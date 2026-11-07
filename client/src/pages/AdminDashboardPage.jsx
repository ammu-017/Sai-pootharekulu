import React, { useState, useEffect } from 'react';
import {
  Users,
  ShoppingBag,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  MessageCircle,
  RefreshCw,
  Search,
  Filter,
  Package,
  Edit2,
  Save,
  ShieldCheck,
} from 'lucide-react';
import { SectionDivider, GoldCorner } from '../components/TraditionalMotif';
import api from '../services/api';

const statusOptions = [
  'Order Placed',
  'Payment Successful',
  'Preparing',
  'Ready for Delivery',
  'Delivered',
  'Cancelled',
];

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'customers' | 'products'
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');

  // Editing product price/stock state
  const [editingProductId, setEditingProductId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes, customersRes, productsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get(`/admin/orders?status=${statusFilter}&search=${searchQuery}`),
        api.get('/admin/customers'),
        api.get('/products'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (ordersRes.data.success) setOrders(ordersRes.data.orders);
      if (customersRes.data.success) setCustomers(customersRes.data.customers);
      if (productsRes.data.success) setProducts(productsRes.data.products);
    } catch (err) {
      setActionError(err.message || 'Failed to fetch admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAdminData();
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      setActionMessage('');
      setActionError('');
      const res = await api.put(`/admin/orders/${orderId}/status`, {
        orderStatus: newStatus,
      });
      if (res.data.success) {
        setActionMessage(`Order status updated to "${newStatus}"!`);
        fetchAdminData();
      }
    } catch (err) {
      setActionError(err.message || 'Failed to update order status.');
    }
  };

  const handleResendWhatsApp = async (orderId) => {
    try {
      setActionMessage('');
      setActionError('');
      const res = await api.post(`/admin/orders/${orderId}/resend-whatsapp`);
      if (res.data.success) {
        setActionMessage(
          'WhatsApp notification triggered! Fallback link opened or Cloud API dispatched.'
        );
        if (res.data.directLink) {
          window.open(res.data.directLink, '_blank');
        }
        fetchAdminData();
      }
    } catch (err) {
      setActionError(err.message || 'Failed to trigger WhatsApp notification.');
    }
  };

  const handleSaveProduct = async (id) => {
    try {
      const payload = {};
      if (editPrice) payload.price = Number(editPrice);
      if (editStock) payload.stockQuantity = Number(editStock);

      const res = await api.put(`/admin/products/${id}`, payload);
      if (res.data.success) {
        setActionMessage('Product updated successfully!');
        setEditingProductId(null);
        fetchAdminData();
      }
    } catch (err) {
      setActionError(err.message || 'Failed to update product');
    }
  };

  return (
    <div className="min-h-screen bg-[#041f14] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gold-500/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-wider border border-amber-500/40">
                Official Business Owner Portal
              </span>
            </div>
            <h1 className="font-cinzel text-2xl sm:text-4xl font-black text-ivory mt-2">
              Sai Pootharekulu Admin Dashboard
            </h1>
            <p className="font-traditional text-gold-300 italic text-base sm:text-lg mt-1">
              Manage Orders, Deliveries, Customers & Pricing • Owner Hotline: 9441321874
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#062b1c] border border-gold-500/40 text-gold-300 text-sm sm:text-base font-semibold hover:border-gold-400 hover:text-white transition-all shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Action alerts */}
        {actionMessage && (
          <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-sm sm:text-base flex items-center gap-2.5 shadow-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}
        {actionError && (
          <div className="p-4 rounded-xl bg-red-950/90 border border-red-500 text-red-200 text-sm sm:text-base flex items-center gap-2.5 shadow-md">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* 1. Stat Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-[#062b1c] border border-gold-500/30 shadow-md">
            <div className="flex items-center justify-between text-gold-400 mb-2">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">
                Total Sales
              </span>
              <IndianRupee className="w-6 h-6" />
            </div>
            <span className="font-cinzel text-2xl sm:text-4xl font-black gold-text">
              ₹{stats?.totalSales || 0}
            </span>
            <span className="text-xs sm:text-sm text-cream/70 block mt-1.5">
              Verified online payments
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#062b1c] border border-gold-500/30 shadow-md">
            <div className="flex items-center justify-between text-gold-400 mb-2">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">
                Total Orders
              </span>
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="font-cinzel text-2xl sm:text-4xl font-black text-ivory">
              {stats?.totalOrders || 0}
            </span>
            <span className="text-xs sm:text-sm text-cream/70 block mt-1.5">
              Lifetime customer orders
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#062b1c] border border-gold-500/30 shadow-md">
            <div className="flex items-center justify-between text-gold-400 mb-2">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">
                Pending / Preparing
              </span>
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <span className="font-cinzel text-2xl sm:text-4xl font-black text-amber-300">
              {stats?.pendingOrders || 0}
            </span>
            <span className="text-xs sm:text-sm text-cream/70 block mt-1.5">
              Active orders in pipeline
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#062b1c] border border-gold-500/30 shadow-md">
            <div className="flex items-center justify-between text-gold-400 mb-2">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">
                Registered Customers
              </span>
              <Users className="w-6 h-6" />
            </div>
            <span className="font-cinzel text-2xl sm:text-4xl font-black text-ivory">
              {stats?.totalCustomers || 0}
            </span>
            <span className="text-xs sm:text-sm text-cream/70 block mt-1.5">
              Customer accounts
            </span>
          </div>
        </div>

        {/* 2. Navigation Tabs */}
        <div className="flex border-b border-gold-500/30 gap-4 sm:gap-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 font-cinzel text-base sm:text-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'text-gold-300 border-b-2 border-gold-400'
                : 'text-cream/60 hover:text-white'
            }`}
          >
            Orders Management ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`pb-3 font-cinzel text-base sm:text-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'customers'
                ? 'text-gold-300 border-b-2 border-gold-400'
                : 'text-cream/60 hover:text-white'
            }`}
          >
            Registered Customers ({customers.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 font-cinzel text-base sm:text-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'text-gold-300 border-b-2 border-gold-400'
                : 'text-cream/60 hover:text-white'
            }`}
          >
            Products & Inventory ({products.length})
          </button>
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#062b1c] p-4 sm:p-5 rounded-2xl border border-gold-500/30">
              {/* Filter by status */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Filter className="w-5 h-5 text-gold-400 shrink-0" />
                <span className="text-sm sm:text-base font-semibold text-gold-300 whitespace-nowrap">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#02130c] border border-gold-500/30 rounded-xl px-4 py-2 text-sm sm:text-base text-ivory focus:outline-none focus:border-gold-400 cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  {statusOptions.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Order ID or Name..."
                  className="px-4 py-2 rounded-xl bg-[#02130c] border border-gold-500/30 text-sm sm:text-base text-ivory focus:outline-none focus:border-gold-400 w-full sm:w-72"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-gold-gradient-bg text-[#041f14] font-bold hover:scale-105 transition-transform"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Orders Table */}
            <div className="bg-[#062b1c] rounded-2xl border border-gold-500/30 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm sm:text-base">
                  <thead className="bg-[#02130c] text-gold-300 uppercase font-cinzel text-xs sm:text-sm border-b border-gold-500/20 tracking-wider">
                    <tr>
                      <th className="py-4 px-5">Order ID & Date</th>
                      <th className="py-4 px-5">Customer Details</th>
                      <th className="py-4 px-5">Ordered Items</th>
                      <th className="py-4 px-5">Total Amount</th>
                      <th className="py-4 px-5">Status & Update</th>
                      <th className="py-4 px-5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-500/10 text-cream/90 font-sans">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-10 text-center text-cream/60 text-base">
                          No orders found matching the criteria.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order._id} className="hover:bg-emerald-900/30 transition-colors">
                          {/* Order ID & Date */}
                          <td className="py-4 px-5 align-top">
                            <span className="font-cinzel font-bold text-ivory block text-base sm:text-lg">
                              {order.orderId}
                            </span>
                            <span className="text-xs sm:text-sm text-cream/60 block mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </td>

                          {/* Customer Details */}
                          <td className="py-4 px-5 align-top">
                            <span className="font-semibold text-ivory block text-base">
                              {order.customerName}
                            </span>
                            <span className="text-sm text-gold-300 block mt-0.5">
                              📞 {order.customerPhone}
                            </span>
                            <span className="text-xs sm:text-sm text-cream/70 max-w-[200px] truncate block mt-0.5">
                              📍 {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                            </span>
                          </td>

                          {/* Ordered Items */}
                          <td className="py-4 px-5 align-top">
                            <div className="space-y-1">
                              {order.orderItems?.map((it, idx) => (
                                <div key={idx} className="text-xs sm:text-sm">
                                  • {it.name} ({it.packSize}) ×{' '}
                                  <strong className="text-gold-200">{it.quantity}</strong>
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* Total Amount */}
                          <td className="py-4 px-5 align-top">
                            <span className="font-cinzel text-lg sm:text-xl font-bold text-gold-300 block">
                              ₹{order.totalPrice}
                            </span>
                            <span
                              className={`text-xs font-bold px-2.5 py-0.5 rounded-full inline-block mt-1 ${
                                order.isPaid
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-red-950 text-red-400 border border-red-500/30'
                              }`}
                            >
                              {order.isPaid ? 'PAID' : 'PENDING'}
                            </span>
                            {order.paymentDetails?.paymentMethod && (
                              <span className="text-[11px] text-cream/60 block mt-0.5">
                                {order.paymentDetails.paymentMethod}
                              </span>
                            )}
                          </td>

                          {/* Status & Update Dropdown */}
                          <td className="py-4 px-5 align-top">
                            <select
                              value={order.orderStatus}
                              onChange={(e) =>
                                handleUpdateOrderStatus(order._id, e.target.value)
                              }
                              className="bg-[#02130c] border border-gold-500/40 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-ivory focus:outline-none focus:border-gold-400 cursor-pointer"
                            >
                              {statusOptions.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-5 text-center align-top">
                            <button
                              onClick={() => handleResendWhatsApp(order._id)}
                              className="p-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-500/30 transition-colors shadow"
                              title="Resend WhatsApp notification to Owner (9441321874)"
                            >
                              <MessageCircle className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REGISTERED CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="bg-[#062b1c] rounded-2xl border border-gold-500/30 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm sm:text-base">
                <thead className="bg-[#02130c] text-gold-300 uppercase font-cinzel text-xs sm:text-sm border-b border-gold-500/20 tracking-wider">
                  <tr>
                    <th className="py-4 px-5">Customer Name</th>
                    <th className="py-4 px-5">Email Address</th>
                    <th className="py-4 px-5">Phone Number</th>
                    <th className="py-4 px-5">Saved Address</th>
                    <th className="py-4 px-5">Total Orders</th>
                    <th className="py-4 px-5">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-500/10 text-cream/90 font-sans">
                  {customers.map((cust) => (
                    <tr key={cust._id} className="hover:bg-emerald-900/30 transition-colors">
                      <td className="py-4 px-5 font-semibold text-ivory text-base">
                        {cust.name}
                      </td>
                      <td className="py-4 px-5 text-gold-300">{cust.email}</td>
                      <td className="py-4 px-5">
                        <a
                          href={`tel:${cust.phone}`}
                          className="hover:underline text-cream font-medium"
                        >
                          {cust.phone}
                        </a>
                      </td>
                      <td className="py-4 px-5 text-xs sm:text-sm text-cream/70 max-w-[220px] truncate">
                        {cust.deliveryAddress?.street
                          ? `${cust.deliveryAddress.street}, ${cust.deliveryAddress.city} - ${cust.deliveryAddress.pincode}`
                          : 'Not yet entered'}
                      </td>
                      <td className="py-4 px-5 font-bold text-gold-200 text-base">
                        {cust.totalOrders || 0}
                      </td>
                      <td className="py-4 px-5 text-xs sm:text-sm text-cream/60">
                        {new Date(cust.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS & INVENTORY */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((prod) => (
              <div
                key={prod._id}
                className="p-6 rounded-2xl bg-[#062b1c] border border-gold-500/30 space-y-4 shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-cinzel text-xl font-bold text-ivory">
                      {prod.name}
                    </h4>
                    <span className="text-sm font-semibold text-gold-300">{prod.packSize} Box</span>
                  </div>
                  <span className="px-3 py-1 rounded bg-emerald-950 text-xs sm:text-sm font-bold text-emerald-400 border border-emerald-500/30">
                    {prod.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm sm:text-base">
                  <div className="bg-[#02130c] p-4 rounded-xl border border-gold-500/20">
                    <span className="text-cream/70 text-xs sm:text-sm block">Current Price</span>
                    {editingProductId === prod._id ? (
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 bg-[#041f14] border border-gold-500/40 rounded-lg text-ivory font-bold text-base"
                      />
                    ) : (
                      <span className="font-cinzel text-2xl font-black text-gold-300">
                        ₹{prod.price}
                      </span>
                    )}
                  </div>

                  <div className="bg-[#02130c] p-4 rounded-xl border border-gold-500/20">
                    <span className="text-cream/70 text-xs sm:text-sm block">Stock Inventory</span>
                    {editingProductId === prod._id ? (
                      <input
                        type="number"
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 bg-[#041f14] border border-gold-500/40 rounded-lg text-ivory font-bold text-base"
                      />
                    ) : (
                      <span className="font-cinzel text-2xl font-black text-ivory">
                        {prod.stockQuantity} boxes
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  {editingProductId === prod._id ? (
                    <>
                      <button
                        onClick={() => setEditingProductId(null)}
                        className="px-4 py-2 rounded-xl border border-gray-500 text-sm font-medium text-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveProduct(prod._id)}
                        className="px-4 py-2 rounded-xl bg-gold-gradient-bg text-[#041f14] font-bold text-sm sm:text-base flex items-center gap-1.5 shadow-gold"
                      >
                        <Save className="w-4 h-4" /> Save
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingProductId(prod._id);
                        setEditPrice(prod.price);
                        setEditStock(prod.stockQuantity);
                      }}
                      className="px-4 py-2 rounded-xl border border-gold-500/40 text-gold-300 text-sm sm:text-base font-semibold hover:border-gold-400 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" /> Edit Price / Stock
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
