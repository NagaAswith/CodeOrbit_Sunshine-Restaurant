import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import { 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  CalendarDays, 
  Clock, 
  Users, 
  Sparkles,
  Search,
  Check
} from 'lucide-react';

export default function AdminTokenVerificationPage() {
  const { verifyToken, checkInWithToken, bookings } = useRestaurant();
  const toast = useToast();

  const [tokenInput, setTokenInput] = useState('');
  const [verifiedBooking, setVerifiedBooking] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasVerified, setHasVerified] = useState(false);

  const handleVerify = (e) => {
    if (e) e.preventDefault();
    if (!tokenInput.trim()) {
      toast.error('Please enter a 5-digit/character entry token');
      return;
    }

    const booking = verifyToken(tokenInput.trim());
    if (booking) {
      setVerifiedBooking(booking);
      setErrorMessage('');
      setHasVerified(true);
      toast.success(`Valid token! Found reservation for ${booking.customerName}`);
    } else {
      setVerifiedBooking(null);
      setErrorMessage('Invalid or expired token.');
      setHasVerified(true);
      toast.error('Invalid or expired token.');
    }
  };

  const handleCheckIn = () => {
    if (!verifiedBooking) return;
    const res = checkInWithToken(verifiedBooking.token);
    if (res.success) {
      setVerifiedBooking(res.booking);
      toast.success(`Guest ${res.booking.customerName} checked in successfully!`);
    } else {
      toast.error(res.message);
    }
  };

  // Pre-fill quick demo token
  const handleQuickToken = (t) => {
    setTokenInput(t);
    const booking = verifyToken(t);
    if (booking) {
      setVerifiedBooking(booking);
      setErrorMessage('');
      setHasVerified(true);
    }
  };

  // Recent checked-in guests
  const checkedInGuests = bookings.filter(b => b.status === 'Checked In').slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-white">Guest Entry Token Verification</h2>
        <p className="text-xs text-stone-400">Front-desk scanner & token lookup to verify reservation upon arrival</p>
      </div>

      {/* Main Verification Card */}
      <div className="bg-[#160f0a] rounded-3xl border border-amber-500/25 p-6 sm:p-10 shadow-2xl space-y-6">
        
        <div className="text-center max-w-md mx-auto space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-glow">
            <KeyRound className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
            TOKEN VERIFICATION
          </h3>
          <p className="text-xs text-stone-400">
            Enter 5-digit token to verify customer at restaurant entry
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleVerify} className="max-w-md mx-auto space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={12}
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
              placeholder="e.g. A7K42"
              className="flex-1 px-4 py-3.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 font-mono text-center text-xl font-bold uppercase tracking-[0.25em] focus:outline-none focus:border-amber-500 placeholder-stone-600"
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-glow transition-all active:scale-95 shrink-0"
            >
              Verify
            </button>
          </div>

          {/* Quick Demo Pill Helper */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-stone-400">
            <span>Demo Tokens:</span>
            {['A7K42', 'B9X11', 'R4M88', 'K2N55'].map((tok) => (
              <button
                key={tok}
                type="button"
                onClick={() => handleQuickToken(tok)}
                className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-amber-400 font-mono font-bold text-xs transition-colors"
              >
                {tok}
              </button>
            ))}
          </div>
        </form>

        {/* Verification Result Display */}
        {hasVerified && (
          verifiedBooking ? (
            <div className="bg-[#1c150f] rounded-2xl border border-emerald-500/30 p-6 space-y-6 animate-slide-up max-w-xl mx-auto">
              
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Valid Reservation Found</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  verifiedBooking.status === 'Checked In'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {verifiedBooking.status}
                </span>
              </div>

              {/* Booking Attributes */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-stone-400 uppercase text-[10px]">Customer Name</span>
                  <div className="text-base font-bold text-white mt-0.5">{verifiedBooking.customerName}</div>
                  <div className="text-stone-400">{verifiedBooking.phone}</div>
                </div>

                <div>
                  <span className="text-stone-400 uppercase text-[10px]">Booking Reference</span>
                  <div className="font-mono text-base font-bold text-amber-400 mt-0.5">{verifiedBooking.id}</div>
                  <div className="font-mono text-xs text-stone-400">Token: {verifiedBooking.token}</div>
                </div>

                <div>
                  <span className="text-stone-400 uppercase text-[10px]">Date & Time</span>
                  <div className="text-white font-medium mt-0.5 flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-amber-400" />
                    <span>{verifiedBooking.date}</span>
                  </div>
                  <div className="text-stone-400 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{verifiedBooking.time}</span>
                  </div>
                </div>

                <div>
                  <span className="text-stone-400 uppercase text-[10px]">Party Size & Format</span>
                  <div className="text-white font-medium mt-0.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>{verifiedBooking.guests} Guests</span>
                  </div>
                  <div className="text-stone-400">{verifiedBooking.roomType} • {verifiedBooking.bookingType}</div>
                </div>
              </div>

              {/* Special Request */}
              {verifiedBooking.specialRequest && (
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs">
                  <span className="text-amber-400 font-semibold block mb-0.5">Table Preferences:</span>
                  <p className="text-stone-300 italic">"{verifiedBooking.specialRequest}"</p>
                </div>
              )}

              {/* Check-In Action Button */}
              <div className="pt-2">
                {verifiedBooking.status === 'Checked In' ? (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold text-center flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>Customer is already Checked In at Table</span>
                  </div>
                ) : (
                  <button
                    onClick={handleCheckIn}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-glow transition-all active:scale-95"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Check In Customer Now</span>
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-center space-y-2 max-w-md mx-auto animate-fade-in">
              <AlertCircle className="w-6 h-6 text-rose-400 mx-auto" />
              <div className="text-sm font-bold text-rose-300">{errorMessage}</div>
              <p className="text-xs text-stone-400">
                Please verify the 5-character token on the customer voucher or look up by phone number in Bookings.
              </p>
            </div>
          )
        )}

      </div>

      {/* Currently Checked In Guests List */}
      <div className="bg-[#160f0a] rounded-3xl border border-amber-500/20 p-6 space-y-4 shadow-xl">
        <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-amber-400" />
          <span>Currently Checked In & Seated Guests</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {checkedInGuests.length === 0 ? (
            <div className="col-span-full text-center py-6 text-xs text-stone-400">
              No guests checked in yet today.
            </div>
          ) : (
            checkedInGuests.map(g => (
              <div key={g.id} className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{g.customerName}</span>
                  <span className="font-mono text-amber-400 font-bold">{g.token}</span>
                </div>
                <div className="text-stone-400">{g.guests} Guests • {g.roomType}</div>
                <div className="text-stone-500 text-[10px]">{g.time}</div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
