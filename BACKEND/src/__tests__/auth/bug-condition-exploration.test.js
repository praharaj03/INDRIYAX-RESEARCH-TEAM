/**
 * Bug Condition Exploration Test
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3**
 * 
 * **Property 1: Bug Condition - Valid Supabase Token Verification Failure**
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * DO NOT attempt to fix the test or the code when it fails
 * 
 * NOTE: This test encodes the expected behavior - it will validate the fix when it passes after implementation
 * 
 * GOAL: Surface counterexamples that demonstrate the bug exists with the current incorrect JWT secret
 * 
 * Test Strategy:
 * - Generate a JWT token that represents what Supabase would issue
 * - Send HTTP request to GET /api/v1/auth/me with Authorization: Bearer <token>
 * - Assert that with the CURRENT JWT secret, the middleware behavior matches expected behavior
 * - Document the actual behavior (rejection vs acceptance)
 * 
 * Expected Outcome on UNFIXED code:
 * - Test FAILS with "Invalid or expired token" or JWT signature verification error
 * - This proves the bug exists (valid tokens are being rejected)
 * 
 * Expected Outcome on FIXED code:
 * - Test PASSES (token verification succeeds, user profile is returned)
 * - This proves the fix works
 */

import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env.config.js';
import app from '../../app.js';
import prisma from '../../config/prisma.config.js';
import { generateValidSupabaseToken, decodeToken } from '../helpers/token.helper.js';

describe('Bug Condition Exploration: Valid Supabase Token Verification', () => {
  let testUserId;
  let validToken;

  beforeAll(async () => {
    // Create a test user in the database
    // This simulates a user that exists in Supabase and our database
    testUserId = '123e4567-e89b-12d3-a456-426614174000';
    
    try {
      await prisma.user.upsert({
        where: { id: testUserId },
        update: {
          email: 'bugtest@example.com',
          fullName: 'Bug Test User',
        },
        create: {
          id: testUserId,
          email: 'bugtest@example.com',
          fullName: 'Bug Test User',
          role: 'USER',
        },
      });
      console.log('[Bug Test Setup] Test user created:', testUserId);
    } catch (error) {
      console.error('[Bug Test Setup] Failed to create test user:', error.message);
    }

    // Generate a valid Supabase JWT token using the CURRENT JWT secret
    // This represents what a real Supabase token would look like
    validToken = generateValidSupabaseToken({
      sub: testUserId,
      email: 'bugtest@example.com',
      role: 'authenticated',
    });

    // Decode and log token details for debugging
    const decoded = decodeToken(validToken);
    console.log('[Bug Test Setup] Generated token claims:', decoded.payload);
    console.log('[Bug Test Setup] Token algorithm:', decoded.header.alg);
    console.log('[Bug Test Setup] Current JWT secret length:', config.supabase.jwtSecret?.length || 0);
    console.log('[Bug Test Setup] Current JWT secret (first 20 chars):', config.supabase.jwtSecret?.substring(0, 20) || 'NOT SET');
  }, 30000);

  /**
   * Property 1: Bug Condition - Valid Token Verification
   * 
   * This test encodes the EXPECTED BEHAVIOR after the fix:
   * - Valid Supabase JWT tokens should be accepted
   * - User should be attached to req.user
   * - Endpoint should return user profile data
   * 
   * On UNFIXED code (incorrect JWT secret):
   * - This test will FAIL (token rejected with 401)
   * - Failure proves the bug exists
   * 
   * On FIXED code (correct JWT secret):
   * - This test will PASS (token accepted, profile returned)
   * - Success proves the fix works
   */
  it('should successfully verify valid Supabase JWT token and return user profile', async () => {
    console.log('\n[Bug Condition Test] Testing valid token against /api/v1/auth/me');
    console.log('[Bug Condition Test] Token (first 50 chars):', validToken.substring(0, 50) + '...');

    // Attempt to verify the token manually first to see what error we get
    try {
      const decoded = jwt.verify(validToken, config.supabase.jwtSecret);
      console.log('[Bug Condition Test] Manual jwt.verify() SUCCEEDED');
      console.log('[Bug Condition Test] Decoded user ID:', decoded.sub);
    } catch (error) {
      console.error('[Bug Condition Test] Manual jwt.verify() FAILED:', {
        errorName: error.name,
        errorMessage: error.message,
      });
      console.error('[Bug Condition Test] This indicates JWT secret mismatch');
    }

    // Send HTTP request to protected endpoint
    const response = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${validToken}`)
      .expect('Content-Type', /json/);

    console.log('[Bug Condition Test] Response status:', response.status);
    console.log('[Bug Condition Test] Response body:', JSON.stringify(response.body, null, 2));

    // EXPECTED BEHAVIOR (after fix):
    // - Status should be 200
    // - Response should contain user data
    // - User ID should match the token's sub claim
    
    // If this assertion FAILS on unfixed code, it proves the bug exists
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBe(testUserId);
    expect(response.body.data.email).toBe('bugtest@example.com');

    console.log('[Bug Condition Test] ✓ Token verification SUCCEEDED');
    console.log('[Bug Condition Test] ✓ User profile returned successfully');
  }, 30000);

  /**
   * Counterexample Documentation Test
   * 
   * This test documents the specific error when token verification fails
   * It helps identify the root cause (signature mismatch, wrong secret, etc.)
   */
  it('should document JWT verification error details', async () => {
    console.log('\n[Counterexample Documentation] Analyzing JWT verification behavior');

    // Test 1: Verify token structure is valid
    const decoded = decodeToken(validToken);
    expect(decoded).toBeDefined();
    expect(decoded.payload.sub).toBe(testUserId);
    expect(decoded.payload.email).toBe('bugtest@example.com');
    expect(decoded.header.alg).toBe('HS256');
    console.log('[Counterexample] ✓ Token structure is valid');

    // Test 2: Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    const isExpired = decoded.payload.exp < now;
    expect(isExpired).toBe(false);
    console.log('[Counterexample] ✓ Token is not expired');

    // Test 3: Attempt verification with current secret
    let verificationError = null;
    try {
      jwt.verify(validToken, config.supabase.jwtSecret);
      console.log('[Counterexample] ✓ Token verification SUCCEEDED with current secret');
    } catch (error) {
      verificationError = error;
      console.error('[Counterexample] ✗ Token verification FAILED with current secret:', {
        errorName: error.name,
        errorMessage: error.message,
      });
    }

    // Test 4: Document current JWT secret configuration
    console.log('[Counterexample] Current JWT secret configuration:', {
      isDefined: !!config.supabase.jwtSecret,
      length: config.supabase.jwtSecret?.length || 0,
      firstChars: config.supabase.jwtSecret?.substring(0, 20) || 'NOT SET',
      isBase64Like: /^[A-Za-z0-9+/=]+$/.test(config.supabase.jwtSecret || ''),
    });

    // If verification failed, this is the bug condition
    if (verificationError) {
      console.error('[Counterexample] BUG CONFIRMED: Valid token rejected due to:', verificationError.message);
      console.error('[Counterexample] Root cause: JWT secret mismatch');
      console.error('[Counterexample] Action required: Update SUPABASE_JWT_SECRET in .env with correct value from Supabase dashboard');
    }
  });
});
