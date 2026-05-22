# Image Upload Flow — Two-Step Integration Guide

## Overview

The image upload flow is **decoupled** from resource creation. Rather than sending a file and form data together in one request, the frontend performs two separate API calls in sequence:

1. **Upload the image** → receive a public URL
2. **Create the resource** → attach that URL in the JSON payload

> This same two-step flow applies identically whether you are an **ADMIN** creating an Event (with a `thumbnail`) or an **AUTHOR** creating a Post (with a cover image). The upload API endpoint is shared.

---

## Step-by-Step Breakdown

### Step 1 — Upload the Image (Get the URL)

When the user selects an image file, the frontend immediately uploads it — before the form is even submitted.

| # | Who          | Action                                                                                     |
|---|--------------|--------------------------------------------------------------------------------------------|
| 1 | **Frontend** | Sends a `multipart/form-data` request to `POST /api/v1/uploads/image`                     |
| 2 | **Backend**  | Multer middleware catches the raw file; Supabase service uploads it to `indriyax-assets`   |
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
  folder → "events"   (or "posts", "avatars", etc.)
```

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

> Save `data.url` — you will pass it into the next step.

---

### Step 2 — Create the Resource (Use the URL)

Now that the frontend holds a stable, public URL, it attaches it to the resource payload and submits the form.

| # | Who          | Action                                                                                         |
|---|--------------|------------------------------------------------------------------------------------------------|
| 1 | **Frontend** | Places the URL into the `thumbnail` field (or equivalent) of the form payload                  |
| 2 | **Frontend** | Sends a standard `application/json` request to `POST /api/v1/events` (or `/api/v1/posts`)     |
| 3 | **Backend**  | Zod validates the payload (including verifying `thumbnail` is a valid URL) and saves to DB     |

#### API Call — Create Event (ADMIN)

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
  "price": 500,
  "date": "2026-06-01T10:00:00.000Z"
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

The function below demonstrates how both steps are chained together on form submission:

```javascript
async function handleCreateEventFormSubmit(eventData, selectedImageFile, token) {
  try {
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
      if (!uploadResult.success) throw new Error("Image upload failed");

      // Save the returned URL for Step 2
      thumbnailUrl = uploadResult.data.url;
    }

    // -------------------------------------------------------
    // STEP 2: Create the Event using the returned image URL
    // -------------------------------------------------------
    const finalEventPayload = {
      ...eventData,           // title, description, date, etc.
      thumbnail: thumbnailUrl // Attach the Supabase URL from Step 1
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
    return eventResult;

  } catch (error) {
    console.error("Workflow failed:", error);
  }
}
```

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

---

## Upload-on-Select (Optimistic UX Pattern)

For an even faster experience, trigger **Step 1 the moment the user picks a file** — before they click Submit:

```javascript
// Attach to your file <input> onChange handler
async function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  setIsUploading(true);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "events");

  const res = await fetch("https://api.indriyax.com/api/v1/uploads/image", {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    body: formData
  });

  const result = await res.json();
  if (result.success) {
    setThumbnailUrl(result.data.url); // Store in state, use later in Step 2
  }

  setIsUploading(false);
}
```

This makes the final Submit feel near-instant since the image is already in the cloud before the user finishes filling out the rest of the form.

---

## Why Decouple Upload from Creation?

| Reason            | Explanation                                                                                             |
|-------------------|---------------------------------------------------------------------------------------------------------|
| **Speed**         | The image uploads in the background while the user fills out the form, making submission feel instant   |
| **Reusability**   | The same `POST /api/v1/uploads/image` endpoint serves event thumbnails, post covers, and profile pics   |
| **Clean Payloads**| Event and Post controllers only receive clean JSON strings — no parsing of complex multipart file buffers|

---

## Flow Diagram

```
User selects image
       │
       ▼
POST /api/v1/uploads/image   (multipart/form-data)
       │
       ▼
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