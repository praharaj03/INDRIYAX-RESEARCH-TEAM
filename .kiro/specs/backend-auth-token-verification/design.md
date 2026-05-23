# Backend Auth Token Verification Bugfix Design

## Overview

The backend authentication middleware is rejecting all valid JWT tokens issued by Supabase due to incorrect JWT secret configuration. The `SUPABASE_JWT_SECRET` environment variable contains a base64-encoded secret, but Supabase JWTs are signed with the project's JWT secret found in the Supabase dashboard under Project Settings > API > JWT Settings. This design outlines the fix to verify and configure the correct JWT secret, enhance error logging for better debugging, and validate the fix end-to-end.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when valid Supabase JWT tokens fail verification in the backend auth middleware
- **Property (P)**: The desired behavior when valid tokens are sent - successful verification and user authentication
- **Preservation**: Existing security behaviors (rejecting invalid/expired tokens, requiring Authorization header) that must remain unchanged
- **JWT Secret**: The cryptographic key used to verify JWT token signatures - must match the secret used by Supabase to sign tokens
- **auth.middleware.js**: The Express middleware in `src/middlewares/auth.middleware.js` that verifies JWT tokens using `jwt.verify()`
- **Supabase JWT**: Access tokens issued by Supabase Auth containing user identity claims (sub, email, role, etc.)
- **Token Verification**: The process of cryptographically validating a JWT's signature using the JWT secret

## Bug Details

### Bug Condition

The bug manifests when a valid Supabase JWT token is sent to any protected backend endpoint. The `protect` middleware in `auth.middleware.js` attempts to verify the token using `jwt.verify(token, config.supabase.jwtSecret)`, but the verification fails because the `SUPABASE_JWT_SECRET` environment variable contains an incorrect value (likely a project ID, anon key, or other non-secret value instead of the actual JWT secret from Supabase dashboard).

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type HTTPRequest
  OUTPUT: boolean
  
  RETURN input.headers.authorization EXISTS
         AND input.headers.authorization STARTS_WITH "Bearer "
         AND extractedToken = input.headers.authorization.split(' ')[1]
         AND extractedToken IS_VALID_SUPABASE_JWT
         AND config.supabase.jwtSecret != ACTUAL_SUPABASE_JWT_SECRET
         AND jwt.verify(extractedToken, config.supabase.jwtSecret) THROWS_ERROR
