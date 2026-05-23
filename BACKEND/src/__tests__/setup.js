import { config } from '../config/env.config.js';

// Test setup - runs before all tests
console.log('[Test Setup] Environment:', config.nodeEnv);
console.log('[Test Setup] Database URL configured:', !!config.databaseUrl);
console.log('[Test Setup] Supabase JWT Secret configured:', !!config.supabase.jwtSecret);
