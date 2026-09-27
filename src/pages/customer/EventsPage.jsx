import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import EventCard from '../../components/customer/EventCard';
import { Calendar, Sparkles, Music, Gift, HeartHandshake, ArrowRight } from 'lucide-react';

export default function EventsPage() {
  const { events } = useRestaurant();
  const navigate = useNavigate();

  const activeEvents = events.filter(e => e.isActive);

  const handleBookEvent = (event) => {
    navigate('/reservation', {
      state: {
        bookingType: 'Private Event',
        specialRequest: `Reservation for Special Event: ${event.title} (${event.date}) - Offer: ${event.offerText}`
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#120d09] text-stone-100 pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-2">
            Curated Experiences & Culinary Gatherings
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-white">
            Special Events & Dining Nights
          </h1>
          <p className="text-stone-400 text-sm mt-3">
            From live acoustic Sufi music and romantic candlelit jazz dinners to festive royal degustation feasts.
          </p>
        </div>

        {/* Feature Event Spotlight Banner */}
        {activeEvents.length > 0 && (
          <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 mb-16 bg-[#18120c] shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-72 lg:h-auto min-h-[320px]">
                <img
                  src={activeEvents[0].image}
                  alt={activeEvents[0].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#18120c] via-transparent to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-bold text-xs shadow-glow">
                  Featured Spotlight
                </div>
              </div>

              <div className="p-8 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="text-xs text-amber-400 font-semibold tracking-wider uppercase">
                    {activeEvents[0].date} • {activeEvents[0].time}
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    {activeEvents[0].title}
                  </h2>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    {activeEvents[0].description}
                  </p>
                  {activeEvents[0].offerText && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                      <span>{activeEvents[0].offerText}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-stone-800">
                  <button
                    onClick={() => handleBookEvent(activeEvents[0])}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-glow transition-all active:scale-95"
                  >
                    Reserve Seats for this Event
                  </button>
                  <span className="text-xs text-stone-400">
                    Only {activeEvents[0].availableSeats} seats remaining
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Events Grid */}
        <div>
          <h3 className="font-serif text-2xl font-bold text-white mb-6">
            All Upcoming Experiences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeEvents.map((event) => (
              <EventCard key={event.id} event={event} onBook={handleBookEvent} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
