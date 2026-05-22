# Posts Module (Blog)

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

### 1. Get All Posts

| Property   | Details                                                                              |
|------------|--------------------------------------------------------------------------------------|
| **Route**  | `GET /api/v1/posts`                                                                  |
| **Access** | Public (published posts only) · Admin / Author (all posts including drafts)         |
| **Status** | `200 OK`                                                                             |

#### Response

Returns an array of post objects, each with nested author details.

```json
{
  "success": true,
  "data": [
    {
      "id": "cuid",
      "slug": "my-first-blog-abc",
      "title": "My First Blog",
      "tags": ["tech", "javascript"],
      "author": {
        "id": "uuid",
        "fullName": "Jane Doe",
        "imageUrl": "https://..."
      },
      "createdAt": "2026-05-22T10:00:00Z",
      "...": "..."
    }
  ]
}
```

---

### 2. Get Post by Slug

| Property   | Details                          |
|------------|----------------------------------|
| **Route**  | `GET /api/v1/posts/:slug`        |
| **Access** | Public                           |
| **Status** | `200 OK`                         |

#### Path Parameters

| Parameter | Type     | Description             |
|-----------|----------|-------------------------|
| `slug`    | `string` | URL-friendly post slug  |

#### Response

Returns a single post object with nested author details.

```json
{
  "success": true,
  "data": {
    "id": "cuid",
    "slug": "my-first-blog-abc",
    "title": "My First Blog",
    "content": "Detailed content here...",
    "tags": ["tech", "javascript"],
    "author": {
      "id": "uuid",
      "fullName": "Jane Doe",
      "imageUrl": "https://..."
    },
    "createdAt": "2026-05-22T10:00:00Z",
    "...": "..."
  }
}
```

---

### 3. Create Post

| Property   | Details                          |
|------------|----------------------------------|
| **Route**  | `POST /api/v1/posts`             |
| **Access** | Private (AUTHOR, ADMIN)          |
| **Status** | `201 Created`                    |

#### Request Payload

```json
{
  "title": "My First Blog",
  "content": "Detailed content here...",
  "tags": ["tech", "javascript"]
}
```

#### Payload Fields

| Field     | Type       | Required | Description                              |
|-----------|------------|----------|------------------------------------------|
| `title`   | `string`   | Yes      | Title of the blog post                   |
| `content` | `string`   | Yes      | Full body content of the post            |
| `tags`    | `string[]` | No       | Array of tag strings for categorization  |

---

### 4. Update Post

| Property   | Details                                                             |
|------------|---------------------------------------------------------------------|
| **Route**  | `PATCH /api/v1/posts/:id`                                           |
| **Access** | Private (AUTHOR, ADMIN) — Authors can only update their own posts   |
| **Status** | `200 OK`                                                            |

#### Path Parameters

| Parameter | Type     | Description        |
|-----------|----------|--------------------|
| `id`      | `string` | CUID of the post   |

> Send only the fields you wish to update. All fields from the **Create Post** payload are accepted.

> **Authorization Note:** An `AUTHOR` attempting to update another author's post will receive a `403 Forbidden` error.

---

### 5. Delete Post

| Property   | Details                                                             |
|------------|---------------------------------------------------------------------|
| **Route**  | `DELETE /api/v1/posts/:id`                                          |
| **Access** | Private (AUTHOR, ADMIN) — Authors can only delete their own posts   |
| **Status** | `200 OK`                                                            |

#### Path Parameters

| Parameter | Type     | Description        |
|-----------|----------|--------------------|
| `id`      | `string` | CUID of the post   |

> **Authorization Note:** An `AUTHOR` attempting to delete another author's post will receive a `403 Forbidden` error.