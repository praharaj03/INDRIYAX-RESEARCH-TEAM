import app from './app.js';
import { connectDB } from './config/prisma.config.js';
import { config } from './config/env.config.js';

const startServer = async () => {
  try {
    // 1. Connect to the database first
    await connectDB(); 
    
    // 2. Start the Express server
    app.listen(config.port, () => {
      console.log(`🚀 IndriyaX Backend running in ${config.nodeEnv} mode on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();