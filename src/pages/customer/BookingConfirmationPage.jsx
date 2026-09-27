import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { formatINR, formatDate } from '../../utils/formatters';
import { 
  CheckCircle2, 
  Copy, 
  Printer, 
  CalendarDays, 
  Clock, 
  Users, 
  QrCode, 
  UtensilsCrossed, 
  ArrowRight,
  Home,
  Search,
  Check
} from 'lucide-react';

export default function BookingConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  // Fallback demo booking if user navigates directly
  const booking = location.state?.booking || {
    id: 'SUN-2026-00128',
    token: 'A7K42',
    customerName: 'Rahul Sharma',
    phone: '+91 98111 23456',
    email: 'rahul.sharma@example.com',
    date: '2026-09-23',
    time: '07:30 PM',
    guests: 4,
    bookingType: 'Dinner',
    roomType: 'VIP Table',
    amount: 1800,
    status: 'Confirmed'
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(booking.token);
    setCopied(true);
    toast.success(`Copied Token "${booking.token}" to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#120d09] text-stone-100 pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Icon & Heading */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 mb-4 shadow-glow">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1">
            Table Reserved Successfully
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            BOOKING CONFIRMED
          </h1>
          <p className="text-stone-300 text-sm mt-2 max-w-md mx-auto">
            We look forward to welcoming you at SUNSHINE for an unforgettable dining experience.
          </p>
        </div>

        {/* Printable Booking Voucher Card */}
        <div 
          id="printable-voucher" 
          className="bg-[#18120c] rounded-3xl border border-amber-500/30 overflow-hidden shadow-2xl relative mb-8 print:border-black print:text-black print:bg-white"
        >
          {/* Voucher Header Strip */}
          <div className="p-6 bg-gradient-to-r from-amber-500/20 via-amber-600/20 to-amber-500/20 border-b border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-widest block">
                Official Booking Reference
              </span>
              <span className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wider">
                {booking.id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                {booking.status || 'Confirmed'}
              </span>
            </div>
          </div>

          {/* Visual Token Box */}
          <div className="p-6 sm:p-8 bg-[#1f1610] border-b border-stone-800 text-center space-y-3">
            <span className="text-xs uppercase tracking-widest font-semibold text-stone-400 block">
              Your 5-Character Entry Verification Token
            </span>

            <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-[#140e0a] border-2 border-amber-500/50 shadow-glow">
              <span className="font-mono text-4xl sm:text-5xl font-black text-amber-400 tracking-[0.25em] pl-2">
                {booking.token}
              </span>
              <button
                onClick={handleCopyToken}
                className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                title="Copy token to clipboard"
                aria-label="Copy token"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <p className="text-xs text-amber-300/90 font-medium">
              ⚠️ Please keep your booking token for restaurant front-desk check-in.
            </p>
          </div>

          {/* Reservation Breakdown Grid */}
          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="text-xs text-stone-400 block uppercase tracking-wider mb-1">Primary Guest</span>
              <span className="font-bold text-white text-base">{booking.customerName}</span>
              <span className="text-xs text-stone-400 block mt-0.5">{booking.phone}</span>
              {booking.email && <span className="text-xs text-stone-400 block">{booking.email}</span>}
            </div>

            <div>
              <span className="text-xs text-stone-400 block uppercase tracking-wider mb-1">Date & Time</span>
              <div className="flex items-center gap-1.5 font-bold text-white text-base">
                <CalendarDays className="w-4 h-4 text-amber-400" />
                <span>{booking.date}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-stone-300 mt-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{booking.time}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-stone-400 block uppercase tracking-wider mb-1">Party Size & Space</span>
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Users className="w-4 h-4 text-amber-400" />
                <span>{booking.guests} Guests</span>
              </div>
              <span className="text-xs text-stone-400 block mt-0.5">{booking.roomType} • {booking.bookingType}</span>
            </div>

            <div>
              <span className="text-xs text-stone-400 block uppercase tracking-wider mb-1">Total Estimated Bill</span>
              <span className="font-serif text-2xl font-bold text-amber-400">
                {formatINR(booking.amount)}
              </span>
              <span className="text-[11px] text-stone-400 block mt-0.5">Payable at table</span>
            </div>

            {booking.specialRequest && (
              <div className="sm:col-span-2 pt-4 border-t border-stone-800">
                <span className="text-xs text-stone-400 block uppercase tracking-wider mb-1">Special Table Requests</span>
                <p className="text-xs text-stone-300 italic">"{booking.specialRequest}"</p>
              </div>
            )}
          </div>

          {/* Verification Barcode / Token Visual Footer */}
          <div className="p-4 bg-[#140e0a] border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Verified Digital Pass</span>
            </div>
            <span>SUNSHINE Restaurant Concierge</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Download Voucher</span>
          </button>

          <Link
            to="/booking-status"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold uppercase tracking-wider shadow-glow transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Track with Token</span>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-semibold transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back to Restaurant</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
