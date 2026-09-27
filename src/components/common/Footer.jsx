import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { 
  UtensilsCrossed, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Send, 
  Heart,
  Instagram,
  Facebook,
  Twitter,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export default function Footer() {
  const { settings } = useRestaurant();
  const toast = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Thank you for subscribing to Sunshine Privileges!');
    setEmail('');
  };

  return (
    <footer className="bg-[#0b0805] text-stone-300 border-t border-amber-500/15 relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-amber-500/5 blur-3xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Column 1: Brand & Story */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 p-0.5 shadow-glow">
                <div className="w-full h-full bg-[#1c150f] rounded-[10px] flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-wider text-white">
                  {settings.restaurantName || 'SUNSHINE'}
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-amber-400 font-medium">
                  {settings.subtitle || 'Restaurant & Dining Experience'}
                </span>
              </div>
            </Link>

            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              "{settings.tagline || 'Good food. Great moments.'}" {settings.footerAboutText || 'Crafted with culinary reverence, locally-sourced produce, and centuries of authentic gastronomy.'}
            </p>

            {/* Newsletter Subscription */}
            <form onSubmit={handleSubscribe} className="pt-2">
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                Join our Culinary Club
              </label>
              <div className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Join</span>
                </button>
              </div>
            </form>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors">Home Experience</Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-amber-400 transition-colors">Digital Menu & Ordering</Link>
              </li>
              <li>
                <Link to="/reservation" className="hover:text-amber-400 transition-colors">Table & Room Booking</Link>
              </li>
              <li>
                <Link to="/booking-status" className="hover:text-amber-400 transition-colors">Track Booking with Token</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-amber-400 transition-colors">Live Events & Special Nights</Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-amber-400 transition-colors">Guest Reviews & Feedback</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors">About Our Culinary Heritage</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">Contact & Reservations</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Hours & Dining */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Operational Hours
            </h4>
            <div className="space-y-3 text-xs text-stone-400">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-medium">{settings.businessDays || 'Mon – Sun (All 7 Days)'}</div>
                  <div className="text-stone-400">{settings.openingTime || '11:00 AM'} – {settings.closingTime || '11:30 PM'}</div>
                </div>
              </div>
              <div className="pt-2 border-t border-stone-800/80">
                <div className="text-white font-medium mb-1">Dining Formats:</div>
                <div className="text-stone-400">Main Dining Hall • VIP Family Booths • Private AC Party Rooms • Al-Fresco Terrace</div>
              </div>
            </div>
          </div>

          {/* Column 4: Contact & Concierge */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Concierge
            </h4>
            <ul className="space-y-3 text-xs text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span>{settings.address || 'Plot 42, Sunshine Boulevard, Jubilee Hills, Hyderabad'}</span>
                  <div className="mt-1">
                    <a
                      href={settings.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(settings.address || 'Sunshine Restaurant Jubilee Hills Hyderabad')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-medium underline underline-offset-2 transition-colors"
                      title="Open Google Maps location"
                    >
                      <span>View on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-amber-400 transition-colors">{settings.phone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href={`https://wa.me/${(settings.whatsapp || '').replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  WhatsApp Concierge
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-amber-400 transition-colors">{settings.email}</a>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#instagram" className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-amber-400 transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#facebook" className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-amber-400 transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#twitter" className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-amber-400 transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Internship Bar */}
        <div className="mt-12 pt-8 border-t border-stone-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            © {new Date().getFullYear()} {settings.footerCopyright || `${settings.restaurantName || 'SUNSHINE'} Restaurant & Dining Experience. All rights reserved.`}
          </div>
          
          <div className="flex items-center gap-2 text-stone-400 bg-stone-900/60 px-3 py-1.5 rounded-full border border-stone-800">
            <span>Built for</span>
            <span className="font-semibold text-amber-400">CodeOrbit Tech Web Development Internship</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/admin" className="flex items-center gap-1.5 text-stone-400 hover:text-amber-400 transition-colors">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Management Console</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
