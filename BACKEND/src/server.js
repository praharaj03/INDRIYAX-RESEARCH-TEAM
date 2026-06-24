import app from './app.js';
import prisma, { connectDB } from './config/prisma.config.js';
import { config } from './config/env.config.js';

let server;

const startServer = async () => {
  try {
    // 1. Connect to the database first
    await connectDB();

    // 2. Start the Express server (capture the instance for graceful shutdown)
    server = app.listen(config.port, () => {
      console.log(
        `🚀 IndriyaX Backend running in ${config.nodeEnv} mode on port ${config.port}`
      );
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// ── Graceful shutdown ──────────────────────────────────────────────────────
// Stop accepting new connections, let in-flight requests finish, release the
// DB pool, then exit. Force-exit if something hangs past the grace window.
const shutdown = async (signal, exitCode = 0) => {
  console.log(`\n${signal} received — shutting down gracefully...`);

  // Hard cap so a stuck connection can't block a deploy forever.
  const forceTimer = setTimeout(() => {
    console.error('Graceful shutdown timed out — forcing exit.');
    process.exit(1);
  }, 10_000);
  forceTimer.unref();

  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await prisma.$disconnect();
    clearTimeout(forceTimer);
    process.exit(exitCode);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection:', reason);
  shutdown('unhandledRejection', 1);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  shutdown('uncaughtException', 1);
});

startServer();