import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu as MenuIcon, 
  KeyRound, 
  PlusCircle, 
  ExternalLink, 
  Calendar,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function AdminHeader({ title, subtitle, onMenuToggle }) {
  const navigate = useNavigate();
  const { adminUser } = useAuth();

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 bg-[#160f0a]/95 backdrop-blur-md border-b border-amber-500/15 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Mobile hamburger & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white"
            aria-label="Toggle Navigation Drawer"
          >
            <MenuIcon className="w-5 h-5" />
          </button>

          <div>
            <h1 className="font-serif text-lg sm:text-2xl font-bold text-white tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-stone-400 hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Date, Quick Actions, and Customer Link */}
        <div className="flex items-center gap-3">
          
          {/* Today Date Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900/80 border border-stone-800 text-xs text-stone-300">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>{todayStr}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>

          {/* Quick Token Verification shortcut */}
          <button
            onClick={() => navigate('/admin/token')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
            title="Fast Front-Desk Token Verification"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Verify Token</span>
          </button>

          {/* Quick Manual Booking shortcut */}
          <button
            onClick={() => navigate('/admin/manual-booking')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-glow transition-all hover:scale-105 active:scale-95"
            title="New Manual Reservation Entry"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Booking</span>
          </button>

          {/* Jump to Customer Experience */}
          <Link
            to="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-900 border border-transparent hover:border-stone-800 text-xs transition-colors"
            title="Open Customer Experience in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>Customer Site</span>
          </Link>

        </div>

      </div>
    </header>
  );
}
