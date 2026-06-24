# Image Upload Flow — Two-Step Integration Guide

## Overview

The image upload flow is **decoupled** from resource creation. Rather than sending a file and form data together in one request, the frontend performs two separate API calls in sequence:

1. **Upload the image** → receive a public URL
2. **Create / update the resource** → attach that URL in the JSON payload

> The upload endpoint (`POST /api/v1/uploads/image`) is **shared** and open to **any logged-in user**. It backs:
> - **Profile pictures** — any user (folder `avatars`)
> - **Event thumbnails / QR codes** — `ADMIN` (folder `events`), used when creating an Event
> - **Post cover images** — `AUTHOR`/`ADMIN` (folder `posts`), used when creating a Post
>
> The upload itself only returns a URL — it grants no access. Attaching that URL to a protected resource (creating an Event or Post) is separately role-controlled by those endpoints.

---

## Upload Constraints (read before integrating)

| Constraint        | Value                                                                 |
|-------------------|-----------------------------------------------------------------------|
| Max file size     | **5 MB** (larger → `400`)                                              |
| Allowed types     | `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif` (MIME **and** extension checked) |
| **Not** allowed   | SVG (script-injection risk), and any non-image type                   |
| `folder` values   | `events`, `posts`, `avatars`, `misc` — anything else falls back to `misc` |
| Field name        | Must be exactly `file`                                                 |
| Auth              | `Authorization: Bearer <token>` required                              |

See [Uploads Module](./upload_docs.md) for the full endpoint reference.

---

## Step-by-Step Breakdown

### Step 1 — Upload the Image (Get the URL)

When the user selects an image file, the frontend immediately uploads it — before the form is even submitted.

| # | Who          | Action                                                                                     |
|---|--------------|--------------------------------------------------------------------------------------------|
| 1 | **Frontend** | Sends a `multipart/form-data` request to `POST /api/v1/uploads/image`                       |
| 2 | **Backend**  | Multer validates type/size; the Supabase service uploads it to the `indriyax-assets` bucket |
| 3 | **Backend**  | Responds with the **public URL** of the uploaded image                                     |

#### API Call

```
POST /api/v1/uploads/image
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

```
Form Fields:
  file   → <the raw image file>
  folder → "events"   (one of: "events", "posts", "avatars", "misc")
```

#### Success Response

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "https://[SUPABASE_URL]/storage/v1/object/public/indriyax-assets/events/1684719234-12345.jpg"
  }
}
```

> Save `data.url` — you will pass it into the next step.

#### Error Response (handle these for proper notifications)

Errors come back in the standard envelope with a human-readable `message` you can show directly:

```json
{
  "success": false,
  "status": "fail",
  "message": "File too large. Maximum allowed size is 5 MB."
}
```

| Status | Example `message`                                            | Cause                       |
|--------|--------------------------------------------------------------|-----------------------------|
| `400`  | `Unsupported file type. Allowed: JPG, JPEG, PNG, WEBP, GIF.` | Disallowed type             |
| `400`  | `File too large. Maximum allowed size is 5 MB.`              | Over 5 MB                   |
| `400`  | `No image file provided. Use form field "file".`            | Missing / wrong field name  |
| `401`  | _(auth message)_                                            | Not logged in               |
| `502`  | `Failed to upload file to storage. Please try again.`       | Storage backend error       |

---

### Step 2 — Create / Update the Resource (Use the URL)

Now that the frontend holds a stable, public URL, it attaches it to the resource payload and submits the form.

| # | Who          | Action                                                                                       |
|---|--------------|----------------------------------------------------------------------------------------------|
| 1 | **Frontend** | Places the URL into the `thumbnail` / `coverImage` (or `qrCodeUrl`) field of the payload      |
| 2 | **Frontend** | Sends a standard `application/json` request to `POST /api/v1/events` (or `/api/v1/posts`)     |
| 3 | **Backend**  | Zod validates the payload (including verifying the URL field) and saves to DB                 |

#### API Call — Create Event (ADMIN)

A **paid** event must also include `price` (> 0), `qrCodeUrl`, and `upiId` — see [Events Module](./events_docs.md).

```
POST /api/v1/events
Content-Type: application/json
Authorization: Bearer <token>
```

```json
{
  "title": "React Summit",
  "description": "Full day conference...",
  "speaker": "Jane Doe",
  "thumbnail": "https://[SUPABASE_URL]/storage/v1/object/public/indriyax-assets/events/1684719234-12345.jpg",
  "venue": "Tech Park",
  "type": "OFFLINE",
  "date": "2026-06-01T10:00:00.000Z",
  "isFree": false,
  "price": 500,
  "qrCodeUrl": "https://[SUPABASE_URL]/storage/v1/object/public/indriyax-assets/events/qr-9876543210.png",
  "upiId": "indriyax@ybl"
}
```

#### API Call — Create Post (AUTHOR)

