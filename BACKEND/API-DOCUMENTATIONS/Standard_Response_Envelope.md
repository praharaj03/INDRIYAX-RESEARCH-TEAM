# Standard Response Envelope

Every IndriyaX API response — success or error — follows one of two predictable shapes. This lets the frontend handle responses generically and surface the right notification to the user.

---

## Success

```json
{
  "success": true,
  "message": "Optional success message",
  "data": { }
}
```

| Field     | Type                | Always present | Description                                         |
|-----------|---------------------|----------------|-----------------------------------------------------|
| `success` | `boolean`           | Yes            | `true` for all 2xx responses                        |
| `message` | `string`            | No             | Human-readable success note (present on writes)     |
| `data`    | `object` \| `array` | Yes            | The payload (shape depends on the endpoint)         |

---

## Error

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

| Field     | Type      | Always present | Description                                                                 |
|-----------|-----------|----------------|-----------------------------------------------------------------------------|
| `success` | `boolean` | Yes            | Always `false` for errors                                                   |
| `status`  | `string`  | Yes            | `"fail"` for 4xx (client) errors, `"error"` for 5xx (server) errors         |
| `message` | `string`  | Yes            | Safe, human-readable description the frontend can show directly             |
| `errors`  | `array`   | No             | Field-level validation details; present mainly on `400` validation failures |

> `errors` is an array of `{ field, message }` objects. `field` is the offending input key (e.g. `"utr"`, `"fullName"`); for top-level rules it may be the section name. Use it to highlight the specific input in a form.

---

## Status Codes

| Code  | `status` | Meaning               | Typical cause                                                                         |
|-------|----------|-----------------------|---------------------------------------------------------------------------------------|
| `200` | —        | OK                    | Successful read or update                                                             |
| `201` | —        | Created               | New resource created (event, post, comment, payment)                                  |
| `400` | `fail`   | Bad Request           | Validation failure, business-rule violation, malformed JSON                           |
| `401` | `fail`   | Unauthorized          | Missing / invalid / expired auth token                                                |
| `403` | `fail`   | Forbidden             | Authenticated but lacks the required role or ownership                                 |
| `404` | `fail`   | Not Found             | Resource (or route) does not exist                                                    |
| `409` | `fail`   | Conflict              | Duplicate / state conflict (reused UTR, duplicate enrollment, already-processed payment, slug collision) |
| `413` | `fail`   | Payload Too Large     | Request body exceeds the size limit                                                   |
| `429` | `fail`   | Too Many Requests     | Rate limit exceeded (see per-endpoint limits)                                         |
| `500` | `error`  | Internal Server Error | Unexpected server fault (details hidden in production)                                 |
| `502` | `error`  | Bad Gateway           | Upstream storage (Supabase) failed during an upload                                   |
| `503` | `error`  | Service Unavailable   | Database temporarily unreachable                                                      |

### Notes on specific codes

- **`400`** carries the `errors[]` array for validation failures. Business-rule failures (e.g. underpaying for an event) return `400` with a descriptive `message` and no `errors[]`.
- **`409`** is used wherever a request conflicts with current state rather than being malformed — most notably throughout the payments flow.
- **`429`** responses include standard rate-limit headers (`RateLimit-*`). The **global** limit is **300 requests / minute / IP**; **payment submission** is additionally limited to **10 / minute / user**. The `/api/v1/health` route is never rate-limited.
- **`5xx`** responses never leak stack traces or internal details in production; the `message` is generic and safe to display.

---

## Security & Transport Notes

- Endpoints requiring authentication expect a Supabase access token: `Authorization: Bearer <token>`. Tokens are verified **locally** (signature, expiry, issuer, audience) with no per-request round-trip to Supabase.
- Standard security headers are applied to every response (via Helmet).
- CORS is restricted to the configured frontend origin(s); credentials are allowed.
- Request bodies are capped (JSON ~1 MB; file uploads 5 MB via multipart). Oversized bodies return `413`.
- The API runs behind a reverse proxy with `trust proxy` enabled, so client IPs (used for rate limiting) are resolved correctly.