import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Phone, Sparkles, CheckCircle2 } from 'lucide-react';
import { LotusMotif, GoldCorner } from './TraditionalMotif';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#02130c] via-[#041f14] to-[#073522] py-16 lg:py-24 border-b border-gold-500/20">
      <div className="absolute inset-0 opacity-10 pointer-events-none traditional-pattern" />

      {/* Ambient gold glow elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, Tagline, Story & Call-to-actions */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Top Traditional Pill */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-emerald-950/90 border border-gold-500/50 shadow-gold">
              <LotusMotif className="w-5 h-5 text-gold-400" />
              <span className="text-sm font-bold tracking-wider text-gold-300 uppercase">
                Authentic Andhra Delicacy • Fresh Batches
              </span>
            </div>

            {/* Main Brand Title (36px - 60px) */}
            <div className="space-y-2">
              <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-black tracking-wide text-ivory leading-tight">
                Sai <span className="gold-text">Pootharekulu</span>
              </h1>
              <p className="font-traditional italic text-2xl sm:text-3xl text-gold-300 font-semibold tracking-wide">
                Traditional Taste... Timeless Delight...
              </p>
            </div>

            {/* Description (16px–18px body text) */}
            <p className="font-sans text-base sm:text-lg text-cream/95 max-w-2xl leading-relaxed">
              Experience the authentic taste of traditional Andhra Pootharekulu,
              freshly prepared with pure ghee, jaggery, and premium dry fruits. Delicate,
              crisp wafer-thin rice starch layers melting effortlessly on your palate.
            </p>

            {/* Key Quality Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-2 pb-2">
              <div className="flex items-center gap-2.5 bg-emerald-900/70 p-3 rounded-xl border border-gold-500/30">
                <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <span className="text-sm sm:text-base font-semibold text-ivory">Pure Desi Ghee</span>
              </div>
              <div className="flex items-center gap-2.5 bg-emerald-900/70 p-3 rounded-xl border border-gold-500/30">
                <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <span className="text-sm sm:text-base font-semibold text-ivory">Organic Bellam</span>
              </div>
              <div className="flex items-center gap-2.5 bg-emerald-900/70 p-3 rounded-xl border border-gold-500/30 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <span className="text-sm sm:text-base font-semibold text-ivory">Loaded Dry Fruits</span>
              </div>
            </div>

            {/* Buttons: Order Now & Explore Menu (16px–18px bold, min-h-[52px]) */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-cinzel text-base sm:text-lg font-bold text-[#041f14] bg-gradient-to-r from-gold-400 via-gold-200 to-gold-500 shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300 min-h-[52px]"
              >
                <ShoppingBag className="w-5 h-5 text-[#041f14]" />
                <span>Order Now</span>
                <ArrowRight className="w-5 h-5 text-[#041f14]" />
              </Link>

              <a
                href="#menu-section"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-cinzel text-base sm:text-lg font-semibold text-gold-300 border-2 border-gold-500/60 hover:bg-gold-500/10 hover:border-gold-400 transition-all duration-300 min-h-[52px]"
              >
                <span>Explore Menu</span>
              </a>
            </div>

            {/* Direct Phone Order Pill */}
            <div className="pt-2">
              <a
                href="tel:9441321874"
                className="inline-flex items-center gap-3.5 px-6 py-3 rounded-2xl bg-emerald-950/90 border border-gold-500/40 text-gold-300 hover:text-white hover:border-gold-400 transition-all"
              >
                <div className="p-2 rounded-full bg-gold-500 text-[#041f14]">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-xs uppercase tracking-wider block text-gold-400/90 font-bold">
                    Direct Phone / WhatsApp Order
                  </span>
                  <span className="text-lg sm:text-xl font-bold font-sans text-ivory">
                    9441321874
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Promotional Poster Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-md w-full">
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-gold-600 via-gold-300 to-gold-700 opacity-75 blur-sm group-hover:opacity-100 transition duration-500" />

              <div className="relative rounded-3xl overflow-hidden bg-[#02130c] border-2 border-gold-400/80 shadow-2xl">
                <GoldCorner position="top-left" />
                <GoldCorner position="top-right" />
                <GoldCorner position="bottom-left" />
                <GoldCorner position="bottom-right" />

                {/* Poster Image */}
                <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden">
                  <img
                    src="/sai-pootharekulu-poster.jpg"
                    alt="Sai Pootharekulu Promotional Poster"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#02130c] via-transparent to-transparent opacity-60" />
                </div>

                {/* Poster Bottom Card Banner */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-[#062b1c] via-[#083a26] to-[#062b1c] border-t border-gold-500/40 text-center">
                  <div className="flex items-center justify-between text-sm font-bold text-gold-300 mb-1.5">
                    <span className="bg-emerald-950 px-3 py-1.5 rounded-full border border-gold-500/40">
                      Box of 6 Pcs – ₹180/-
                    </span>
                    <span className="bg-emerald-950 px-3 py-1.5 rounded-full border border-gold-500/40">
                      Box of 12 Pcs – ₹349/-
                    </span>
                  </div>
                  <p className="text-sm text-cream/90 italic mt-1 font-traditional">
                    Handmade fresh every week with 100% pure desi ghee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
