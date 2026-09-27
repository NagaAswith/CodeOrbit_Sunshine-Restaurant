import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import { Plus, Flame, Sparkles, Star, Eye } from 'lucide-react';

export default function MenuCard({ item }) {
  const { setSelectedFoodItem, addToCart, getProductReviewStats } = useRestaurant();
  const toast = useToast();

  const { averageRating, totalCount } = getProductReviewStats(item.id);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (!item.isAvailable) return;
    
    // If item has customizable add-ons, open details modal instead
    if (item.addons && item.addons.length > 0) {
      setSelectedFoodItem(item);
      return;
    }

    addToCart(item, 1, []);
    toast.success(`Added ${item.name} to cart!`);
  };

  return (
    <article
      onClick={() => setSelectedFoodItem(item)}
      className={`group relative bg-[#18120c] rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between hover:shadow-glow hover:-translate-y-1 ${
        item.isAvailable 
          ? 'border-amber-500/15 hover:border-amber-500/40' 
          : 'border-stone-800'
      }`}
    >
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-900">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#18120c] via-transparent to-black/30" />

        {/* Veg / Non-Veg Indicator Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1c150f]/90 backdrop-blur-md border border-stone-700/60 shadow-lg text-[11px] font-semibold">
          <span 
            className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center ${
              item.isVeg 
                ? 'border-emerald-500' 
                : 'border-rose-500'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          </span>
          <span className={item.isVeg ? 'text-emerald-400' : 'text-rose-400'}>
            {item.isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>

        {/* Feature Badges (Chef's Special / Popular) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          {item.isChefSpecial && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-bold text-[10px] shadow-glow">
              <Sparkles className="w-3 h-3" />
              <span>Chef's Special</span>
            </span>
          )}
          {item.isPopular && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-900/90 border border-amber-500/40 text-amber-300 font-semibold text-[10px]">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span>Popular</span>
            </span>
          )}
        </div>

        {/* Out of Stock Floating Badge over Image */}
        {!item.isAvailable && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/90 backdrop-blur-md border border-rose-500/50 text-rose-300 text-[11px] font-bold shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span>Out of Stock</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Spice Chillies */}
          <div className="flex items-center justify-between gap-2 mb-1.5 text-xs text-stone-400">
            <span className="text-amber-400/90 font-medium tracking-wide uppercase text-[10px]">
              {item.category}
            </span>
            {item.spiceLevel > 0 && (
              <div className="flex items-center gap-0.5" title={`Spice Level: ${item.spiceLevel}/3`}>
                {[...Array(Math.min(3, item.spiceLevel))].map((_, i) => (
                  <Flame key={i} className="w-3 h-3 text-red-500 fill-red-500" />
                ))}
              </div>
            )}
          </div>

          {/* Dish Title */}
          <h3 className="font-serif text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
            {item.name}
          </h3>

          {/* Product Rating & Review Count */}
          <div className="flex items-center gap-1.5 mt-1 mb-1.5 text-xs">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold ml-1 text-white text-xs">{averageRating}</span>
            </div>
            <span className="text-[11px] text-stone-400 font-medium">({totalCount})</span>
            {totalCount > 0 ? (
              <span className="text-[10px] text-stone-500">
                {totalCount === 1 ? '1 review' : `${totalCount} reviews`}
              </span>
            ) : (
              <span className="text-[10px] text-stone-500 italic">No reviews yet</span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Bottom Price & Actions */}
        <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-400 block uppercase">Price</span>
            <span className="font-bold text-base text-amber-400">
              {formatINR(item.price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFoodItem(item);
              }}
              className="p-2 rounded-xl bg-stone-800/70 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              title="View dish ingredients and details"
              aria-label={`View details for ${item.name}`}
            >
              <Eye className="w-4 h-4" />
            </button>

            {item.isAvailable ? (
              <button
                type="button"
                onClick={handleQuickAdd}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-glow transition-all active:scale-95"
                aria-label={`Add ${item.name} to cart`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Order</span>
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-rose-400/80 font-bold text-xs cursor-not-allowed"
                aria-label={`${item.name} is Out of Stock`}
              >
                <span>Out of Stock</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
