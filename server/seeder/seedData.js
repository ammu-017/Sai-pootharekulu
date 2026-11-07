import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

export const seedProducts = [
  {
    name: 'Jaggery Pootharekulu (Bellam)',
    category: 'Jaggery Pootharekulu',
    description:
      'Traditional Andhra Pootharekulu prepared with authentic organic jaggery (bellam), aromatic cardamom, and pure fragrant ghee wrapped in gossamer-thin rice paper. Six individual rolls served fresh.',
    packSize: '6 Pieces',
    pieces: 6,
    price: 180,
    originalPrice: 180,
    image: '/sweets/jaggery-pootharekulu-6pcs.jpg',
    badge: 'Pure Ghee & Bellam',
    inStock: true,
    stockQuantity: 120,
    ingredients: [
      'Pure Desi Ghee',
      'Organic Andhra Bellam (Jaggery)',
      'Traditional Rice Starch Film (Rekulu)',
      'Aromatic Cardamom (Elachi)',
    ],
    highlight: 'Box of 6 Pcs - ₹180/- Only!',
  },
  {
    name: 'Jaggery Pootharekulu (Bellam)',
    category: 'Jaggery Pootharekulu',
    description:
      'Authentic traditional Andhra Pootharekulu with organic jaggery and generous pure ghee. Twelve neatly arranged rolls in a premium festive value box.',
    packSize: '12 Pieces',
    pieces: 12,
    price: 349,
    originalPrice: 349,
    image: '/sweets/jaggery-pootharekulu-12pcs.jpg',
    badge: 'Family Value Pack',
    inStock: true,
    stockQuantity: 80,
    ingredients: [
      'Pure Desi Ghee',
      'Organic Andhra Bellam (Jaggery)',
      'Traditional Rice Starch Film (Rekulu)',
      'Aromatic Cardamom (Elachi)',
    ],
    highlight: 'Box of 12 Pcs - ₹349/- Only!',
  },
  {
    name: 'Dry Fruit Pootharekulu',
    category: 'Dry Fruit Pootharekulu',
    description:
      'Delicious traditional Pootharekulu generously filled with premium assorted roasted dry fruits (pistachios, cashews, almonds) and pure ghee. Six exquisite artisanal rolls.',
    packSize: '6 Pieces',
    pieces: 6,
    price: 180,
    originalPrice: 180,
    image: '/sweets/dryfruit-pootharekulu-6pcs.jpg',
    badge: 'Loaded Dry Fruits',
    inStock: true,
    stockQuantity: 150,
    ingredients: [
      'Crunchy Cashew Nuts (Kaju)',
      'Premium Almonds (Badam)',
      'Pistachios (Pista)',
      'Pure Desi Ghee',
      'Traditional Rice Starch Film',
    ],
    highlight: 'Box of 6 Pcs - ₹180/- Only!',
  },
  {
    name: 'Dry Fruit Pootharekulu',
    category: 'Dry Fruit Pootharekulu',
    description:
      'Royal grand celebration pack featuring twelve beautifully arranged Pootharekulu rolls loaded with assorted crunchy dry fruits and pure desi cow ghee.',
    packSize: '12 Pieces',
    pieces: 12,
    price: 349,
    originalPrice: 349,
    image: '/sweets/dryfruit-pootharekulu-12pcs.jpg',
    badge: 'Royal Grand Pack',
    inStock: true,
    stockQuantity: 95,
    ingredients: [
      'Crunchy Cashew Nuts (Kaju)',
      'Premium Almonds (Badam)',
      'Pistachios (Pista)',
      'Pure Desi Ghee',
      'Traditional Rice Starch Film',
    ],
    highlight: 'Box of 12 Pcs - ₹349/- Only!',
  },
];

export const seedDatabase = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Seeding initial products for Sai Pootharekulu...');
      await Product.deleteMany({});
      await Product.insertMany(seedProducts);
      console.log('4 Sai Pootharekulu product variants seeded successfully!');
    } else {
      console.log(`Database already has ${productCount} products.`);
    }

    const adminExists = await User.findOne({ email: 'admin@saipootharekulu.com' });
    if (!adminExists) {
      console.log('Creating default Admin user (admin@saipootharekulu.com)...');
      await User.create({
        name: 'Sai Pootharekulu Admin',
        email: 'admin@saipootharekulu.com',
        phone: '9441321874',
        password: 'admin123',
        role: 'admin',
        deliveryAddress: {
          street: 'Chandhana Residency, Kudlu Gate, Room No. 7',
          landmark: 'Kudlu Gate Bus Stop',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560068',
        },
      });
      console.log('Admin user created successfully (admin@saipootharekulu.com / admin123)');
    }
  } catch (error) {
    console.error('Database seeding error:', error);
  }
};

if (process.argv[1]?.endsWith('seedData.js')) {
  mongoose
    .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sai_pootharekulu')
    .then(async () => {
      console.log('Connected to MongoDB for direct seeding...');
      await seedDatabase();
      process.exit(0);
    })
    .catch((err) => {
      console.error('Direct seed connection error:', err);
      process.exit(1);
    });
}
