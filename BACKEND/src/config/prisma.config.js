import { PrismaClient } from '@prisma/client';
import { config } from './env.config.js';
import supabaseDb from './supabase-db.js';

let prisma;
let usingSupabaseFallback = false;

try {
  if (config.nodeEnv === 'production') {
    prisma = new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient({
        log: ['warn', 'error'],
      });
    }
    prisma = global.prisma;
  }
} catch (err) {
  console.warn('⚠️  PrismaClient initialization failed, using Supabase REST fallback');
  prisma = supabaseDb;
  usingSupabaseFallback = true;
}

export const connectDB = async () => {
  // First try Prisma direct connection
  if (!usingSupabaseFallback) {
    try {
      await prisma.$connect();
      console.log('✅ PostgreSQL Database connected via Prisma');
      return;
    } catch (error) {
      console.warn('⚠️  Prisma direct connection failed:', error.message);
      console.log('   Falling back to Supabase REST API...');
    }
  }

  // Fallback: use Supabase REST client
  try {
    await supabaseDb.$connect();
    prisma = supabaseDb;
    usingSupabaseFallback = true;
    // Update the global reference
    if (config.nodeEnv !== 'production') {
      global.prisma = supabaseDb;
    }
  } catch (error) {
    throw new Error(`All database connections failed: ${error.message}`);
  }
};

export default prisma;

// Export a getter so modules always get the current client
export function getDb() {
  return usingSupabaseFallback ? supabaseDb : prisma;
}