END FUNCTION
```

### Examples

- **Example 1**: User logs in via frontend Supabase client, receives valid JWT token `eyJhbGc...`, frontend sends `GET /api/v1/auth/me` with `Authorization: Bearer eyJhbGc...`, backend rejects with "Invalid or expired token" even though token is valid
- **Example 2**: User attempts to access protected event creation endpoint `POST /api/v1/events`, sends valid Supabase token, backend returns 401 Unauthorized due to verification failure
- **Example 3**: Frontend dashboard loads and calls `/api/v1/auth/me` to fetch user profile, receives authentication error, dashboard shows "Failed to load user data"
- **Edge Case**: User sends malformed token or expired token - backend should still reject with appropriate error (this behavior must be preserved)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Invalid or malformed tokens must continue to be rejected with appropriate error messages
- Requests without Authorization header must continue to be rejected as unauthorized
- Expired tokens must continue to be rejected with "Invalid or expired token" error
- Frontend Supabase authentication flow must continue to obtain valid JWT access tokens
- Token extraction from `Authorization: Bearer <token>` format must continue to work correctly
- Environment configuration loading from `.env` file must continue to work on server startup
- Auth middleware must continue to apply consistently across all protected routes

**Scope:**
All inputs that do NOT involve valid Supabase JWT tokens (missing tokens, malformed tokens, expired tokens, tokens from other sources) should be completely unaffected by this fix. This includes:
- Requests without Authorization header
- Requests with malformed Authorization header format
- Requests with expired or tampered tokens
- Server startup and configuration loading
- Other middleware and route handlers

## Hypothesized Root Cause

Based on the bug description and code analysis, the most likely issues are:

1. **Incorrect JWT Secret Value**: The `SUPABASE_JWT_SECRET` in `.env` contains the wrong value
   - May contain the project reference ID (e.g., `xehtvbeoqvuorcpphuvv`)
   - May contain the anon key instead of the JWT secret
   - May contain a service role key instead of the JWT secret
   - The correct value is found in Supabase Dashboard > Project Settings > API > JWT Settings > JWT Secret

2. **JWT Secret Format Mismatch**: The JWT secret may need specific encoding
   - Supabase JWT secrets are typically base64-encoded strings
   - The secret in `.env` may need to be the raw base64 string without additional encoding

3. **Missing Error Context**: The current error handling catches all JWT verification errors and returns a generic message
   - No logging of the actual verification error (signature mismatch, algorithm mismatch, etc.)
   - Difficult to diagnose whether the issue is secret mismatch, expired token, or other JWT error

4. **Environment Variable Not Loaded**: The `SUPABASE_JWT_SECRET` may not be properly loaded from `.env`
   - Less likely given the current code structure, but possible if `.env` file is not in the correct location

## Correctness Properties

Property 1: Bug Condition - Valid Token Verification

_For any_ HTTP request where a valid Supabase JWT token is provided in the Authorization header and the correct JWT secret is configured, the fixed auth middleware SHALL successfully verify the token using `jwt.verify()`, extract the user ID from the `sub` claim, retrieve the user from the database, and attach the user object to `req.user` for downstream handlers.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

Property 2: Preservation - Invalid Token Rejection

_For any_ HTTP request where the token is invalid (missing, malformed, expired, or tampered), the fixed auth middleware SHALL produce exactly the same rejection behavior as the original middleware, returning 401 Unauthorized with appropriate error messages and NOT allowing access to protected resources.

**Validates: Requirements 3.1, 3.2, 3.3, 3.5, 3.7**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct (incorrect JWT secret value):

**File**: `d:\INDRIYAX\BACKEND\.env`

**Environment Variable**: `SUPABASE_JWT_SECRET`

**Specific Changes**:
1. **Verify Correct JWT Secret**: Navigate to Supabase Dashboard > Project Settings > API > JWT Settings
   - Locate the "JWT Secret" field (NOT the anon key or service role key)
   - Copy the exact base64-encoded secret string
   - This is typically a long base64 string (e.g., `BrVDk9n4vRX+V4LJp0J9OIrV6gSF6EkexqvWeG39UWV51BzjEXf4I0FUO83vuxoYaPkkjjeejzfykF72h5alfA==`)

2. **Update .env Configuration**: Replace the current `SUPABASE_JWT_SECRET` value with the correct JWT secret
   - Ensure no extra whitespace or quotes around the value
   - Verify the value is the complete base64 string

3. **Enhance Error Logging**: Modify `src/middlewares/auth.middleware.js` to log detailed error information
   - Log the actual JWT verification error message (without exposing the token itself)
   - Log whether the error is due to signature mismatch, expiration, or other causes
   - Add structured logging to help diagnose future authentication issues

4. **Add Configuration Validation**: Add startup validation in `src/config/env.config.js`
   - Check that `SUPABASE_JWT_SECRET` is defined and non-empty
   - Optionally validate the format (base64 string of expected length)
   - Throw clear error on startup if JWT secret is missing

5. **Restart Backend Server**: After updating `.env`, restart the Node.js server to load the new configuration
   - Stop the current server process
   - Run `npm start` or `npm run dev` to restart with new environment variables

**File**: `d:\INDRIYAX\BACKEND\src\middlewares\auth.middleware.js`

**Function**: `protect` middleware

**Specific Changes**:
1. **Enhanced Error Logging**: Add detailed error logging in the catch block
   ```javascript
   catch (error) {
     // Log detailed error for debugging (without exposing sensitive token data)
     console.error('[Auth Middleware] Token verification failed:', {
       errorName: error.name,
       errorMessage: error.message,
       timestamp: new Date().toISOString()
     });
     
     return next(new UnauthorizedException('Invalid or expired token.'));
   }
   ```

2. **Token Presence Logging**: Add debug logging when token is missing
   ```javascript
   if (!token) {
     console.warn('[Auth Middleware] No token provided in Authorization header');
     return next(new UnauthorizedException('Not authorized to access this route. Please log in.'));
   }
   ```

3. **Successful Verification Logging**: Add debug logging on successful verification (optional, for development)
   ```javascript
   // After successful jwt.verify()
   console.log('[Auth Middleware] Token verified successfully for user:', decoded.sub);
   ```

**File**: `d:\INDRIYAX\BACKEND\src\config\env.config.js`

**Configuration Object**: `config.supabase`

**Specific Changes**:
1. **Add Validation**: Validate JWT secret on module load
   ```javascript
   // After dotenv.config()
   if (!process.env.SUPABASE_JWT_SECRET) {
     throw new Error('SUPABASE_JWT_SECRET is required but not defined in .env file');
   }
   
   if (process.env.SUPABASE_JWT_SECRET.length < 32) {
     console.warn('[Config] SUPABASE_JWT_SECRET seems too short - verify it is the correct JWT secret from Supabase dashboard');
   }
   ```

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code (with incorrect JWT secret), then verify the fix works correctly (with correct JWT secret) and preserves existing security behaviors.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm that the current JWT secret is incorrect by observing verification failures with valid tokens.

**Test Plan**: Manually test the authentication flow with valid Supabase tokens against the UNFIXED backend (with current incorrect JWT secret). Observe the verification failures and error messages. This confirms the root cause is JWT secret mismatch.

**Test Cases**:
1. **Valid Token Rejection Test**: Authenticate via frontend Supabase client, obtain valid JWT token, send `GET /api/v1/auth/me` request with token (will fail on unfixed code with "Invalid or expired token")
2. **Token Decode Test**: Use jwt.io or similar tool to decode the token and verify it contains valid claims (sub, email, exp, iss) - confirms token structure is correct
3. **Manual Verification Test**: Attempt to verify the token using the current `SUPABASE_JWT_SECRET` value in a test script - observe signature verification failure
4. **Error Log Analysis**: Check backend logs for JWT verification errors - observe generic error messages without detailed context (confirms need for enhanced logging)

**Expected Counterexamples**:
- Valid Supabase tokens are rejected with "Invalid or expired token" error
- JWT verification throws `JsonWebTokenError: invalid signature` or similar error
- Possible causes: JWT secret mismatch, incorrect secret format, wrong secret source (anon key vs JWT secret)

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds (valid Supabase tokens), the fixed middleware produces the expected behavior (successful verification and authentication).

**Pseudocode:**
```
FOR ALL request WHERE isBugCondition(request) DO
  // After fix: correct JWT secret configured
  result := protect_middleware_fixed(request)
  ASSERT result.user EXISTS
  ASSERT result.user.id = decoded_token.sub
  ASSERT request.user IS_ATTACHED
  ASSERT next() IS_CALLED_WITHOUT_ERROR
