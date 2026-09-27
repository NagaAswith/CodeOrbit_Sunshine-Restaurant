import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import MenuCard from '../../components/customer/MenuCard';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Flame, 
  Star, 
  X, 
  UtensilsCrossed 
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Starters',
  'Main Course',
  'Breads',
  'Rice & Biryani',
  'Desserts',
  'Beverages'
];

export default function MenuPage() {
  const { menu } = useRestaurant();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('all'); // 'all', 'veg', 'non-veg'
  const [onlyPopular, setOnlyPopular] = useState(false);
  const [onlySpicy, setOnlySpicy] = useState(false);
  const [onlyChefSpecial, setOnlyChefSpecial] = useState(false);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menu.filter((item) => {
      // Category filter
      if (activeCategory !== 'All' && item.category !== activeCategory) {
        return false;
      }
      // Dietary filter
      if (selectedDiet === 'veg' && !item.isVeg) return false;
      if (selectedDiet === 'non-veg' && item.isVeg) return false;

      // Tag filters
      if (onlyPopular && !item.isPopular) return false;
      if (onlyChefSpecial && !item.isChefSpecial) return false;
      if (onlySpicy && (!item.spiceLevel || item.spiceLevel < 2)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesIng = item.ingredients?.some(i => i.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesIng) return false;
      }

      return true;
    });
  }, [menu, activeCategory, selectedDiet, onlyPopular, onlyChefSpecial, onlySpicy, searchQuery]);

  const clearAllFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
    setSelectedDiet('all');
    setOnlyPopular(false);
    setOnlySpicy(false);
    setOnlyChefSpecial(false);
  };

  const hasActiveFilters = 
    activeCategory !== 'All' || 
    searchQuery.trim() !== '' || 
    selectedDiet !== 'all' || 
    onlyPopular || 
    onlySpicy || 
    onlyChefSpecial;

  return (
    <div className="min-h-screen bg-[#120d09] text-stone-100 pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-2">
            Artisanal Dining Experience
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-white">
            Digital Restaurant Menu
          </h1>
          <p className="text-stone-400 text-sm mt-3">
            Hand-crafted delicacies prepared with pure clarified butter, fragrant spices, and slow-fire cooking.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[#18120c] rounded-3xl border border-amber-500/20 p-4 sm:p-6 mb-10 shadow-xl space-y-5">
          
          {/* Top row: Search input & dietary toggles */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food, ingredients (e.g. Paneer, Biryani, Naan)..."
                className="w-full pl-12 pr-10 py-3 rounded-2xl bg-stone-900 border border-stone-800 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Veg / Non-Veg segmented toggle */}
            <div className="flex items-center p-1 rounded-2xl bg-stone-900 border border-stone-800 shrink-0 w-full md:w-auto">
              <button
                onClick={() => setSelectedDiet('all')}
                className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedDiet === 'all'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                All Diets
              </button>

              <button
                onClick={() => setSelectedDiet('veg')}
                className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedDiet === 'veg'
                    ? 'bg-emerald-500 text-stone-950 font-bold shadow-sm'
                    : 'text-stone-400 hover:text-emerald-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Pure Veg</span>
              </button>

              <button
                onClick={() => setSelectedDiet('non-veg')}
                className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedDiet === 'non-veg'
                    ? 'bg-rose-500 text-white font-bold shadow-sm'
                    : 'text-stone-400 hover:text-rose-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span>Non-Veg</span>
              </button>
            </div>

          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-glow scale-105'
                    : 'bg-stone-900/80 hover:bg-stone-800 text-stone-300 border border-stone-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Attribute Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-800/80 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-stone-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filters:</span>
              </span>

              <button
                onClick={() => setOnlyChefSpecial(!onlyChefSpecial)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                  onlyChefSpecial
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Chef's Special</span>
              </button>

              <button
                onClick={() => setOnlyPopular(!onlyPopular)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                  onlyPopular
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Star className="w-3 h-3 text-amber-400" />
                <span>Popular</span>
              </button>

              <button
                onClick={() => setOnlySpicy(!onlySpicy)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                  onlySpicy
                    ? 'bg-red-500/20 border-red-500 text-red-300 font-bold'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Flame className="w-3 h-3 text-red-400" />
                <span>Spicy Dishes</span>
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-stone-400 hover:text-amber-400 underline underline-offset-4 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>

        </div>

        {/* Results Count Bar */}
        <div className="flex items-center justify-between mb-6 text-xs text-stone-400">
          <span>
            Showing <strong className="text-white">{filteredItems.length}</strong> delicacies
            {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
          </span>
          <span className="italic">Click any item for nutritional & add-on details</span>
        </div>

        {/* Food Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-[#18120c] rounded-3xl border border-stone-800 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-stone-900 flex items-center justify-center mx-auto text-stone-500">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-white">No dishes match your selection</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              We couldn't find any dishes matching your current search query or active filter tags.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-glow transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
