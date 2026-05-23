import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL,
  supabase: {
    jwtSecret: process.env.SUPABASE_JWT_SECRET,
    url: process.env.SUPABASE_URL,                   
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }
};