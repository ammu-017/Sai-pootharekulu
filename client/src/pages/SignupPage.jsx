import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoldCorner } from '../components/TraditionalMotif';

const SignupPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const validate = () => {
    if (!formData.name.trim()) return 'Please enter your full name.';
    if (!formData.email.trim()) return 'Please enter your email address.';
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return 'Please enter a valid email address.';
    }
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 10) {
      return 'Please enter a valid 10-digit mobile number.';
    }
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Password and Confirm Password do not match.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      navigate('/menu');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#02130c] via-[#041f14] to-[#062b1c]">
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
              Create an Account
            </h2>
            <p className="font-traditional text-gold-300 italic text-base sm:text-lg mt-1.5">
              Join Sai Pootharekulu for Authentic Andhra Sweets
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-base text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name (16px label & input) */}
            <div>
              <label className="block text-base font-semibold uppercase tracking-wider text-gold-300 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gold-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#02130c] border border-gold-500/40 text-ivory text-base focus:outline-none focus:border-gold-400 min-h-[48px]"
                />
              </div>
            </div>

            {/* Email Address */}
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

            {/* Phone Number */}
            <div>
              <label className="block text-base font-semibold uppercase tracking-wider text-gold-300 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gold-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="10-digit mobile number"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#02130c] border border-gold-500/40 text-ivory text-base focus:outline-none focus:border-gold-400 min-h-[48px]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-base font-semibold uppercase tracking-wider text-gold-300 mb-2">
                Password *
              </label>
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
                  placeholder="At least 6 characters"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-base font-semibold uppercase tracking-wider text-gold-300 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gold-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Re-enter your password"
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-[#02130c] border border-gold-500/40 text-ivory text-base focus:outline-none focus:border-gold-400 min-h-[48px]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gold-400 hover:text-gold-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Create Account Button (16px–18px, min-h-[50px]) */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-xl font-cinzel text-base sm:text-lg font-bold text-[#041f14] bg-gradient-to-r from-gold-400 via-gold-200 to-gold-500 shadow-gold hover:shadow-gold-lg hover:scale-[1.01] transition-all disabled:opacity-60 min-h-[50px]"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center text-base text-cream/80 border-t border-gold-500/20 pt-4">
            <span>Already have an account? </span>
            <Link to="/login" className="font-bold text-gold-300 hover:text-white underline">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
