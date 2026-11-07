import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoldCorner } from '../components/TraditionalMotif';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(formData.email.trim(), formData.password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#02130c] via-[#041f14] to-[#062b1c]">
      <div className="max-w-lg w-full relative">
        <div className="absolute -inset-1.5 bg-gradient-to-r from-gold-600 via-gold-300 to-gold-600 rounded-3xl blur opacity-30 pointer-events-none" />

        <div className="relative rounded-3xl bg-[#062b1c] border-2 border-gold-500/40 p-8 sm:p-10 shadow-2xl">
          <GoldCorner position="top-left" />
          <GoldCorner position="top-right" />

          {/* Header (28px–36px) */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 rounded-full p-0.5 bg-gradient-to-tr from-gold-500 to-gold-200 mb-4 shadow-gold">
              <img
                src="/sai-pootharekulu-logo.jpg"
                alt="Sai Pootharekulu"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-ivory">
              Welcome Back
            </h2>
            <p className="font-traditional text-gold-300 italic text-base sm:text-lg mt-1.5">
              Sign in to order your favorite Andhra Pootharekulu
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-base text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Address (16px label & input) */}
            <div>
              <label className="block text-base font-semibold uppercase tracking-wider text-gold-300 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gold-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#02130c] border border-gold-500/40 text-ivory text-base focus:outline-none focus:border-gold-400 min-h-[48px]"
                />
              </div>
            </div>

            {/* Password (16px label & input) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-base font-semibold uppercase tracking-wider text-gold-300">
                  Password *
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-gold-400 font-semibold hover:text-white underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gold-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-[#02130c] border border-gold-500/40 text-ivory text-base focus:outline-none focus:border-gold-400 min-h-[48px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gold-400 hover:text-gold-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button (16px–18px bold, min-h-[48px]) */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-xl font-cinzel text-base sm:text-lg font-bold text-[#041f14] bg-gradient-to-r from-gold-400 via-gold-200 to-gold-500 shadow-gold hover:shadow-gold-lg hover:scale-[1.01] transition-all disabled:opacity-60 flex items-center justify-center gap-2.5 min-h-[50px]"
              >
                <LogIn className="w-5 h-5" />
                <span>{loading ? 'Signing In...' : 'Login to Store'}</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Help */}
          <div className="mt-5 p-3.5 rounded-xl bg-emerald-950/80 border border-gold-500/30 text-xs sm:text-sm text-cream/90 text-center">
            <span className="text-gold-300 font-bold block mb-1">Admin Demo Account:</span>
            admin@saipootharekulu.com / admin123
          </div>

          {/* Switch to Sign Up */}
          <div className="mt-6 text-center text-base text-cream/80 border-t border-gold-500/20 pt-4">
            <span>Don't have an account? </span>
            <Link to="/signup" className="font-bold text-gold-300 hover:text-white underline">
              Create a New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
