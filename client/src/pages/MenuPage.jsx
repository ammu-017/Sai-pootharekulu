import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { SectionDivider } from '../components/TraditionalMotif';
import { Sparkles } from 'lucide-react';
import api from '../services/api';

const defaultFallbackProducts = [
  {
    _id: 'prod-1',
    name: 'Jaggery Pootharekulu (Bellam)',
    category: 'Jaggery Pootharekulu',
    description:
      'Traditional Andhra Pootharekulu prepared with authentic organic jaggery and pure ghee. Six individual rolls served fresh on a brass plate.',
    packSize: '6 Pieces',
    pieces: 6,
    price: 180,
    originalPrice: 180,
    image: '/sweets/jaggery-pootharekulu-6pcs.jpg',
    badge: 'Pure Ghee & Bellam',
    ingredients: ['Pure Desi Ghee', 'Organic Bellam', 'Rice Starch Film', 'Cardamom'],
  },
  {
    _id: 'prod-2',
    name: 'Jaggery Pootharekulu (Bellam)',
    category: 'Jaggery Pootharekulu',
    description:
      'Authentic traditional Andhra Pootharekulu with organic jaggery and generous pure ghee. Twelve neatly arranged rolls in a festive gift box.',
    packSize: '12 Pieces',
    pieces: 12,
    price: 349,
    originalPrice: 349,
    image: '/sweets/jaggery-pootharekulu-12pcs.jpg',
    badge: 'Family Value Box',
    ingredients: ['Pure Desi Ghee', 'Organic Bellam', 'Rice Starch Film', 'Cardamom'],
  },
  {
    _id: 'prod-3',
    name: 'Dry Fruit Pootharekulu',
    category: 'Dry Fruit Pootharekulu',
    description:
      'Delicious traditional Pootharekulu generously filled with premium assorted dry fruits (cashews, pistachios, almonds) and pure ghee. Six individual artisanal rolls.',
    packSize: '6 Pieces',
    pieces: 6,
    price: 180,
    originalPrice: 180,
    image: '/sweets/dryfruit-pootharekulu-6pcs.jpg',
    badge: 'Loaded Dry Fruits',
    ingredients: ['Cashews (Kaju)', 'Almonds (Badam)', 'Pistachios (Pista)', 'Pure Ghee'],
  },
  {
    _id: 'prod-4',
    name: 'Dry Fruit Pootharekulu',
    category: 'Dry Fruit Pootharekulu',
    description:
      'Grand festive celebration box featuring twelve beautifully arranged Pootharekulu rolls packed with generous crunchy dry fruits and pure ghee.',
    packSize: '12 Pieces',
    pieces: 12,
    price: 349,
    originalPrice: 349,
    image: '/sweets/dryfruit-pootharekulu-12pcs.jpg',
    badge: 'Festive Celebration Box',
    ingredients: ['Cashews (Kaju)', 'Almonds (Badam)', 'Pistachios (Pista)', 'Pure Ghee'],
  },
];

const MenuPage = () => {
  const [products, setProducts] = useState(defaultFallbackProducts);
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        if (res.data?.products?.length > 0) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.warn('Using default menu products:', err.message);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts =
    selectedFilter === 'All'
      ? products
      : products.filter((p) => p.category === selectedFilter);

  return (
    <div className="min-h-screen bg-[#041f14] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionDivider
          title="Sai Pootharekulu Special Menu"
          subtitle="All 4 Varieties & Pack Sizes"
        />

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 my-8">
          {['All', 'Jaggery Pootharekulu', 'Dry Fruit Pootharekulu'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedFilter(tab)}
              className={`px-6 py-2.5 rounded-full font-cinzel text-base sm:text-lg font-semibold transition-all duration-300 ${
                selectedFilter === tab
                  ? 'bg-gradient-to-r from-gold-400 via-gold-200 to-gold-500 text-[#041f14] shadow-gold scale-105'
                  : 'bg-[#062b1c] text-cream/90 border border-gold-500/30 hover:border-gold-400 hover:text-white'
              }`}
            >
              {tab === 'All' ? 'All 4 Variations' : tab}
            </button>
          ))}
        </div>

        {/* Information Callout Banner */}
        <div className="mb-10 p-5 rounded-2xl bg-gradient-to-r from-[#062b1c] via-[#083a26] to-[#062b1c] border border-gold-500/30 text-center max-w-3xl mx-auto shadow-md">
          <p className="text-base sm:text-lg text-gold-200 font-medium flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-400 shrink-0" />
            <span>
              All orders are freshly prepared in pure ghee. Standard delivery charges: ₹40 (FREE above ₹499).
            </span>
          </p>
        </div>

        {/* 4 Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
