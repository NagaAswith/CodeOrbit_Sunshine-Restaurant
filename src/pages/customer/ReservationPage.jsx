import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import { 
  CalendarDays, 
  Clock, 
  Users, 
  Sparkles, 
  Phone, 
  Mail, 
  User, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const BOOKING_TYPES = [
  'Dining',
  'Birthday',
  'Anniversary',
  'Family Gathering',
  'Private Event'
];

export default function ReservationPage() {
  const { timeSlots, pricing, settings, createBooking, cart, cartTotal } = useRestaurant();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // Get today's ISO date string (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  // Pre-fill state if navigated from event or cart
  const initialType = location.state?.bookingType || 'Dining';
  const initialNotes = location.state?.specialRequest || location.state?.kitchenNotes || '';

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    date: todayStr,
    time: '07:00 PM – 08:00 PM',
    guests: 2,
    bookingType: initialType,
    roomType: 'Normal', // 'Normal', 'VIP Table', 'AC Room', 'Non-AC Room'
    specialRequest: initialNotes
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute live price estimate
  const estimatedAmount = useMemo(() => {
    let base = 0;
    const g = Number(formData.guests || 1);

    if (formData.roomType === 'Normal') {
      base = g * (pricing.normalSeatPrice || 200);
    } else if (formData.roomType === 'VIP Table') {
      base = g * (pricing.vipSeatPrice || 450);
    } else if (formData.roomType === 'AC Room') {
      base = Number(pricing.acRoomPrice || 2500);
    } else if (formData.roomType === 'Non-AC Room') {
      base = Number(pricing.nonAcRoomPrice || 1800);
    }

    return base + (cartTotal > 0 ? cartTotal : 0);
  }, [formData.guests, formData.roomType, pricing, cartTotal]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.customerName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!formData.date) {
      toast.error('Please select a reservation date');
      return;
    }
    if (!formData.time) {
      toast.error('Please select a dining time slot');
      return;
    }

    setIsSubmitting(true);

    try {
      const newBooking = createBooking({
        ...formData,
        guests: Number(formData.guests),
        amount: estimatedAmount,
        preorderedItems: cart.length > 0 ? cart : []
      });

      toast.success('Table reserved successfully! Token generated.');
      navigate('/booking-confirmation', { state: { booking: newBooking } });
    } catch (err) {
      console.error(err);
      toast.error('Failed to create reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#120d09] text-stone-100 pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-2">
            Instant Confirmation & Token Issuance
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-white">
            Table & Room Reservation
          </h1>
          <p className="text-stone-400 text-sm mt-3">
            Reserve your seating in advance. You will receive an immediate 5-digit verification token for entry.
          </p>
        </div>

        {/* Reservation Form Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Form Inputs */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Guest Contact Details */}
            <div className="bg-[#18120c] rounded-3xl border border-amber-500/20 p-6 space-y-4 shadow-xl">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-amber-400" />
                <span>1. Guest Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    Phone Number (for token SMS) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    Email Address (for receipt)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. rahul.sharma@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Date, Time & Guests */}
            <div className="bg-[#18120c] rounded-3xl border border-amber-500/20 p-6 space-y-4 shadow-xl">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-amber-400" />
                <span>2. Schedule & Party Size</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    Number of Guests (Headcount) *
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20, 25, 30].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time Slots Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Available Time Slot *</span>
                  <span className="text-[11px] text-amber-400/90 font-normal">Real-time availability</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {timeSlots.map((slot) => {
                    const slotLabel = `${slot.startTime} – ${slot.endTime}`;
                    const isSelected = formData.time === slotLabel;
                    const isFull = slot.availableSeats <= 0 || !slot.isActive;

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={isFull}
                        onClick={() => setFormData({ ...formData, time: slotLabel })}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          isSelected
                            ? 'bg-amber-500 border-amber-500 text-stone-950 font-bold shadow-glow scale-[1.02]'
                            : isFull
                            ? 'bg-stone-950/60 border-stone-900 text-stone-600 cursor-not-allowed'
                            : 'bg-stone-900/80 border-stone-800 text-stone-300 hover:border-amber-500/40'
                        }`}
                      >
                        <span className="text-xs font-semibold block">{slot.startTime}</span>
                        <span className={`text-[10px] mt-1 ${isSelected ? 'text-stone-900' : isFull ? 'text-rose-500' : 'text-stone-400'}`}>
                          {isFull ? 'Sold Out' : `${slot.availableSeats} seats left`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 3: Booking Type & Space Preference */}
            <div className="bg-[#18120c] rounded-3xl border border-amber-500/20 p-6 space-y-4 shadow-xl">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>3. Occasion & Seating Preference</span>
              </h3>

              {/* Booking Type */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                  Booking Occasion Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {BOOKING_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, bookingType: type })}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        formData.bookingType === type
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room & Seating Options (incorporating reference admin concepts) */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-3">
                  Seating Format & Room Choice
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Normal Table */}
                  <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                    formData.roomType === 'Normal'
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-glow'
                      : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:border-stone-700'
                  }`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="roomType"
                        value="Normal"
                        checked={formData.roomType === 'Normal'}
                        onChange={() => setFormData({ ...formData, roomType: 'Normal' })}
                        className="mt-1 accent-amber-500"
                      />
                      <div>
                        <div className="text-sm font-bold">Normal Dining Seating</div>
                        <div className="text-xs text-stone-400 mt-0.5">Central restaurant hall seating</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-400">
                      {formatINR(pricing.normalSeatPrice || 200)}/guest
                    </span>
                  </label>

                  {/* VIP Table */}
                  <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                    formData.roomType === 'VIP Table'
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-glow'
                      : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:border-stone-700'
                  }`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="roomType"
                        value="VIP Table"
                        checked={formData.roomType === 'VIP Table'}
                        onChange={() => setFormData({ ...formData, roomType: 'VIP Table' })}
                        className="mt-1 accent-amber-500"
                      />
                      <div>
                        <div className="text-sm font-bold flex items-center gap-1.5">
                          <span>VIP Lounge Booth</span>
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded">Plush</span>
                        </div>
                        <div className="text-xs text-stone-400 mt-0.5">Dedicated butler & garden view</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-400">
                      {formatINR(pricing.vipSeatPrice || 450)}/guest
                    </span>
                  </label>

                  {/* AC Room (Recommended) */}
                  <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                    formData.roomType === 'AC Room'
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-glow'
                      : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:border-stone-700'
                  }`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="roomType"
                        value="AC Room"
                        checked={formData.roomType === 'AC Room'}
                        onChange={() => setFormData({ ...formData, roomType: 'AC Room' })}
                        className="mt-1 accent-amber-500"
                      />
                      <div>
                        <div className="text-sm font-bold flex items-center gap-1.5">
                          <span>AC Private Room</span>
                          <span className="text-[10px] bg-amber-500 text-stone-950 font-bold px-1.5 py-0.2 rounded">
                            {pricing.acRoomLabel || 'Recommended'}
                          </span>
                        </div>
                        <div className="text-xs text-stone-400 mt-0.5">Exclusive private suite with music control</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-400">
                      {formatINR(pricing.acRoomPrice || 2500)} fixed
                    </span>
                  </label>

                  {/* Non-AC Room */}
                  <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                    formData.roomType === 'Non-AC Room'
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-glow'
                      : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:border-stone-700'
                  }`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="roomType"
                        value="Non-AC Room"
                        checked={formData.roomType === 'Non-AC Room'}
                        onChange={() => setFormData({ ...formData, roomType: 'Non-AC Room' })}
                        className="mt-1 accent-amber-500"
                      />
                      <div>
                        <div className="text-sm font-bold flex items-center gap-1.5">
                          <span>Courtyard Hall</span>
                          <span className="text-[10px] bg-stone-800 text-stone-400 px-1.5 py-0.2 rounded">
                            {pricing.nonAcRoomLabel || 'Budget Friendly'}
                          </span>
                        </div>
                        <div className="text-xs text-stone-400 mt-0.5">Semi-outdoor airy party space</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-400">
                      {formatINR(pricing.nonAcRoomPrice || 1800)} fixed
                    </span>
                  </label>

                </div>
              </div>

              {/* Special Requests */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                  Special Requests & Table Notes
                </label>
                <textarea
                  value={formData.specialRequest}
                  onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                  rows="2"
                  placeholder="e.g. Birthday anniversary cake candles, quiet corner table, baby high-chair..."
                  className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

            </div>

          </div>

          {/* Right Column: Pricing Breakdown & Submit CTA */}
          <div className="space-y-6">
            <div className="bg-[#18120c] rounded-3xl border border-amber-500/20 p-6 space-y-6 shadow-xl sticky top-28">
              <h3 className="font-serif text-xl font-bold text-white pb-3 border-b border-stone-800">
                Reservation Summary
              </h3>

              <div className="space-y-3 text-xs text-stone-300">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Date</span>
                  <span className="font-semibold text-white">{formData.date}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Time Slot</span>
                  <span className="font-semibold text-white">{formData.time}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Party Size</span>
                  <span className="font-semibold text-white">{formData.guests} Guests</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Occasion</span>
                  <span className="font-semibold text-amber-400">{formData.bookingType}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Format</span>
                  <span className="font-semibold text-white">{formData.roomType}</span>
                </div>

                {cart.length > 0 && (
                  <div className="flex items-center justify-between text-amber-300 pt-2 border-t border-stone-800">
                    <span>Pre-ordered Dishes ({cart.length})</span>
                    <span className="font-semibold">{formatINR(cartTotal)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-base font-bold text-white">
                  <span>Estimated Total</span>
                  <span className="text-amber-400 text-2xl font-serif">{formatINR(estimatedAmount)}</span>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 text-[11px] text-stone-400 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Instant 5-Character Token</span>
                </div>
                <div>Your token will be generated immediately and stored for instant front-desk verification.</div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-stone-950 font-bold text-sm uppercase tracking-wider shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Confirming...' : 'Confirm Table Booking'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-stone-400 text-center leading-relaxed">
                By booking, you agree to our 15-minute grace period policy. No cancellation charges.
              </p>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
