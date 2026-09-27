import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import { 
  PlusCircle, 
  CalendarDays, 
  Clock, 
  Users, 
  DollarSign, 
  Phone, 
  User, 
  FileText, 
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function AdminManualBookingPage() {
  const { createBooking, pricing, timeSlots } = useRestaurant();
  const navigate = useNavigate();
  const toast = useToast();

  const todayStr = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    bookingType: 'Dining',
    roomType: 'Normal',
    date: todayStr,
    time: '07:00 PM – 08:00 PM',
    guests: 2,
    amount: 400,
    specialRequest: 'Walk-in / Direct Phone Reservation'
  });

  const [isAutoCalc, setIsAutoCalc] = useState(true);

  // Recalculate price if auto calculation is on
  const calculatePrice = (guests, roomType) => {
    const g = Number(guests || 1);
    if (roomType === 'Normal') return g * (pricing.normalSeatPrice || 200);
    if (roomType === 'VIP Table') return g * (pricing.vipSeatPrice || 450);
    if (roomType === 'AC Room') return Number(pricing.acRoomPrice || 2500);
    if (roomType === 'Non-AC Room') return Number(pricing.nonAcRoomPrice || 1800);
    return g * 200;
  };

  const handleGuestsChange = (e) => {
    const g = Number(e.target.value);
    setForm(prev => ({
      ...prev,
      guests: g,
      amount: isAutoCalc ? calculatePrice(g, prev.roomType) : prev.amount
    }));
  };

  const handleRoomTypeChange = (e) => {
    const r = e.target.value;
    setForm(prev => ({
      ...prev,
      roomType: r,
      amount: isAutoCalc ? calculatePrice(prev.guests, r) : prev.amount
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.customerName.trim() || !form.phone.trim()) {
      toast.error('Customer name and phone number are required');
      return;
    }

    try {
      const newBooking = createBooking({
        ...form,
        guests: Number(form.guests),
        amount: Number(form.amount),
        status: 'Confirmed'
      });

      toast.success(`Reservation created! Token: ${newBooking.token}`);
      navigate('/admin/bookings');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create manual reservation');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      <div>
        <h2 className="font-serif text-2xl font-bold text-white">Manual Booking Entry</h2>
        <p className="text-xs text-stone-400">Record direct phone, email or walk-in reservations and assign instant verification tokens</p>
      </div>

      <div className="bg-[#160f0a] rounded-3xl border border-amber-500/20 p-6 sm:p-10 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Guest Details */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Customer Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 12345"
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-300 font-semibold mb-1.5">Email Address (Optional)</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="guest@example.com"
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Booking Type, Sub Type, Headcount */}
          <div className="pt-4 border-t border-stone-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Booking Type & Venue Allocation</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">Booking Type *</label>
                <select
                  value={form.bookingType}
                  onChange={(e) => setForm({ ...form, bookingType: e.target.value })}
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Dining">Dining</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Family Gathering">Family Gathering</option>
                  <option value="Private Event">Private Event</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">Sub Type / Space *</label>
                <select
                  value={form.roomType}
                  onChange={handleRoomTypeChange}
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Normal">Normal Table (₹{pricing.normalSeatPrice}/seat)</option>
                  <option value="VIP Table">VIP Table (₹{pricing.vipSeatPrice}/seat)</option>
                  <option value="AC Room">AC Room (₹{pricing.acRoomPrice} fixed)</option>
                  <option value="Non-AC Room">Non-AC Room (₹{pricing.nonAcRoomPrice} fixed)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">Headcount (Guests) *</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={form.guests}
                  onChange={handleGuestsChange}
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Date, Time & Price */}
          <div className="pt-4 border-t border-stone-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Schedule & Pricing</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">Date *</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">Time Slot *</label>
                <select
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
                >
                  {timeSlots.map(s => (
                    <option key={s.id} value={`${s.startTime} – ${s.endTime}`}>
                      {s.startTime} – {s.endTime} ({s.availableSeats} seats free)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-stone-300 font-semibold">Total Price (₹) *</label>
                  <label className="flex items-center gap-1 text-[10px] text-stone-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAutoCalc}
                      onChange={(e) => setIsAutoCalc(e.target.checked)}
                      className="accent-amber-500"
                    />
                    <span>Auto</span>
                  </label>
                </div>
                <input
                  type="number"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-amber-400 font-bold text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="pt-4 border-t border-stone-800 text-xs">
            <label className="block text-stone-300 font-semibold mb-1.5">Special Requests / Staff Notes</label>
            <textarea
              rows="2"
              value={form.specialRequest}
              onChange={(e) => setForm({ ...form, specialRequest: e.target.value })}
              placeholder="e.g. VIP guest, requested table by the fountain, cake arrangement..."
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/bookings')}
              className="px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-glow transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Booking & Assign Token</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
