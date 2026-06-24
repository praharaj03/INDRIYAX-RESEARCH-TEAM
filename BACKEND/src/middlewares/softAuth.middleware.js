import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.config.js';
import { config } from '../config/env.config.js';

// Mirrors the verification in protect, but NEVER blocks. Used on public routes
// (like GET /events) that show extra data to logged-in admins but must still
// work for anonymous visitors. No token / bad token => req.user stays undefined.
const JWT_SECRET = config.supabase.jwtSecret;
const JWT_ISSUER = `${String(config.supabase.url).replace(/\/$/, '')}/auth/v1`;
const JWT_AUDIENCE = 'authenticated';
const VERIFY_OPTIONS = {
  algorithms: ['HS256'], // keep in sync with protect (swap to JWKS if asymmetric)
  issuer: JWT_ISSUER,
  audience: JWT_AUDIENCE,
};

const USER_PROFILE_SELECT = {
  id: true,
  email: true,
  fullName: true,
  imageUrl: true,
  role: true,
  createdAt: true,
};

export const softAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) return next();

    const token = authHeader.slice(7).trim();
    if (!token) return next();

    let claims;
    try {
      claims = jwt.verify(token, JWT_SECRET, VERIFY_OPTIONS);
    } catch {
      // Bad/expired token on a PUBLIC route → just proceed anonymously.
      return next();
    }

    if (claims?.sub) {
      const user = await prisma.user.findUnique({
        where: { id: claims.sub },
        select: USER_PROFILE_SELECT,
      });
      if (user) req.user = user;
    }
    return next();
  } catch {
    // Never let optional auth break a public route.
    return next();
  }
};