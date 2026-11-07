import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', getOrderById);

export default router;

