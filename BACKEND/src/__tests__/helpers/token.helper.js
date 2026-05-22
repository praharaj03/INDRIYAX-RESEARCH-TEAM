import jwt from 'jsonwebtoken';
import { config } from '../../config/env.config.js';

/**
 * Generate a valid Supabase JWT token for testing
 * This simulates what Supabase Auth would generate
 * 
 * @param {Object} payload - Token payload
 * @param {string} payload.sub - User ID (UUID format)
 * @param {string} payload.email - User email
 * @param {string} payload.role - User role (e.g., 'authenticated')
 * @param {string} secret - JWT secret to sign with (defaults to current config)
 * @returns {string} Signed JWT token
 */
export function generateSupabaseToken(payload = {}, secret = null) {
  const defaultPayload = {
    sub: payload.sub || '123e4567-e89b-12d3-a456-426614174000', // Default test user ID
    email: payload.email || 'test@example.com',
    role: payload.role || 'authenticated',
    aud: 'authenticated',
    iss: config.supabase.url || 'https://xehtvbeoqvuorcpphuvv.supabase.co',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour from now
  };

  const tokenPayload = { ...defaultPayload, ...payload };
  const jwtSecret = secret || config.supabase.jwtSecret;

  return jwt.sign(tokenPayload, jwtSecret);
}

/**
 * Generate a token with the CORRECT Supabase JWT secret
 * This is what a real Supabase token would look like
 */
export function generateValidSupabaseToken(payload = {}) {
  return generateSupabaseToken(payload, config.supabase.jwtSecret);
}

/**
 * Generate a token with an INCORRECT secret
 * This simulates the bug condition where the secret is wrong
 */
export function generateTokenWithWrongSecret(payload = {}) {
  const wrongSecret = 'wrong-secret-for-testing-bug-condition';
  return generateSupabaseToken(payload, wrongSecret);
}

/**
 * Decode a JWT token without verification (for inspection)
 */
export function decodeToken(token) {
  return jwt.decode(token, { complete: true });
}
