# Payments & Enrollments Module

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

### 1. Submit Manual Payment

| Property   | Details                          |
|------------|----------------------------------|
| **Route**  | `POST /api/v1/payments`          |
| **Access** | Private (Logged In)              |
| **Status** | `201 Created`                    |

#### Request Payload

```json
{
  "eventId": "cuid-of-event",
  "amount": 500,
  "utr": "ABCD12345678",
  "screenshotUrl": "https://..."
}
```

#### Payload Fields

| Field           | Type     | Required | Description                                                       |
|-----------------|----------|----------|-------------------------------------------------------------------|
| `eventId`       | `string` | Yes      | CUID of the event being enrolled in                               |
| `amount`        | `number` | Yes      | Amount paid by the user                                           |
| `utr`           | `string` | Yes      | Unique Transaction Reference number from the payment              |
| `screenshotUrl` | `string` | Yes      | Publicly accessible URL of the payment confirmation screenshot    |

#### Business Validation Rules

The API enforces the following rules before creating a `PENDING` payment:

- **Free Events Check:** If the requested event has `isFree: true`, the API returns a `400 Bad Request` with the message `"This is a free event. No payment is required."`.
- **Minimum Amount Check:** The `amount` provided in the payload must be greater than or equal to the event's `price`. If the user attempts to underpay, the API returns a `400 Bad Request`.

#### Response

```json
{
  "success": true,
  "message": "Payment submitted successfully. Your enrollment is pending admin verification.",
  "data": {
    "payment": {
      "id": "cuid",
      "status": "PENDING",
      "...": "..."
    },
    "enrollment": {
      "id": "cuid",
      "status": "PENDING",
      "...": "..."
    }
  }
}
```

#### Payment & Enrollment Statuses

| Status     | Description                                        |
|------------|----------------------------------------------------|
| `PENDING`  | Submitted but not yet reviewed by an admin         |
| `SUCCESS`  | Payment verified and approved                      |
| `REJECTED` | Payment rejected by admin                          |
| `APPROVED` | Enrollment activated after payment success         |

---

### 2. Review Pending Payment

| Property   | Details                                  |
|------------|------------------------------------------|
| **Route**  | `PATCH /api/v1/payments/:id/review`      |
| **Access** | Private (ADMIN only)                     |
| **Status** | `200 OK`                                 |

#### Path Parameters

| Parameter | Type     | Description           |
|-----------|----------|-----------------------|
| `id`      | `string` | CUID of the payment   |

#### Request Payload

```json
{
  "status": "SUCCESS",
  "rejectionReason": ""
}
```

#### Payload Fields

| Field             | Type     | Required                          | Description                                        |
|-------------------|----------|-----------------------------------|----------------------------------------------------|
| `status`          | `string` | Yes                               | New status — `SUCCESS` or `REJECTED`               |
| `rejectionReason` | `string` | **Required if status=`REJECTED`** | Explanation provided to the user for the rejection |

> **Note:** If `status` is set to `"REJECTED"`, the `rejectionReason` field becomes strictly required. Omitting it will result in a `400` validation error.

#### Response

```json
{
  "success": true,
  "message": "Payment has been marked as SUCCESS. Enrollment is now APPROVED.",
  "data": {
    "payment": {
      "id": "cuid",
      "status": "SUCCESS",
      "...": "..."
    },
    "enrollment": {
      "id": "cuid",
      "status": "APPROVED",
      "...": "..."
    }
  }
}
```

#### Status Transition Logic

| Payment Action | Payment Status | Enrollment Status |
|----------------|----------------|-------------------|
| Submitted      | `PENDING`      | `PENDING`         |
| Approved       | `SUCCESS`      | `APPROVED`        |
| Rejected       | `REJECTED`     | `REJECTED`        |