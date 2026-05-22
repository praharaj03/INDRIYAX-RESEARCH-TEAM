import { Router } from 'express';

import paymentRoutes from '../modules/payments/payment.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';
import eventRoutes from '../modules/events/event.routes.js';
import postRoutes from '../modules/posts/post.routes.js';
import uploadRoutes from '../modules/uploads/upload.routes.js';
import commentRoutes from '../modules/comments/comment.routes.js';

const router = Router();

// Health Check Route (Great for Railway/Render to check if your app is alive)
router.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'IndriyaX API is running perfectly! 🚀' 
  });
});

router.use('/auth', authRoutes);
router.use('/payments', paymentRoutes);
router.use('/events', eventRoutes);
router.use('/posts', postRoutes);
router.use('/uploads', uploadRoutes);
router.use('/comments', commentRoutes);

export default router;