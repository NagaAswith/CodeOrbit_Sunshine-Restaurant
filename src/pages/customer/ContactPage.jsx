import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  Send, 
  CheckCircle2, 
  CalendarDays,
  ExternalLink,
  Navigation
} from 'lucide-react';

export default function ContactPage() {
  const { settings } = useRestaurant();
  const toast = useToast();

  const handleOpenGoogleMaps = () => {
    const mapsUrl = settings.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(settings.address || 'Sunshine Restaurant Jubilee Hills Hyderabad')}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Thank you! Your message has been sent to our concierge.');
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#120d09] text-stone-100 pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-2">
            Concierge & Hospitality
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-white">
            Get in Touch with SUNSHINE
          </h1>
          <p className="text-stone-400 text-sm mt-3">
            Have questions regarding private celebrations, banquets, customized dietary menus, or corporate dining? We are here to assist.
          </p>
        </div>

        {/* 2-Column Contact Info and Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Contact Cards & Map Preview */}
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Phone Card */}
              <div className="p-5 rounded-2xl bg-[#18120c] border border-amber-500/20 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Direct Telephone</h4>
                <a href={`tel:${settings.phone}`} className="text-sm font-bold text-white hover:text-amber-400 transition-colors block">
                  {settings.phone}
                </a>
                <span className="text-[11px] text-stone-400 block">Available 10 AM – 11:30 PM</span>
              </div>

              {/* WhatsApp Card */}
              <div className="p-5 rounded-2xl bg-[#18120c] border border-emerald-500/20 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">WhatsApp Concierge</h4>
                <a 
                  href={`https://wa.me/${(settings.whatsapp || '').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5"
                >
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <span className="text-[11px] text-stone-400 block">Instant table assistance</span>
              </div>

              {/* Email Card */}
              <div className="p-5 rounded-2xl bg-[#18120c] border border-amber-500/20 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Reservations Email</h4>
                <a href={`mailto:${settings.email}`} className="text-sm font-bold text-white hover:text-amber-400 transition-colors block truncate">
                  {settings.email}
                </a>
                <span className="text-[11px] text-stone-400 block">Guaranteed 2-hour response</span>
              </div>

              {/* Hours Card */}
              <div className="p-5 rounded-2xl bg-[#18120c] border border-amber-500/20 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Service Hours</h4>
                <div className="text-sm font-bold text-white">
                  {settings.openingTime} – {settings.closingTime}
                </div>
                <span className="text-[11px] text-stone-400 block">{settings.businessDays}</span>
              </div>

            </div>

            {/* Address Banner */}
            <div className="p-6 rounded-2xl bg-[#18120c] border border-amber-500/20 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white mb-1">Restaurant Location & Valet</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {settings.address}
                </p>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-amber-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Complimentary valet parking available for all guests</span>
                </div>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleOpenGoogleMaps}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
                    title="Open live navigation in Google Maps"
                  >
                    <Navigation className="w-3.5 h-3.5 text-amber-400" />
                    <span>View Location on Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-amber-400/80" />
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Map Visual Card */}
            <div 
              onClick={handleOpenGoogleMaps}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleOpenGoogleMaps()}
              className="group rounded-3xl overflow-hidden border border-stone-800 hover:border-amber-500/40 bg-stone-900 relative h-56 cursor-pointer shadow-xl transition-all"
              title="Click to open Google Maps"
            >
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80"
                alt="Map Location of Sunshine Restaurant"
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <div className="w-11 h-11 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-glow mb-2 animate-bounce">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="font-serif font-bold text-base text-white">SUNSHINE Gourmet Enclave</span>
                <span className="text-xs text-stone-300">Jubilee Hills, Hyderabad</span>
                <span className="mt-2 text-[11px] text-amber-300 bg-black/60 px-3 py-1 rounded-full border border-amber-500/30 backdrop-blur-sm group-hover:bg-amber-500 group-hover:text-stone-950 font-medium transition-colors inline-flex items-center gap-1.5">
                  <Navigation className="w-3 h-3" />
                  <span>Click to open Google Maps</span>
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Inquiry Form */}
          <div className="bg-[#18120c] rounded-3xl border border-amber-500/20 p-8 shadow-xl">
            <h3 className="font-serif text-2xl font-bold text-white mb-2">
              Send a Message to Concierge
            </h3>
            <p className="text-xs text-stone-400 mb-6">
              Let us know how we can make your dining celebration extraordinary.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="vikram@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                  Inquiry Topic
                </label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Private Dining & Banquet">Private Dining & Banquet Suite Booking</option>
                  <option value="Corporate Event">Corporate Dinner / Event</option>
                  <option value="Dietary or Chef Request">Dietary Consultation / Chef Degustation</option>
                  <option value="Feedback">Dining Experience Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                  Your Message *
                </label>
                <textarea
                  required
                  rows="4"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your event date, number of expected guests, or custom preferences..."
                  className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>

              {submitted && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center">
                  ✓ Message received! Our guest concierge will reach out within 2 hours.
                </div>
              )}
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
