import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  User,
  LogOut,
  Menu as MenuIcon,
  X,
  Phone,
  ShieldAlert,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { LotusMotif } from './TraditionalMotif';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemsCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop / Menu', path: '/menu' },
    { name: 'About Us', path: '/#about' },
    { name: 'Contact Us', path: '/#contact' },
    ...(isAuthenticated ? [{ name: 'My Orders', path: '/my-orders' }] : []),
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Heritage Gold Bar */}
      <div className="bg-gradient-to-r from-[#946f20] via-[#fcf6ba] to-[#946f20] text-[#041f14] py-1.5 px-4 text-sm sm:text-base font-medium text-center flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5 font-bold tracking-wider">
          <Sparkles className="w-4 h-4" /> Authentic Andhra Pootharekulu | Fresh Batches Every Sunday
        </span>
        <span className="hidden sm:inline">|</span>
        <a
          href="tel:9441321874"
          className="hidden sm:flex items-center gap-1.5 font-extrabold hover:underline"
        >
          <Phone className="w-4 h-4" /> 9441321874
        </a>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-[#041f14]/95 backdrop-blur-md border-b border-gold-500/30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24">
            {/* Logo and Brand Title */}
            <Link to="/" className="flex items-center gap-3.5 group">
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-gold-500 via-gold-200 to-gold-700 shadow-gold group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/sai-pootharekulu-logo.jpg"
                  alt="Sai Pootharekulu Official Logo"
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#041f14]"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-cinzel text-xl sm:text-3xl font-black text-ivory tracking-wider group-hover:text-gold-300 transition-colors">
                  Sai Pootharekulu
                </span>
                <span className="font-traditional text-xs sm:text-sm text-gold-400 font-medium italic tracking-widest hidden sm:block">
                  Traditional Taste... Timeless Delight...
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (16px–18px for clear readability) */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-lg font-sans text-base font-semibold transition-colors duration-200 ${
                    isActive(link.path)
                      ? 'text-gold-300 bg-emerald-850 border-b-2 border-gold-400'
                      : 'text-ivory/90 hover:text-gold-300 hover:bg-emerald-850/60'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Actions: Admin Pill, Cart & User Menu */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Admin Panel Badge if Admin */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-sm font-bold hover:bg-amber-500/30 transition-all"
                  title="Store Admin Dashboard"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin Panel</span>
                </Link>
              )}

              {/* Shopping Cart Button */}
              <button
                onClick={openCart}
                className="relative p-3 rounded-full bg-emerald-850 border border-gold-500/40 text-gold-300 hover:text-gold-100 hover:border-gold-400 hover:shadow-gold transition-all duration-300"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-6 h-6" />
                {itemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-red-600 to-amber-600 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#041f14] animate-pulse">
                    {itemsCount}
                  </span>
                )}
              </button>

              {/* User Account / Auth Buttons (16px buttons) */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2.5 p-2 sm:px-4 sm:py-2 rounded-full bg-emerald-850 border border-gold-500/40 text-ivory hover:border-gold-400 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gold-500 text-[#041f14] font-black flex items-center justify-center text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-base font-semibold hidden sm:inline max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gold-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#062b1c] border border-gold-500/40 shadow-2xl py-3 z-50 text-ivory"
                      onMouseLeave={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-4 py-2.5 border-b border-gold-500/20">
                        <p className="text-base font-bold truncate">{user.name}</p>
                        <p className="text-xs text-gold-400/90 truncate">{user.email}</p>
                        <p className="text-xs text-gray-300 mt-1">📞 {user.phone}</p>
                      </div>

                      <Link
                        to="/my-orders"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-base hover:bg-emerald-800/60 transition-colors"
                      >
                        <ShoppingBag className="w-5 h-5 text-gold-400" /> My Orders
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-base text-amber-300 hover:bg-emerald-800/60 transition-colors"
                        >
                          <ShieldAlert className="w-5 h-5 text-amber-400" /> Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-base text-red-400 hover:bg-red-500/10 transition-colors border-t border-gold-500/20 mt-1"
                      >
                        <LogOut className="w-5 h-5" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-base font-semibold text-gold-300 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2.5 text-base font-bold text-[#041f14] bg-gradient-to-r from-gold-400 via-gold-200 to-gold-500 rounded-full shadow-gold hover:scale-105 transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gold-400 hover:text-gold-200"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer (Large legible text) */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#02130c] border-b border-gold-500/40 px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-lg font-semibold ${
                  isActive(link.path)
                    ? 'text-gold-300 bg-emerald-850 font-bold'
                    : 'text-ivory hover:text-gold-300 hover:bg-emerald-900/50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-lg font-bold text-amber-300 bg-amber-950/40 border border-amber-500/30"
              >
                <ShieldAlert className="w-5 h-5 text-amber-400" /> Admin Dashboard
              </Link>
            )}

            {!isAuthenticated && (
              <div className="pt-4 grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3.5 rounded-xl border border-gold-500/50 text-gold-300 text-base font-bold"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3.5 rounded-xl bg-gold-gradient-bg text-[#041f14] text-base font-bold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
