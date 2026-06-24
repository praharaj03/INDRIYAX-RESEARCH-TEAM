import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.config.js';

// Imports
import routes from './routes/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { NotFoundException } from './shared/exceptions/index.js';

const app = express();

// ── Behind a reverse proxy (Railway/Render) ──────────────────────────────
// Required for correct client IPs and for rate limiting to work per-user.
// Set to the NUMBER of proxies in front of the app:
//   1 = Railway/Render alone.  2 = if Cloudflare (or another LB) sits in front.
// Do NOT use `true` (trust all) — it lets clients spoof X-Forwarded-For.
app.set('trust proxy', 1);
app.disable('x-powered-by'); // (helmet also does this; explicit for clarity)

// ── Security headers ─────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────────────────────────────────────
// Supports a single origin OR a comma-separated allow-list in config.frontendUrl,
// e.g. "https://indriyax.com,http://localhost:3000". A single URL works unchanged.
const allowedOrigins = String(config.frontendUrl || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // No Origin header = non-browser client (curl, server-to-server, health checks).
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Disallowed: don't set CORS headers (browser blocks) but DON'T 500.
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    maxAge: 600, // cache preflight 10 min → far fewer OPTIONS round-trips
  })
);

// ── Global rate limiter (in-memory, no Redis) ────────────────────────────
// Runs AFTER cors so even 429 responses carry CORS headers and stay readable.
// Coarse safety net against scripted abuse / runaway client loops.
// Short window = shared/NAT IPs recover within a minute instead of being locked out.
// Tune freely; stricter per-route limiters (e.g. payment submission) come with
// those modules.
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 300, // requests per IP per window
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: (req) => req.path === '/api/v1/health', // never throttle monitoring
  handler: (req, res) => {
    // Same envelope as everything else → frontend handles it like any error.
    res.status(429).json({
      success: false,
      status: 'fail',
      message: 'Too many requests. Please slow down and try again shortly.',
    });
  },
});
app.use(apiLimiter);

// ── Body parsing ─────────────────────────────────────────────────────────
// JSON dropped from 10mb → 1mb. Image uploads use multipart (multer), so this
// does NOT affect uploads. 1mb fits even very long blog posts (~1M chars).
// Bump ONLY if your blog editor can embed base64 images inline in `content`.
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Master API Route
app.use('/api/v1', routes);

// 404 Handler
app.use((req, res, next) => {
  next(new NotFoundException(`Cannot ${req.method} ${req.originalUrl}`));
});

// Global Error Handler
app.use(errorMiddleware);

export default app;