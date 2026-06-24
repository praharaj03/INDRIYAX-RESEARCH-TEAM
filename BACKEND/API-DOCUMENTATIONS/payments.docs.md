# Payments & Enrollments Module

> All responses follow the [Standard Response Envelope](./Standard_Response_Envelope.md). Possible error codes: `400`, `401`, `403`, `404`, `409`, `429`, `500`.

This module implements a **manual UPI payment + verification** flow. See [Manual Payment & Verification Flow](./payment_flow_docs.md) for the end-to-end sequence and state machine.

---

## Endpoints

### 1. Submit Manual Payment

| Property       | Details                       |
|----------------|-------------------------------|
| **Route**      | `POST /api/v1/payments`       |
| **Access**     | Private (Logged In)           |
| **Status**     | `201 Created`                 |
| **Rate limit** | 10 requests / minute / user   |

Creates a `PENDING` payment **and** a `PENDING` enrollment **atomically** — both succeed or neither does.

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

| Field           | Type     | Required | Rules                                                                              |
|-----------------|----------|----------|------------------------------------------------------------------------------------|
| `eventId`       | `string` | Yes      | CUID of the event being enrolled in                                                |
| `amount`        | `number` | Yes      | Integer; must be **≥** the event's `price`                                          |
| `utr`           | `string` | Yes      | 12–22 alphanumeric chars. **Normalized to uppercase** and must be **globally unique** |
| `screenshotUrl` | `string` | Yes      | Valid URL of the payment-confirmation screenshot (the admin's proof during review)  |

> **`screenshotUrl` is required.** Upload the screenshot first via `POST /api/v1/uploads/image`, then submit its returned URL here.
> **Unknown fields are rejected** with `400`.

#### Business Validation Rules

| Rule                            | Failure              | Code  | `message`                                                                |
|---------------------------------|----------------------|-------|--------------------------------------------------------------------------|
| Event must exist and be active  | —                    | `404` | `Event not found or is no longer active.`                                |
| Event must be paid              | `isFree: true`       | `400` | `This is a free event. No payment is required.`                          |
| No underpaying                  | `amount < price`     | `400` | `The payment amount (X) is less than the required event price (Y).`      |
| UTR must be unused              | reused UTR           | `409` | `This UTR / transaction reference has already been used.`                |

> Overpayment (`amount > price`) is **accepted** — the admin verifies the exact figure during review.

#### Enrollment State Rules (Duplicate Handling & Retry)

A user may have at most one enrollment per event. Submission behavior depends on the current enrollment state:

| Current enrollment | Behavior                                                                                       |
|--------------------|------------------------------------------------------------------------------------------------|
| _none_             | New payment + enrollment created → `201`                                                        |
| `REJECTED`         | **Retry allowed** — the enrollment is reset to `PENDING` and a **new** payment is created → `201` |
| `PENDING`          | Blocked → `409` `You already have a payment pending verification for this event.`              |
| `APPROVED`         | Blocked → `409` `You are already enrolled in this event.`                                       |

> Each retry creates a **new** payment record; the previous `REJECTED` payment is **retained for audit history**. A user whose payment was wrongly rejected can therefore resubmit with a new UTR.

#### Response

```json
{
  "success": true,
  "message": "Payment submitted successfully. Your enrollment is pending admin verification.",
  "data": {
    "payment": { "id": "cuid", "status": "PENDING", "...": "..." },
    "enrollment": { "id": "cuid", "status": "PENDING", "...": "..." },
    "retried": false
  }
}
```

| Field        | Type      | Description                                                  |
|--------------|-----------|-------------------------------------------------------------|
| `payment`    | `object`  | The created payment record                                  |
| `enrollment` | `object`  | The created (or recycled) enrollment record                 |
| `retried`    | `boolean` | `true` if this was a resubmission after a prior rejection   |

#### Statuses

| Status     | Applies to            | Meaning                              |
|------------|-----------------------|--------------------------------------|
| `PENDING`  | Payment & Enrollment  | Submitted, awaiting admin review     |
| `SUCCESS`  | Payment               | Verified and approved                |
| `REJECTED` | Payment & Enrollment  | Rejected by admin                    |
| `APPROVED` | Enrollment            | Activated after payment success      |

---

### 2. Review Pending Payment

| Property   | Details                              |
|------------|--------------------------------------|
| **Route**  | `PATCH /api/v1/payments/:id/review`  |
| **Access** | Private (`ADMIN` only)               |
| **Status** | `200 OK`                             |

Approves or rejects a `PENDING` payment and updates the linked enrollment **atomically**. The transition is **guarded at the database level** — a payment that is no longer `PENDING` cannot be re-processed (protects against two admins reviewing the same payment simultaneously).

#### Path Parameters

| Parameter | Type     | Description         |
|-----------|----------|---------------------|
| `id`      | `string` | CUID of the payment |

#### Request Payload

```json
{
  "status": "SUCCESS",
  "rejectionReason": ""
}
```

#### Payload Fields

| Field             | Type     | Required        | Rules                                                              |
|-------------------|----------|-----------------|-------------------------------------------------------------------|
| `status`          | `string` | Yes             | `SUCCESS` or `REJECTED`                                            |
| `rejectionReason` | `string` | If `REJECTED`   | 5–500 chars. **Required** when `status=REJECTED`; ignored otherwise |

> **Note:** if `status` is `REJECTED`, omitting `rejectionReason` (or supplying fewer than 5 chars) returns a `400` validation error. Unknown fields are rejected with `400`.

#### Transition Logic

| `status` sent | Payment becomes | Enrollment becomes |
|---------------|-----------------|--------------------|
| `SUCCESS`     | `SUCCESS`       | `APPROVED`         |
| `REJECTED`    | `REJECTED`      | `REJECTED`         |

The reviewing admin's id is recorded in `reviewedById`, with `reviewedAt` timestamped, for auditing.

#### Errors

| Status | `message`                                                                  |
|--------|----------------------------------------------------------------------------|
| `404`  | `Payment record not found.`                                                |
| `409`  | `This payment has already been processed (current status: X).`             |
| `409`  | `This payment was just processed by another request. Please refresh.`       |

#### Response

```json
{
  "success": true,
  "message": "Payment has been marked as SUCCESS. Enrollment is now APPROVED.",
  "data": {
    "payment": {
      "id": "cuid",
      "status": "SUCCESS",
      "reviewedById": "admin-uuid",
      "reviewedAt": "2026-05-23T09:00:00Z",
      "user": { "email": "user@example.com", "fullName": "John Doe" },
      "event": { "title": "React Summit" },
      "...": "..."
    },
    "enrollment": { "id": "cuid", "status": "APPROVED", "...": "..." }
  }
}
```

> The success `message` reflects the **actual resulting** statuses (read back from the database), not the requested status.