END FOR
```

**Test Plan**: After updating the JWT secret to the correct value from Supabase dashboard, test the authentication flow end-to-end.

**Test Cases**:
1. **Valid Token Acceptance Test**: Authenticate via frontend, obtain token, send `GET /api/v1/auth/me` - should return user profile data successfully
2. **User Attachment Test**: Verify that `req.user` is properly attached with correct user data from database
3. **Multiple Endpoints Test**: Test token verification across different protected endpoints (events, posts, dashboard) - all should accept valid tokens
4. **Token Refresh Test**: Test with newly issued tokens and tokens near expiration - all valid tokens should be accepted

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold (invalid/missing tokens), the fixed middleware produces the same result as the original middleware (rejection with appropriate errors).

**Pseudocode:**
```
FOR ALL request WHERE NOT isBugCondition(request) DO
  ASSERT protect_middleware_original(request) = protect_middleware_fixed(request)
  ASSERT both_return_401_unauthorized
  ASSERT both_return_same_error_message
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain (missing tokens, malformed tokens, expired tokens, tampered tokens)
- It catches edge cases that manual unit tests might miss (unusual header formats, special characters, encoding issues)
- It provides strong guarantees that security behavior is unchanged for all invalid inputs

**Test Plan**: Observe rejection behavior on UNFIXED code first for various invalid inputs, then write property-based tests capturing that behavior and verify it remains unchanged after the fix.

