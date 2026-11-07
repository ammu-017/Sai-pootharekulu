import mongoose from 'mongoose';
import Order from '../models/Order.js';
import { memoryStore } from '../services/memoryStore.js';

// Helper to generate unique order ID like #SP1001
const generateOrderId = async () => {
  if (mongoose.connection.readyState === 1) {
    const count = await Order.countDocuments();
    return `#SP${1001 + count}`;
  }
  const orders = await memoryStore.getAllOrders();
  return `#SP${1001 + orders.length}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public or Protected
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      paymentMethod = 'Razorpay UPI',
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Please add items before placing an order.',
      });
    }

    if (!customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, email, and phone number are required.',
      });
    }

    if (
      !deliveryAddress ||
      !deliveryAddress.street ||
      !deliveryAddress.city ||
      !deliveryAddress.state ||
      !deliveryAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Complete delivery address (Street, City, State, Pincode) is required.',
      });
    }

    const itemsPrice = orderItems.reduce(
      (acc, item) => acc + Number(item.price) * Number(item.quantity),
      0
    );
    const deliveryPrice = itemsPrice >= 499 ? 0 : 40;
    const totalPrice = itemsPrice + deliveryPrice;
    const orderId = await generateOrderId();

    const orderData = {
      orderId,
      user: req.user ? req.user._id : null,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone.trim(),
      deliveryAddress: {
        street: deliveryAddress.street.trim(),
        landmark: deliveryAddress.landmark ? deliveryAddress.landmark.trim() : '',
        city: deliveryAddress.city.trim(),
        state: deliveryAddress.state.trim(),
        pincode: deliveryAddress.pincode.trim(),
      },
      orderItems: orderItems.map((item) => ({
        product: item._id || item.product,
        name: item.name,
        category: item.category,
        packSize: item.packSize,
        pieces: item.pieces,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        image: item.image,
      })),
      itemsPrice,
      deliveryPrice,
      totalPrice,
      paymentMethod,
      orderStatus: 'Order Placed',
      isPaid: false,
    };

    if (mongoose.connection.readyState === 1) {
      const order = new Order(orderData);
      const createdOrder = await order.save();
      return res.status(201).json({
        success: true,
        message: 'Order initialized successfully',
        order: createdOrder,
      });
    }

    // Memory Store fallback
    const createdOrder = await memoryStore.createOrder(orderData);
    res.status(201).json({
      success: true,
      message: 'Order initialized successfully',
      order: createdOrder,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
};

// @desc    Get order by ID or orderId (e.g., #SP1001)
// @route   GET /api/orders/:id
// @access  Public / Private
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      let order = id.startsWith('#SP')
        ? await Order.findOne({ orderId: id })
        : await Order.findById(id);

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      return res.json({ success: true, order });
    }

    const order = await memoryStore.findOrderById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details',
      error: error.message,
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, orders });
    }

    const orders = await memoryStore.getMyOrders(req.user._id);
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your orders',
      error: error.message,
    });
  }
};
