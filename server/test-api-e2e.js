import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

async function runApiTests() {
  const PORT = 5099;
  const server = app.listen(PORT, async () => {
    try {
      console.log(`Test server running on port ${PORT}...`);
      const baseUrl = `http://localhost:${PORT}/api`;

      // 1. Test Products API
      console.log('1. Testing GET /api/products...');
      const prodRes = await fetch(`${baseUrl}/products`);
      const prodData = await prodRes.json();
      console.log(`   Products received: ${prodData.products?.length} items`);
      if (!prodData.products || prodData.products.length < 4) {
        throw new Error('Expected 4 products from API');
      }

      // 2. Test Customer Signup/Auth
      console.log('2. Testing POST /api/auth/register...');
      const regRes = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Ananya Sharma',
          email: `ananya_${Date.now()}@example.com`,
          phone: '9848011223',
          password: 'Password@123',
          confirmPassword: 'Password@123',
        }),
      });
      const regData = await regRes.json();
      console.log(`   Registered user: ${regData.user?.name}, Token present: ${Boolean(regData.token)}`);
      const token = regData.token;

      // 3. Test Order Creation
      console.log('3. Testing POST /api/orders...');
      const orderPayload = {
        customerName: 'Ananya Sharma',
        customerEmail: regData.user.email,
        customerPhone: '9848011223',
        deliveryAddress: {
          street: 'Prestige Lakeside Habitat, Tower 12',
          landmark: 'Varthur',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560087',
        },
        orderItems: [
          {
            product: prodData.products[0]._id,
            name: prodData.products[0].name,
            packSize: prodData.products[0].packSize,
            pieces: prodData.products[0].pieces,
            price: prodData.products[0].price,
            quantity: 2,
            subtotal: prodData.products[0].price * 2,
            image: prodData.products[0].image,
          },
          {
            product: prodData.products[3]._id,
            name: prodData.products[3].name,
            packSize: prodData.products[3].packSize,
            pieces: prodData.products[3].pieces,
            price: prodData.products[3].price,
            quantity: 1,
            subtotal: prodData.products[3].price,
            image: prodData.products[3].image,
          },
        ],
        itemsPrice: prodData.products[0].price * 2 + prodData.products[3].price,
        deliveryFee: 0,
        totalPrice: prodData.products[0].price * 2 + prodData.products[3].price,
      };

      const orderRes = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });
      const orderData = await orderRes.json();
      console.log(`   Order created: ${orderData.order?.orderId}, Total: ₹${orderData.order?.totalPrice}`);
      const createdOrderId = orderData.order.orderId;

      // 4. Test Payment Initiation & UPI Details
      console.log('4. Testing POST /api/payment/create-razorpay-order...');
      const payInitRes = await fetch(`${baseUrl}/payment/create-razorpay-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: createdOrderId }),
      });
      const payInitData = await payInitRes.json();
      console.log(`   UPI Merchant VPA: ${payInitData.upiDetails?.merchantVpa}`);
      console.log(`   Standard UPI Link: ${payInitData.upiDetails?.standardUpiUrl}`);

      if (payInitData.upiDetails?.merchantVpa !== '9441321874@ybl') {
        throw new Error('Merchant VPA does not match 9441321874@ybl');
      }

      // 5. Test Payment Verification with UTR
      console.log('5. Testing POST /api/payment/verify-payment with UTR...');
      const verifyRes = await fetch(`${baseUrl}/payment/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: createdOrderId,
          paymentMethod: 'merchant_upi',
          upiRefNumber: '439900123456',
          selectedUpiApp: 'PHONEPE',
        }),
      });
      const verifyData = await verifyRes.json();
      console.log(`   Verification success: ${verifyData.success}`);
      console.log(`   Order status after verification: ${verifyData.order?.orderStatus}`);
      console.log(`   isPaid: ${verifyData.order?.isPaid}`);
      console.log(`   Owner WhatsApp Link: ${verifyData.notification?.directOwnerWhatsAppUrl?.substring(0, 80)}...`);

      if (!verifyData.order?.isPaid || verifyData.order?.orderStatus !== 'Payment Successful') {
        throw new Error('Order was not marked as PAID / Payment Successful');
      }

      // 6. Test Admin Orders & Stats
      console.log('6. Testing Admin Stats & Orders...');
      // Login as Admin
      const adminLoginRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@saipootharekulu.com',
          password: 'admin123',
        }),
      });
      const adminLoginData = await adminLoginRes.json();
      const adminToken = adminLoginData.token;

      const adminOrdersRes = await fetch(`${baseUrl}/admin/orders`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const adminOrdersData = await adminOrdersRes.json();
      const matchedOrder = adminOrdersData.orders?.find((o) => o.orderId === createdOrderId);
      console.log(`   Admin found created order: ${matchedOrder?.orderId}, Status: ${matchedOrder?.orderStatus}, Paid: ${matchedOrder?.isPaid}`);

      if (!matchedOrder || !matchedOrder.isPaid) {
        throw new Error('Admin orders did not reflect paid status');
      }

      console.log('\n✨ ALL E2E HTTP TESTS PASSED COMPLETELY! ✨\n');
      server.close();
      process.exit(0);
    } catch (err) {
      console.error('❌ E2E test failed:', err);
      server.close();
      process.exit(1);
    }
  });
}

runApiTests();

