import prisma from '../config/prisma.config.js';
import { verifySupabaseToken } from '../shared/utils/verifySupabaseToken.js';

// Non-blocking optional auth for public routes. Verifies via the SAME shared
// helper protect uses, so the two can't drift. No / bad token => anonymous.
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
      claims = await verifySupabaseToken(token);
    } catch {
      // Bad/expired token on a PUBLIC route → proceed anonymously, don't block.
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
    return next(); // optional auth must never break a public route
  }
};