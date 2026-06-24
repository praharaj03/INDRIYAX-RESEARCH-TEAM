import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// ── Fail fast: a missing critical secret should kill the process at BOOT,
// not surface as a confusing 500 on the first request that needs it. ──────
const REQUIRED = [
  'DATABASE_URL',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_JWT_SECRET',
];

const missing = REQUIRED.filter((key) => !process.env[key]?.trim());
if (missing.length > 0) {
  // eslint-disable-next-line no-console
  console.error(
    `❌ Missing required environment variable(s): ${missing.join(', ')}\n` +
      `   Set them in your environment / .env before starting the server.`
  );
  process.exit(1);
}

// FRONTEND_URL is required in production (CORS allow-list). In dev we default it.
if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL?.trim()) {
  // eslint-disable-next-line no-console
  console.error('❌ FRONTEND_URL must be set in production (used for CORS).');
  process.exit(1);
}

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL,
  supabase: {
    jwtSecret: process.env.SUPABASE_JWT_SECRET,
    url: process.env.SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
};