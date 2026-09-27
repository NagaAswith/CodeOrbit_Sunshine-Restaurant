import React from 'react';
import { Link } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import MenuCard from '../../components/customer/MenuCard';
import EventCard from '../../components/customer/EventCard';
import { 
  CalendarDays, 
  UtensilsCrossed, 
  Sparkles, 
  Flame, 
  Clock, 
  MapPin, 
  Award, 
  Heart, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  CheckCircle2,
  Users
} from 'lucide-react';

export default function HomePage() {
  const { menu, events, settings, pricing, reviewStats } = useRestaurant();

  // Featured specials (Chef's Special and Popular)
  const featuredDishes = menu.filter(item => item.isChefSpecial || item.isPopular).slice(0, 6);
  // Active featured events
  const featuredEvents = events.filter(ev => ev.isActive).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#120d09] text-stone-100 overflow-x-hidden">
      
      {/* =================================================================== */}
      {/* 1. HERO SECTION */}
      {/* =================================================================== */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Background Food Photography with Dark Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=85"
            alt="Sunshine Restaurant Fine Dining Ambience"
            className="w-full h-full object-cover scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#120d09] via-[#120d09]/80 to-[#120d09]/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-black/80" />
        </div>

        {/* Ambient Top Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/15 blur-[120px] pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Welcome Message */}
          <div className="text-amber-400 font-medium text-xs sm:text-sm tracking-[0.25em] uppercase mb-4">
            WELCOME TO SUNSHINE
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            <span className="block">{settings.heroTitle || settings.tagline || 'Good food. Great moments.'}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 font-normal italic">
              Crafted with Soul.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-stone-300 leading-relaxed font-light mb-10">
            {settings.heroDescription || 'Discover fresh flavours, memorable dining and experiences made for every occasion. From slow-simmered handi delicacies to sizzling clay-oven grills.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              to="/menu"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-stone-950 font-bold text-sm tracking-wide shadow-glow-lg hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Explore Menu</span>
            </Link>

            <Link
              to="/reservation"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#1c150f]/80 hover:bg-[#281e15] border border-amber-500/40 text-amber-300 font-bold text-sm hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md"
            >
              <CalendarDays className="w-4 h-4" />
              <span>Book a Table</span>
            </Link>
          </div>

          {/* Quick Highlights / Trust Bar */}
          <div className="mt-14 pt-8 border-t border-stone-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left max-w-3xl mx-auto">
            <Link to="/reviews" className="flex items-center gap-3 group hover:opacity-90 transition-opacity">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:border-amber-500/40 transition-colors">
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <div className="font-bold text-white text-base flex items-center gap-1">
                  <span>{reviewStats?.averageRating || '4.9'}</span>
                  <span className="text-amber-400 text-xs">★</span>
                </div>
                <div className="text-[11px] text-stone-400 group-hover:text-amber-300 transition-colors">
                  {reviewStats?.totalCount ? `${reviewStats.totalCount} Guest Reviews` : 'Verified Guest Reviews'}
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-base">Master Chefs</div>
                <div className="text-[11px] text-stone-400">Authentic Recipes</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-base">11 AM – 11:30 PM</div>
                <div className="text-[11px] text-stone-400">Daily Lunch & Dinner</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-base">Instant Token</div>
                <div className="text-[11px] text-stone-400">Guaranteed Seating</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. RESTAURANT INTRO / ABOUT SECTION */}
      {/* =================================================================== */}
      <section className="py-20 bg-[#160f0a] border-y border-amber-500/15 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Visual Collage */}
            <div className="relative">
              <div className="relative z-10 grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
                  alt="Restaurant interior"
                  className="rounded-3xl object-cover h-64 sm:h-72 w-full shadow-2xl border border-stone-800"
                />
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                  alt="Fine dining dish"
                  className="rounded-3xl object-cover h-64 sm:h-72 w-full mt-6 shadow-2xl border border-stone-800"
                />
              </div>

              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -left-4 sm:left-6 z-20 p-5 rounded-2xl bg-[#1c150f]/95 border border-amber-500/30 backdrop-blur-md shadow-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-stone-950 font-bold text-xl">
                  15+
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Years of Excellence</div>
                  <div className="text-xs text-stone-400">Pioneering Indian Fine Dining</div>
                </div>
              </div>
            </div>

            {/* Story Copy */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
                Our Story & Concept
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                A place for food, family and memorable evenings.
              </h2>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                {settings.aboutText || "SUNSHINE is born out of a deep reverence for fine culinary traditions, exquisite ingredients, and memorable gatherings. Every meal is an unhurried journey through vibrant spices, artisanal presentation, and heartfelt warmth."}
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "Clay-oven roasted kebabs and slow-simmered Awadhi gravies",
                  "Private AC Dining Rooms for intimate celebrations & meetings",
                  "Strictly farm-fresh local produce & hand-ground whole spices",
                  "Seamless token-based entry verification system"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-stone-300 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors group"
                >
                  <span>Learn more about our heritage</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. DINING ATMOSPHERE & EXPERIENCES */}
      {/* =================================================================== */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-2">
              Atmosphere & Venues
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Dining Spaces Made for Every Occasion
            </h2>
            <p className="text-stone-400 text-sm mt-3">
              Whether you are planning a romantic candlelit dinner, a bustling family reunion, or a high-profile corporate banquet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Space 1: Main Dining Hall */}
            <div className="bg-[#18120c] rounded-2xl border border-amber-500/15 p-6 space-y-4 hover:border-amber-500/40 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">Grand Dining Hall</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Vibrant, open-concept dining with ambient warm lighting, acoustic jazz, and viewing access to the live tandoor kitchen.
              </p>
              <div className="text-xs font-bold text-amber-400 pt-2 border-t border-stone-800">
                Starting at {pricing.normalSeatPrice ? `₹${pricing.normalSeatPrice}/seat` : 'Standard'}
              </div>
            </div>

            {/* Space 2: VIP Booths */}
            <div className="bg-[#18120c] rounded-2xl border border-amber-500/15 p-6 space-y-4 hover:border-amber-500/40 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">VIP Family Booths</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Plush velvet upholstered private booths with dedicated tableside service, custom lighting, and panoramic garden views.
              </p>
              <div className="text-xs font-bold text-amber-400 pt-2 border-t border-stone-800">
                Starting at {pricing.vipSeatPrice ? `₹${pricing.vipSeatPrice}/seat` : 'VIP Service'}
              </div>
            </div>

            {/* Space 3: Private AC Rooms */}
            <div className="bg-[#18120c] rounded-2xl border border-amber-500/30 p-6 space-y-4 hover:border-amber-500/60 transition-all hover:-translate-y-1 relative shadow-glow">
              <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px]">
                {pricing.acRoomLabel || 'Recommended'}
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">Private AC Banquet</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Soundproof luxury private dining suites for birthdays, corporate dinners, and festive celebrations with audio-visual equipment.
              </p>
              <div className="text-xs font-bold text-amber-400 pt-2 border-t border-stone-800">
                Fixed booking at {pricing.acRoomPrice ? `₹${pricing.acRoomPrice}` : 'Private Rate'}
              </div>
            </div>

            {/* Space 4: Non-AC Dining Hall */}
            <div className="bg-[#18120c] rounded-2xl border border-amber-500/15 p-6 space-y-4 hover:border-amber-500/40 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">Family Garden Hall</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Breezy semi-outdoor courtyard hall surrounded by fragrant jasmine shrubs, ideal for large casual family reunions.
              </p>
              <div className="text-xs font-bold text-amber-400 pt-2 border-t border-stone-800">
                {pricing.nonAcRoomLabel || 'Budget Friendly'} • {pricing.nonAcRoomPrice ? `₹${pricing.nonAcRoomPrice}` : 'Affordable'}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. TODAY'S SPECIALS & CHEF'S HIGHLIGHTS */}
      {/* =================================================================== */}
      <section className="py-20 bg-[#160f0a] border-t border-amber-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-2">
                Today's Curated Selection
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Chef's Signature Dishes
              </h2>
              <p className="text-stone-400 text-sm mt-2 max-w-xl">
                Masterfully spiced, char-grilled to perfection, and garnished with authentic royal garnishes.
              </p>
            </div>

            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-amber-400 text-xs font-bold uppercase tracking-wider transition-colors self-start md:self-auto"
            >
              <span>View Full Digital Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid of Food Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDishes.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>

        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. LIVE EVENTS & SPECIAL NIGHTS */}
      {/* =================================================================== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-2">
              Experiences & Offers
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Upcoming Special Nights & Events
            </h2>
            <p className="text-stone-400 text-sm mt-3">
              Join us for live Sufi music, romantic candlelight evenings, lavish Sunday family brunches, and festive culinary pop-ups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

        </div>
      </section>

      {/* =================================================================== */}
      {/* 6. CALL TO ACTION RESERVATION BANNER */}
      {/* =================================================================== */}
      <section className="py-20 bg-gradient-to-r from-amber-950/40 via-[#18120c] to-amber-950/40 border-t border-amber-500/20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 p-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Guaranteed Seating & VIP Hospitality</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight mb-4">
            Ready to experience culinary magic at SUNSHINE?
          </h2>

          <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto mb-8 font-light">
            Book your preferred time slot in advance and receive an instant 5-digit verification token for effortless front-desk check-in.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/reservation"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-glow transition-all hover:scale-105 active:scale-95"
            >
              Book Your Table Now
            </Link>

            <Link
              to="/booking-status"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 font-semibold text-sm transition-colors"
            >
              Have a Booking Token? Verify Status
            </Link>
          </div>

          {/* Location / Find Us Direct Link */}
          <div className="mt-8 flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                const mapsUrl = settings?.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(settings?.address || 'Sunshine Restaurant Jubilee Hills Hyderabad')}`;
                window.open(mapsUrl, '_blank', 'noopener,noreferrer');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="Locate SUNSHINE on Google Maps"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Location / Find Us on Google Maps</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
