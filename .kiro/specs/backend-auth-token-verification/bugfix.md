# Bugfix Requirements Document

## Introduction

The backend authentication middleware is rejecting all valid JWT tokens issued by Supabase with "Invalid or expired token" errors. This prevents authenticated users from accessing protected API endpoints, specifically the `/api/v1/auth/me` endpoint, causing the frontend dashboard to fail when loading user profile data. The root cause is that the `SUPABASE_JWT_SECRET` environment variable is configured with an incorrect value (a UUID/project ID instead of the actual JWT secret), causing token verification to fail for all requests.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a valid Supabase JWT token is sent to the backend in the Authorization header THEN the system rejects the token with "Invalid or expired token" error

1.2 WHEN the auth middleware attempts to verify the token using `jwt.verify(token, config.supabase.jwtSecret)` THEN the verification fails due to incorrect JWT secret

1.3 WHEN the `/api/v1/auth/me` endpoint is called with a valid token THEN the system returns an authentication error instead of user profile data

1.4 WHEN the frontend dashboard attempts to load user information THEN the system fails to retrieve user data due to token verification failure

### Expected Behavior (Correct)

2.1 WHEN a valid Supabase JWT token is sent to the backend in the Authorization header THEN the system SHALL successfully verify the token using the correct Supabase JWT secret

2.2 WHEN the auth middleware attempts to verify the token using `jwt.verify(token, config.supabase.jwtSecret)` THEN the verification SHALL succeed for valid tokens issued by Supabase

2.3 WHEN the `/api/v1/auth/me` endpoint is called with a valid token THEN the system SHALL return the authenticated user's profile data

2.4 WHEN the frontend dashboard attempts to load user information THEN the system SHALL successfully retrieve and display user data

2.5 WHEN token verification fails due to an invalid or expired token THEN the system SHALL provide clear error logging indicating the verification failure reason

### Unchanged Behavior (Regression Prevention)

3.1 WHEN an invalid or malformed token is sent to the backend THEN the system SHALL CONTINUE TO reject the token with appropriate error messages

3.2 WHEN no Authorization header is provided THEN the system SHALL CONTINUE TO reject the request as unauthorized

3.3 WHEN an expired token is sent to the backend THEN the system SHALL CONTINUE TO reject the token with "Invalid or expired token" error

3.4 WHEN the frontend successfully authenticates users via Supabase THEN the system SHALL CONTINUE TO obtain valid JWT access tokens from Supabase

3.5 WHEN the frontend sends tokens in the Authorization header format `Bearer <token>` THEN the system SHALL CONTINUE TO extract and process the token correctly

3.6 WHEN the backend server starts THEN the system SHALL CONTINUE TO load environment configuration from the `.env` file

3.7 WHEN other API endpoints use the auth middleware THEN the system SHALL CONTINUE TO apply token verification consistently across all protected routes
