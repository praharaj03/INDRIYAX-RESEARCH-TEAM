// Authentication is handled by Supabase Auth
// See: services/authService.ts for the client-side implementation
// See: BACKEND/src/middlewares/auth.middleware.js for server-side token verification

export const authConfig = {
  signInUrl: "/login",
  signUpUrl: "/signup",
  afterSignInUrl: "/dashboard",
  afterSignUpUrl: "/dashboard",
};
