# Events Module

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

### 1. Get All Events

| Property   | Details                                                                    |
|------------|----------------------------------------------------------------------------|
| **Route**  | `GET /api/v1/events`                                                       |
| **Access** | Public (returns `isActive: true` only) · Admin (returns all)              |
| **Status** | `200 OK`                                                                   |

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "cuid",
      "slug": "react-summit-xyz",
      "title": "React Summit",
      "price": 0,
      "date": "2026-06-01T10:00:00Z",
      "...": "..."
    }
  ]
}
```

---

### 2. Get Event by Slug

| Property   | Details                          |
|------------|----------------------------------|
| **Route**  | `GET /api/v1/events/:slug`       |
| **Access** | Public                           |
| **Status** | `200 OK`                         |

#### Path Parameters

| Parameter | Type     | Description              |
|-----------|----------|--------------------------|
| `slug`    | `string` | URL-friendly event slug  |

#### Response

```json
{
  "success": true,
  "data": {
    "id": "cuid",
    "title": "React Summit",
    "...": "..."
  }
}
```

---

### 3. Create Event

| Property   | Details                          |
|------------|----------------------------------|
| **Route**  | `POST /api/v1/events`            |
| **Access** | Private (ADMIN only)             |
| **Status** | `201 Created`                    |

#### Request Payload

```json
{
  "title": "React Summit",
  "description": "Full day conference...",
  "speaker": "Jane Doe",
  "thumbnail": "https://...",
  "venue": "Tech Park",
  "type": "OFFLINE",
  "price": 500,
  "date": "2026-06-01T10:00:00.000Z"
}
```

#### Payload Fields

| Field         | Type     | Required | Description                              |
|---------------|----------|----------|------------------------------------------|
| `title`       | `string` | Yes      | Event title                              |
| `description` | `string` | Yes      | Full description of the event            |
| `speaker`     | `string` | Yes      | Name of the speaker(s)                   |
| `thumbnail`   | `string` | Yes      | URL to the event thumbnail image         |
| `venue`       | `string` | Yes      | Physical or virtual venue name           |
| `type`        | `string` | Yes      | Event type — `OFFLINE` or `ONLINE`       |
| `price`       | `number` | Yes      | Ticket price (use `0` for free events)   |
| `date`        | `string` | Yes      | ISO 8601 datetime for the event          |

#### Response

```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "id": "cuid",
    "slug": "react-summit-xyz",
    "...": "..."
  }
}
```

---

### 4. Update Event

| Property   | Details                          |
|------------|----------------------------------|
| **Route**  | `PATCH /api/v1/events/:id`       |
| **Access** | Private (ADMIN only)             |
| **Status** | `200 OK`                         |

#### Path Parameters

| Parameter | Type     | Description          |
|-----------|----------|----------------------|
| `id`      | `string` | CUID of the event    |

> Send only the fields you wish to update in the request body. All fields from the **Create Event** payload are accepted.

---

### 5. Delete Event

| Property   | Details                          |
|------------|----------------------------------|
| **Route**  | `DELETE /api/v1/events/:id`      |
| **Access** | Private (ADMIN only)             |
| **Status** | `200 OK`                         |

#### Path Parameters

| Parameter | Type     | Description          |
|-----------|----------|----------------------|
| `id`      | `string` | CUID of the event    |