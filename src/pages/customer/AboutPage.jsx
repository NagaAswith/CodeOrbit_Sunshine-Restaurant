import React from 'react';
import { Link } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import { 
  Award, 
  Sparkles, 
  UtensilsCrossed, 
  Heart, 
  CheckCircle2, 
  Users, 
  CalendarDays,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function AboutPage() {
  const { settings } = useRestaurant();

  return (
    <div className="min-h-screen bg-[#120d09] text-stone-100 pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
            {settings.restaurantName || 'SUNSHINE'} Heritage & Philosophy
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white leading-tight">
            A place for food, family and memorable evenings.
          </h1>
          <p className="text-stone-300 text-base sm:text-lg font-light leading-relaxed">
            {settings.aboutText || "SUNSHINE is born out of a deep reverence for fine culinary traditions, exquisite ingredients, and memorable gatherings. Every meal is an unhurried journey through vibrant spices, artisanal presentation, and heartfelt warmth."}
          </p>
        </div>

        {/* Story Section with Collage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
              The Culinary Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Rooted in Tradition, Elevated for Modern Palates
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed">
              Founded over fifteen years ago in the historic culinary heartland, SUNSHINE set out with a simple yet uncompromising vision: to elevate traditional Mughlai, Awadhi, and Tandoori gastronomy into a refined, multisensory dining experience.
            </p>
            <p className="text-stone-400 text-sm leading-relaxed">
              We slow-braise our curries in heavy copper degs, grind our whole spice masalas daily on granite stones, and ferment our artisanal naan doughs naturally. The result is pure, authentic flavour without artificial food coloring or preservatives.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-800">
              <div className="p-4 rounded-2xl bg-[#18120c] border border-amber-500/20">
                <div className="font-serif text-3xl font-bold text-amber-400">100%</div>
                <div className="text-xs text-stone-400 mt-1">Farm Fresh Produce & Clarified Desi Ghee</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#18120c] border border-amber-500/20">
                <div className="font-serif text-3xl font-bold text-amber-400">128+</div>
                <div className="text-xs text-stone-400 mt-1">Daily Reservations & Celebrations</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
              alt="Restaurant Interior"
              className="rounded-3xl object-cover h-72 w-full shadow-2xl border border-stone-800"
            />
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
              alt="Warm candlelit dining"
              className="rounded-3xl object-cover h-72 w-full mt-8 shadow-2xl border border-stone-800"
            />
          </div>
        </div>

        {/* Master Chefs & Team Section */}
        <div className="bg-[#160f0a] rounded-3xl border border-amber-500/20 p-8 sm:p-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-2">
              Culinary Artistry
            </span>
            <h3 className="font-serif text-3xl font-bold text-white">
              Meet Our Culinary Masters
            </h3>
            <p className="text-stone-400 text-xs mt-2">
              Driven by decades of culinary mastery, our chefs blend heritage heritage techniques with refined presentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-[#1c150f] rounded-2xl p-6 border border-stone-800 text-center space-y-3">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-2 border-amber-500/40">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80"
                  alt="Executive Chef Vikrant Roy"
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-serif text-lg font-bold text-white">Chef Vikrant Roy</h4>
              <p className="text-xs text-amber-400 font-semibold uppercase">Executive Chef & Culinary Director</p>
              <p className="text-xs text-stone-400 leading-relaxed">
                22+ years crafting Awadhi dum banquets and royal kebab marinades at premier 5-star kitchens.
              </p>
            </div>

            <div className="bg-[#1c150f] rounded-2xl p-6 border border-stone-800 text-center space-y-3">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-2 border-amber-500/40">
                <img
                  src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80"
                  alt="Chef Meenakshi Sen"
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-serif text-lg font-bold text-white">Chef Meenakshi Sen</h4>
              <p className="text-xs text-amber-400 font-semibold uppercase">Master Pastry & Dessert Specialist</p>
              <p className="text-xs text-stone-400 leading-relaxed">
                Reinventing traditional Indian mithais and contemporary confectionery with artisanal precision.
              </p>
            </div>

            <div className="bg-[#1c150f] rounded-2xl p-6 border border-stone-800 text-center space-y-3">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-2 border-amber-500/40">
                <img
                  src="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=400&q=80"
                  alt="Chef Tenzin Dorjee"
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-serif text-lg font-bold text-white">Chef Tenzin Dorjee</h4>
              <p className="text-xs text-amber-400 font-semibold uppercase">Head of Tandoor & Grill Operations</p>
              <p className="text-xs text-stone-400 leading-relaxed">
                Master of charcoal temperatures, creating the silkiest malai marinades and delicate smoked textures.
              </p>
            </div>

          </div>
        </div>

        {/* CTA Banner */}
        <div className="text-center py-10">
          <Link
            to="/reservation"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-glow transition-all hover:scale-105 active:scale-95"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Book Your Table & Experience Sunshine</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
