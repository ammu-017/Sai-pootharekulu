import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Package,
  Calendar,
  Clock,
  MessageCircle,
  Truck,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { SectionDivider, GoldCorner } from '../components/TraditionalMotif';
import api from '../services/api';

const statusColors = {
  'Order Placed': 'bg-blue-900/60 text-blue-300 border-blue-500/40',
  'Payment Successful': 'bg-emerald-900/60 text-emerald-300 border-emerald-500/40',
  Preparing: 'bg-amber-900/60 text-amber-300 border-amber-500/40',
  'Ready for Delivery': 'bg-purple-900/60 text-purple-300 border-purple-500/40',
  Delivered: 'bg-green-900/60 text-green-300 border-green-500/40',
  Cancelled: 'bg-red-900/60 text-red-300 border-red-500/40',
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch order history.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#041f14]">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#041f14] py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionDivider title="My Orders" subtitle="Track Your Sweet Deliveries" />

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-base">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16 px-6 bg-[#062b1c] rounded-3xl border border-gold-500/30 max-w-lg mx-auto shadow-xl">
            <div className="w-20 h-20 rounded-full bg-emerald-950 border border-gold-500/40 mx-auto flex items-center justify-center text-gold-400 mb-5">
              <Package className="w-10 h-10 opacity-70" />
            </div>
            <h3 className="font-cinzel text-2xl font-bold text-ivory mb-3">
              No Orders Placed Yet
            </h3>
            <p className="text-base sm:text-lg text-cream/80 mb-7 leading-relaxed">
              You haven't ordered any authentic Andhra Pootharekulu yet. Explore our delicious menu today!
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gold-gradient-bg text-[#041f14] font-cinzel text-base sm:text-lg font-bold shadow-gold hover:scale-105 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Explore Sweet Menu</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentStatusColor =
                statusColors[order.orderStatus] ||
                'bg-emerald-900/60 text-emerald-300 border-emerald-500/40';

              return (
                <div
                  key={order._id}
                  className="rounded-2xl bg-[#062b1c] border border-gold-500/30 p-6 sm:p-7 shadow-lg hover:border-gold-400/60 transition-all relative"
                >
                  <GoldCorner position="top-right" />

                  {/* Header: Order ID, Date & Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gold-500/20">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-cinzel text-lg sm:text-xl font-bold text-ivory">
                          {order.orderId}
                        </span>
                        <span
                          className={`text-sm font-bold px-3 py-1 rounded-full border ${currentStatusColor}`}
                        >
                          {order.orderStatus}
                        </span>
                        {order.isPaid && (
                          <span className="text-xs sm:text-sm font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            PAID {order.paymentDetails?.paymentMethod ? `(${order.paymentDetails.paymentMethod})` : ''}
                          </span>
                        )}
                      </div>
                      <span className="text-sm sm:text-base text-cream/70 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gold-400" />
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-sm text-cream/70 block">Total Amount</span>
                      <span className="font-cinzel text-2xl sm:text-3xl font-black text-gold-300">
                        ₹{order.totalPrice}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="py-5 space-y-4">
                    {order.orderItems?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-base sm:text-lg text-cream/90 gap-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={item.image || '/sai-pootharekulu-poster.jpg'}
                            alt={item.name}
                            className="w-14 h-14 rounded-xl object-cover border border-gold-500/30 flex-shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-ivory block leading-snug text-base sm:text-lg">
                              {item.name}
                            </span>
                            <span className="text-sm sm:text-base text-gold-300 font-medium">
                              {item.packSize} Box × {item.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-ivory text-lg sm:text-xl flex-shrink-0">
                          ₹{item.subtotal || item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Address & Actions */}
                  <div className="pt-4 border-t border-gold-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm sm:text-base">
                    <div className="text-cream/80">
                      <span className="font-semibold text-gold-300">Delivery To: </span>
                      <span>
                        {order.deliveryAddress?.street}, {order.deliveryAddress?.city} -{' '}
                        {order.deliveryAddress?.pincode}
                      </span>
                    </div>

                    <a
                      href={`https://wa.me/919441321874?text=${encodeURIComponent(
                        `Hi Sai Pootharekulu, I am inquiring about my Order ${order.orderId}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/40 text-sm sm:text-base font-semibold transition-colors w-fit"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>WhatsApp Query (9441321874)</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
