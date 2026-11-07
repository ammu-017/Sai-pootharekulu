import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Smartphone,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { GoldCorner, LotusMotif } from './TraditionalMotif';
import api from '../services/api';

const UpiPaymentModal = ({
  isOpen,
  onClose,
  orderData,
  onPaymentSuccess,
}) => {
  if (!isOpen || !orderData) return null;

  const {
    orderId,
    totalPrice,
    upiDetails,
    customer,
    keyId,
    mode,
    razorpayOrderId,
  } = orderData;

  const merchantVpa = upiDetails?.merchantVpa || '9441321874@ybl';
  const merchantName = upiDetails?.merchantName || 'Sai Pootharekulu';
  const standardUpiUrl = upiDetails?.standardUpiUrl || `upi://pay?pa=${merchantVpa}&pn=Sai%20Pootharekulu&am=${totalPrice}&cu=INR&tr=${orderId}`;

  const [selectedApp, setSelectedApp] = useState('gpay'); // 'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'qr'
  const [upiRefNumber, setUpiRefNumber] = useState('');
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Copy VPA
  const handleCopyVpa = () => {
    navigator.clipboard.writeText(merchantVpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  // Launch UPI Deep Link
  const handleLaunchUpiApp = () => {
    let appUrl = standardUpiUrl;
    if (selectedApp === 'gpay' && upiDetails?.apps?.googlePay) {
      appUrl = upiDetails.apps.googlePay;
    } else if (selectedApp === 'phonepe' && upiDetails?.apps?.phonePe) {
      appUrl = upiDetails.apps.phonePe;
    } else if (selectedApp === 'paytm' && upiDetails?.apps?.paytm) {
      appUrl = upiDetails.apps.paytm;
    } else if (selectedApp === 'bhim' && upiDetails?.apps?.bhim) {
      appUrl = upiDetails.apps.bhim;
    }

    // Attempt to open deep link
    window.location.href = appUrl;
  };

  // Launch Razorpay standard modal if key is provided
  const handleLaunchRazorpayGateway = () => {
    if (window.Razorpay && keyId && keyId.startsWith('rzp_')) {
      const options = {
        key: keyId,
        amount: Math.round(totalPrice * 100),
        currency: 'INR',
        name: 'Sai Pootharekulu',
        description: `Order ${orderId}`,
        image: '/sai-pootharekulu-logo.jpg',
        order_id: razorpayOrderId,
        prefill: {
          name: customer?.name || '',
          email: customer?.email || '',
          contact: customer?.contact || '',
        },
        theme: {
          color: '#041f14',
        },
        handler: async function (response) {
          try {
            setVerifying(true);
            const verifyRes = await api.post('/payment/verify-payment', {
              orderId,
              paymentMethod: 'razorpay',
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              onPaymentSuccess(verifyRes.data);
            }
          } catch (err) {
            setErrorMessage(err.message || 'Payment signature verification failed.');
            setVerifying(false);
          }
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    }
  };

  // Verify Payment by UTR Number
  const handleVerifyUtr = async (e) => {
    e.preventDefault();
    if (!upiRefNumber || upiRefNumber.trim().length < 6) {
      setErrorMessage('Please enter a valid UPI UTR / Transaction Reference Number (min 6 digits).');
      return;
    }

    setVerifying(true);
    setErrorMessage('');

    try {
      const verifyRes = await api.post('/payment/verify-payment', {
        orderId,
        paymentMethod: 'merchant_upi',
        upiRefNumber: upiRefNumber.trim(),
        selectedUpiApp: selectedApp.toUpperCase(),
      });

      if (verifyRes.data.success) {
        onPaymentSuccess(verifyRes.data);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Payment verification failed. Please check your UTR number.');
      setVerifying(false);
    }
  };

  // Dynamic QR Code generation with exact payment intent
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    standardUpiUrl
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#062b1c] border-2 border-gold-500/60 shadow-2xl overflow-hidden my-8">
        <GoldCorner position="top-left" />
        <GoldCorner position="top-right" />

        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-[#02130c] via-[#062b1c] to-[#02130c] border-b border-gold-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-gold-500 to-gold-200 shadow-gold">
              <img
                src="/sai-pootharekulu-logo.jpg"
                alt="Sai Pootharekulu"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-cinzel text-xl font-bold text-ivory">
                Sai Pootharekulu UPI Payment
              </h3>
              <span className="text-xs text-gold-300 font-medium">
                Order ID: <strong>{orderId}</strong> • Verified Merchant
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-gold-400 hover:text-white hover:bg-emerald-900 transition-colors"
            aria-label="Close Payment Modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Amount Banner */}
        <div className="p-5 bg-[#02130c] text-center border-b border-gold-500/20">
          <span className="text-xs text-cream/70 uppercase tracking-widest block font-medium">
            Total Payable Amount
          </span>
          <span className="font-cinzel text-3xl sm:text-4xl font-black gold-text block my-1">
            ₹{totalPrice}
          </span>
          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Merchant: {merchantName} ({merchantVpa})</span>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-950/90 border border-red-500 text-red-200 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* UPI Application Selector */}
          <div>
            <label className="block text-base font-semibold text-gold-300 mb-2">
              Select Your Preferred UPI Payment Option:
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {/* Google Pay */}
              <button
                type="button"
                onClick={() => setSelectedApp('gpay')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  selectedApp === 'gpay'
                    ? 'border-gold-400 bg-emerald-900 shadow-gold'
                    : 'border-gold-500/30 bg-[#02130c] hover:border-gold-500/60'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-bold text-blue-600 text-sm shadow">
                  G
                </div>
                <span className="text-xs sm:text-sm font-semibold text-ivory">Google Pay</span>
              </button>

              {/* PhonePe */}
              <button
                type="button"
                onClick={() => setSelectedApp('phonepe')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  selectedApp === 'phonepe'
                    ? 'border-gold-400 bg-emerald-900 shadow-gold'
                    : 'border-gold-500/30 bg-[#02130c] hover:border-gold-500/60'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-[#5f259f] flex items-center justify-center font-bold text-white text-xs shadow">
                  Pe
                </div>
                <span className="text-xs sm:text-sm font-semibold text-ivory">PhonePe</span>
              </button>

              {/* Paytm */}
              <button
                type="button"
                onClick={() => setSelectedApp('paytm')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  selectedApp === 'paytm'
                    ? 'border-gold-400 bg-emerald-900 shadow-gold'
                    : 'border-gold-500/30 bg-[#02130c] hover:border-gold-500/60'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-[#00b9f5] flex items-center justify-center font-bold text-white text-xs shadow">
                  Paytm
                </div>
                <span className="text-xs sm:text-sm font-semibold text-ivory">Paytm</span>
              </button>

              {/* BHIM UPI */}
              <button
                type="button"
                onClick={() => setSelectedApp('bhim')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  selectedApp === 'bhim'
                    ? 'border-gold-400 bg-emerald-900 shadow-gold'
                    : 'border-gold-500/30 bg-[#02130c] hover:border-gold-500/60'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-orange-500 to-green-600 flex items-center justify-center font-bold text-white text-xs shadow">
                  UPI
                </div>
                <span className="text-xs sm:text-sm font-semibold text-ivory">BHIM UPI</span>
              </button>

              {/* Scan Dynamic QR */}
              <button
                type="button"
                onClick={() => setSelectedApp('qr')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 col-span-2 sm:col-span-1 ${
                  selectedApp === 'qr'
                    ? 'border-gold-400 bg-emerald-900 shadow-gold'
                    : 'border-gold-500/30 bg-[#02130c] hover:border-gold-500/60'
                }`}
              >
                <QrCode className="w-9 h-9 text-gold-400" />
                <span className="text-xs sm:text-sm font-semibold text-ivory">Scan QR</span>
              </button>
            </div>
          </div>

          {/* Tab Content A: Deep Link Button for Mobile / Chosen App */}
          {selectedApp !== 'qr' ? (
            <div className="p-5 rounded-2xl bg-[#02130c] border border-gold-500/30 space-y-4 text-center">
              <span className="text-base text-cream/90 block">
                Click below to launch <strong>{selectedApp.toUpperCase()}</strong> directly with ₹{totalPrice} pre-filled:
              </span>

              <button
                type="button"
                onClick={handleLaunchUpiApp}
                className="w-full py-4 px-6 rounded-xl font-cinzel text-base sm:text-lg font-bold text-[#041f14] bg-gradient-to-r from-gold-400 via-gold-200 to-gold-500 shadow-gold hover:shadow-gold-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="w-5 h-5 text-[#041f14]" />
                <span>Open {selectedApp.toUpperCase()} & Pay ₹{totalPrice}</span>
                <ExternalLink className="w-4 h-4 text-[#041f14]" />
              </button>

              {/* Merchant VPA details */}
              <div className="pt-2 flex items-center justify-center gap-2 text-sm text-cream/80">
                <span>Or pay to VPA: <strong className="text-gold-300">{merchantVpa}</strong></span>
                <button
                  type="button"
                  onClick={handleCopyVpa}
                  className="p-1.5 rounded-lg bg-emerald-900 text-gold-400 hover:text-white"
                  title="Copy UPI ID"
                >
                  {copiedVpa ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ) : (
            /* Tab Content B: Dynamic UPI QR Code */
            <div className="p-5 rounded-2xl bg-[#02130c] border border-gold-500/30 text-center space-y-3">
              <div className="inline-block p-3 bg-white rounded-2xl shadow-xl">
                <img
                  src={qrCodeUrl}
                  alt="UPI QR Code for Sai Pootharekulu"
                  className="w-44 h-44 sm:w-52 sm:h-52 object-contain"
                />
              </div>
              <p className="text-sm sm:text-base text-cream/90">
                Scan with <strong>Google Pay, PhonePe, Paytm, BHIM</strong> or any UPI banking app.
              </p>
              <div className="text-sm text-gold-300 font-bold">
                Amount Locked: ₹{totalPrice} • Payee: {merchantVpa}
              </div>
            </div>
          )}

          {/* Step 2: Confirm Payment by Entering UTR / Reference Number */}
          <form onSubmit={handleVerifyUtr} className="space-y-4 pt-2 border-t border-gold-500/20">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-base font-semibold text-gold-300">
                  Step 2: Enter UPI Ref / UTR Number *
                </label>
                <span className="text-xs sm:text-sm text-cream/70">12-digit number from UPI screen</span>
              </div>
              <input
                type="text"
                value={upiRefNumber}
                onChange={(e) => setUpiRefNumber(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                placeholder="E.g., 431289567123"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#02130c] border border-gold-500/40 text-ivory text-base tracking-wider focus:outline-none focus:border-gold-400 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="w-full py-4 px-6 rounded-xl font-cinzel text-base sm:text-lg font-bold text-[#041f14] bg-gradient-to-r from-gold-400 via-gold-200 to-gold-500 shadow-gold hover:shadow-gold-lg hover:scale-[1.01] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {verifying ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#041f14] border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Payment with Server...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#041f14]" />
                  <span>Verify Payment & Place Order</span>
                </>
              )}
            </button>
          </form>

          {/* Optional Gateway Modal Switch */}
          {keyId && keyId.startsWith('rzp_') && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleLaunchRazorpayGateway}
                className="text-xs font-semibold text-gold-300 hover:text-white underline inline-flex items-center gap-1"
              >
                <span>Or pay via Razorpay Cards/NetBanking Gateway</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-3.5 bg-[#02130c] border-t border-gold-500/20 text-center">
          <p className="text-xs sm:text-sm text-cream/70">
            🔒 Payments are verified securely on our server. An automatic WhatsApp notification will be sent to owner <strong>9441321874</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpiPaymentModal;
