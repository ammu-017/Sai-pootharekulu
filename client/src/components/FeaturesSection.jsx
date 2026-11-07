import React from 'react';
import { Sparkles, ShieldCheck, Heart, Truck } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-gold-400" />,
      title: 'Fresh From Sunday Batches',
      desc: 'Crafted fresh every weekend to ensure maximum crispness, aroma, and melt-in-the-mouth texture.',
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-gold-400" />,
      title: '100% Pure Desi Ghee',
      desc: 'No dalda, no palm oil, and no artificial substitutes. Only rich pure cow ghee in every single roll.',
    },
    {
      icon: <Heart className="w-8 h-8 text-gold-400" />,
      title: 'Zero Artificial Additives',
      desc: 'Purely natural ingredients — rice paper, organic bellam jaggery, cardamom, and premium dry fruits.',
    },
    {
      icon: <Truck className="w-8 h-8 text-gold-400" />,
      title: 'Fast & Secure Delivery',
      desc: 'Carefully packed in sturdy protective food-grade gift boxes to prevent any crushing during transit.',
    },
  ];

  return (
    <section className="py-14 bg-[#041f14] border-y border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-3xl bg-[#062b1c] border-2 border-gold-500/30 text-center hover:border-gold-400 hover:shadow-gold transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-gold-400/40 mx-auto flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h4 className="font-cinzel text-lg sm:text-xl font-bold text-ivory mb-2">
                {feature.title}
              </h4>
              <p className="font-sans text-sm sm:text-base text-cream/85 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
