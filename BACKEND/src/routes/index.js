import { Router } from 'express';

const router = Router();

// Health Check Route (Great for Railway/Render to check if your app is alive)
router.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'IndriyaX API is running perfectly! 🚀' 
  });
});

// We will import and mount our specific module routes here later
// Example:
// import paymentRoutes from '../modules/payments/payment.routes.js';
// router.use('/payments', paymentRoutes);

export default router;