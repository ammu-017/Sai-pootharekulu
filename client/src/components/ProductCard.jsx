import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus, Check, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { GoldCorner } from './TraditionalMotif';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleImageError = () => {
    if (imgSrc !== '/sai-pootharekulu-poster.jpg') {
      setImgSrc('/sai-pootharekulu-poster.jpg');
    }
  };

  return (
    <div className="relative group flex flex-col justify-between rounded-3xl bg-[#062b1c] border-2 border-gold-500/40 shadow-emerald-card hover:border-gold-400 hover:shadow-gold transition-all duration-300 overflow-hidden">
      {/* Decorative Traditional Corners */}
      <GoldCorner position="top-left" />
      <GoldCorner position="top-right" />

      {/* Product Image Section with DSLR cover styling and hover zoom */}
      <div className="relative w-full aspect-[4/3] bg-[#02130c] overflow-hidden">
        <img
          src={imgSrc}
          alt={`${product.name} - ${product.packSize} Box, authentic traditional Andhra Pootharekulu`}
          onError={handleImageError}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#062b1c] via-transparent to-black/20 opacity-80" />

        {/* Pack Size Badge (Clear 14px-16px legible text) */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-black tracking-wider uppercase bg-[#02130c]/95 text-gold-300 border border-gold-500/60 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            {product.packSize}
          </span>
        </div>

        {/* Category Pill */}
        {product.badge && (
          <div className="absolute top-3.5 right-3.5 z-10">
            <span className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold bg-emerald-950/95 text-ivory border border-gold-400/50 shadow-md">
              {product.badge}
            </span>
          </div>
        )}
      </div>

      {/* Product Details Section (Large high-contrast readable fonts) */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div>
          {/* Product Name (20px–22px) */}
          <div className="mb-2">
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-ivory group-hover:text-gold-300 transition-colors leading-snug">
              {product.name}
            </h3>
          </div>

          {/* Pack Size Subtitle */}
          <div className="flex items-center gap-2.5 mb-3">
            <span className="text-sm font-bold px-3 py-1 rounded-md bg-emerald-950 text-gold-300 border border-gold-500/30">
              {product.packSize} Box
            </span>
            <span className="text-sm text-cream font-traditional italic">
              {product.category.includes('Dry Fruit')
                ? 'Assorted Dry Fruits & Ghee'
                : 'Organic Bellam & Desi Ghee'}
            </span>
          </div>

          {/* Description (16px readable body text) */}
          <p className="text-base text-cream/90 leading-relaxed font-sans mb-3">
            {product.description}
          </p>

          {/* Key Ingredients Highlights */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.ingredients.slice(0, 3).map((ing, idx) => (
                <span
                  key={idx}
                  className="text-xs sm:text-sm font-medium px-2.5 py-1 rounded-full bg-emerald-900/80 text-gold-200 border border-gold-500/30"
                >
                  ✓ {ing}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing and Action Footer */}
        <div className="pt-4 border-t border-gold-500/20 space-y-4">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2.5">
              {/* Price (22px–26px) */}
              <span className="font-cinzel text-2xl sm:text-3xl font-black text-gold-300">
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-sm text-cream/70 font-medium">Taxes Included</span>
          </div>

          {/* Quantity Selector & Add to Cart Button (16px-18px touch-friendly) */}
          <div className="flex items-center gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center bg-[#02130c] rounded-2xl border border-gold-500/50 p-1.5">
              <button
                onClick={handleDecrement}
                className="w-9 h-9 flex items-center justify-center text-gold-300 hover:text-white hover:bg-emerald-900 rounded-xl transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-9 text-center text-base font-extrabold text-ivory">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-9 h-9 flex items-center justify-center text-gold-300 hover:text-white hover:bg-emerald-900 rounded-xl transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button (16px–18px font-bold, min-h-[48px]) */}
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 px-4 rounded-2xl font-cinzel text-base font-bold flex items-center justify-center gap-2.5 transition-all duration-300 shadow-gold min-h-[48px] ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-gold-400 via-gold-200 to-gold-500 text-[#041f14] hover:shadow-gold-lg hover:scale-[1.02]'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5 text-white" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
