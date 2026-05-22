# Dashboard Module

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

### 1. Get Overall Platform Statistics

| Property   | Details                              |
|------------|--------------------------------------|
| **Route**  | `GET /api/v1/dashboard/overall`      |
| **Access** | Private (ADMIN only)                 |
| **Status** | `200 OK`                             |

**Description:** Returns high-level metrics for the entire platform, including total earnings, user counts, and month-wise engagement data formatted for charting libraries.

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
      { "month": "Jan 2026", "enrollments": 15 },
      { "month": "Feb 2026", "enrollments": 42 },
      { "month": "Mar 2026", "enrollments": 60 }
    ]
  }
}
```

#### `overview` Field Reference

| Field                        | Type     | Description                                                   |
|------------------------------|----------|---------------------------------------------------------------|
| `totalEarnings`              | `number` | Sum of all revenue from `SUCCESS` payments across all events  |
| `totalEventsConducted`       | `number` | Total number of events that have been created on the platform |
| `totalUsers`                 | `number` | Total registered user accounts                                |
| `totalSuccessfulEnrollments` | `number` | Total enrollments with an `APPROVED` status                   |

#### `engagementChart` Field Reference

| Field         | Type     | Description                                                          |
|---------------|----------|----------------------------------------------------------------------|
| `month`       | `string` | Month label formatted as `"MMM YYYY"` (e.g. `"Jan 2026"`)           |
| `enrollments` | `number` | Total approved enrollments recorded in that calendar month           |

> The `engagementChart` array is pre-sorted chronologically and can be passed directly into charting libraries such as **Recharts**, **Chart.js**, or **Victory** without any transformation.

---

### 2. Get Event-Specific Statistics

| Property   | Details                                       |
|------------|-----------------------------------------------|
| **Route**  | `GET /api/v1/dashboard/events/:eventId`       |
| **Access** | Private (ADMIN only)                          |
| **Status** | `200 OK`                                      |

**Description:** Returns a deep-dive breakdown for a single event — including the revenue it generated, the status of all ticket requests, and a full list of approved participants with their user details.

#### Path Parameters

| Parameter | Type     | Description            |
|-----------|----------|------------------------|
| `eventId` | `string` | CUID of the event      |

#### Response

```json
{
  "success": true,
  "data": {
    "eventInfo": {
      "id": "cuid-event-id",
      "title": "React Advanced Workshop",
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
    ]
  }
}
```

#### `eventInfo` Field Reference

| Field      | Type      | Description                                      |
|------------|-----------|--------------------------------------------------|
| `id`       | `string`  | Unique event identifier (CUID)                   |
| `title`    | `string`  | Event title                                      |
| `price`    | `number`  | Ticket price in currency units                   |
| `date`     | `string`  | ISO 8601 datetime of the event                   |
| `isActive` | `boolean` | Whether the event is publicly visible            |

#### `stats` Field Reference

| Field                  | Type     | Description                                                          |
|------------------------|----------|----------------------------------------------------------------------|
| `totalRevenue`         | `number` | Sum of all `amount` values from `SUCCESS` payments for this event    |
| `approvedParticipants` | `number` | Count of enrollments with `APPROVED` status                          |
| `pendingVerifications` | `number` | Count of enrollments still in `PENDING` status awaiting admin review |
| `rejectedRequests`     | `number` | Count of enrollments with `REJECTED` status                          |

#### `participants` Array — Item Field Reference

| Field                  | Type     | Description                                              |
|------------------------|----------|----------------------------------------------------------|
| `enrollmentId`         | `string` | Unique enrollment identifier (CUID)                      |
| `enrolledAt`           | `string` | ISO 8601 timestamp of when the enrollment was approved   |
| `user.id`              | `string` | Unique user identifier (UUID)                            |
| `user.fullName`        | `string` | Participant's full name                                  |
| `user.email`           | `string` | Participant's registered email address                   |
| `user.imageUrl`        | `string` | URL to the participant's profile picture                 |

> Only enrollments with an `APPROVED` status are included in the `participants` array. Pending and rejected entries are counted in `stats` but are not listed here.