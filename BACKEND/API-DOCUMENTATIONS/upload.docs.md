# Uploads Module

> All responses follow the [Standard Response Envelope](./Standard_Response_Envelope.md). Possible error codes: `400`, `401`, `429`, `500`, `502`.

---

## Endpoints

### 1. Upload Image

| Property   | Details                       |
|------------|-------------------------------|
| **Route**  | `POST /api/v1/uploads/image`  |
| **Access** | Private (any logged-in user)  |
| **Status** | `200 OK`                      |

> **Access:** Any authenticated user may upload. This endpoint backs **profile-picture** uploads as well as event/post images. The upload returns a URL but attaches it to nothing — using that URL on a protected resource (creating an event or post) is separately access-controlled.

#### Request Format

`Content-Type: multipart/form-data`

#### Form Fields

| Field    | Type     | Required | Description                                                                                  |
|----------|----------|----------|----------------------------------------------------------------------------------------------|
| `file`   | `File`   | Yes      | The image to upload. Field name **must** be `file`. Maximum size **5 MB**                     |
| `folder` | `string` | No       | Destination folder. Must be one of the allowed values below; any other value (or omission) falls back to `misc` |

#### Allowed Folders

`events` · `posts` · `avatars` · `misc`

> Folder values are whitelisted to prevent arbitrary or hostile storage paths (e.g. path traversal via `../`). An unrecognized folder is silently coerced to `misc`.

#### Supported File Types

| Type  | Extensions                               |
|-------|------------------------------------------|
| Image | `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif` |

> Both the file's **MIME type** *and* its **extension** are validated against this allow-list — a forged MIME header alone will not pass. **SVG is intentionally not supported**, because it can embed scripts and would be a stored-XSS risk when served from our domain.

#### Response

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "https://[SUPABASE_URL]/storage/v1/object/public/indriyax-assets/avatars/1684719234-12345.jpg"
  }
}
```

#### Response Field Reference

| Field | Type     | Description                                  |
|-------|----------|----------------------------------------------|
| `url` | `string` | Fully qualified public URL of the uploaded image |

#### URL Structure

```
https://[SUPABASE_URL]/storage/v1/object/public/indriyax-assets/{folder}/{timestamp}-{random}.{ext}
```

| Segment        | Description                                       |
|----------------|---------------------------------------------------|
| `SUPABASE_URL` | Your project's Supabase base URL                  |
| `folder`       | The (whitelisted) folder value                    |
| `timestamp`    | Unix timestamp at time of upload                  |
| `random`       | Random number to prevent filename collisions      |
| `ext`          | Extension derived from the validated MIME type    |

#### Example

```bash
curl -X POST https://api.example.com/api/v1/uploads/image \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/image.jpg" \
  -F "folder=avatars"
```

#### Errors

| Status | `message`                                                       | Cause                                  |
|--------|-----------------------------------------------------------------|----------------------------------------|
| `400`  | `No image file provided. Use form field "file".`                | No file sent / wrong field name        |
| `400`  | `Unsupported file type. Allowed: JPG, JPEG, PNG, WEBP, GIF.`     | Disallowed MIME type or extension      |
| `400`  | `File too large. Maximum allowed size is 5 MB.`                 | File exceeds 5 MB                       |
| `401`  | _(auth message)_                                                | Not authenticated                      |
| `429`  | `Too many requests. Please slow down and try again shortly.`    | Rate limit exceeded                    |
| `502`  | `Failed to upload file to storage. Please try again.`           | Storage backend (Supabase) error       |

---

## Storage Cleanup (Avatars)

Uploaded files are **not** automatically deleted just because an upload returns a URL — the file lives in storage until something explicitly removes it. Cleanup is wired into the **profile photo** flow:

- When a user **removes** their photo (`PATCH /api/v1/auth/me` with `imageUrl: null`) or **replaces** it with a new upload, the **previous** avatar file is deleted from the `indriyax-assets` bucket automatically.
- This deletion is **best-effort and non-blocking**: it runs after the profile update succeeds, only targets files inside our own bucket, and never fails the user's action if the delete itself fails (the failure is logged server-side).

> Files uploaded for other resources (event thumbnails, QR codes, post covers) are **not** auto-cleaned when that resource is deleted or its image changed — only the avatar flow performs cleanup today. If orphaned event/post images become a concern at scale, a periodic cleanup job is the recommended approach.