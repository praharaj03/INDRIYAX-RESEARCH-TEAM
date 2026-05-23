# Auth Module

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
    { "field": "email", "message": "Invalid email" }
  ]
}
```

> `errors` is optional and is used primarily for validation failures.

---

## Endpoints

### 1. Get Current Profile

| Property       | Details                  |
|----------------|--------------------------|
| **Route**      | `GET /api/v1/auth/me`    |
| **Access**     | Private (Logged In)      |
| **Status**     | `200 OK`                 |

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

| Field       | Type     | Description                          |
|-------------|----------|--------------------------------------|
| `id`        | `string` | Unique user identifier (UUID)        |
| `email`     | `string` | User's registered email address      |
| `fullName`  | `string` | User's full display name             |
| `imageUrl`  | `string` | URL to profile picture               |
| `role`      | `string` | User role — `USER`, `AUTHOR`, `ADMIN`|
| `createdAt` | `string` | ISO 8601 account creation timestamp  |

---

### 2. Update Profile

| Property       | Details                  |
|----------------|--------------------------|
| **Route**      | `PATCH /api/v1/auth/me`  |
| **Access**     | Private (Logged In)      |
| **Status**     | `200 OK`                 |

#### Request Payload

```json
{
  "fullName": "John Smith",
  "imageUrl": "https://..."
}
```

#### Payload Fields

| Field      | Type     | Required | Description                   |
|------------|----------|----------|-------------------------------|
| `fullName` | `string` | No       | New full name for the profile |
| `imageUrl` | `string` | No       | New profile picture URL       |

#### Response

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "fullName": "John Smith",
    "..."  : "..."
  }
}
```