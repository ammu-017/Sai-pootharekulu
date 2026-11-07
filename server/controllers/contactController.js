import mongoose from 'mongoose';
import ContactMessage from '../models/ContactMessage.js';
import { memoryStore } from '../services/memoryStore.js';

// @desc    Submit a contact inquiry
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, phone number, and message.',
      });
    }

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject || 'General Customer Inquiry',
      message: message.trim(),
    };

    let contact;
    if (mongoose.connection.readyState === 1) {
      contact = await ContactMessage.create(payload);
    } else {
      contact = await memoryStore.createContact(payload);
    }

    res.status(201).json({
      success: true,
      message:
        'Thank you for reaching out to Sai Pootharekulu! We have received your inquiry and will contact you promptly.',
      contact,
    });
  } catch (error) {
    console.error('Contact inquiry submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit your message. Please try again or call us directly at 9441321874.',
      error: error.message,
    });
  }
};
