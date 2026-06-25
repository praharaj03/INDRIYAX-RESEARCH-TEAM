import crypto from 'node:crypto';
import prisma from '../config/prisma.config.js';
import { verifySupabaseToken } from '../shared/utils/verifySupabaseToken.js';
import {
  UnauthorizedException,
  ForbiddenException,
} from '../shared/exceptions/index.js';

const USER_PROFILE_SELECT = {
  id: true,
  email: true,
  fullName: true,
  imageUrl: true,
  role: true,
  createdAt: true,
};

const timingSafeMatch = (a, b) => {
  if (!a || !b) return false;
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
};

let cachedAdminUser = null;
const getOrCreateAdminUser = async () => {
  if (cachedAdminUser) return cachedAdminUser;
  cachedAdminUser = await prisma.user.upsert({
    where: { id: 'admin-system-user-indriyax' },
    update: { role: 'ADMIN' },
    create: {
      id: 'admin-system-user-indriyax',
      email: 'admin@indriyax.com',
      fullName: 'IndriyaX Admin',
      role: 'ADMIN',
    },
    select: USER_PROFILE_SELECT,
  });
  return cachedAdminUser;
};

const resolveDbUser = async (claims) => {
  const userId = claims.sub;
  const email = claims.email ?? null;

  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: USER_PROFILE_SELECT,
  });

  if (existing) {
    if (email && existing.email !== email) {
      return prisma.user.update({
        where: { id: userId },
        data: { email },
        select: USER_PROFILE_SELECT,
      });
    }
    return existing;
  }

  const metadata = claims.user_metadata ?? {};
  return prisma.user.upsert({
    where: { id: userId },
    update: { email: email ?? undefined },
    create: {
      id: userId,
      email,
      fullName: metadata.full_name ?? null,
      imageUrl: metadata.avatar_url ?? null,
      role: 'USER',
    },
    select: USER_PROFILE_SELECT,
  });
};

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return next(new UnauthorizedException('No authentication token provided.'));
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      return next(new UnauthorizedException('No authentication token provided.'));
    }

    // ── Admin API key shortcut ──────────────────────────────────────────
    const adminApiKey = process.env.ADMIN_API_KEY;
    if (adminApiKey && timingSafeMatch(token, adminApiKey)) {
      req.user = await getOrCreateAdminUser();
      return next();
    }

    // ── Supabase JWT — verified locally via the shared helper ───────────
    let claims;
    try {
      claims = await verifySupabaseToken(token);
    } catch {
      return next(
        new UnauthorizedException('Invalid or expired session. Please log in again.')
      );
    }

    if (!claims.sub) {
      return next(new UnauthorizedException('Invalid authentication token.'));
    }

    req.user = await resolveDbUser(claims);
    return next();
  } catch (err) {
    return next(err); // infra failure (DB) → 500/503, not a misleading 401
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedException('Authentication required.'));
    }
    if (roles.length && !roles.includes(req.user.role)) {
      return next(
        new ForbiddenException('You do not have permission to perform this action.')
      );
    }
    return next();
  };
};