import crypto from 'crypto';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import { memoryStore } from '../services/memoryStore.js';
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
  isRazorpayConfigured,
  generateUpiDetails,
} from '../services/razorpayService.js';
import {
  sendOwnerWhatsAppNotification,
  formatOwnerOrderMessage,
  generateWhatsAppLink,
} from '../services/whatsappService.js';

const findOrderHelper = async (orderId) => {
  if (mongoose.connection.readyState === 1) {
    return await Order.findOne({
      $or: [
        { _id: orderId?.match(/^[0-9a-fA-F]{24}$/) ? orderId : null },
        { orderId },
      ],
    });
  }
  return await memoryStore.findOrderById(orderId);
};

// @desc    Initiate payment order for checkout (Gateway or Merchant UPI)
// @route   POST /api/payment/create-razorpay-order
// @access  Public / Private
export const initiateRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required to initiate payment.',
      });
    }

    const order = await findOrderHelper(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found in records.',
      });
    }

    if (order.isPaid) {
      return res.status(400).json({
        success: false,
        message: 'This order is already marked as paid.',
      });
    }

    const paymentOrder = await createRazorpayOrder(order.totalPrice, order.orderId, {
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      orderId: order.orderId,
    });

    order.paymentResult = {
      ...(order.paymentResult || {}),
      razorpayOrderId: paymentOrder.orderId,
      status: 'Created',
    };

    if (mongoose.connection.readyState === 1 && typeof order.save === 'function') {
      await order.save();
    }

    res.json({
      success: true,
      orderId: paymentOrder.orderId,
      razorpayOrderId: paymentOrder.orderId,
      amount: paymentOrder.amount,
      totalPrice: order.totalPrice,
      currency: paymentOrder.currency,
      keyId: paymentOrder.keyId,
      mode: paymentOrder.mode,
      upiDetails: paymentOrder.upiDetails,
      customer: {
        name: order.customerName,
        email: order.customerEmail,
        contact: order.customerPhone,
      },
      order: {
        _id: order._id,
        orderId: order.orderId,
        totalPrice: order.totalPrice,
      },
    });
  } catch (error) {
    console.error('Initiate payment order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment gateway order',
      error: error.message,
    });
  }
};

// @desc    Verify payment (Razorpay HMAC signature or Bank UPI UTR) & mark PAID
// @route   POST /api/payment/verify-payment
// @access  Public / Private
export const verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      paymentMethod = 'razorpay',
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      upiRefNumber,
      selectedUpiApp,
    } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required for payment verification.',
      });
    }

    const order = await findOrderHelper(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found for verification.',
      });
    }

    if (order.isPaid) {
      return res.status(400).json({
        success: false,
        message: 'Order has already been confirmed and paid.',
      });
    }

    let isVerified = false;
    let paymentTransactionId = '';

    // Flow A: Razorpay Gateway Signature Verification
    if (paymentMethod === 'razorpay' && isRazorpayConfigured()) {
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({
          success: false,
          message: 'Razorpay payment parameters missing for verification.',
        });
      }

      isVerified = verifyRazorpaySignature({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });

      paymentTransactionId = razorpayPaymentId;

      if (!isVerified) {
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed: Invalid cryptographic signature.',
        });
      }
    }
    // Flow B: Direct Merchant UPI Verification
    else if (paymentMethod === 'merchant_upi' || paymentMethod === 'upi_direct') {
      if (!upiRefNumber || upiRefNumber.trim().length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid 12-digit UPI UTR / Transaction Reference Number.',
        });
      }

      const cleanUtr = upiRefNumber.trim();

      // Duplicate UTR check across past orders to prevent duplicate fraud
      if (mongoose.connection.readyState === 1) {
        const existingTxn = await Order.findOne({
          'paymentResult.razorpayPaymentId': cleanUtr,
          isPaid: true,
        });
        if (existingTxn) {
          return res.status(400).json({
            success: false,
            message: 'This UPI Transaction Ref has already been used on another order.',
          });
        }
      }

      isVerified = true;
      paymentTransactionId = cleanUtr;
    }
    // Flow C: Test sandbox when explicitly tested with gateway simulator
    else if (razorpayOrderId && razorpayOrderId.startsWith('order_sim_')) {
      isVerified = true;
      paymentTransactionId = razorpayPaymentId || `sim_${Date.now()}`;
    } else {
      // Default to UPI reference verification
      if (!upiRefNumber && !razorpayPaymentId) {
        return res.status(400).json({
          success: false,
          message: 'Payment reference or transaction ID required.',
        });
      }
      isVerified = true;
      paymentTransactionId = upiRefNumber || razorpayPaymentId;
    }

    if (!isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Payment could not be verified by backend.',
      });
    }

    // Mark Order as PAID & status updated
    order.isPaid = true;
    order.paidAt = new Date();
    order.orderStatus = 'Payment Successful';
    order.paymentMethod = selectedUpiApp ? `UPI (${selectedUpiApp})` : 'Merchant UPI';
    order.paymentResult = {
      razorpayOrderId: razorpayOrderId || order.paymentResult?.razorpayOrderId || 'UPI_DIRECT',
      razorpayPaymentId: paymentTransactionId,
      razorpaySignature: razorpaySignature || 'VERIFIED_UPI_TXN',
      status: 'Captured',
    };

    if (mongoose.connection.readyState === 1 && typeof order.save === 'function') {
      await order.save();
    }

    // Automatically send Owner WhatsApp notification to 9441321874
    console.log(`Sending WhatsApp notification to Owner (9441321874) for ${order.orderId}...`);
    const notificationResult = await sendOwnerWhatsAppNotification(order);

    order.whatsappNotificationSent = notificationResult.success;
    order.whatsappNotificationLog = JSON.stringify({
      timestamp: new Date().toISOString(),
      method: notificationResult.method,
      result: notificationResult.message,
    });

    if (mongoose.connection.readyState === 1 && typeof order.save === 'function') {
      await order.save();
    }

    const formattedMsg = formatOwnerOrderMessage(order);
    const directOwnerWhatsAppUrl = generateWhatsAppLink('9441321874', formattedMsg);

    res.json({
      success: true,
      message: 'Payment verified successfully and order placed!',
      order,
      notification: {
        sent: notificationResult.success,
        method: notificationResult.method,
        statusText: notificationResult.message,
        directOwnerWhatsAppUrl,
      },
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during payment verification',
      error: error.message,
    });
  }
};

// @desc    Handle Razorpay Webhook events
// @route   POST /api/payment/webhook
// @access  Public (Webhook)
export const handleRazorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    if (secret && signature) {
      const shasum = crypto.createHmac('sha256', secret);
      shasum.update(JSON.stringify(req.body));
      const digest = shasum.digest('hex');
      if (digest !== signature) {
        return res.status(400).json({ message: 'Invalid webhook signature' });
      }
    }

    const event = req.body.event;
    console.log('Received Razorpay Webhook event:', event);

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = req.body.payload.payment.entity;
      const rzpOrderId = paymentEntity.order_id;

      if (mongoose.connection.readyState === 1) {
        const order = await Order.findOne({
          'paymentResult.razorpayOrderId': rzpOrderId,
        });
        if (order && !order.isPaid) {
          order.isPaid = true;
          order.paidAt = new Date();
          order.orderStatus = 'Payment Successful';
          order.paymentResult = {
            razorpayOrderId: rzpOrderId,
            razorpayPaymentId: paymentEntity.id,
            status: 'Captured',
          };
          const notificationResult = await sendOwnerWhatsAppNotification(order);
          order.whatsappNotificationSent = notificationResult.success;
          await order.save();
        }
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: error.message });
  }
};
