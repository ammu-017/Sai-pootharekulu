import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  MapPin,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { SectionDivider, GoldCorner } from './TraditionalMotif';
import api from '../services/api';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.post('/contact', formData);
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'General Inquiry',
          message: '',
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit form. Please call 9441321874.');
    } finally {
      setLoading(false);
    }
  };

  const googleMapsUrl =
    'https://www.google.com/maps/search/?api=1&query=Chandhana+Residency+Kudlu+Gate+Electronic+City+Bengaluru';

  const whatsappUrl =
    'https://wa.me/919441321874?text=Hi%20Sai%20Pootharekulu,%20I%20would%20like%20to%20order%20authentic%20Pootharekulu';

  return (
    <section id="contact" className="py-20 bg-[#041f14] relative border-b border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionDivider
          title="Visit Us & Order Directly"
          subtitle="Customer Service & Inquiries"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12 items-start">
          {/* Left Column: Official Business Details & Map */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#062b1c] border-2 border-gold-500/40 shadow-emerald-card relative overflow-hidden">
              <GoldCorner position="top-left" />
              <GoldCorner position="top-right" />

              <h3 className="font-cinzel text-2xl sm:text-3xl font-black text-ivory mb-2">
                Sai Pootharekulu
              </h3>
              <p className="font-traditional text-gold-300 italic text-base sm:text-lg mb-8">
                Freshly Handcrafted Sweets in Electronic City, Bengaluru
              </p>

              <div className="space-y-6">
                {/* Clickable Phone Number (18px-22px) */}
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-950 border border-gold-500/40 text-gold-400">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-gold-400 font-bold mb-0.5">
                      Official Contact Number
                    </span>
                    <a
                      href="tel:9441321874"
                      className="text-xl sm:text-2xl font-black font-sans text-ivory hover:text-gold-300 transition-colors inline-block"
                    >
                      9441321874
                    </a>
                    <span className="block text-sm text-cream/80 mt-0.5">
                      (Tap to call immediately for quick direct orders)
                    </span>
                  </div>
                </div>

                {/* WhatsApp Quick Chat */}
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-950 border border-gold-500/40 text-emerald-400">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-gold-400 font-bold mb-1">
                      WhatsApp Messaging & Order
                    </span>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white text-base font-bold transition-all shadow-md min-h-[44px]"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Chat on WhatsApp: 9441321874
                    </a>
                  </div>
                </div>

                {/* Clickable Official Address */}
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-950 border border-gold-500/40 text-gold-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-gold-400 font-bold mb-1">
                      Official Business Address
                    </span>
                    <p className="text-base font-medium text-ivory leading-relaxed">
                      Chandhana Residency, Kudlu Gate, Room No. 7, Electronic City,
                      Bengaluru, Karnataka - 560068.
                    </p>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-gold-300 hover:text-white mt-2 hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open Location in Google Maps
                    </a>
                  </div>
                </div>

                {/* Preparation Schedule */}
                <div className="flex items-start gap-4 pt-3 border-t border-gold-500/20">
                  <div className="p-3.5 rounded-2xl bg-emerald-950 border border-gold-500/40 text-gold-400">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-gold-400 font-bold mb-0.5">
                      Fresh Batch Preparation Schedule
                    </span>
                    <p className="text-base text-cream/90">
                      Fresh batches available from <strong>Sunday</strong> every week. Orders
                      accepted 24/7 online.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Google Maps Container */}
            <div className="rounded-2xl overflow-hidden border-2 border-gold-500/40 shadow-lg bg-[#02130c]">
              <div className="bg-[#02130c] px-5 py-3 text-sm font-semibold text-gold-300 flex items-center justify-between border-b border-gold-500/20">
                <span>📍 Kudlu Gate, Electronic City, Bengaluru</span>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1.5"
                >
                  View Large Map <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <iframe
                title="Sai Pootharekulu Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15557.067307997523!2d77.64332924999999!3d12.890637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae14b986e72b49%3A0xb35359a35e80dcfe!2sKudlu%20Gate%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="240"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form (16px labels & inputs, min-h-[48px]) */}
          <div className="lg:col-span-6">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#062b1c] border-2 border-gold-500/40 shadow-emerald-card relative">
              <GoldCorner position="top-right" />
              <GoldCorner position="bottom-left" />

              <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-ivory mb-2">
                Send Us a Message
              </h3>
              <p className="font-sans text-base text-cream/80 mb-8">
                Have bulk order requirements, festival gifting queries, or custom pack requests?
                Send us a message below.
              </p>

              {successMsg && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-900/80 border border-emerald-400 text-emerald-200 text-base flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-base">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-base font-semibold uppercase tracking-wider text-gold-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#02130c] border border-gold-500/40 text-ivory text-base focus:outline-none focus:border-gold-400 min-h-[48px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold uppercase tracking-wider text-gold-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3.5 rounded-xl bg-[#02130c] border border-gold-500/40 text-ivory text-base focus:outline-none focus:border-gold-400 min-h-[48px]"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold uppercase tracking-wider text-gold-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-3.5 rounded-xl bg-[#02130c] border border-gold-500/40 text-ivory text-base focus:outline-none focus:border-gold-400 min-h-[48px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-semibold uppercase tracking-wider text-gold-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="E.g., Bulk Wedding Order / Festival Gifting"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#02130c] border border-gold-500/40 text-ivory text-base focus:outline-none focus:border-gold-400 min-h-[48px]"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold uppercase tracking-wider text-gold-300 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Write your message or inquiry here..."
                    className="w-full px-4 py-3.5 rounded-xl bg-[#02130c] border border-gold-500/40 text-ivory text-base focus:outline-none focus:border-gold-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl font-cinzel text-base sm:text-lg font-bold text-[#041f14] bg-gradient-to-r from-gold-400 via-gold-200 to-gold-500 shadow-gold hover:shadow-gold-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 min-h-[50px]"
                >
                  <Send className="w-5 h-5 text-[#041f14]" />
                  <span>{loading ? 'Submitting Message...' : 'Send Inquiry'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
