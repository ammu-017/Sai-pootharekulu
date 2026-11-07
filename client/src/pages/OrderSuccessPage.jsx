import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  CheckCircle2,
  ShoppingBag,
  MessageCircle,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Sparkles,
  ArrowRight,
  Package,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GoldCorner, LotusMotif } from '../components/TraditionalMotif';
import api from '../services/api';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [notification, setNotification] = useState(location.state?.notification || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#fcf6ba', '#0e5538', '#ffffff'],
      });
    } catch {
      // Confetti fallback
    }

    if (!order && id) {
      const fetchOrder = async () => {
        try {
          const res = await api.get(`/orders/${id}`);
          if (res.data.success) {
            setOrder(res.data.order);
          }
        } catch (err) {
          setError(err.message || 'Failed to fetch order information.');
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#041f14]">
        <div className="w-14 h-14 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-[#041f14]">
        <h2 className="font-cinzel text-2xl text-red-400 mb-2">Order Not Found</h2>
        <p className="text-base text-cream/80 mb-6">{error || 'Could not locate order details.'}</p>
        <Link
          to="/"
          className="px-8 py-3.5 rounded-full bg-gold-gradient-bg text-[#041f14] font-cinzel text-base font-bold"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const ownerPhone = '9441321874';
  const ownerWhatsAppUrl =
    notification?.directOwnerWhatsAppUrl ||
    `https://api.whatsapp.com/send?phone=91${ownerPhone}&text=${encodeURIComponent(
      `Hello Sai Pootharekulu! I have placed Order ${order.orderId} for ₹${order.totalPrice}. Please confirm preparation.`
    )}`;

  return (
    <div className="min-h-screen bg-[#041f14] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto relative">
        <div className="absolute -inset-1.5 bg-gradient-to-r from-gold-600 via-gold-300 to-gold-600 rounded-3xl blur opacity-30 pointer-events-none" />

        <div className="relative rounded-3xl bg-[#062b1c] border-2 border-gold-500/50 p-8 sm:p-12 shadow-2xl">
          <GoldCorner position="top-left" />
          <GoldCorner position="top-right" />
          <GoldCorner position="bottom-left" />
          <GoldCorner position="bottom-right" />

          {/* Success Checkmark & Header (28px - 36px) */}
          <div className="text-center space-y-4 mb-10">
            <div className="w-24 h-24 rounded-full bg-emerald-950 border-4 border-emerald-400 mx-auto flex items-center justify-center text-emerald-400 shadow-gold">
              <CheckCircle2 className="w-14 h-14" />
            </div>

            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-emerald-950 border border-gold-500/40 text-gold-300 text-sm font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Payment Verified & Confirmed</span>
            </div>

            <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-black text-ivory">
              Order Placed Successfully!
            </h1>

            {/* Required Message */}
            <p className="font-traditional italic text-xl sm:text-2xl text-gold-300 max-w-xl mx-auto leading-relaxed">
              "Thank you for choosing Sai Pootharekulu! Enjoy the authentic taste of tradition."
            </p>

            <div className="pt-2">
              <span className="font-sans text-base text-cream/90">
                Order Reference:{' '}
                <strong className="font-cinzel text-xl text-gold-200 font-black">
                  {order.orderId}
                </strong>
              </span>
            </div>
          </div>

          {/* Owner Notification Banner */}
          <div className="mb-8 p-5 rounded-2xl bg-[#02130c] border border-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-full bg-emerald-900/60 text-emerald-400 border border-gold-500/30">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="font-bold text-ivory text-base block">
                  Automated Owner Notification (9441321874)
                </span>
                <span className="text-cream/80 text-sm">
                  {order.whatsappNotificationSent
                    ? 'Dispatched via WhatsApp Business Cloud API'
                    : 'Order recorded. Instant message link prepared.'}
                </span>
              </div>
            </div>

            <a
              href={ownerWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm transition-colors shadow-md flex-shrink-0 min-h-[44px]"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Notify Owner on WhatsApp</span>
            </a>
          </div>

          {/* Ordered Products Section */}
          <div className="mb-8 p-6 rounded-2xl bg-[#041f14] border border-gold-500/30 space-y-4">
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-gold-300 pb-3 border-b border-gold-500/20 flex items-center gap-2.5">
              <Package className="w-5 h-5" /> Ordered Sweets
            </h3>

            <div className="space-y-4">
              {order.orderItems?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-base gap-3"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={item.image || '/sai-pootharekulu-poster.jpg'}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover border border-gold-500/30 flex-shrink-0"
                    />
                    <div>
                      <span className="font-semibold text-ivory block leading-tight text-base">
                        {item.name}
                      </span>
                      <span className="text-sm text-gold-300">
                        {item.packSize} Box × {item.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-cinzel font-bold text-gold-200 text-lg flex-shrink-0">
                    ₹{item.subtotal || item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gold-500/20 space-y-2 text-base">
              <div className="flex justify-between text-cream/80">
                <span>Items Subtotal</span>
                <span>₹{order.itemsPrice}</span>
              </div>
              <div className="flex justify-between text-cream/80">
                <span>Delivery Charges</span>
                <span>{order.deliveryPrice === 0 ? 'FREE' : `₹${order.deliveryPrice}`}</span>
              </div>
              <div className="flex justify-between text-xl font-cinzel font-bold text-ivory pt-2 border-t border-gold-500/20">
                <span>Total Paid</span>
                <span className="gold-text font-black text-2xl">₹{order.totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Customer & Delivery Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8 text-sm text-cream/90">
            <div className="p-5 rounded-2xl bg-[#041f14] border border-gold-500/20 space-y-2">
              <span className="font-bold text-gold-300 block text-sm uppercase tracking-wider">
                Customer Details
              </span>
              <p className="font-bold text-ivory text-base">{order.customerName}</p>
              <p>📞 {order.customerPhone}</p>
              <p>✉️ {order.customerEmail}</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#041f14] border border-gold-500/20 space-y-2">
              <span className="font-bold text-gold-300 block text-sm uppercase tracking-wider">
                Delivery Address
              </span>
              <p className="text-ivory text-base">
                {order.deliveryAddress?.street},{' '}
                {order.deliveryAddress?.landmark ? `${order.deliveryAddress.landmark}, ` : ''}
                {order.deliveryAddress?.city}, {order.deliveryAddress?.state} -{' '}
                {order.deliveryAddress?.pincode}
              </p>
              <div className="pt-2 flex items-center gap-2 text-emerald-400 font-bold text-base">
                <CheckCircle2 className="w-5 h-5" />
                <span>Payment Status: SUCCESSFUL</span>
              </div>
            </div>
          </div>

          {/* Action Buttons (16px–18px bold, min-h-[50px]) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-gold-500/30">
            <Link
              to="/menu"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-cinzel text-base font-bold text-[#041f14] bg-gradient-to-r from-gold-400 via-gold-200 to-gold-500 shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all flex items-center justify-center gap-2.5 min-h-[50px]"
            >
              <ShoppingBag className="w-5 h-5 text-[#041f14]" />
              <span>Continue Shopping</span>
            </Link>

            <Link
              to="/my-orders"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-cinzel text-base font-bold text-gold-300 border-2 border-gold-500/60 hover:bg-gold-500/10 hover:border-gold-400 transition-all text-center min-h-[50px] flex items-center justify-center"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
