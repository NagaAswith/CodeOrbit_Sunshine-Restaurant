import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  CalendarDays, 
  Users, 
  AlertCircle, 
  FileText, 
  ShieldCheck,
  Sparkles,
  UtensilsCrossed
} from 'lucide-react';

export default function BookingStatusPage() {
  const { verifyToken, bookings } = useRestaurant();
  const toast = useToast();

  const [inputVal, setInputVal] = useState('');
  const [searchedBooking, setSearchedBooking] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) {
      toast.error('Please enter a Booking ID or 5-character token');
      return;
    }

    const found = verifyToken(inputVal.trim());
    setSearchedBooking(found);
    setHasSearched(true);

    if (found) {
      toast.success(`Found reservation for ${found.customerName}!`);
    } else {
      toast.error('No reservation found with this token or ID');
    }
  };

  // Quick demo filler
  const handleQuickFill = (token) => {
    setInputVal(token);
    const found = verifyToken(token);
    setSearchedBooking(found);
    setHasSearched(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Checked In':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Pending':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/40';
      case 'Completed':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'Cancelled':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default:
        return 'bg-stone-800 text-stone-300 border-stone-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#120d09] text-stone-100 pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-2">
            Reservation Verification & Status
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
            Track Booking with Token
          </h1>
          <p className="text-stone-400 text-sm mt-3">
            Enter your 5-character reservation token or Booking ID to view real-time seating confirmation and entry status.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="bg-[#18120c] p-2.5 rounded-2xl border border-amber-500/30 shadow-xl flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value.toUpperCase())}
                placeholder="Enter 5-character token (e.g. A7K42) or Booking ID"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 uppercase tracking-widest font-mono text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-glow transition-all active:scale-95"
            >
              Verify Token
            </button>
          </div>

          {/* Quick Demo Tokens */}
          <div className="flex flex-wrap items-center gap-2 mt-3 px-2 text-xs text-stone-400">
            <span>Demo Tokens to test:</span>
            {['A7K42', 'B9X11', 'R4M88', 'K2N55'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleQuickFill(t)}
                className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-amber-300 font-mono font-bold transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        </form>

        {/* Search Results */}
        {hasSearched && (
          searchedBooking ? (
            <div className="bg-[#18120c] rounded-3xl border border-amber-500/30 overflow-hidden shadow-2xl animate-slide-up">
              
              {/* Card Header Strip */}
              <div className="p-6 bg-gradient-to-r from-amber-500/15 via-[#1c150f] to-amber-500/15 border-b border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">Booking ID:</span>
                    <span className="font-mono font-bold text-white text-base">{searchedBooking.id}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">Token:</span>
                    <span className="font-mono font-bold text-amber-400 text-lg tracking-widest">{searchedBooking.token}</span>
                  </div>
                </div>

                <div className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider shadow-sm ${getStatusBadge(searchedBooking.status)}`}>
                  {searchedBooking.status}
                </div>
              </div>

              {/* Status Timeline Bar */}
              <div className="px-6 py-5 bg-[#140e0a] border-b border-stone-800">
                <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                  <div className="space-y-1">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-stone-950 font-bold flex items-center justify-center mx-auto text-xs">✓</div>
                    <span className="text-stone-300 font-medium block">Created</span>
                  </div>
                  <div className="space-y-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                      searchedBooking.status !== 'Cancelled' ? 'bg-emerald-500 text-stone-950' : 'bg-stone-800 text-stone-500'
                    }`}>✓</div>
                    <span className="text-stone-300 font-medium block">Confirmed</span>
                  </div>
                  <div className="space-y-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                      searchedBooking.status === 'Checked In' || searchedBooking.status === 'Completed'
                        ? 'bg-amber-500 text-stone-950'
                        : 'bg-stone-800 text-stone-500'
                    }`}>3</div>
                    <span className={searchedBooking.status === 'Checked In' ? 'text-amber-400 font-bold block' : 'text-stone-500 block'}>
                      Checked In
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                      searchedBooking.status === 'Completed' ? 'bg-purple-500 text-white' : 'bg-stone-800 text-stone-500'
                    }`}>4</div>
                    <span className={searchedBooking.status === 'Completed' ? 'text-purple-400 font-bold block' : 'text-stone-500 block'}>
                      Completed
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking Details Grid */}
              <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="text-xs text-stone-400 uppercase tracking-wider block mb-1">Customer Details</span>
                  <div className="font-bold text-white text-base">{searchedBooking.customerName}</div>
                  <div className="text-xs text-stone-400 mt-0.5">{searchedBooking.phone}</div>
                  {searchedBooking.email && <div className="text-xs text-stone-400">{searchedBooking.email}</div>}
                </div>

                <div>
                  <span className="text-xs text-stone-400 uppercase tracking-wider block mb-1">Date & Time</span>
                  <div className="flex items-center gap-2 font-bold text-white text-base">
                    <CalendarDays className="w-4 h-4 text-amber-400" />
                    <span>{searchedBooking.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-300 mt-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{searchedBooking.time}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-stone-400 uppercase tracking-wider block mb-1">Seating & Headcount</span>
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>{searchedBooking.guests} Guests</span>
                  </div>
                  <div className="text-xs text-stone-400 mt-0.5">{searchedBooking.roomType} • {searchedBooking.bookingType}</div>
                </div>

                <div>
                  <span className="text-xs text-stone-400 uppercase tracking-wider block mb-1">Total Bill</span>
                  <div className="font-serif text-2xl font-bold text-amber-400">{formatINR(searchedBooking.amount)}</div>
                </div>

                {searchedBooking.specialRequest && (
                  <div className="sm:col-span-2 pt-4 border-t border-stone-800">
                    <span className="text-xs text-stone-400 uppercase tracking-wider block mb-1">Special Table Notes</span>
                    <p className="text-xs text-stone-300 italic">"{searchedBooking.specialRequest}"</p>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-[#18120c] rounded-3xl border border-rose-500/30 p-8 text-center space-y-4 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">No Booking Found</h3>
              <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
                We couldn't locate any active reservation matching "<span className="text-white font-mono">{inputVal}</span>". Please check your 5-character token or phone confirmation.
              </p>
            </div>
          )
        )}

      </div>
    </div>
  );
}
