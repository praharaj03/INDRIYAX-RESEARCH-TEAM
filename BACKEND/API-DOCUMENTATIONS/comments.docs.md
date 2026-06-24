# Comments Module

> All responses follow the [Standard Response Envelope](./Standard_Response_Envelope.md). Possible error codes: `400`, `401`, `403`, `404`, `429`, `500`.

## Access & Visibility Overview

| Action          | Access                                          |
|-----------------|-------------------------------------------------|
| Read comments   | Public — **but only for a published post**       |
| Create comment  | Private (any logged-in user)                    |
| Update comment  | Comment **owner** only                          |
| Delete comment  | Comment **owner** OR `ADMIN`                     |

**Post-visibility rule:** comment endpoints operate only on **published** posts. If the referenced post is a draft (unpublished) or does not exist, the API returns `404` — both when reading and when creating. This prevents draft comment threads from leaking, and stops comments being attached to a hidden post.

> **Premium posts:** comments are **public** on a published post even if the post itself is premium — the article body is login-gated, but the discussion thread is open. (Reading a premium post's body still requires login; see the Posts module.)

---

## Endpoints

### 1. Get Comments for a Post

| Property   | Details                             |
|------------|-------------------------------------|
| **Route**  | `GET /api/v1/comments/post/:postId` |
| **Access** | Public (published posts only)       |
| **Status** | `200 OK`                            |

Returns all comments for the post, newest first.

#### Path Parameters

| Parameter | Type     | Description                            |
|-----------|----------|----------------------------------------|
| `postId`  | `string` | CUID of the post to fetch comments for |

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "cuid",
      "content": "Great post!",
      "createdAt": "2026-05-22T10:00:00Z",
      "user": {
        "fullName": "John Doe",
        "imageUrl": "https://..."
      }
    }
  ]
}
```

#### Response Field Reference

| Field           | Type     | Description                               |
|-----------------|----------|-------------------------------------------|
| `id`            | `string` | Unique comment identifier (CUID)          |
| `content`       | `string` | The text body of the comment              |
| `createdAt`     | `string` | ISO 8601 timestamp of when it was posted  |
| `user.fullName` | `string` | Full name of the comment author           |
| `user.imageUrl` | `string` | Profile picture URL of the comment author |

#### Errors

| Status | `message`         | Cause                                    |
|--------|-------------------|------------------------------------------|
| `404`  | `Post not found.` | Post does not exist, or is an unpublished draft |

---

### 2. Create Comment

| Property   | Details                 |
|------------|-------------------------|
| **Route**  | `POST /api/v1/comments` |
| **Access** | Private (Logged In)     |
| **Status** | `201 Created`           |

The author is taken from the authenticated user — it cannot be set in the payload.

#### Request Payload

```json
{
  "postId": "cuid",
  "content": "This is a very helpful article!"
}
```

#### Payload Fields

| Field     | Type     | Required | Rules                                                   |
|-----------|----------|----------|---------------------------------------------------------|
| `postId`  | `string` | Yes      | CUID of the post being commented on (must be published) |
| `content` | `string` | Yes      | Trimmed; 1–1000 chars. Whitespace-only is rejected      |

> **Unknown fields are rejected** with `400` — `userId` and `id` cannot be injected via the payload.

#### Response

```json
{
  "success": true,
  "message": "Comment posted successfully",
  "data": {
    "id": "cuid",
    "content": "This is a very helpful article!",
    "createdAt": "2026-05-22T10:00:00Z",
    "user": { "fullName": "John Doe", "imageUrl": "https://..." }
  }
}
```

#### Errors

| Status | `message`                    | Cause                                  |
|--------|------------------------------|----------------------------------------|
| `400`  | `Comment cannot be empty`    | Empty or whitespace-only content       |
| `400`  | `Comment is too long`        | Content exceeds 1000 chars             |
| `404`  | `Post not found.`            | Post does not exist or is a draft      |

---

### 3. Update Comment

| Property   | Details                      |
|------------|------------------------------|
| **Route**  | `PATCH /api/v1/comments/:id` |
| **Access** | Private (Comment Owner only) |
| **Status** | `200 OK`                     |

#### Path Parameters

| Parameter | Type     | Description         |
|-----------|----------|---------------------|
| `id`      | `string` | CUID of the comment |

#### Request Payload

```json
{
  "content": "Updated comment text."
}
```

#### Payload Fields

| Field     | Type     | Required | Rules                                              |
|-----------|----------|----------|----------------------------------------------------|
| `content` | `string` | Yes      | Trimmed; 1–1000 chars. Whitespace-only is rejected |

> **Unknown fields are rejected** with `400`.

#### Errors

| Status | `message`                              | Cause                          |
|--------|----------------------------------------|--------------------------------|
| `403`  | `You can only edit your own comments.` | Requester is not the author    |
| `404`  | `Comment not found.`                   | No comment with that id        |

> **Authorization:** only the original author may update a comment. Admins are **not** granted edit rights on others' comments (only delete — see below).

---

### 4. Delete Comment

| Property   | Details                          |
|------------|----------------------------------|
| **Route**  | `DELETE /api/v1/comments/:id`    |
| **Access** | Private (Comment Owner OR Admin) |
| **Status** | `200 OK`                         |

#### Path Parameters

| Parameter | Type     | Description         |
|-----------|----------|---------------------|
| `id`      | `string` | CUID of the comment |

#### Errors

| Status | `message`                                              | Cause                            |
|--------|--------------------------------------------------------|----------------------------------|
| `403`  | `You do not have permission to delete this comment.`   | Not the owner and not an `ADMIN` |
| `404`  | `Comment not found.`                                   | No comment with that id          |

> **Authorization:** a comment can be deleted by its original author **or** any `ADMIN`. All other users receive `403`.