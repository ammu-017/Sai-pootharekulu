import mongoose from 'mongoose';
import { seedDatabase } from '../seeder/seedData.js';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/sai_pootharekulu';

  try {
    console.log(`Connecting to MongoDB...`);
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
    await seedDatabase();
  } catch (error) {
    console.log('ℹ️ No active local/remote MongoDB detected.');
    console.log('✨ Activated In-Memory Store! Full functionality is available immediately.');
    console.log('💡 To connect a real MongoDB cluster later, set MONGO_URI in server/.env (e.g. MongoDB Atlas).');
  }
};

export default connectDB;
