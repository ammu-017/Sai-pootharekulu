import Razorpay from 'razorpay';
import crypto from 'crypto';

const getKeyId = () => process.env.RAZORPAY_KEY_ID || '';
const getKeySecret = () => process.env.RAZORPAY_KEY_SECRET || '';

export const isRazorpayConfigured = () => {
  const keyId = getKeyId();
  const keySecret = getKeySecret();
  return (
    Boolean(keyId) &&
    Boolean(keySecret) &&
    !keyId.includes('YourKeyIdHere') &&
    !keySecret.includes('YourKeySecretHere') &&
    keyId.startsWith('rzp_')
  );
};

export const getRazorpayInstance = () => {
  if (!isRazorpayConfigured()) {
    return null;
  }
  return new Razorpay({
    key_id: getKeyId(),
    key_secret: getKeySecret(),
  });
};

/**
 * Generate standard UPI payload & deep-links for configured Sai Pootharekulu merchant account
 */
export const generateUpiDetails = (amountInInr, orderId) => {
  const merchantVpa = process.env.MERCHANT_UPI_ID || '9441321874@ybl';
  const merchantName = process.env.MERCHANT_NAME || 'Sai Pootharekulu';
  const note = `Order ${orderId} - Sai Pootharekulu Sweets`;

  // Standard NPCI UPI URI specifications
  const baseUpiParams = new URLSearchParams({
    pa: merchantVpa,
    pn: merchantName,
    am: amountInInr.toFixed(2),
    cu: 'INR',
    tr: orderId,
    tn: note,
  }).toString();

  const standardUpiUrl = `upi://pay?${baseUpiParams}`;

  return {
    merchantVpa,
    merchantName,
    amount: amountInInr,
    standardUpiUrl,
    apps: {
      googlePay: `gpay://upi/pay?${baseUpiParams}`,
      phonePe: `phonepe://pay?${baseUpiParams}`,
      paytm: `paytmmp://pay?${baseUpiParams}`,
      bhim: `upi://pay?${baseUpiParams}`,
    },
  };
};

/**
 * Create a new payment order
 * Supports both Gateway (Razorpay) and Direct Merchant UPI
 */
export const createRazorpayOrder = async (amountInInr, receipt, notes = {}) => {
  const amountInPaise = Math.round(amountInInr * 100);
  const upiDetails = generateUpiDetails(amountInInr, receipt);

  if (isRazorpayConfigured()) {
    try {
      const razorpay = getRazorpayInstance();
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: receipt.toString(),
        notes: {
          ...notes,
          merchantUpi: upiDetails.merchantVpa,
        },
      };
      const order = await razorpay.orders.create(options);
      return {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        mode: 'razorpay_gateway',
        keyId: getKeyId(),
        upiDetails,
      };
    } catch (err) {
      console.warn('Razorpay order creation fallback to direct UPI:', err.message);
    }
  }

  // Seamless Direct Merchant UPI flow
  const orderId = `UPI_${receipt}_${Date.now()}`;
  return {
    success: true,
    orderId,
    amount: amountInPaise,
    currency: 'INR',
    mode: 'merchant_upi',
    keyId: getKeyId() || '',
    upiDetails,
  };
};

/**
 * Verify Razorpay payment signature
 */
export const verifyRazorpaySignature = ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  if (!razorpayOrderId || !razorpayPaymentId) {
    return false;
  }

  const keySecret = getKeySecret();
  if (isRazorpayConfigured() && keySecret && razorpaySignature) {
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === razorpaySignature;
  }

  return false;
};
