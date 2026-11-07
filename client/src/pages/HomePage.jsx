import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import FeaturesSection from '../components/FeaturesSection';
import ProductCard from '../components/ProductCard';
import AboutSection from '../components/AboutSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FAQSection from '../components/FAQSection';
import ContactSection from '../components/ContactSection';
import { SectionDivider } from '../components/TraditionalMotif';
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

const HomePage = () => {
  const [products, setProducts] = useState(defaultFallbackProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/products');
        if (res.data?.products?.length > 0) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.warn('Using default catalog:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#041f14]">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Brand Pillars & Features */}
      <FeaturesSection />

      {/* 3. Product Menu Section (All 4 variations displayed clearly) */}
      <section id="menu-section" className="py-20 relative bg-[#041f14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionDivider
            title="Authentic Sweet Menu"
            subtitle="Handcrafted Andhra Pootharekulu"
          />

          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm sm:text-base text-cream/80 leading-relaxed font-sans">
              Choose your favorite variety in <strong>6 Pieces</strong> or <strong>12 Pieces</strong> boxes.
              Each sweet is rolled to perfection with pure ghee and wholesome ingredients.
            </p>
          </div>

          {/* 4 Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. About Us Section */}
      <AboutSection />

      {/* 5. Customer Reviews & Testimonials */}
      <TestimonialsSection />

      {/* 6. Frequently Asked Questions */}
      <FAQSection />

      {/* 7. Contact Us & Store Details Section */}
      <ContactSection />
    </div>
  );
};

export default HomePage;
