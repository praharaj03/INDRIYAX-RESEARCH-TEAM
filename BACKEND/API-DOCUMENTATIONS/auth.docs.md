# Auth Module

> All responses follow the [Standard Response Envelope](./Standard_Response_Envelope.md). Possible error codes: `400`, `401`, `403`, `404`, `409`, `429`, `500`.

## Authentication

All endpoints in this module are **private** and require a Supabase access token:

```
Authorization: Bearer <supabase_access_token>
```

The token is verified **locally** (signature, expiry, issuer, audience) on every request — there is no per-call round-trip to Supabase. On a user's first authenticated request, their profile row is provisioned automatically from their Supabase identity (`full_name`, `avatar_url`).

| Failure                              | Code  | `message`                                            |
|--------------------------------------|-------|------------------------------------------------------|
| No `Authorization: Bearer` header    | `401` | `No authentication token provided.`                  |
| Expired token                        | `401` | `Your session has expired. Please log in again.`     |
| Invalid / tampered token             | `401` | `Invalid authentication token.`                      |

> **Revocation note:** because tokens are verified locally, an access token remains valid until it **expires** (Supabase default ~1 hour) even after a server-side sign-out or ban.

---

## Endpoints

### 1. Get Current Profile

| Property   | Details               |
|------------|-----------------------|
| **Route**  | `GET /api/v1/auth/me` |
| **Access** | Private (Logged In)   |
| **Status** | `200 OK`              |

#### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "imageUrl": "https://...",
    "role": "USER",
    "createdAt": "2026-05-22T10:00:00Z"
  }
}
```

#### Field Reference

| Field       | Type             | Description                              |
|-------------|------------------|------------------------------------------|
| `id`        | `string`         | Unique user identifier (Supabase UUID)   |
| `email`     | `string`         | Registered email address                 |
| `fullName`  | `string \| null` | Display name (may be `null` until set)   |
| `imageUrl`  | `string \| null` | Profile picture URL (`null` if the user has no photo) |
| `role`      | `string`         | `USER`, `AUTHOR`, or `ADMIN`             |
| `createdAt` | `string`         | ISO 8601 account creation timestamp      |

> The response contains **only** these fields. Internal columns are never exposed.

---

### 2. Update Profile

| Property   | Details                 |
|------------|-------------------------|
| **Route**  | `PATCH /api/v1/auth/me` |
| **Access** | Private (Logged In)     |
| **Status** | `200 OK`                |

#### Request Payload

```json
{
  "fullName": "John Smith",
  "imageUrl": "https://..."
}
```

#### Payload Fields

| Field      | Type              | Required | Rules                                                        |
|------------|-------------------|----------|--------------------------------------------------------------|
| `fullName` | `string`          | No       | Trimmed; 2–100 characters                                   |
| `imageUrl` | `string` \| `null`| No       | A valid `http(s)` URL (max 2048 chars) to **set/replace** the photo, or `null` to **remove** it |

#### Profile Photo: Set, Replace, or Remove

The behavior depends on whether `imageUrl` is present in the body, and its value:

| Intent                  | Send                          | Effect                                    |
|-------------------------|-------------------------------|-------------------------------------------|
| **Keep** current photo  | omit `imageUrl` entirely      | Photo unchanged                           |
| **Set / replace** photo | `"imageUrl": "https://..."`   | Photo updated to the new URL              |
| **Remove** photo        | `"imageUrl": null`            | Photo cleared — `imageUrl` becomes `null` |

> **Storage cleanup:** when a photo is **removed** or **replaced**, the previously uploaded file is automatically deleted from storage (best-effort) so orphaned avatars don't accumulate. This cleanup never blocks or fails the profile update — if it can't delete the old file, the update still succeeds.

##### Example — remove the photo

```json
{ "imageUrl": null }
```

```js
await fetch('/api/v1/auth/me', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify({ imageUrl: null }),
});
```

#### Validation Rules

- **At least one field is required.** An empty body returns `400` — `Provide at least one field to update (fullName or imageUrl)`. (Note: `"imageUrl": null` counts as a field, so removing the photo alone is a valid request.)
- **Unknown fields are rejected.** Sending `email`, `role`, or any other key returns `400`. These are immutable via this endpoint and are **not** silently dropped.
- When `imageUrl` is a string, it must begin with `http://` or `https://` (blocks `javascript:`, `data:`, `file:` URLs). `null` is the only non-URL value accepted.

#### Response

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Smith",
    "imageUrl": null,
    "role": "USER",
    "createdAt": "2026-05-22T10:00:00Z"
  }
}
```

---

### 3. Get My Enrollments

| Property   | Details                           |
|------------|-----------------------------------|
| **Route**  | `GET /api/v1/auth/my-enrollments` |
| **Access** | Private (Logged In)               |
| **Status** | `200 OK`                          |

Returns the current user's event enrollments (all statuses), newest first, each with summary details of the associated event.

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "cuid-enrollment-id",
      "userId": "uuid-user-id",
      "eventId": "cuid-event-id",
      "status": "APPROVED",
      "createdAt": "2026-05-22T10:00:00Z",
      "updatedAt": "2026-05-23T09:00:00Z",
      "event": {
        "id": "cuid-event-id",
        "slug": "react-summit-xyz",
        "title": "React Summit",
        "thumbnail": "https://...",
        "date": "2026-06-01T10:00:00Z",
        "venue": "Tech Park",
        "type": "OFFLINE",
        "price": 500,
        "speaker": "Jane Doe",
        "meetingLink": "https://..."
      }
    }
  ]
}
```

#### Enrollment Status

| Status     | Meaning                                          |
|------------|--------------------------------------------------|
| `PENDING`  | Payment submitted, awaiting admin verification   |
| `APPROVED` | Payment verified — ticket confirmed              |
| `REJECTED` | Payment rejected by admin                        |

#### Important: Conditional `meetingLink`

> `event.meetingLink` is **only included when the enrollment `status` is `APPROVED`**. For `PENDING` and `REJECTED` enrollments the field is omitted entirely, so a user cannot access the meeting link before their payment is verified.