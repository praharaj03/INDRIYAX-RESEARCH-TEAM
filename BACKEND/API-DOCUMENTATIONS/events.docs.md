# Events Module

> All responses follow the [Standard Response Envelope](./Standard_Response_Envelope.md). Possible error codes: `400`, `401`, `403`, `404`, `409`, `429`, `500`.

## Access Overview

| Action                    | Access                                   |
|---------------------------|------------------------------------------|
| List / view events        | Public (with optional auth for admins)   |
| Create / update / delete  | `ADMIN` only                             |

> Admin-only routes require a valid token **and** the `ADMIN` role. The list endpoint uses optional ("soft") auth: anonymous callers receive active events only; an authenticated admin additionally sees inactive events.

---

## Endpoints

### 1. Get All Events

| Property   | Details                                                  |
|------------|----------------------------------------------------------|
| **Route**  | `GET /api/v1/events`                                     |
| **Access** | Public (active only) · Admin (all, including inactive)   |
| **Status** | `200 OK`                                                 |

Results are ordered by event `date` ascending.

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "cuid",
      "slug": "react-summit-xyz",
      "title": "React Summit",
      "description": "Full day conference...",
      "speaker": "Jane Doe",
      "thumbnail": "https://...",
      "venue": "Tech Park",
      "type": "OFFLINE",
      "date": "2026-06-01T10:00:00Z",
      "isActive": true,
      "isFree": false,
      "price": 500,
      "createdAt": "2026-05-22T10:00:00Z"
    }
  ]
}
```

> **Payment details are intentionally omitted from the list.** `qrCodeUrl`, `upiId`, `upiNumber`, `meetingLink`, `summary`, and `recordingLink` are **not** returned in the bulk listing — fetch a single event by slug to retrieve them.

---

### 2. Get Event by Slug

| Property   | Details                    |
|------------|----------------------------|
| **Route**  | `GET /api/v1/events/:slug` |
| **Access** | Public                     |
| **Status** | `200 OK`                   |

Returns the **full** event record, including the payment details (`qrCodeUrl`, `upiId`, `upiNumber`) the frontend needs to render the payment screen for a paid event.

#### Path Parameters

| Parameter | Type     | Description             |
|-----------|----------|-------------------------|
| `slug`    | `string` | URL-friendly event slug |

#### Errors

| Status | `message`         |
|--------|-------------------|
| `404`  | `Event not found` |

---

### 3. Create Event

| Property   | Details                |
|------------|------------------------|
| **Route**  | `POST /api/v1/events`  |
| **Access** | Private (`ADMIN` only) |
| **Status** | `201 Created`          |

The `slug` is generated automatically from the title.

#### Request Payload

```json
{
  "title": "React Summit",
  "description": "Full day conference...",
  "speaker": "Jane Doe",
  "thumbnail": "https://...",
  "venue": "Tech Park",
  "type": "OFFLINE",
  "date": "2026-06-01T10:00:00.000Z",
  "restricted": false,
  "isActive": true,
  "meetingLink": "https://...",
  "isFree": false,
  "price": 500,
  "qrCodeUrl": "https://...",
  "upiId": "indriyax@ybl",
  "upiNumber": "9876543210"
}
```

#### Payload Fields

| Field         | Type      | Required    | Description                                                            |
|---------------|-----------|-------------|------------------------------------------------------------------------|
| `title`       | `string`  | Yes         | Min 3 chars                                                            |
| `description` | `string`  | Yes         | Min 10 chars                                                           |
| `speaker`     | `string`  | Yes         | Min 2 chars                                                            |
| `thumbnail`   | `string`  | Yes         | Valid URL                                                              |
| `venue`       | `string`  | Yes         | Min 2 chars                                                            |
| `type`        | `string`  | Yes         | `ONLINE`, `OFFLINE`, or `HYBRID`                                       |
| `date`        | `string`  | Yes         | ISO 8601 datetime                                                     |
| `restricted`  | `boolean` | No          | Defaults to `false`                                                   |
| `isActive`    | `boolean` | No          | Defaults to `true` (publicly visible)                                 |
| `meetingLink` | `string`  | No          | Valid URL or `null`                                                   |
| `isFree`      | `boolean` | No          | Defaults to `true`. If `false`, the payment fields below are required |
| `price`       | `number`  | Conditional | Integer (whole units). Required & > 0 if `isFree=false`               |
| `qrCodeUrl`   | `string`  | Conditional | Required if `isFree=false`. Bank QR image URL                         |
| `upiId`       | `string`  | Conditional | Required if `isFree=false`. Receiving UPI ID                         |
| `upiNumber`   | `string`  | No          | Optional contact number linked to the UPI account                    |

> **Conditional validation:** if `isFree` is `false`, the request is rejected with `400` unless `price` (> 0), `qrCodeUrl`, and `upiId` are **all** present. The error is reported on the `isFree` field so the frontend can highlight the billing section.

> **Unknown fields are rejected.** Sending a key not listed above returns `400`.

#### Response

```json
{
  "success": true,
  "message": "Event created successfully",
  "data": { "id": "cuid", "slug": "react-summit-xyz", "...": "..." }
}
```

> In the rare event of a slug collision, the API returns `409` — `Could not generate a unique slug for this event. Please try again.`

---

### 4. Update Event

| Property   | Details                    |
|------------|----------------------------|
| **Route**  | `PATCH /api/v1/events/:id` |
| **Access** | Private (`ADMIN` only)     |
| **Status** | `200 OK`                   |

#### Path Parameters

| Parameter | Type     | Description       |
|-----------|----------|-------------------|
| `id`      | `string` | CUID of the event |

Send only the fields you wish to change. All **Create Event** fields are accepted, plus:

| Field           | Type     | Description                  |
|-----------------|----------|------------------------------|
| `summary`       | `string` | Post-event summary text      |
| `recordingLink` | `string` | URL to the event recording   |

> **Conditional validation applies the same way — and is enforced against the _merged_ result.** If a patch would leave the event paid (`isFree: false`) without a valid `price`, `qrCodeUrl`, and `upiId` — whether those values come from the patch or the existing record — the request is rejected with `400`. An event can never be left in a "paid but unpayable" state. Unknown fields are rejected with `400`.

#### Errors

| Status | `message`                                                                          |
|--------|------------------------------------------------------------------------------------|
| `404`  | `Event not found`                                                                  |
| `400`  | `Paid events require a price greater than 0, a QR code image URL, and a UPI ID.`    |

---

### 5. Delete Event

| Property   | Details                     |
|------------|-----------------------------|
| **Route**  | `DELETE /api/v1/events/:id` |
| **Access** | Private (`ADMIN` only)      |
| **Status** | `200 OK`                    |

#### Path Parameters

| Parameter | Type     | Description       |
|-----------|----------|-------------------|
| `id`      | `string` | CUID of the event |

#### Behavior & Errors

| Status | `message`                                                              | Cause                                                                                      |
|--------|------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| `404`  | `Event not found`                                                      | No event with that id                                                                      |
| `400`  | `Operation failed because a related record is missing or still in use.` | The event has **payment records** — deletion is blocked to preserve financial history     |

> Enrollments for an event are removed automatically on delete (cascade). **Payments are not** — an event that has ever received a payment cannot be deleted. Resolve/archive those records first if removal is truly required.