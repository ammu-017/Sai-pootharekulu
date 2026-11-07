import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  MapPin,
  User,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { GoldCorner, SectionDivider, LotusMotif } from '../components/TraditionalMotif';
import UpiPaymentModal from '../components/UpiPaymentModal';
import api from '../services/api';

const CheckoutPage = () => {
  const { cartItems, subtotal, deliveryCharges, grandTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Customer Form state
  const [customer, setCustomer] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.deliveryAddress?.street || '',
    landmark: user?.deliveryAddress?.landmark || '',
    city: user?.deliveryAddress?.city || 'Bengaluru',
    state: user?.deliveryAddress?.state || 'Karnataka',
    pincode: user?.deliveryAddress?.pincode || '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activePaymentOrder, setActivePaymentOrder] = useState(null);
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setCustomer((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        street: prev.street || user.deliveryAddress?.street || '',
        landmark: prev.landmark || user.deliveryAddress?.landmark || '',
        city: prev.city || user.deliveryAddress?.city || 'Bengaluru',
        state: prev.state || user.deliveryAddress?.state || 'Karnataka',
        pincode: prev.pincode || user.deliveryAddress?.pincode || '',
      }));
    }
  }, [user]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-[#041f14]">
        <div className="w-20 h-20 rounded-full bg-emerald-950 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-4">
          <Truck className="w-10 h-10 opacity-70" />
        </div>
        <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-ivory mb-2">
          Your Cart is Empty
        </h2>
        <p className="text-base text-cream/80 max-w-sm mb-6">
          Please add our delicious traditional Andhra Pootharekulu to your cart before proceeding to checkout.
        </p>
        <Link
          to="/menu"
          className="px-8 py-3.5 rounded-full bg-gold-gradient-bg text-[#041f14] font-cinzel text-base font-bold shadow-gold hover:scale-105 transition-all"
        >
          Explore Sweet Menu
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage('');
  };

  const validateForm = () => {
    if (!customer.name.trim()) return 'Please enter customer full name.';
    if (!customer.email.trim()) return 'Please enter a valid email address.';
    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 10) return 'Please enter a valid 10-digit mobile number.';
    if (!customer.street.trim()) return 'Please enter street / house address.';
    if (!customer.city.trim()) return 'Please enter city.';
    if (!customer.state.trim()) return 'Please enter state.';
    if (!customer.pincode.trim()) return 'Please enter postal pincode.';
    return null;
  };

  // Submit Checkout & Open Interactive UPI Payment Modal
  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    const validationErr = validateForm();
    if (validationErr) {
      setErrorMessage(validationErr);
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // 1. Create order on backend
      const orderPayload = {
        orderItems: cartItems,
        customerName: customer.name.trim(),
        customerEmail: customer.email.trim().toLowerCase(),
        customerPhone: customer.phone.trim(),
        deliveryAddress: {
          street: customer.street.trim(),
          landmark: customer.landmark ? customer.landmark.trim() : '',
          city: customer.city.trim(),
          state: customer.state.trim(),
          pincode: customer.pincode.trim(),
        },
        paymentMethod: 'Sai Pootharekulu UPI',
      };

      const orderRes = await api.post('/orders', orderPayload);
      const createdOrder = orderRes.data.order;

      // 2. Initiate payment order on backend
      const pmtRes = await api.post('/payment/create-razorpay-order', {
        orderId: createdOrder._id,
      });

      // 3. Open interactive UPI Payment Modal with live deep-links & QR
      setActivePaymentOrder({
        ...pmtRes.data,
        orderId: createdOrder.orderId,
        _id: createdOrder._id,
        totalPrice: createdOrder.totalPrice,
      });

      setIsUpiModalOpen(true);
      setIsProcessing(false);
    } catch (err) {
      console.error('Checkout initialization error:', err);
      setErrorMessage(err.message || 'Failed to initialize payment. Please check your connection.');
      setIsProcessing(false);
    }
  };

  // Called upon successful backend verification
  const handlePaymentSuccess = (verifyResult) => {
    setIsUpiModalOpen(false);
    clearCart();
    navigate(`/order-success/${verifyResult.order.orderId}`, {
      state: {
        order: verifyResult.order,
        notification: verifyResult.notification,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#041f14] py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionDivider
          title="Secure UPI & Card Checkout"
          subtitle="Finalize Your Sweet Delivery"
        />

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/90 border border-red-500 text-red-200 text-base flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleProceedToPayment}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Cols: Customer Details & Delivery Address */}
            <div className="lg:col-span-7 space-y-6">
              {/* Customer Information */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#062b1c] border border-gold-500/40 shadow-emerald-card relative">
                <GoldCorner position="top-left" />
                <GoldCorner position="top-right" />

                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gold-500/20">
                  <User className="w-6 h-6 text-gold-400" />
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-ivory">
                    1. Customer Information
                  </h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-base font-semibold text-gold-300 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={customer.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter customer full name"
                      className="w-full px-4 py-3 rounded-xl bg-[#02130c] border border-gold-500/40 text-ivory text-base focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-gold-300 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={customer.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#02130c] border border-gold-500/40 text-ivory text-base focus:outline-none focus:border-gold-400"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gold-300 mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={customer.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="10-digit mobile number"
                        className="w-full px-4 py-3 rounded-xl bg-[#02130c] border border-gold-500/40 text-ivory text-base focus:outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#062b1c] border border-gold-500/40 shadow-emerald-card relative">
                <GoldCorner position="top-left" />
                <GoldCorner position="top-right" />

                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gold-500/20">
                  <MapPin className="w-6 h-6 text-gold-400" />
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-ivory">
                    2. Delivery Address
                  </h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-base font-semibold text-gold-300 mb-1.5">
                      Street Address / House No. / Apartment *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={customer.street}
                      onChange={handleInputChange}
                      required
                      placeholder="E.g., Flat 204, Royal Palms, Main Road"
                      className="w-full px-4 py-3 rounded-xl bg-[#02130c] border border-gold-500/40 text-ivory text-base focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-gold-300 mb-1.5">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={customer.landmark}
                      onChange={handleInputChange}
                      placeholder="E.g., Near Kudlu Gate Bus Stop"
                      className="w-full px-4 py-3 rounded-xl bg-[#02130c] border border-gold-500/40 text-ivory text-base focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-gold-300 mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={customer.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-[#02130c] border border-gold-500/40 text-ivory text-base focus:outline-none focus:border-gold-400"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gold-300 mb-1.5">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={customer.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-[#02130c] border border-gold-500/40 text-ivory text-base focus:outline-none focus:border-gold-400"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gold-300 mb-1.5">
                        Postal Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={customer.pincode}
                        onChange={handleInputChange}
                        required
                        placeholder="6-digit PIN"
                        className="w-full px-4 py-3 rounded-xl bg-[#02130c] border border-gold-500/40 text-ivory text-base focus:outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Supported UPI Applications Highlights */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#062b1c] border border-gold-500/40 shadow-emerald-card relative">
                <GoldCorner position="top-left" />
                <GoldCorner position="top-right" />

                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gold-500/20">
                  <Smartphone className="w-6 h-6 text-gold-400" />
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-ivory">
                    3. Supported UPI Payment Applications
                  </h3>
                </div>

                <p className="text-base text-cream/90 mb-4">
                  Pay securely to official merchant <strong>Sai Pootharekulu (9441321874@ybl)</strong> using any preferred UPI application:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-emerald-950/90 rounded-xl border border-gold-500/30 text-center font-semibold text-base text-ivory flex items-center justify-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Google Pay
                  </div>
                  <div className="p-3 bg-emerald-950/90 rounded-xl border border-gold-500/30 text-center font-semibold text-base text-ivory flex items-center justify-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" /> PhonePe
                  </div>
                  <div className="p-3 bg-emerald-950/90 rounded-xl border border-gold-500/30 text-center font-semibold text-base text-ivory flex items-center justify-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block" /> Paytm
                  </div>
                  <div className="p-3 bg-emerald-950/90 rounded-xl border border-gold-500/30 text-center font-semibold text-base text-ivory flex items-center justify-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> BHIM UPI
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Order Summary & Pay Action */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 sm:p-8 rounded-2xl bg-[#062b1c] border border-gold-500/40 shadow-emerald-card sticky top-24">
                <GoldCorner position="top-right" />
                <GoldCorner position="bottom-left" />

                <h3 className="font-cinzel text-xl font-bold text-ivory mb-5 pb-3 border-b border-gold-500/30">
                  Order Summary ({cartItems.length} items)
                </h3>

                {/* Items Breakdown with Sweet Images */}
                <div className="space-y-4 max-h-72 overflow-y-auto pr-1 mb-5">
                  {cartItems.map((item) => (
                    <div
                      key={`${item._id || item.product}-${item.packSize}`}
                      className="flex items-center justify-between text-base py-2.5 border-b border-gold-500/10 gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || '/sai-pootharekulu-poster.jpg'}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover border border-gold-500/30 flex-shrink-0"
                        />
                        <div className="space-y-0.5">
                          <span className="font-semibold text-ivory block leading-tight text-base">
                            {item.name}
                          </span>
                          <span className="text-sm text-gold-300">
                            {item.packSize} Box × {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-cinzel text-lg font-bold text-gold-200 flex-shrink-0">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotal & Delivery Calculation */}
                <div className="space-y-2.5 text-base border-t border-gold-500/20 pt-4">
                  <div className="flex justify-between text-cream/90">
                    <span>Subtotal</span>
                    <span className="font-semibold text-ivory">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-cream/90">
                    <span>Delivery Charges</span>
                    <span>
                      {deliveryCharges === 0 ? (
                        <span className="text-emerald-400 font-bold">FREE Delivery</span>
                      ) : (
                        `₹${deliveryCharges}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-2xl font-cinzel font-black text-ivory pt-3 border-t border-gold-500/20">
                    <span>Final Payable</span>
                    <span className="gold-text">₹{grandTotal}</span>
                  </div>
                </div>

                {/* Proceed to UPI Payment Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="mt-6 w-full py-4 px-6 rounded-xl font-cinzel text-lg font-bold text-[#041f14] bg-gradient-to-r from-gold-400 via-gold-200 to-gold-500 shadow-gold hover:shadow-gold-lg hover:scale-[1.01] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2 min-h-[52px]"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#041f14] border-t-transparent rounded-full animate-spin" />
                      <span>Opening Payment Gateway...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to Pay ₹{grandTotal} via UPI</span>
                      <ArrowRight className="w-5 h-5 text-[#041f14]" />
                    </>
                  )}
                </button>

                <p className="mt-4 text-xs text-cream/70 text-center leading-relaxed">
                  🔒 Payments are verified securely on our server. An automatic WhatsApp notification will be sent to owner <strong>9441321874</strong> upon successful payment.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Interactive UPI Payment Modal */}
      <UpiPaymentModal
        isOpen={isUpiModalOpen}
        onClose={() => setIsUpiModalOpen(false)}
        orderData={activePaymentOrder}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default CheckoutPage;
