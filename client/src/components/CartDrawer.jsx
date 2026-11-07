import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { LotusMotif } from './TraditionalMotif';

const CartDrawer = () => {
  const {
    cartItems,
    itemsCount,
    subtotal,
    deliveryCharges,
    grandTotal,
    freeDeliveryThreshold,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-[#041f14] border-l-2 border-gold-500/40 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-[#02130c] via-[#062b1c] to-[#02130c] border-b border-gold-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-gold-400" />
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-ivory">
                Your Sweet Cart ({itemsCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-full text-gold-400 hover:text-white hover:bg-emerald-900 transition-colors"
              aria-label="Close Cart Drawer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Delivery Bar (14px - 16px text) */}
          <div className="bg-[#02130c] px-5 py-3 border-b border-gold-500/20 text-sm">
            <div className="flex items-center justify-between mb-1.5 text-gold-300">
              <span className="flex items-center gap-2 font-medium">
                <Truck className="w-5 h-5 text-gold-400" />
                {amountNeededForFreeDelivery === 0 ? (
                  <span className="text-emerald-400 font-bold">
                    🎉 You qualify for FREE Delivery!
                  </span>
                ) : (
                  <span>
                    Add ₹{amountNeededForFreeDelivery} more for{' '}
                    <strong className="text-gold-200">FREE Delivery</strong>
                  </span>
                )}
              </span>
              <span className="font-bold">₹{subtotal} / ₹{freeDeliveryThreshold}</span>
            </div>
            <div className="w-full h-2 bg-emerald-950 rounded-full overflow-hidden border border-gold-500/30">
              <div
                className="h-full bg-gradient-to-r from-gold-500 via-gold-300 to-amber-300 transition-all duration-300"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-24 h-24 rounded-full bg-emerald-900/60 border border-gold-500/30 flex items-center justify-center text-gold-400">
                  <ShoppingBag className="w-12 h-12 opacity-60" />
                </div>
                <h3 className="font-cinzel text-xl font-bold text-ivory">
                  Your Cart is Empty
                </h3>
                <p className="text-base text-cream/80 max-w-xs">
                  Discover our freshly prepared authentic Andhra Pootharekulu crafted with pure desi ghee and dry fruits.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/menu');
                  }}
                  className="px-8 py-3.5 rounded-full bg-gold-gradient-bg text-[#041f14] font-cinzel text-base font-bold shadow-gold hover:scale-105 transition-all min-h-[48px]"
                >
                  Explore Sweet Menu
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={`${item._id || item.product}-${item.packSize}`}
                  className="flex gap-4 bg-[#062b1c] p-4 rounded-2xl border border-gold-500/30 shadow-md"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image || '/sai-pootharekulu-poster.jpg'}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-gold-500/30 flex-shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-cinzel text-base sm:text-lg font-bold text-ivory leading-tight">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item._id || item.product, item.packSize)}
                          className="text-red-400/80 hover:text-red-400 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-gold-300 block mt-0.5">
                        {item.packSize} Box
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Price Calculation */}
                      <span className="text-base font-cinzel font-bold text-gold-200">
                        ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center bg-[#02130c] rounded-xl border border-gold-500/40 px-1.5 py-1">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item._id || item.product,
                              item.packSize,
                              item.quantity - 1
                            )
                          }
                          className="w-7 h-7 flex items-center justify-center text-gold-300 hover:text-white"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-7 text-center text-sm font-black text-ivory">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item._id || item.product,
                              item.packSize,
                              item.quantity + 1
                            )
                          }
                          className="w-7 h-7 flex items-center justify-center text-gold-300 hover:text-white"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Calculation & Proceed to Checkout */}
          {cartItems.length > 0 && (
            <div className="p-5 sm:p-6 bg-[#02130c] border-t border-gold-500/30 space-y-4">
              <div className="space-y-2 text-base">
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
                <div className="h-[1px] bg-gold-500/20 my-2" />
                <div className="flex justify-between text-xl sm:text-2xl font-cinzel font-black text-ivory">
                  <span>Total Amount</span>
                  <span className="gold-text">₹{grandTotal}</span>
                </div>
              </div>

              {/* Proceed to Checkout Button (16px–18px, min-h-[48px]) */}
              <button
                onClick={handleCheckout}
                className="w-full py-4 px-6 rounded-2xl font-cinzel text-base sm:text-lg font-bold text-[#041f14] bg-gradient-to-r from-gold-400 via-gold-200 to-gold-500 shadow-gold hover:shadow-gold-lg hover:scale-[1.01] flex items-center justify-center gap-2.5 transition-all duration-300 min-h-[50px]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5 text-[#041f14]" />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-cream/70">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>100% Authentic Traditional Preparation & Secure UPI Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