```
POST /api/v1/posts
Content-Type: application/json
Authorization: Bearer <token>
```

```json
{
  "title": "My First Blog",
  "content": "Detailed content here...",
  "tags": ["tech", "javascript"],
  "coverImage": "https://[SUPABASE_URL]/storage/v1/object/public/indriyax-assets/posts/1684719234-67890.jpg"
}
```

---

## Complete Frontend Implementation (React / Next.js)

The function below chains both steps on form submission. Note the error handling: it reads the server's `message` so the UI can show a precise reason rather than a generic failure.

```javascript
async function handleCreateEventFormSubmit(eventData, selectedImageFile, token) {
  let thumbnailUrl = "";

  // -------------------------------------------------------
  // STEP 1: Upload the image first (if a file was selected)
  // -------------------------------------------------------
  if (selectedImageFile) {
    const formData = new FormData();
    formData.append("file", selectedImageFile);
    formData.append("folder", "events");

    const uploadResponse = await fetch("https://api.indriyax.com/api/v1/uploads/image", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
        // ⚠️ Do NOT set "Content-Type" manually when using FormData.
        // The browser sets it automatically with the correct boundary.
      },
      body: formData
    });

    const uploadResult = await uploadResponse.json();

    // Surface the server's real message (e.g. "File too large...") to the user.
    if (!uploadResponse.ok || !uploadResult.success) {
      throw new Error(uploadResult.message || "Image upload failed");
    }

    thumbnailUrl = uploadResult.data.url; // Save for Step 2
  }

  // -------------------------------------------------------
  // STEP 2: Create the Event using the returned image URL
  // -------------------------------------------------------
  const finalEventPayload = {
    ...eventData,            // title, description, date, payment fields, etc.
    thumbnail: thumbnailUrl  // Attach the Supabase URL from Step 1
  };

  const eventResponse = await fetch("https://api.indriyax.com/api/v1/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(finalEventPayload)
  });

  const eventResult = await eventResponse.json();

  if (!eventResponse.ok || !eventResult.success) {
    // eventResult.errors may contain field-level validation messages.
    throw new Error(eventResult.message || "Event creation failed");
  }

  return eventResult;
}
```

> Let the caller catch and display the thrown message (toast/snackbar). Avoid swallowing it in a bare `console.error` — that's the difference between "Something went wrong" and "File too large. Maximum allowed size is 5 MB."

---

## Important Implementation Notes

### Do Not Set `Content-Type` for FormData

```javascript
// ✅ Correct — let the browser handle it
headers: {
  "Authorization": `Bearer ${token}`
}

// ❌ Wrong — breaks the multipart boundary, upload will fail
headers: {
  "Content-Type": "multipart/form-data",
  "Authorization": `Bearer ${token}`
}
```

When using `FormData`, the browser automatically sets the `Content-Type` header to `multipart/form-data` and appends the correct `boundary` string. Setting it manually strips the boundary and causes the server to reject the request.

### Use a Valid `folder` Value

Pass one of `events`, `posts`, `avatars`, `misc`. Any other value (or omitting it) silently stores the file under `misc` — it won't error, but your asset won't land where you expect.

---

## Upload-on-Select (Optimistic UX Pattern)

For an even faster experience, trigger **Step 1 the moment the user picks a file** — before they click Submit:

```javascript
// Attach to your file <input> onChange handler
async function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  setIsUploading(true);
  setUploadError(null);

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "events");

    const res = await fetch("https://api.indriyax.com/api/v1/uploads/image", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.message || "Upload failed");
    }

    setThumbnailUrl(result.data.url); // Store in state, use later in Step 2
  } catch (err) {
    setUploadError(err.message);      // Show the precise reason inline
  } finally {
    setIsUploading(false);
  }
}
```

This makes the final Submit feel near-instant since the image is already in the cloud before the user finishes filling out the rest of the form.

---

## Why Decouple Upload from Creation?

| Reason             | Explanation                                                                                              |
|--------------------|---------------------------------------------------------------------------------------------------------|
| **Speed**          | The image uploads in the background while the user fills out the form, making submission feel instant    |
| **Reusability**    | The same `POST /api/v1/uploads/image` endpoint serves event thumbnails, post covers, and profile pics    |
| **Clean Payloads** | Event and Post controllers receive clean JSON strings — no parsing of complex multipart file buffers     |

---

## Flow Diagram

```
User selects image
       │
       ▼
POST /api/v1/uploads/image   (multipart/form-data)
       │
       ├── 400 (bad type / too large)  → show message, stop
       ├── 502 (storage error)         → show message, allow retry
       │
       ▼  200 OK
  { data: { url: "https://supabase.../image.jpg" } }
       │
       ▼
User clicks Submit
       │
       ▼
POST /api/v1/events          (application/json)
  { thumbnail: "https://supabase.../image.jpg", ...rest }
       │
       ▼
  Event created & saved to DB ✓
```