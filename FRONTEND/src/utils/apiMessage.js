/**
 * apiMessage.js
 *
 * Helpers for surfacing the EXACT message the IndriyaX backend returns.
 *
 * IMPORTANT — matches THIS app's axios interceptors (src/api/client.js):
 *
 *  Success interceptor returns the unwrapped envelope:
 *      { success: true, message?, data }
 *
 *  Error interceptor REJECTS with a flattened object (NOT an axios error):
 *      { message: string, errors: [{field,message}], status: number }
 *
 * So a caught error here is typically:  { message, errors, status }
 * These helpers also stay tolerant of raw axios errors / envelopes / strings,
 * in case any call bypasses the interceptor.
 */

/** Locate the envelope-ish object from any error/result shape. */
function pickEnvelope(e) {
  if (!e) return null;
  // axios raw error
  if (e.response?.data) return e.response.data;
  // some wrappers
  if (e.data && (e.data.message || e.data.errors)) return e.data;
  // this app's flattened error  { message, errors, status }  OR a raw envelope
  if (e.message || Array.isArray(e.errors)) return e;
  if (e.success === false) return e;
  return null;
}

/**
 * Best human-readable error message.
 * Priority: errors[0].message (field validation) -> message -> fallback.
 */
export function getErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  if (!err) return fallback;
  if (typeof err === 'string') return err;

  const env = pickEnvelope(err);
  if (env) {
    if (Array.isArray(env.errors) && env.errors.length > 0 && env.errors[0]?.message) {
      return env.errors[0].message;
    }
    if (env.message && env.message !== '[object Object]') return env.message;
  }
  if (err.message && err.message !== '[object Object]') return err.message;
  return fallback;
}

/** Map of { field: message } for inline form display. */
export function getFieldErrors(err) {
  const env = pickEnvelope(err);
  const out = {};
  if (env && Array.isArray(env.errors)) {
    for (const e of env.errors) {
      if (e?.field && e?.message && !out[e.field]) out[e.field] = e.message;
    }
  }
  return out;
}

/** Success message from a (possibly already-unwrapped) response/envelope. */
export function getSuccessMessage(res, fallback = 'Done.') {
  if (!res) return fallback;
  if (typeof res === 'string') return res;
  return res?.message || res?.data?.message || fallback;
}

/**
 * HTTP status of an error.
 * This app's interceptor puts it at top-level `status` (a number).
 * Falls back to axios shapes for safety.
 */
export function getErrorStatus(err) {
  if (!err) return null;
  // this app's flattened error: { message, errors, status }
  if (typeof err.status === 'number') return err.status;
  return (
    err?.response?.status ||
    err?.statusCode ||
    null
  );
}