# Posts Module (Blog)

> All responses follow the [Standard Response Envelope](./Standard_Response_Envelope.md). Possible error codes: `400`, `401`, `403`, `404`, `409`, `429`, `500`.

## Access & Visibility Overview

| Action                       | Access                                                                 |
|------------------------------|------------------------------------------------------------------------|
| List posts                   | Public (published only) · `AUTHOR`/`ADMIN` see drafts too               |
| View a single **non-premium** post | Public                                                           |
| View a single **premium** post     | Any **logged-in** user (anonymous → `401`)                       |
| View a **draft** (unpublished)     | `AUTHOR`/`ADMIN` or the post's own author only (others → `404`)  |
| Create                       | `AUTHOR`, `ADMIN`                                                       |
| Update / Delete              | `ADMIN` (any post) · `AUTHOR` (own posts only)                         |

> Public read routes use optional ("soft") auth: a valid token is read if present (to unlock drafts/premium), but is not required.

**Visibility rules in short:**
- **Drafts** are invisible to the public — both in the list and by slug. A non-privileged request for a draft slug returns `404` (its existence is never revealed).
- **Premium posts** appear in the public list (title, excerpt, cover, `isPremium: true`) so they can be advertised, but their **body requires login** — fetching a premium post by slug while anonymous returns `401`.
- **Non-premium published posts** are fully public.

---

## Endpoints

### 1. Get All Posts

| Property   | Details                                                              |
|------------|----------------------------------------------------------------------|
| **Route**  | `GET /api/v1/posts`                                                  |
| **Access** | Public (published only) · `AUTHOR`/`ADMIN` (all, including drafts)   |
| **Status** | `200 OK`                                                             |

Returns an array of post objects (newest first), each with nested author details.

> **The list returns metadata only — `content` (the post body) is _not_ included.** This keeps the feed lightweight and means premium bodies are never served in bulk regardless of login state. Fetch a single post by slug to read its body.

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "cuid",
      "slug": "my-first-blog-abc",
      "title": "My First Blog",
      "excerpt": "A short teaser...",
      "coverImage": "https://...",
      "published": true,
      "isPremium": false,
      "tags": ["tech", "javascript"],
      "authorId": "uuid",
      "author": {
        "id": "uuid",
        "fullName": "Jane Doe",
        "imageUrl": "https://..."
      },
      "createdAt": "2026-05-22T10:00:00Z",
      "updatedAt": "2026-05-22T10:00:00Z"
    }
  ]
}
```

---

### 2. Get Post by Slug

| Property   | Details                   |
|------------|---------------------------|
| **Route**  | `GET /api/v1/posts/:slug` |
| **Access** | Public (with optional auth — see rules) |
| **Status** | `200 OK`                  |

Returns a single post object, including `content`, with nested author details.

#### Path Parameters

| Parameter | Type     | Description            |
|-----------|----------|------------------------|
| `slug`    | `string` | URL-friendly post slug |

#### Access Rules

| Scenario                                   | Result                                              |
|--------------------------------------------|-----------------------------------------------------|
| Published, non-premium                     | `200` — anyone                                      |
| Published, premium, requester logged in    | `200` — full content                                |
| Published, premium, requester anonymous    | `401` — `Please log in to read this premium article.` |
| Draft (unpublished), privileged / author   | `200` — full content                                |
| Draft (unpublished), anyone else           | `404` — `Post not found` (existence hidden)         |

> "Logged in" for premium means **any authenticated user** — role does not matter.

#### Response

```json
{
  "success": true,
  "data": {
    "id": "cuid",
    "slug": "my-first-blog-abc",
    "title": "My First Blog",
    "content": "Detailed content here...",
    "excerpt": "A short teaser...",
    "coverImage": "https://...",
    "published": true,
    "isPremium": false,
    "tags": ["tech", "javascript"],
    "authorId": "uuid",
    "author": {
      "id": "uuid",
      "fullName": "Jane Doe",
      "imageUrl": "https://..."
    },
    "createdAt": "2026-05-22T10:00:00Z",
    "updatedAt": "2026-05-22T10:00:00Z"
  }
}
```

#### Errors

| Status | `message`                                          |
|--------|----------------------------------------------------|
| `401`  | `Please log in to read this premium article.`      |
| `404`  | `Post not found`                                   |

---

### 3. Create Post

| Property   | Details                  |
|------------|--------------------------|
| **Route**  | `POST /api/v1/posts`     |
| **Access** | Private (`AUTHOR`, `ADMIN`) |
| **Status** | `201 Created`            |

The `slug` is generated automatically from the title. The author is taken from the authenticated user — it cannot be set in the payload.

#### Request Payload

```json
{
  "title": "My First Blog",
  "content": "Detailed content here...",
  "excerpt": "A short teaser...",
  "coverImage": "https://...",
  "published": false,
  "isPremium": false,
  "tags": ["tech", "javascript"]
}
```

#### Payload Fields

| Field        | Type       | Required | Rules                                                        |
|--------------|------------|----------|--------------------------------------------------------------|
| `title`      | `string`   | Yes      | Trimmed; 5–200 chars                                         |
| `content`    | `string`   | Yes      | Min 20 chars                                                |
| `excerpt`    | `string`   | No       | Trimmed; max 500 chars                                      |
| `coverImage` | `string`   | No       | Valid URL                                                  |
| `published`  | `boolean`  | No       | Defaults to `false` (draft)                                |
| `isPremium`  | `boolean`  | No       | Defaults to `false`. If `true`, the body is login-gated    |
| `tags`       | `string[]` | No       | Trimmed, de-duplicated; max 20 tags, each ≤ 40 chars       |

> **Unknown fields are rejected** with `400` — `authorId`, `slug`, `id`, and timestamps cannot be injected via the payload.

#### Response

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": { "id": "cuid", "slug": "my-first-blog-abc", "...": "..." }
}
```

> In the rare event of a slug collision, the API returns `409` — `Could not generate a unique slug for this post. Please try again.`

---

### 4. Update Post

| Property   | Details                                                            |
|------------|-------------------------------------------------------------------|
| **Route**  | `PATCH /api/v1/posts/:id`                                         |
| **Access** | Private (`AUTHOR`, `ADMIN`) — authors can only update their own   |
| **Status** | `200 OK`                                                          |

#### Path Parameters

| Parameter | Type     | Description      |
|-----------|----------|------------------|
| `id`      | `string` | CUID of the post |

Send only the fields you wish to change. All **Create Post** fields are accepted.

> **At least one field is required** (empty body → `400`). **Unknown fields are rejected** (`400`).

#### Errors

| Status | `message`                                              |
|--------|--------------------------------------------------------|
| `403`  | `You do not have permission to edit this post.`        |
| `404`  | `Post not found`                                       |

> **Authorization:** an `AUTHOR` attempting to update another author's post receives `403`. An `ADMIN` may update any post.

---

### 5. Delete Post

| Property   | Details                                                           |
|------------|-------------------------------------------------------------------|
| **Route**  | `DELETE /api/v1/posts/:id`                                       |
| **Access** | Private (`AUTHOR`, `ADMIN`) — authors can only delete their own  |
| **Status** | `200 OK`                                                         |

#### Path Parameters

| Parameter | Type     | Description      |
|-----------|----------|------------------|
| `id`      | `string` | CUID of the post |

#### Errors

| Status | `message`                                              |
|--------|--------------------------------------------------------|
| `403`  | `You do not have permission to delete this post.`      |
| `404`  | `Post not found`                                       |

> **Authorization:** an `AUTHOR` attempting to delete another author's post receives `403`. An `ADMIN` may delete any post.