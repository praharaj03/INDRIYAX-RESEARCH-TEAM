import jwt from 'jsonwebtoken';
import { config } from '../config/env.config.js';
import { UnauthorizedException } from '../shared/exceptions/index.js';
import prisma from '../config/prisma.config.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new UnauthorizedException('Not authorized to access this route. Please log in.'));
    }

    // 2. Verify token using Supabase JWT Secret
    const decoded = jwt.verify(token, config.supabase.jwtSecret);

    // 3. Check if user still exists in our database
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.sub }, // Supabase stores the user ID in the 'sub' claim
    });

    if (!currentUser) {
      return next(new UnauthorizedException('The user belonging to this token no longer exists.'));
    }

    // 4. Attach user to request object for downstream controllers
    req.user = currentUser;
    next();
  } catch (error) {
    return next(new UnauthorizedException('Invalid or expired token.'));
  }
};

// Middleware to restrict access to specific roles (e.g., ADMIN)
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new UnauthorizedException('You do not have permission to perform this action.'));
    }
    next();
  };
};