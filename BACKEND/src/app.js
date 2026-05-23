import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config/env.config.js';

// Imports
import routes from './routes/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { NotFoundException } from './shared/exceptions/index.js';

const app = express();

// Security & Utility Middlewares
app.use(helmet());
app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Master API Route
app.use('/api/v1', routes);

// 404 Handler
app.use((req, res, next) => {
  next(new NotFoundException(`Cannot ${req.method} ${req.originalUrl}`));
});

// Global Error Handler
app.use(errorMiddleware);

export default app;