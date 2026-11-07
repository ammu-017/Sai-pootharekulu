import React from 'react';
import { Star, Quote } from 'lucide-react';
import { SectionDivider, GoldCorner } from './TraditionalMotif';

const TestimonialsSection = () => {
  const reviews = [
    {
      name: 'Venkatesh Rao',
      location: 'Bengaluru (HSR Layout)',
      rating: 5,
      review:
        'The authentic taste of Atreyapuram Pootharekulu right here in Bengaluru! The paper is so delicate, and you can smell the pure cow ghee as soon as you open the box. Highly recommended for gifting!',
      sweet: 'Dry Fruit Pootharekulu – 12 Pieces',
    },
    {
      name: 'Sravani Chowdary',
      location: 'Hyderabad / Electronic City',
      rating: 5,
      review:
        'Ordered the Jaggery (Bellam) box for our family Diwali celebration. It brought back childhood memories. Perfectly balanced sweetness with rich cardamom and ghee. Arrived super fresh without any damage.',
      sweet: 'Jaggery Pootharekulu – 6 Pieces',
    },
    {
      name: 'Kiran Kumar Reddy',
      location: 'Bengaluru (Kudlu Gate)',
      rating: 5,
      review:
        'Living near Kudlu Gate, I visited and ordered directly. The owner is very polite and passionate about traditional recipes. The loaded dry fruits variety is simply royal!',
      sweet: 'Dry Fruit Pootharekulu – 12 Pieces',
    },
  ];

  return (
    <section className="py-20 bg-[#02130c] border-b border-gold-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionDivider
          title="Customer Delight"
          subtitle="Loved Across South India"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="relative p-6 sm:p-8 rounded-3xl bg-[#062b1c] border border-gold-500/30 hover:border-gold-400/70 hover:shadow-gold transition-all duration-300 flex flex-col justify-between"
            >
              <GoldCorner position="top-right" />

              <div>
                <Quote className="w-9 h-9 text-gold-400/50 mb-3" />
                <div className="flex items-center gap-1.5 mb-3.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold-400 fill-current" />
                  ))}
                </div>
                <p className="font-traditional italic text-base sm:text-lg text-cream/95 leading-relaxed mb-6">
                  "{rev.review}"
                </p>
              </div>

              <div className="pt-4 border-t border-gold-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-cinzel text-base sm:text-lg font-bold text-ivory">
                    {rev.name}
                  </h4>
                  <span className="text-sm text-gold-300 block">
                    {rev.location}
                  </span>
                </div>
                <span className="text-xs sm:text-sm px-3 py-1 rounded-full bg-emerald-950 text-gold-200 border border-gold-500/30 font-medium">
                  {rev.sweet}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
