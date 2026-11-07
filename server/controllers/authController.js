import mongoose from 'mongoose';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { memoryStore } from '../services/memoryStore.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'sai_pootharekulu_default_secret_key',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new customer
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields.',
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long.',
      });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    const phoneClean = phone.replace(/[^0-9]/g, '');
    if (phoneClean.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit Indian mobile number.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and Confirm Password do not match.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if Mongoose is connected
    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({
        $or: [{ email: normalizedEmail }, { phone: phoneClean }],
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message:
            existingUser.email === normalizedEmail
              ? 'An account with this email address already exists. Please log in.'
              : 'An account with this phone number already exists.',
        });
      }

      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        phone: phoneClean,
        password,
        role: 'customer',
      });

      const token = generateToken(user._id);
      return res.status(201).json({
        success: true,
        message: 'Account created successfully! Welcome to Sai Pootharekulu.',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          deliveryAddress: user.deliveryAddress,
          token,
        },
      });
    }

    // Memory Store fallback
    const existing = await memoryStore.findUserByEmail(normalizedEmail);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    const newUser = await memoryStore.createUser({
      name: name.trim(),
      email: normalizedEmail,
      phone: phoneClean,
      password,
      role: 'customer',
    });

    const token = generateToken(newUser._id);
    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Sai Pootharekulu.',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        deliveryAddress: newUser.deliveryAddress,
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: normalizedEmail }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password. Please check your credentials.',
        });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password. Please check your credentials.',
        });
      }

      const token = generateToken(user._id);
      return res.json({
        success: true,
        message: 'Login successful! Welcome back to Sai Pootharekulu.',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          deliveryAddress: user.deliveryAddress,
          token,
        },
      });
    }

    // Memory Store fallback
    const user = await memoryStore.findUserByEmail(normalizedEmail);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
      });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      message: 'Login successful! Welcome back to Sai Pootharekulu.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        deliveryAddress: user.deliveryAddress,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id);
      if (user) {
        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            deliveryAddress: user.deliveryAddress,
          },
        });
      }
    } else {
      const user = await memoryStore.findUserById(req.user._id);
      if (user) {
        const { password, ...rest } = user;
        return res.json({ success: true, user: rest });
      }
    }
    res.status(404).json({ success: false, message: 'User not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile & delivery address
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      if (req.body.deliveryAddress) {
        user.deliveryAddress = {
          street: req.body.deliveryAddress.street ?? user.deliveryAddress.street,
          landmark: req.body.deliveryAddress.landmark ?? user.deliveryAddress.landmark,
          city: req.body.deliveryAddress.city ?? user.deliveryAddress.city,
          state: req.body.deliveryAddress.state ?? user.deliveryAddress.state,
          pincode: req.body.deliveryAddress.pincode ?? user.deliveryAddress.pincode,
        };
      }
      const updatedUser = await user.save();
      return res.json({
        success: true,
        message: 'Profile updated successfully.',
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role,
          deliveryAddress: updatedUser.deliveryAddress,
          token: generateToken(updatedUser._id),
        },
      });
    }

    const updatedUser = await memoryStore.updateUser(req.user._id, req.body);
    if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });

    const { password, ...rest } = updatedUser;
    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: { ...rest, token: generateToken(updatedUser._id) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot / Reset password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your registered email address.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'No account registered with this email address.',
        });
      }

      if (newPassword) {
        if (newPassword.length < 6) {
          return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters.',
          });
        }
        if (newPassword !== confirmPassword) {
          return res.status(400).json({
            success: false,
            message: 'Passwords do not match.',
          });
        }

        user.password = newPassword;
        await user.save();
        return res.json({
          success: true,
          message: 'Password updated successfully! Please log in with your new password.',
        });
      }

      return res.json({
        success: true,
        message: 'Account verified. You can now set your new password.',
        verified: true,
        email: user.email,
      });
    }

    // Memory Store fallback
    const user = await memoryStore.findUserByEmail(normalizedEmail);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account registered with this email address.',
      });
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters.',
        });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Passwords do not match.',
        });
      }

      await memoryStore.updateUser(user._id, { password: newPassword });
      return res.json({
        success: true,
        message: 'Password updated successfully! Please log in with your new password.',
      });
    }

    res.json({
      success: true,
      message: 'Account verified. You can now set your new password.',
      verified: true,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
