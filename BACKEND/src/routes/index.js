import { Router } from 'express';
import paymentRoutes from '../modules/payments/payment.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';

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

export default router;