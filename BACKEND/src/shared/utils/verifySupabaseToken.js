import { createRemoteJWKSet, jwtVerify } from 'jose';
import { config } from '../../config/env.config.js';

// THE single source of truth for verifying a Supabase access token.
// Both protect (blocking) and softAuth (non-blocking) call this, so their
// verification can never drift apart again.
//
// Supabase asymmetric signing keys are published as a JWKS. createRemoteJWKSet
// fetches once, caches in memory, and only re-fetches when it sees an unknown
// key id (kid) — i.e. after a key rotation. So there is no per-request network
// call on the hot path.
const JWKS = createRemoteJWKSet(
  new URL(`${String(config.supabase.url).replace(/\/$/, '')}/auth/v1/.well-known/jwks.json`)
);

const JWT_ISSUER = `${String(config.supabase.url).replace(/\/$/, '')}/auth/v1`;
const JWT_AUDIENCE = 'authenticated';

// Pin to the asymmetric algorithms Supabase uses. If you confirm your tokens
// are exactly one of these (check the `alg` in the token header), trim to just
// that value — but keeping both is safe.
const ALGORITHMS = ['ES256', 'RS256'];

/**
 * Verifies a Supabase JWT locally (signature, expiry, issuer, audience).
 * @param {string} token - the raw bearer token (no "Bearer " prefix)
 * @returns {Promise<object>} the verified JWT claims (payload)
 * @throws if the token is invalid/expired/wrong issuer|audience
 */
export const verifySupabaseToken = async (token) => {
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    algorithms: ALGORITHMS,
  });
  return payload;
};