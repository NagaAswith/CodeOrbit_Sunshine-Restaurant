import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ShoppingBag, 
  CalendarDays, 
  Search, 
  Menu as MenuIcon, 
  X, 
  ShieldCheck, 
  UtensilsCrossed, 
  Sparkles,
  PhoneCall
} from 'lucide-react';

export default function Navbar() {
  const { cartCount, setIsCartOpen, settings } = useRestaurant();
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Reservations', path: '/reservation' },
    { name: 'Events', path: '/events' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#120d09]/95 backdrop-blur-md border-b border-amber-500/20 py-3 shadow-xl' 
          : 'bg-gradient-to-b from-[#120d09]/90 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg p-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 p-0.5 shadow-glow group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#1c150f] rounded-[10px] flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-wider text-white group-hover:text-amber-400 transition-colors">
                {settings.restaurantName || 'SUNSHINE'}
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-amber-400/80 font-medium">
                {settings.subtitle || 'Dining Experience'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors relative py-1 hover:text-amber-400 ${
                    isActive ? 'text-amber-400 font-semibold' : 'text-stone-300'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="hidden sm:flex items-center gap-3">


            {/* Track Booking / Token Button */}
            <Link
              to="/booking-status"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-amber-300 hover:bg-white/5 border border-stone-800 transition-all"
              title="Track reservation status with Booking ID or Token"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>Track Booking</span>
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-[#231a13] hover:bg-[#2e231a] text-stone-200 border border-amber-500/20 hover:border-amber-500/40 transition-all active:scale-95"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs flex items-center justify-center shadow-glow animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Book a Table Primary CTA */}
            <Link
              to="/reservation"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 bg-[length:200%_auto] hover:bg-right text-stone-950 font-bold text-sm shadow-glow transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <CalendarDays className="w-4 h-4" />
              <span>Book a Table</span>
            </Link>

            {/* Quick Admin Portal Link */}
            <Link
              to={isAuthenticated ? "/admin" : "/admin/login"}
              className="p-2.5 rounded-xl text-stone-400 hover:text-amber-400 hover:bg-stone-800/60 transition-colors"
              title={isAuthenticated ? "Admin Portal Console" : "Admin Portal Login"}
              aria-label="Admin Portal"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile Right Bar (Cart + Hamburger) */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-lg bg-stone-900 text-stone-200 border border-stone-800"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-stone-900 text-stone-300 hover:text-white border border-stone-800"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-amber-400" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-amber-500/20 bg-[#160f0a]/98 backdrop-blur-xl px-4 pt-4 pb-6 shadow-2xl animate-fade-in">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold'
                      : 'text-stone-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <div className="pt-3 border-t border-stone-800 flex flex-col gap-2.5">


              <Link
                to="/booking-status"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 text-sm font-medium"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>Track Booking with Token</span>
              </Link>

              <Link
                to="/reservation"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 text-stone-950 font-bold text-sm shadow-glow"
              >
                <CalendarDays className="w-4 h-4" />
                <span>Book a Table</span>
              </Link>

              <Link
                to={isAuthenticated ? "/admin" : "/admin/login"}
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-stone-900/60 border border-amber-500/30 text-amber-400 text-xs font-semibold"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isAuthenticated ? 'Admin Console' : 'Admin Portal Login'}</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
