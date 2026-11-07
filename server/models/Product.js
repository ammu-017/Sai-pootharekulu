import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Jaggery Pootharekulu', 'Dry Fruit Pootharekulu'],
    },
    description: {
      type: String,
      required: true,
    },
    packSize: {
      type: String,
      required: true,
      enum: ['6 Pieces', '12 Pieces'],
    },
    pieces: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      default: '',
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 100,
    },
    ingredients: [
      {
        type: String,
      },
    ],
    highlight: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;

