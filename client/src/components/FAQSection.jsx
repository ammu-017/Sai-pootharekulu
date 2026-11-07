import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { SectionDivider } from './TraditionalMotif';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'What is Pootharekulu and how is it prepared?',
      a: 'Pootharekulu (literally "coated sheets") is a renowned traditional sweet delicacy from Atreyapuram in Andhra Pradesh. An ultra-thin edible film is baked with rice batter on inverted hot earthen pots over woodfire, smeared with pure cow ghee, layered with organic bellam (jaggery) or roasted dry fruits, and folded into neat rolls.',
    },
    {
      q: 'How long does Sai Pootharekulu stay fresh?',
      a: 'When stored in an airtight container at room temperature away from direct moisture, our Pootharekulu retains its crispness and aroma for 15 to 20 days. We recommend not refrigerating them to preserve the delicate texture.',
    },
    {
      q: 'When are fresh batches prepared?',
      a: 'Fresh batches are handcrafted every weekend and available fresh from Sunday! We do not stock stale warehouse items; every box is prepared fresh to order.',
    },
    {
      q: 'Do you offer bulk delivery for marriages and corporate gifting?',
      a: 'Yes! We cater to weddings, family functions, housewarmings, and festive corporate gifting across Bengaluru and Pan-India. For custom bulk pricing, please call or WhatsApp us at 9441321874.',
    },
    {
      q: 'How are the sweets packaged for delivery?',
      a: 'Because Pootharekulu is delicate, each piece is carefully placed in food-grade wrapping and encased within rigid, heavy-duty gift boxes with protective cushioning to prevent breakage during transit.',
    },
  ];

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="py-20 bg-[#041f14] border-b border-gold-500/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionDivider
          title="Frequently Asked Questions"
          subtitle="Everything You Need to Know"
        />

        <div className="mt-10 space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#062b1c] border border-gold-500/30 overflow-hidden transition-all shadow-md"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between text-ivory hover:text-gold-300 transition-colors"
              >
                <span className="font-cinzel text-base sm:text-lg font-bold flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-gold-400 transition-transform duration-300 shrink-0 ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === idx && (
                <div className="px-6 pb-6 pt-2 text-base sm:text-lg text-cream/90 border-t border-gold-500/10 leading-relaxed font-sans">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
