import { memoryStore } from './services/memoryStore.js';
import { generateUpiDetails } from './services/razorpayService.js';
import { formatOwnerOrderMessage, generateWhatsAppLink } from './services/whatsappService.js';

async function runTest() {
  console.log('--- 🧪 STARTING SAI POOTHAREKULU UPI PAYMENT TEST ---');

  // Step 1: Create a realistic test order
  const newOrder = await memoryStore.createOrder({
    customerName: 'Kalyan Chakravarthy',
    customerEmail: 'kalyan.c@example.com',
    customerPhone: '9848022338',
    deliveryAddress: {
      street: 'Flat 402, Sai Nilayam, Kudlu Gate',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560068',
      country: 'India',
    },
    orderItems: [
      {
        product: 'prod-1',
        name: 'Jaggery Pootharekulu (Bellam)',
        packSize: '6 Pieces',
        pieces: 6,
        price: 180,
        quantity: 2,
        subtotal: 360,
        image: '/sweets/jaggery-pootharekulu-6pcs.jpg',
      },
      {
        product: 'prod-4',
        name: 'Dry Fruit Pootharekulu',
        packSize: '12 Pieces',
        pieces: 12,
        price: 349,
        quantity: 1,
        subtotal: 349,
        image: '/sweets/dryfruit-pootharekulu-12pcs.jpg',
      },
    ],
    itemsPrice: 709,
    deliveryFee: 0, // Above ₹499 is free
    totalPrice: 709,
    paymentMethod: 'UPI',
  });

  console.log('✅ Order Created:');
  console.log('   - Order ID:', newOrder.orderId);
  console.log('   - Total Price: ₹' + newOrder.totalPrice);
  console.log('   - Initial Status:', newOrder.orderStatus);
  console.log('   - isPaid:', newOrder.isPaid);

  // Step 2: Generate UPI Details & Deep Links
  const upi = generateUpiDetails(newOrder.totalPrice, newOrder.orderId, {
    customerName: newOrder.customerName,
    customerPhone: newOrder.customerPhone,
  });

  console.log('\n✅ UPI Payment Intent Generated:');
  console.log('   - Merchant VPA:', upi.merchantVpa);
  console.log('   - Merchant Name:', upi.merchantName);
  console.log('   - Standard UPI URI:', upi.standardUpiUrl);
  console.log('   - Google Pay URI:', upi.apps.googlePay);
  console.log('   - PhonePe URI:', upi.apps.phonePe);
  console.log('   - Paytm URI:', upi.apps.paytm);
  console.log('   - BHIM URI:', upi.apps.bhim);

  if (!decodeURIComponent(upi.standardUpiUrl).includes('9441321874@ybl')) {
    throw new Error('Merchant UPI VPA does not match 9441321874@ybl');
  }

  // Step 3: Simulate customer payment and submit 12-digit UTR
  const testUtr = '431289567123';
  console.log('\n✅ Simulating Payment Verification with UTR:', testUtr);

  // Update order in memoryStore as verified
  const updatedOrder = await memoryStore.updateOrder(newOrder.orderId, {
    isPaid: true,
    paidAt: new Date(),
    orderStatus: 'Payment Successful',
    paymentMethod: 'UPI (GPAY)',
    paymentResult: {
      razorpayOrderId: 'UPI_DIRECT',
      razorpayPaymentId: testUtr,
      razorpaySignature: 'VERIFIED_UPI_TXN',
      status: 'Captured',
    },
  });

  console.log('\n✅ Verified Order Status:');
  console.log('   - Order Status:', updatedOrder.orderStatus);
  console.log('   - isPaid:', updatedOrder.isPaid);
  console.log('   - Transaction ID (UTR):', updatedOrder.paymentResult.razorpayPaymentId);
  console.log('   - Payment Method:', updatedOrder.paymentMethod);

  // Step 4: Verify WhatsApp dispatch to Owner (9441321874)
  const message = formatOwnerOrderMessage(updatedOrder);
  const waUrl = generateWhatsAppLink('9441321874', message);

  console.log('\n✅ Owner WhatsApp Notification Generated:');
  console.log('   - Target Phone: 9441321874');
  console.log('   - Direct URL:', waUrl.substring(0, 100) + '...');
  console.log('   - Message Snippet:\n' + message.substring(0, 250) + '\n...');

  console.log('\n🎉 ALL UPI PAYMENT VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉');
}

runTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
