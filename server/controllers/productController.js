import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { memoryStore } from '../services/memoryStore.js';

// @desc    Fetch all available products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const products = await Product.find({ inStock: true }).sort({ category: 1, pieces: 1 });
      return res.json({
        success: true,
        count: products.length,
        products,
      });
    }

    // Memory Store fallback
    const products = await memoryStore.getProducts();
    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, product });
    }

    const product = await memoryStore.findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product details',
      error: error.message,
    });
  }
};
