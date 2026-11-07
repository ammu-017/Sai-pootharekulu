import express from 'express';
import {
  initiateRazorpayOrder,
  verifyPayment,
  handleRazorpayWebhook,
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-razorpay-order', initiateRazorpayOrder);
router.post('/verify-payment', verifyPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), handleRazorpayWebhook);

export default router;

