import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, Heart, ShieldAlert, Sparkles } from 'lucide-react';
import { LotusMotif } from './TraditionalMotif';

const Footer = () => {
  return (
    <footer className="bg-[#02130c] border-t-2 border-gold-500/40 text-ivory relative overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-gold-600 via-gold-200 to-gold-600 w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand Info & Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-gold-500 to-gold-200 shadow-gold">
                <img
                  src="/sai-pootharekulu-logo.jpg"
                  alt="Sai Pootharekulu Official Logo"
                  className="w-14 h-14 rounded-full object-cover"
                />
              </div>
              <div>
                <span className="font-cinzel text-xl sm:text-2xl font-black gold-text">
                  Sai Pootharekulu
                </span>
                <span className="block font-traditional text-sm text-gold-400 italic">
                  Traditional Taste... Timeless Delight...
                </span>
              </div>
            </div>

            <p className="font-sans text-sm sm:text-base text-cream/80 leading-relaxed">
              Crafting authentic Andhra Pootharekulu with time-honored artisanal care. Prepared
              with pure cow ghee, organic bellam (jaggery), and assorted premium dry fruits.
            </p>

            <div className="pt-2 flex items-center gap-2 text-sm text-gold-300 font-semibold">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Available Fresh from Sunday Every Week</span>
            </div>
          </div>

          {/* Col 2: Quick Links (16px readable navigation) */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-lg font-bold text-gold-300 border-b border-gold-500/30 pb-2.5">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-base text-cream/90 font-sans">
              <li>
                <Link to="/" className="hover:text-gold-300 transition-colors">
                  Home Page
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-gold-300 transition-colors">
                  Sweet Menu & Pricing
                </Link>
              </li>
              <li>
                <a href="/#about" className="hover:text-gold-300 transition-colors">
                  About Our Heritage
                </a>
              </li>
              <li>
                <a href="/#contact" className="hover:text-gold-300 transition-colors">
                  Contact Us & Location
                </a>
              </li>
              <li>
                <Link to="/my-orders" className="hover:text-gold-300 transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-1.5 text-gold-400 font-semibold"
                >
                  <ShieldAlert className="w-4 h-4" /> Owner Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Product Highlights */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-lg font-bold text-gold-300 border-b border-gold-500/30 pb-2.5">
              Our Specialties
            </h4>
            <ul className="space-y-2.5 text-sm sm:text-base text-cream/90">
              <li className="flex items-center justify-between">
                <span>Jaggery Pootharekulu (6 Pcs)</span>
                <span className="font-bold text-gold-300 text-lg">₹180</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Jaggery Pootharekulu (12 Pcs)</span>
                <span className="font-bold text-gold-300 text-lg">₹349</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Dry Fruit Pootharekulu (6 Pcs)</span>
                <span className="font-bold text-gold-300 text-lg">₹180</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Dry Fruit Pootharekulu (12 Pcs)</span>
                <span className="font-bold text-gold-300 text-lg">₹349</span>
              </li>
            </ul>
            <p className="text-xs text-cream/70 italic pt-1">
              * Freshly prepared to order with pure desi cow ghee and organic jaggery.
            </p>
          </div>

          {/* Col 4: Business Contact & Location */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-lg font-bold text-gold-300 border-b border-gold-500/30 pb-2.5">
              Official Contact
            </h4>
            <div className="space-y-3 text-sm sm:text-base text-cream/90">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                <span>
                  Chandhana Residency, Kudlu Gate, Room No. 7, Electronic City,
                  Bengaluru, Karnataka - 560068.
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <a
                  href="tel:9441321874"
                  className="font-black text-ivory hover:text-gold-300 transition-colors text-lg"
                >
                  9441321874
                </a>
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/919441321874?text=Hi%20Sai%20Pootharekulu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold transition-colors min-h-[44px]"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp: 9441321874</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-gold-500/20 flex flex-col sm:flex-row items-center justify-between text-sm text-cream/70 gap-4">
          <div className="flex items-center gap-2">
            <LotusMotif className="w-5 h-5 text-gold-400" />
            <span>
              &copy; {new Date().getFullYear()} Sai Pootharekulu. All Rights Reserved.
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gold-300 font-medium">
            <span>Handcrafted with</span>
            <Heart className="w-4 h-4 text-red-400 fill-current" />
            <span>in Andhra & Bengaluru</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
