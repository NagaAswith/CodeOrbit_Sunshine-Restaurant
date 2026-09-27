import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, Tag, ArrowRight, Sparkles } from 'lucide-react';

export default function EventCard({ event, onBook }) {
  const navigate = useNavigate();

  const handleBook = () => {
    if (onBook) {
      onBook(event);
    } else {
      navigate('/reservation', { 
        state: { 
          bookingType: 'Private Event', 
          specialRequest: `Reservation for special event: ${event.title} (${event.date})` 
        } 
      });
    }
  };

  return (
    <div className="group relative bg-[#18120c] rounded-2xl border border-amber-500/15 hover:border-amber-500/40 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-glow hover:-translate-y-1">
      {/* Event Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-900">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#18120c] via-transparent to-black/30" />

        {/* Discount Badge */}
        {event.discount && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-bold text-xs shadow-glow">
            <Tag className="w-3 h-3" />
            <span>{event.discount}</span>
          </div>
        )}

        {/* Available seats */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900/90 backdrop-blur-md border border-stone-700 text-stone-300 text-xs font-medium">
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span>{event.availableSeats} seats left</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Date and Time pills */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400">
            <div className="flex items-center gap-1.5 text-amber-400/90 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{event.time}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-stone-400 leading-relaxed line-clamp-3">
            {event.description}
          </p>

          {/* Offer Banner */}
          {event.offerText && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
              <span>{event.offerText}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-5 pt-4 border-t border-stone-800/80">
          <button
            onClick={handleBook}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-amber-500 text-stone-200 hover:text-stone-950 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-glow group-hover:border-amber-500"
          >
            <span>Book Experience</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
