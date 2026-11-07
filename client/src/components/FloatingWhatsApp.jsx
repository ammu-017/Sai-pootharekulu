import React, { useState } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';

const FloatingWhatsApp = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  const ownerPhone = '9441321874';
  const whatsappUrl = `https://wa.me/91${ownerPhone}?text=${encodeURIComponent(
    'Hi Sai Pootharekulu! I would like to inquire about ordering authentic Pootharekulu.'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Speech bubble tooltip */}
      {showTooltip && (
        <div className="mb-2 mr-1 bg-[#062b1c] border border-gold-400/60 text-ivory text-xs px-3.5 py-2 rounded-2xl shadow-gold max-w-[200px] relative animate-float">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-1.5 -right-1.5 bg-emerald-950 text-gold-400 hover:text-white rounded-full p-0.5 border border-gold-500/40"
            aria-label="Close message"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="flex items-center gap-1.5 text-gold-300 font-bold mb-0.5">
            <Sparkles className="w-3 h-3 text-gold-400" />
            <span>Order on WhatsApp</span>
          </div>
          <p className="text-[11px] text-cream/80 leading-tight">
            Chat directly with us at <strong>9441321874</strong>
          </p>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-700 via-emerald-600 to-emerald-500 text-white shadow-gold-lg hover:scale-110 transition-all duration-300 border-2 border-gold-400"
        aria-label="Direct WhatsApp Order: 9441321874"
        title="Direct WhatsApp Order: 9441321874"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gold-500" />
        </span>
        <MessageCircle className="w-7 h-7 text-white fill-current group-hover:rotate-12 transition-transform" />
      </a>
    </div>
  );
};

export default FloatingWhatsApp;

