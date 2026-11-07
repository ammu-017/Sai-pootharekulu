import express from 'express';
import {
  getAdminStats,
  getAllOrders,
  updateOrderStatus,
  getAllCustomers,
  updateProduct,
  resendOrderWhatsApp,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.post('/orders/:id/resend-whatsapp', resendOrderWhatsApp);
router.get('/customers', getAllCustomers);
router.put('/products/:id', updateProduct);

export default router;

