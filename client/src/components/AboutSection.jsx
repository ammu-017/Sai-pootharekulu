import React from 'react';
import { SectionDivider, GoldCorner, LotusMotif } from './TraditionalMotif';
import { Flame, Award, HeartHandshake, ShieldCheck, Sparkles, Gem } from 'lucide-react';

const AboutSection = () => {
  const highlights = [
    {
      icon: <Award className="w-7 h-7 text-gold-400" />,
      title: 'Authentic Traditional Taste',
      desc: 'Originating from Atreyapuram in East Godavari, prepared using time-honored artisanal culinary techniques passed down generations.',
    },
    {
      icon: <Gem className="w-7 h-7 text-gold-400" />,
      title: 'Quality Ingredients',
      desc: 'Selected rice grains, premium grade dry fruits, natural jaggery, and pure farm fresh ingredients with zero adulteration.',
    },
    {
      icon: <Flame className="w-7 h-7 text-gold-400" />,
      title: 'Pure Ghee and Jaggery',
      desc: 'Rich aromatic desi ghee paired harmoniously with unrefined organic Andhra bellam (jaggery) for genuine sweetness.',
    },
    {
      icon: <Sparkles className="w-7 h-7 text-gold-400" />,
      title: 'Premium Dry Fruits',
      desc: 'Generously loaded with roasted cashew nuts (kaju), almonds (badam), and hand-picked pistachios (pista).',
    },
    {
      icon: <HeartHandshake className="w-7 h-7 text-gold-400" />,
      title: 'Freshly Prepared Sweets',
      desc: 'Handcrafted fresh in small batches every week. Zero stale warehouse stock — each box delivers peak freshness and crispness.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-[#02130c] relative border-b border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionDivider
          title="The Heritage of Pootharekulu"
          subtitle="Our Tradition & Passion"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mt-12">
          {/* Left Column: Brand Story Card */}
          <div className="lg:col-span-6 relative">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#062b1c] border-2 border-gold-500/40 shadow-emerald-card relative overflow-hidden">
              <GoldCorner position="top-left" />
              <GoldCorner position="top-right" />
              <GoldCorner position="bottom-left" />
              <GoldCorner position="bottom-right" />

              <div className="flex items-center gap-3.5 mb-6">
                <LotusMotif className="w-9 h-9 text-gold-400" />
                <span className="font-cinzel text-2xl font-black gold-text">
                  Sai Pootharekulu
                </span>
              </div>

              {/* Exact Description required with high readability */}
              <blockquote className="font-traditional text-2xl sm:text-3xl text-ivory italic leading-relaxed border-l-4 border-gold-400 pl-5 mb-6">
                "Sai Pootharekulu brings you the authentic traditional taste of Andhra Pradesh.
                Prepared with love using quality ingredients, pure ghee, jaggery, and premium dry
                fruits, every piece delivers a delightful traditional experience."
              </blockquote>

              <p className="font-sans text-base sm:text-lg text-cream/90 leading-relaxed mb-4">
                Pootharekulu (literally <em>"coated sheets"</em>) is one of India's most extraordinary
                culinary marvels. A gossamer-thin edible rice starch film is skillfully baked on
                inverted earthen pots heated with woodfire. The delicate sheet is then generously basted
                with molten pure desi ghee, layered with organic bellam or finely crushed dry fruits,
                and folded into neat silken sweet scrolls.
              </p>

              <div className="mt-6 pt-6 border-t border-gold-500/20 flex items-center justify-between">
                <div>
                  <span className="block text-xs uppercase tracking-widest text-gold-400 font-bold">
                    Artisanal Standard
                  </span>
                  <span className="text-base font-bold text-ivory">
                    100% Pure Desi Ghee & Bellam
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-xs uppercase tracking-widest text-gold-400 font-bold">
                    Freshness Promise
                  </span>
                  <span className="text-base font-bold text-ivory">
                    Handcrafted Weekly
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Highlights Grid (16px–18px body, 18px–20px headings) */}
          <div className="lg:col-span-6 space-y-5">
            <h3 className="font-cinzel text-2xl sm:text-3xl font-black text-ivory mb-5">
              Why Choose <span className="gold-text">Sai Pootharekulu</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className={`p-5 rounded-2xl bg-[#041f14] border-2 border-gold-500/30 hover:border-gold-400 transition-all duration-300 ${
                    index === 0 ? 'sm:col-span-2' : ''
                  }`}
                >
                  <div className="p-3 rounded-xl bg-emerald-950 inline-block border border-gold-500/40 mb-3">
                    {item.icon}
                  </div>
                  <h4 className="font-cinzel text-lg font-bold text-gold-200 mb-1.5">
                    {item.title}
                  </h4>
                  <p className="font-sans text-sm sm:text-base text-cream/80 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
