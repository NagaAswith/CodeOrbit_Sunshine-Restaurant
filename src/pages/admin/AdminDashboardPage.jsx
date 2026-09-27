import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import { 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  DollarSign, 
  TrendingUp, 
  KeyRound, 
  PlusCircle, 
  ArrowRight, 
  UtensilsCrossed, 
  Users, 
  Sparkles,
  Info,
  Check,
  Eye
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { 
    bookings, 
    liveStats, 
    updateBookingStatus, 
    menu 
  } = useRestaurant();

  const navigate = useNavigate();
  const toast = useToast();
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Recent 6 bookings
  const recentBookings = bookings.slice(0, 6);

  const handleStatusChange = (id, newStatus) => {
    updateBookingStatus(id, newStatus);
    toast.success(`Booking ${id} status updated to ${newStatus}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Checked In':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Pending':
        return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
      case 'Completed':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'Cancelled':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-stone-800 text-stone-300 border-stone-700';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Demo Notice Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Demo Data Notice:</strong> The statistics and revenue figures below represent realistic simulation metrics designed for internship demonstration.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/admin/token')}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-sm"
          >
            Verify 5-Digit Token
          </button>
        </div>
      </div>

      {/* 6 Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Total Bookings */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#160f0a] border border-amber-500/20 space-y-2 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Total Bookings</span>
            <CalendarDays className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-white">
            {liveStats.totalBookings}
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14% this month</span>
          </div>
        </div>

        {/* Today's Bookings */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#160f0a] border border-amber-500/20 space-y-2 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Today's Bookings</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">
            {liveStats.todayBookings}
          </div>
          <div className="text-[10px] text-stone-400">
            18 Dinner • 6 Lunch
          </div>
        </div>

        {/* Confirmed */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#160f0a] border border-emerald-500/20 space-y-2 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-emerald-400">
            {liveStats.confirmed}
          </div>
          <div className="text-[10px] text-stone-400">
            Tables ready
          </div>
        </div>

        {/* Pending */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#160f0a] border border-sky-500/20 space-y-2 hover:border-sky-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Pending</span>
            <AlertCircle className="w-4 h-4 text-sky-400" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-sky-400">
            {liveStats.pending}
          </div>
          <div className="text-[10px] text-stone-400">
            Awaiting table allocation
          </div>
        </div>

        {/* Cancelled */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#160f0a] border border-rose-500/20 space-y-2 hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Cancelled</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-rose-400">
            {liveStats.cancelled}
          </div>
          <div className="text-[10px] text-stone-400">
            2.3% cancel rate
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#160f0a] border border-amber-500/30 space-y-2 hover:border-amber-500/50 transition-all shadow-glow">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Today's Revenue</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-serif text-xl sm:text-2xl font-bold text-amber-400">
            {formatINR(liveStats.todayRevenue)}
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Target achieved</span>
          </div>
        </div>

      </div>

      {/* Interactive Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Bookings Overview (Weekly Distribution) */}
        <div className="p-6 rounded-3xl bg-[#160f0a] border border-amber-500/20 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Bookings Overview</h3>
              <p className="text-xs text-stone-400">Reservations traffic by day of the week</p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">
              This Week
            </span>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="h-52 w-full pt-4 flex items-end justify-between gap-3 sm:gap-6 px-2">
            {[
              { day: 'Mon', count: 18, height: '45%' },
              { day: 'Tue', count: 14, height: '35%' },
              { day: 'Wed', count: 22, height: '55%' },
              { day: 'Thu', count: 28, height: '70%' },
              { day: 'Fri', count: 38, height: '95%' },
              { day: 'Sat', count: 42, height: '100%', highlight: true },
              { day: 'Sun', count: 35, height: '88%' },
            ].map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                  {item.count}
                </span>
                <div 
                  style={{ height: item.height }}
                  className={`w-full max-w-[36px] rounded-t-xl transition-all duration-500 group-hover:scale-105 ${
                    item.highlight 
                      ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-glow' 
                      : 'bg-stone-800 hover:bg-amber-500/60'
                  }`}
                />
                <span className={`text-xs font-semibold ${item.highlight ? 'text-amber-400' : 'text-stone-400'}`}>
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Revenue Overview (Simulated Hourly / Category Trend) */}
        <div className="p-6 rounded-3xl bg-[#160f0a] border border-amber-500/20 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Revenue Overview</h3>
              <p className="text-xs text-stone-400">Peak dining revenue periods (Lunch vs Dinner)</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
              ₹48,650 Today
            </span>
          </div>

          {/* SVG Area / Multi-bar Chart */}
          <div className="h-52 w-full pt-4 flex flex-col justify-between">
            <div className="space-y-3">
              {[
                { label: 'Dinner Prime (7 PM – 10 PM)', amount: 28400, percent: 58, color: 'bg-amber-500' },
                { label: 'Lunch Buffet (12 PM – 3 PM)', amount: 13500, percent: 28, color: 'bg-amber-600' },
                { label: 'Private AC Banquet Suites', amount: 4800, percent: 10, color: 'bg-emerald-500' },
                { label: 'Beverages & Mocktail Bar', amount: 1950, percent: 4, color: 'bg-sky-500' },
              ].map((cat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-300 font-medium">{cat.label}</span>
                    <span className="text-amber-400 font-bold">{formatINR(cat.amount)} ({cat.percent}%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-stone-900 overflow-hidden">
                    <div
                      style={{ width: `${cat.percent}%` }}
                      className={`h-full rounded-full ${cat.color} transition-all duration-700`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-stone-400 text-center pt-2 border-t border-stone-800/80">
              Average ticket size per guest: <strong className="text-white">₹420</strong>
            </div>
          </div>
        </div>

        {/* Chart 3: Booking Status Breakdown */}
        <div className="p-6 rounded-3xl bg-[#160f0a] border border-amber-500/20 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-white">Booking Status Breakdown</h3>
            <span className="text-xs text-stone-400">Total {bookings.length} reservations</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-emerald-500/20">
              <span className="text-xs text-stone-400 block">Confirmed</span>
              <span className="text-2xl font-bold text-emerald-400">{liveStats.confirmed}</span>
              <span className="text-[10px] text-stone-500 block">Guaranteed entry</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-amber-500/20">
              <span className="text-xs text-stone-400 block">Checked In</span>
              <span className="text-2xl font-bold text-amber-400">{liveStats.checkedIn || 1}</span>
              <span className="text-[10px] text-stone-500 block">Currently seated</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-sky-500/20">
              <span className="text-xs text-stone-400 block">Pending</span>
              <span className="text-2xl font-bold text-sky-400">{liveStats.pending}</span>
              <span className="text-[10px] text-stone-500 block">Review required</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-purple-500/20">
              <span className="text-xs text-stone-400 block">Completed</span>
              <span className="text-2xl font-bold text-purple-400">{liveStats.completed || 1}</span>
              <span className="text-[10px] text-stone-500 block">Billed & settled</span>
            </div>
          </div>
        </div>

        {/* Chart 4: Popular Menu Items Performance */}
        <div className="p-6 rounded-3xl bg-[#160f0a] border border-amber-500/20 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-white">Popular Dishes Ranking</h3>
            <Link to="/admin/menu" className="text-xs text-amber-400 hover:underline">
              Manage Menu
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { name: 'Butter Chicken', orders: 184, rev: 77280, cat: 'Main Course' },
              { name: 'Chicken Dum Biryani', orders: 165, rev: 67650, cat: 'Rice & Biryani' },
              { name: 'Paneer Tikka', orders: 142, rev: 39760, cat: 'Starters' },
              { name: 'Gulab Jamun with Rabdi', orders: 118, rev: 21240, cat: 'Desserts' },
            ].map((dish, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900/60 border border-stone-800">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                    #{i + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{dish.name}</h4>
                    <span className="text-[10px] text-stone-400">{dish.cat}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-400">{formatINR(dish.rev)}</span>
                  <span className="text-[10px] text-stone-400 block">{dish.orders} orders</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Bookings Quick Table */}
      <div className="p-6 rounded-3xl bg-[#160f0a] border border-amber-500/20 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-white">Recent Guest Reservations</h3>
            <p className="text-xs text-stone-400">Latest online and manual table bookings with verification tokens</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/bookings"
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-amber-400 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              View All Bookings ({bookings.length})
            </Link>

            <Link
              to="/admin/manual-booking"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-glow transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Manual Entry</span>
            </Link>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Booking ID</th>
                <th className="py-3 px-3">Token</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Guests</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-3 font-mono font-semibold text-white">
                    {b.id}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {b.token}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-white">{b.customerName}</div>
                    <div className="text-[10px] text-stone-400">{b.phone}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="text-white">{b.date}</div>
                    <div className="text-[10px] text-stone-400">{b.time}</div>
                  </td>
                  <td className="py-3.5 px-3 font-medium text-white">
                    {b.guests}
                  </td>
                  <td className="py-3.5 px-3 text-stone-300">
                    <div>{b.bookingType}</div>
                    <div className="text-[10px] text-stone-500">{b.roomType}</div>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-amber-400">
                    {formatINR(b.amount)}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {b.status !== 'Checked In' && b.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'Checked In')}
                          className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-stone-950 font-bold text-[10px] transition-colors"
                          title="Check In Guest"
                        >
                          Check In
                        </button>
                      )}
                      {b.status === 'Pending' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'Confirmed')}
                          className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-stone-950 font-bold text-[10px] transition-colors"
                          title="Confirm Reservation"
                        >
                          Confirm
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                        title="View Full Booking Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Quick View Modal */}
      {selectedBooking && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div 
            className="w-full max-w-lg bg-[#18120c] border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold">Booking Reference</span>
                <h3 className="font-mono text-xl font-bold text-white">{selectedBooking.id}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase ${getStatusBadge(selectedBooking.status)}`}>
                {selectedBooking.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-stone-400 uppercase text-[10px]">Verification Token</span>
                <div className="font-mono text-lg font-bold text-amber-400">{selectedBooking.token}</div>
              </div>
              <div>
                <span className="text-stone-400 uppercase text-[10px]">Customer Name</span>
                <div className="font-bold text-white text-sm">{selectedBooking.customerName}</div>
                <div className="text-stone-400">{selectedBooking.phone}</div>
              </div>
              <div>
                <span className="text-stone-400 uppercase text-[10px]">Date & Time</span>
                <div className="text-white font-medium">{selectedBooking.date} at {selectedBooking.time}</div>
              </div>
              <div>
                <span className="text-stone-400 uppercase text-[10px]">Party Size & Format</span>
                <div className="text-white font-medium">{selectedBooking.guests} Guests • {selectedBooking.roomType}</div>
              </div>
            </div>

            {selectedBooking.specialRequest && (
              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs">
                <span className="text-amber-400 font-semibold block mb-0.5">Special Request:</span>
                <p className="text-stone-300 italic">"{selectedBooking.specialRequest}"</p>
              </div>
            )}

            <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
              <span className="font-serif text-lg font-bold text-amber-400">{formatINR(selectedBooking.amount)}</span>
              <div className="flex gap-2">
                {selectedBooking.status !== 'Checked In' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, 'Checked In');
                      setSelectedBooking(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
                  >
                    Check In Guest
                  </button>
                )}
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 text-stone-300 text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
