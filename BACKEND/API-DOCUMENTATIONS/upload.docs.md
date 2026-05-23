# Uploads Module

## Standard Response Envelope

All **successful** responses follow this structure:

```json
{
  "success": true,
  "message": "Optional success message",
  "data": { }
}
```

All **error** responses (`400`, `401`, `403`, `404`, `500`) follow this structure:

```json
{
  "success": false,
  "status": "fail",
  "message": "Error description here",
  "errors": [
    { "field": "fieldName", "message": "Validation message" }
  ]
}
```

---

## Endpoints

### 1. Upload Image

| Property   | Details                          |
|------------|----------------------------------|
| **Route**  | `POST /api/v1/uploads/image`     |
| **Access** | Private (AUTHOR, ADMIN)          |
| **Status** | `200 OK`                         |

#### Request Format

`Content-Type: multipart/form-data`

#### Form Fields

| Field    | Type     | Required | Description                                                        |
|----------|----------|----------|--------------------------------------------------------------------|
| `file`   | `File`   | Yes      | The image file to upload. Maximum size: **5 MB**                   |
| `folder` | `string` | No       | Destination folder name in storage (e.g., `"events"`, `"posts"`)  |

#### Supported File Types

| Type  | Extensions              |
|-------|-------------------------|
| Image | `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif` |

> Files exceeding **5 MB** will be rejected with a `400 Bad Request` error.

#### Response

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "https://[SUPABASE_URL]/storage/v1/object/public/indriyax-assets/events/1684719234-12345.jpg"
  }
}
```

#### Response Field Reference

| Field | Type     | Description                                              |
|-------|----------|----------------------------------------------------------|
| `url` | `string` | Fully qualified public URL of the uploaded image in Supabase Storage |

#### URL Structure

```
https://[SUPABASE_URL]/storage/v1/object/public/indriyax-assets/{folder}/{timestamp}-{random}.{ext}
```

| Segment       | Description                                          |
|---------------|------------------------------------------------------|
| `SUPABASE_URL`| Your project's Supabase base URL                     |
| `folder`      | The folder value passed in the request (or root if omitted) |
| `timestamp`   | Unix timestamp at time of upload                     |
| `random`      | Random number to prevent filename collisions         |
| `ext`         | Original file extension                              |

#### Example Usage

```bash
curl -X POST https://api.example.com/api/v1/uploads/image \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/image.jpg" \
  -F "folder=events"
```

#### Common Errors

| Status | Cause                                              |
|--------|----------------------------------------------------|
| `400`  | File missing, file too large (>5 MB), or unsupported file type |
| `401`  | User is not authenticated                          |
| `403`  | User does not have `AUTHOR` or `ADMIN` role        |