# Comments Module

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

### 1. Get Comments for a Post

| Property   | Details                                    |
|------------|--------------------------------------------|
| **Route**  | `GET /api/v1/comments/post/:postId`        |
| **Access** | Public                                     |
| **Status** | `200 OK`                                   |

#### Path Parameters

| Parameter | Type     | Description                       |
|-----------|----------|-----------------------------------|
| `postId`  | `string` | CUID of the post to fetch comments for |

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "cuid",
      "content": "Great post!",
      "user": {
        "fullName": "John Doe",
        "imageUrl": "https://..."
      },
      "createdAt": "2026-05-22T10:00:00Z"
    }
  ]
}
```

#### Response Field Reference

| Field              | Type     | Description                              |
|--------------------|----------|------------------------------------------|
| `id`               | `string` | Unique comment identifier (CUID)         |
| `content`          | `string` | The text body of the comment             |
| `user.fullName`    | `string` | Full name of the comment author          |
| `user.imageUrl`    | `string` | Profile picture URL of the comment author|
| `createdAt`        | `string` | ISO 8601 timestamp of when it was posted |

---

### 2. Create Comment

| Property   | Details                          |
|------------|----------------------------------|
| **Route**  | `POST /api/v1/comments`          |
| **Access** | Private (Logged In)              |
| **Status** | `201 Created`                    |

#### Request Payload

```json
{
  "postId": "cuid",
  "content": "This is a very helpful article!"
}
```

#### Payload Fields

| Field     | Type     | Required | Description                              |
|-----------|----------|----------|------------------------------------------|
| `postId`  | `string` | Yes      | CUID of the post being commented on      |
| `content` | `string` | Yes      | Text body of the comment                 |

---

### 3. Update Comment

| Property   | Details                                      |
|------------|----------------------------------------------|
| **Route**  | `PATCH /api/v1/comments/:id`                 |
| **Access** | Private (Comment Owner only)                 |
| **Status** | `200 OK`                                     |

#### Path Parameters

| Parameter | Type     | Description           |
|-----------|----------|-----------------------|
| `id`      | `string` | CUID of the comment   |

#### Request Payload

```json
{
  "content": "Updated comment text."
}
```

#### Payload Fields

| Field     | Type     | Required | Description                    |
|-----------|----------|----------|--------------------------------|
| `content` | `string` | Yes      | The new text for the comment   |

> **Authorization Note:** Only the original author of a comment may update it. Any other user will receive a `403 Forbidden` error.

---

### 4. Delete Comment

| Property   | Details                                          |
|------------|--------------------------------------------------|
| **Route**  | `DELETE /api/v1/comments/:id`                    |
| **Access** | Private (Comment Owner OR Admin)                 |
| **Status** | `200 OK`                                         |

#### Path Parameters

| Parameter | Type     | Description           |
|-----------|----------|-----------------------|
| `id`      | `string` | CUID of the comment   |

> **Authorization Note:** A comment can be deleted by either its original author or any user with the `ADMIN` role. All other users will receive a `403 Forbidden` error.