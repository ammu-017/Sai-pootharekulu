import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { GoldCorner } from '../components/TraditionalMotif';
import api from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: verify email, 2: set new password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your registered email.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setStep(2);
        setMessage('Account located. Please enter your new password.');
      }
    } catch (err) {
      setError(err.message || 'Email not found in our database.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/auth/forgot-password', {
        email,
        newPassword,
        confirmPassword,
      });
      if (res.data.success) {
        setStep(3);
        setMessage(res.data.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#02130c] via-[#041f14] to-[#062b1c]">
      <div className="max-w-md w-full relative">
        <div className="relative rounded-2xl bg-[#062b1c] border border-gold-500/40 p-8 shadow-2xl">
          <GoldCorner position="top-left" />
          <GoldCorner position="top-right" />

          <div className="text-center mb-6">
            <h2 className="font-cinzel text-2xl font-bold text-ivory">
              Reset Your Password
            </h2>
            <p className="font-traditional text-gold-300 italic text-sm mt-1">
              Sai Pootharekulu Account Security
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs text-center">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{message}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleVerifyEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-300 mb-1">
                  Registered Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your registered email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#02130c] border border-gold-500/30 text-ivory text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-cinzel text-sm font-bold text-[#041f14] bg-gold-gradient-bg shadow-gold hover:scale-[1.01] transition-all disabled:opacity-60"
              >
                {loading ? 'Verifying Account...' : 'Continue'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-300 mb-1">
                  New Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#02130c] border border-gold-500/30 text-ivory text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-300 mb-1">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#02130c] border border-gold-500/30 text-ivory text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-cinzel text-sm font-bold text-[#041f14] bg-gold-gradient-bg shadow-gold hover:scale-[1.01] transition-all disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Update Password'}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-4 space-y-4">
              <p className="text-xs text-cream/80">
                Your password has been reset successfully. You can now log in with your updated credentials.
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-2.5 rounded-xl bg-gold-gradient-bg text-[#041f14] font-cinzel text-sm font-bold"
              >
                Back to Login
              </Link>
            </div>
          )}

          <div className="mt-6 text-center border-t border-gold-500/20 pt-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-gold-300 hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

