# Dashboard Module

> All responses follow the [Standard Response Envelope](./Standard_Response_Envelope.md). Possible error codes: `400`, `401`, `403`, `404`, `429`, `500`.

All endpoints in this module are **`ADMIN` only** (`protect` + `restrictTo('ADMIN')`). A non-admin receives `403`; an unauthenticated request receives `401`.

---

## Endpoints

### 1. Get Overall Platform Statistics

| Property   | Details                         |
|------------|---------------------------------|
| **Route**  | `GET /api/v1/dashboard/overall` |
| **Access** | Private (`ADMIN` only)          |
| **Status** | `200 OK`                        |

**Description:** High-level platform metrics — total earnings, counts, and a month-by-month engagement series formatted for charting libraries.

#### Response

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalEarnings": 45000,
      "totalEventsConducted": 12,
      "totalUsers": 204,
      "totalSuccessfulEnrollments": 180
    },
    "engagementChart": [
      { "month": "Jan 2026", "enrollments": 0 },
      { "month": "Feb 2026", "enrollments": 42 },
      { "month": "Mar 2026", "enrollments": 60 },
      { "month": "Apr 2026", "enrollments": 18 },
      { "month": "May 2026", "enrollments": 33 },
      { "month": "Jun 2026", "enrollments": 27 }
    ]
  }
}
```

#### `overview` Field Reference

| Field                        | Type     | Description                                                    |
|------------------------------|----------|---------------------------------------------------------------|
| `totalEarnings`              | `number` | Sum of `amount` from all `SUCCESS` payments across all events  |
| `totalEventsConducted`       | `number` | Total number of events created on the platform                |
| `totalUsers`                 | `number` | Total registered user accounts                                |
| `totalSuccessfulEnrollments` | `number` | Total enrollments with `APPROVED` status                      |

#### `engagementChart` Field Reference

| Field         | Type     | Description                                              |
|---------------|----------|----------------------------------------------------------|
| `month`       | `string` | Month label, format `"MMM YYYY"` (e.g. `"Jan 2026"`)    |
| `enrollments` | `number` | Count of `APPROVED` enrollments created in that month   |

> **Chart contract — always exactly 6 entries, oldest → newest, with no gaps.** The series spans the **last 6 calendar months including the current month**. Months with no approved enrollments are included with `enrollments: 0` (not omitted), so the array can be passed straight into **Recharts / Chart.js / Victory** without holes or pre-processing. Enrollments are bucketed by their creation month.

---

### 2. Get Event-Specific Statistics

| Property   | Details                                 |
|------------|-----------------------------------------|
| **Route**  | `GET /api/v1/dashboard/events/:eventId` |
| **Access** | Private (`ADMIN` only)                  |
| **Status** | `200 OK`                                |

**Description:** Deep-dive breakdown for a single event — revenue, enrollment-status counts, the list of approved participants, and the queue of pending payments awaiting verification.

#### Path Parameters

| Parameter | Type     | Description                                  |
|-----------|----------|----------------------------------------------|
| `eventId` | `string` | CUID of the event. Malformed ids return `400` |

#### Response

```json
{
  "success": true,
  "data": {
    "eventInfo": {
      "id": "cuid-event-id",
      "title": "React Advanced Workshop",
      "isFree": false,
      "price": 500,
      "date": "2026-06-01T10:00:00.000Z",
      "isActive": true
    },
    "stats": {
      "totalRevenue": 15000,
      "approvedParticipants": 30,
      "pendingVerifications": 5,
      "rejectedRequests": 1
    },
    "participants": [
      {
        "enrollmentId": "cuid-enrollment-id",
        "enrolledAt": "2026-05-20T10:00:00.000Z",
        "user": {
          "id": "uuid-user-id",
          "fullName": "Alice Johnson",
          "email": "alice@example.com",
          "imageUrl": "https://..."
        }
      }
    ],
    "pendingRequests": [
      {
        "paymentId": "cuid-payment-id",
        "utr": "ABCD12345678",
        "screenshotUrl": "https://...",
        "amount": 500,
        "submittedAt": "2026-05-21T14:30:00.000Z",
        "user": {
          "id": "uuid-user-id",
          "fullName": "Bob Singh",
          "email": "bob@example.com"
        }
      }
    ]
  }
}
```

#### `eventInfo` Field Reference

| Field      | Type      | Description                                                        |
|------------|-----------|--------------------------------------------------------------------|
| `id`       | `string`  | Unique event identifier (CUID)                                     |
| `title`    | `string`  | Event title                                                        |
| `isFree`   | `boolean` | Whether the event requires payment                                 |
| `price`    | `number`  | Ticket price (whole units; `0` when `isFree` is `true`)           |
| `date`     | `string`  | ISO 8601 datetime of the event                                     |
| `isActive` | `boolean` | Whether the event is publicly visible                              |

#### `stats` Field Reference

| Field                  | Type     | Description                                                          |
|------------------------|----------|----------------------------------------------------------------------|
| `totalRevenue`         | `number` | Sum of `amount` from `SUCCESS` payments for this event              |
| `approvedParticipants` | `number` | Count of enrollments with `APPROVED` status                          |
| `pendingVerifications` | `number` | Count of enrollments still `PENDING` admin review                    |
| `rejectedRequests`     | `number` | Count of enrollments with `REJECTED` status                          |

#### `participants[]` — Item Field Reference

> Contains only `APPROVED` enrollments. Pending and rejected entries are reflected in `stats` but not listed here.

| Field           | Type     | Description                                            |
|-----------------|----------|--------------------------------------------------------|
| `enrollmentId`  | `string` | Unique enrollment identifier (CUID)                    |
| `enrolledAt`    | `string` | ISO 8601 timestamp of when the enrollment was **approved** |
| `user.id`       | `string` | Unique user identifier (UUID)                          |
| `user.fullName` | `string` | Participant's full name                                |
| `user.email`    | `string` | Participant's registered email address                 |
| `user.imageUrl` | `string` | URL to the participant's profile picture               |

#### `pendingRequests[]` — Item Field Reference

> The queue of payments **awaiting verification** for this event (status `PENDING`), **oldest first** so admins can clear the queue in order. Each entry is the data an admin needs to verify a manual UPI payment and then call `PATCH /api/v1/payments/:id/review`.

| Field           | Type     | Description                                              |
|-----------------|----------|----------------------------------------------------------|
| `paymentId`     | `string` | Payment id to pass to the review endpoint (CUID)        |
| `utr`           | `string` | The UTR / transaction reference to cross-check in the bank app |
| `screenshotUrl` | `string` | URL of the user-submitted payment screenshot            |
| `amount`        | `number` | Amount the user claims to have paid (verify against `price`) |
| `submittedAt`   | `string` | ISO 8601 timestamp of when the payment was submitted    |
| `user.id`       | `string` | Submitter's user id (UUID)                              |
| `user.fullName` | `string` | Submitter's full name                                   |
| `user.email`    | `string` | Submitter's email                                       |

#### Errors

| Status | `message`                  | Cause                              |
|--------|----------------------------|------------------------------------|
| `400`  | `Invalid event ID format.` | `eventId` is not a valid CUID      |
| `404`  | `Event not found`          | No event with that id              |

---

## Notes on Retries & Counts

Because a user may **retry** a payment after rejection (see [Payments](./payments_docs.md)), an event can accumulate multiple payment rows for the same user — at most one of which is `SUCCESS`. All figures here are status-scoped so retries never distort them:

- `totalRevenue` / `totalEarnings` sum **`SUCCESS`** payments only — rejected retry attempts contribute nothing.
- `approvedParticipants` and the participant list count **`APPROVED`** enrollments only (one per user per event).
- `pendingRequests` lists current **`PENDING`** payments; once reviewed, a payment leaves this queue.