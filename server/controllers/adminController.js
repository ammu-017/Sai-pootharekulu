import mongoose from 'mongoose';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { memoryStore } from '../services/memoryStore.js';
import {
  sendOwnerWhatsAppNotification,
  formatOwnerOrderMessage,
  generateWhatsAppLink,
} from '../services/whatsappService.js';

// @desc    Get dashboard metrics & statistical summary
// @route   GET /api/admin/stats
// @access  Private / Admin
export const getAdminStats = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const totalOrders = await Order.countDocuments();
      const paidOrders = await Order.find({ isPaid: true });
      const totalSales = paidOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      const pendingOrders = await Order.countDocuments({
        orderStatus: { $in: ['Order Placed', 'Payment Successful', 'Preparing'] },
      });
      const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
      const totalCustomers = await User.countDocuments({ role: 'customer' });
      const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(6);

      return res.json({
        success: true,
        stats: {
          totalSales,
          totalOrders,
          pendingOrders,
          deliveredOrders,
          totalCustomers,
        },
        recentOrders,
      });
    }

    // Memory Store fallback
    const stats = await memoryStore.getAdminStats();
    const orders = await memoryStore.getAllOrders();
    res.json({
      success: true,
      stats,
      recentOrders: orders.slice(0, 6),
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve administrative statistics',
      error: error.message,
    });
  }
};

// @desc    Get all orders with filtering
// @route   GET /api/admin/orders
// @access  Private / Admin
export const getAllOrders = async (req, res) => {
  try {
    const { status, search } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (status && status !== 'All') {
        query.orderStatus = status;
      }
      if (search) {
        query.$or = [
          { orderId: { $regex: search, $options: 'i' } },
          { customerName: { $regex: search, $options: 'i' } },
          { customerPhone: { $regex: search, $options: 'i' } },
        ];
      }
      const orders = await Order.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, orders });
    }

    const orders = await memoryStore.getAllOrders({ status, search });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private / Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, ownerNotes } = req.body;
    const { id } = req.params;

    const validStatuses = [
      'Order Placed',
      'Payment Successful',
      'Preparing',
      'Ready for Delivery',
      'Delivered',
      'Cancelled',
    ];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status value provided.',
      });
    }

    if (mongoose.connection.readyState === 1) {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      order.orderStatus = orderStatus;
      if (ownerNotes !== undefined) order.ownerNotes = ownerNotes;
      await order.save();
      return res.json({
        success: true,
        message: `Order status updated to '${orderStatus}'`,
        order,
      });
    }

    const order = await memoryStore.updateOrderStatus(id, orderStatus, ownerNotes);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    res.json({
      success: true,
      message: `Order status updated to '${orderStatus}'`,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
};

// @desc    Get list of all registered customers
// @route   GET /api/admin/customers
// @access  Private / Admin
export const getAllCustomers = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const customers = await User.find({ role: 'customer' })
        .select('-password')
        .sort({ createdAt: -1 });

      const customersWithOrders = await Promise.all(
        customers.map(async (cust) => {
          const orderCount = await Order.countDocuments({
            $or: [{ user: cust._id }, { customerEmail: cust.email }],
          });
          return { ...cust.toObject(), totalOrders: orderCount };
        })
      );
      return res.json({ success: true, count: customersWithOrders.length, customers: customersWithOrders });
    }

    const customers = await memoryStore.getAllCustomers();
    res.json({ success: true, count: customers.length, customers });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer list',
      error: error.message,
    });
  }
};

// @desc    Manage products (update price or stock status)
// @route   PUT /api/admin/products/:id
// @access  Private / Admin
export const updateProduct = async (req, res) => {
  try {
    const { price, inStock, stockQuantity } = req.body;

    if (mongoose.connection.readyState === 1) {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      if (price !== undefined) product.price = price;
      if (inStock !== undefined) product.inStock = inStock;
      if (stockQuantity !== undefined) product.stockQuantity = stockQuantity;
      await product.save();
      return res.json({ success: true, message: 'Product updated successfully', product });
    }

    const product = await memoryStore.updateProduct(req.params.id, req.body);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({ success: true, message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message,
    });
  }
};

// @desc    Resend WhatsApp notification for an order
// @route   POST /api/admin/orders/:id/resend-whatsapp
// @access  Private / Admin
export const resendOrderWhatsApp = async (req, res) => {
  try {
    const id = req.params.id;
    let order;

    if (mongoose.connection.readyState === 1) {
      order = await Order.findById(id);
    } else {
      order = await memoryStore.findOrderById(id);
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const result = await sendOwnerWhatsAppNotification(order);
    const message = formatOwnerOrderMessage(order);
    const directLink = generateWhatsAppLink('9441321874', message);

    order.whatsappNotificationSent = result.success;
    order.whatsappNotificationLog = JSON.stringify({
      timestamp: new Date().toISOString(),
      method: result.method,
      result: result.message,
    });

    if (mongoose.connection.readyState === 1 && typeof order.save === 'function') {
      await order.save();
    }

    res.json({
      success: true,
      message: 'WhatsApp notification dispatched to owner (9441321874)',
      result,
      directLink,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to dispatch WhatsApp notification',
      error: error.message,
    });
  }
};
