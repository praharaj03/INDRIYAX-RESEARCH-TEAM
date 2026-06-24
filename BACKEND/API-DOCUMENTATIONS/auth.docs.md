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
| `imageUrl`  | `string \| null` | Profile picture URL (may be `null`)      |
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

| Field      | Type     | Required | Rules                              |
|------------|----------|----------|------------------------------------|
| `fullName` | `string` | No       | Trimmed; 2–100 characters          |
| `imageUrl` | `string` | No       | Valid `http(s)` URL; max 2048 chars |

#### Validation Rules

- **At least one field is required.** An empty body returns `400` — `Provide at least one field to update (fullName or imageUrl)`.
- **Unknown fields are rejected.** Sending `email`, `role`, or any other key returns `400`. These are immutable via this endpoint and are **not** silently dropped.
- `imageUrl` must begin with `http://` or `https://` (blocks `javascript:`, `data:`, `file:` URLs).

#### Response

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Smith",
    "imageUrl": "https://...",
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