import app from './app.js';
import { connectDB } from './config/prisma.config.js';
import { config } from './config/env.config.js';

const startServer = async () => {
  try {
    // 1. Attempt to connect to the database
    await connectDB(); 
    console.log('✅ Database connected');
  } catch (error) {
    console.error('⚠️  Database connection failed (server starting anyway):', error.message);
    console.error('   Routes that require DB will fail until connection is restored.');
  }

  // 2. Start the Express server regardless
  app.listen(config.port, () => {
    console.log(`🚀 IndriyaX Backend running in ${config.nodeEnv} mode on port ${config.port}`);
  });
};

startServer();