**Test Cases**:
1. **Missing Token Preservation**: Send requests without Authorization header - should continue to return 401 "Not authorized to access this route"
2. **Malformed Token Preservation**: Send requests with malformed Authorization header (missing "Bearer", invalid format) - should continue to be rejected
3. **Expired Token Preservation**: Send requests with expired Supabase tokens - should continue to return "Invalid or expired token"
4. **Tampered Token Preservation**: Send requests with valid tokens that have been modified (signature mismatch) - should continue to be rejected

### Unit Tests

- Test token extraction from Authorization header with various formats
- Test JWT verification with correct secret (should succeed)
- Test JWT verification with incorrect secret (should fail)
- Test user lookup in database after successful verification
- Test error handling for missing user in database
- Test error handling for JWT verification failures (expired, invalid signature, malformed)

### Property-Based Tests

- Generate random valid Supabase JWT tokens (using test JWT secret) and verify all are accepted by the middleware
- Generate random invalid tokens (malformed, expired, wrong signature) and verify all are rejected consistently
- Generate random Authorization header formats and verify proper extraction or rejection
- Test that all protected routes consistently apply the auth middleware with same behavior

### Integration Tests

- Test full authentication flow: frontend login → obtain token → call protected endpoint → receive user data
- Test token refresh flow: obtain new token → verify old and new tokens both work (if not expired)
- Test cross-endpoint consistency: verify same token works across all protected routes (events, posts, dashboard, auth/me)
- Test error logging: verify detailed error logs are generated for verification failures (check console output)
- Test configuration validation: verify server fails to start with missing or invalid JWT secret (test startup validation)

### Manual End-to-End Verification

**Step-by-step verification process:**

1. **Verify Current Bug**:
   - Start backend with current (incorrect) JWT secret
   - Login via frontend Supabase auth
   - Attempt to access `/api/v1/auth/me`
   - Observe 401 error with "Invalid or expired token"

2. **Obtain Correct JWT Secret**:
   - Navigate to Supabase Dashboard: https://supabase.com/dashboard/project/xehtvbeoqvuorcpphuvv/settings/api
   - Locate "JWT Settings" section
   - Copy the "JWT Secret" value (base64-encoded string)

3. **Apply Fix**:
   - Update `BACKEND/.env` file with correct `SUPABASE_JWT_SECRET`
   - Add enhanced error logging to `auth.middleware.js`
   - Add configuration validation to `env.config.js`
   - Restart backend server

4. **Verify Fix**:
   - Login via frontend Supabase auth (obtain fresh token)
   - Call `GET /api/v1/auth/me` with token
   - Verify successful response with user profile data
   - Check backend logs for successful verification message

5. **Verify Preservation**:
   - Test without Authorization header → should return 401
   - Test with malformed token → should return 401
   - Test with expired token (if available) → should return 401
   - Verify error logs show detailed error information

6. **Verify Cross-Endpoint**:
   - Test token on other protected endpoints (events, posts, dashboard)
   - Verify all endpoints accept the valid token
   - Verify consistent authentication behavior across all routes
