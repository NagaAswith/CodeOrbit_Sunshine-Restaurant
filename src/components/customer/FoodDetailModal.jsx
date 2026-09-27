import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import { 
  X, 
  Plus, 
  Minus, 
  Flame, 
  Sparkles, 
  Check, 
  ShoppingBag, 
  Star, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Calendar,
  Utensils
} from 'lucide-react';

export default function FoodDetailModal() {
  const { 
    selectedFoodItem, 
    setSelectedFoodItem, 
    addToCart, 
    setIsCartOpen,
    getProductReviewStats,
    addReview
  } = useRestaurant();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'reviews'
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState([]);

  // Review Form State
  const [revName, setRevName] = useState('');
  const [revEmail, setRevEmail] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [revBookingId, setRevBookingId] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Reset form whenever a new food item is selected
  useEffect(() => {
    setQuantity(1);
    setSelectedAddons([]);
    setActiveTab('details');
    setRevName('');
    setRevEmail('');
    setRevRating(5);
    setRevComment('');
    setRevBookingId('');
    setReviewSuccess(false);
  }, [selectedFoodItem]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedFoodItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedFoodItem]);

  if (!selectedFoodItem) return null;

  const item = selectedFoodItem;
  const { averageRating, totalCount, reviews: itemReviews, starBreakdown } = getProductReviewStats(item.id);

  const toggleAddon = (addon) => {
    if (selectedAddons.some(a => a.id === addon.id)) {
      setSelectedAddons(prev => prev.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons(prev => [...prev, addon]);
    }
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + Number(a.price), 0);
  const unitPrice = Number(item.price) + addonsTotal;
  const grandTotal = unitPrice * quantity;

  const handleAddToCart = () => {
    if (!item.isAvailable) return;
    addToCart(item, quantity, selectedAddons);
    toast.success(`Added ${quantity}x ${item.name} to cart!`);
    setSelectedFoodItem(null);
  };

  const handleAddToCartAndCheckout = () => {
    if (!item.isAvailable) return;
    addToCart(item, quantity, selectedAddons);
    setSelectedFoodItem(null);
    setIsCartOpen(true);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!revName.trim()) {
      toast.error('Please enter your name.');
      return;
    }
    if (!revComment.trim() || revComment.trim().length < 10) {
      toast.error('Please write a review of at least 10 characters.');
      return;
    }

    setIsSubmittingReview(true);
    setTimeout(() => {
      addReview({
        customerName: revName.trim(),
        email: revEmail.trim() || undefined,
        rating: Number(revRating),
        category: 'Food',
        review: revComment.trim(),
        menuItemId: item.id,
        bookingId: revBookingId.trim() || undefined,
        status: 'Pending'
      });

      setIsSubmittingReview(false);
      setReviewSuccess(true);
      toast.success(`Thank you! Your review for ${item.name} has been submitted for moderation.`);

      setRevName('');
      setRevEmail('');
      setRevRating(5);
      setRevComment('');
      setRevBookingId('');
    }, 350);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={() => setSelectedFoodItem(null)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="food-modal-title"
    >
      <div 
        className="relative w-full max-w-2xl bg-[#18120c] border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedFoodItem(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-stone-300 hover:text-white backdrop-blur-md border border-white/10 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Image */}
        <div className="relative h-56 sm:h-64 w-full shrink-0 bg-stone-900">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18120c] via-transparent to-black/40" />

          {/* Indicators Over Image */}
          <div className="absolute bottom-4 left-6 flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border flex items-center gap-1.5 ${
              item.isVeg
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              <span>{item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}</span>
            </span>

            {!item.isAvailable && (
              <span className="px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border bg-rose-950/90 border-rose-500/50 text-rose-300 flex items-center gap-1.5 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                <span>Out of Stock</span>
              </span>
            )}

            {item.isChefSpecial && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-bold text-xs shadow-glow">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chef's Signature</span>
              </span>
            )}

            <span className="px-3 py-1 rounded-full bg-stone-900/80 border border-stone-700 text-stone-300 text-xs">
              {item.category}
            </span>
          </div>
        </div>

        {/* Navigation Tabs (Details vs Reviews) */}
        <div className="flex border-b border-stone-800 bg-[#140e0a] px-6 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'details'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Dish Overview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Customer Reviews ({totalCount})</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Title & Price Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="food-modal-title" className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {item.name}
              </h2>

              {/* Dynamic Product Rating Summary */}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900 border border-amber-500/30 text-xs">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold ml-1 text-white text-xs">{averageRating}</span>
                  </div>
                  <span className="text-stone-400 font-medium">({totalCount} {totalCount === 1 ? 'review' : 'reviews'})</span>
                </div>

                {/* Spice Meter */}
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <span>Spice:</span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((lvl) => (
                      <Flame
                        key={lvl}
                        className={`w-3.5 h-3.5 ${
                          lvl <= (item.spiceLevel || 0)
                            ? 'text-red-500 fill-red-500'
                            : 'text-stone-700'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-stone-400 ml-1">
                      {item.spiceLevel === 0 ? 'Mild' : item.spiceLevel === 1 ? 'Medium' : item.spiceLevel === 2 ? 'Spicy' : 'Hot'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-stone-400 uppercase tracking-wider block">Price</span>
              <span className="font-bold text-2xl text-amber-400">
                {formatINR(item.price)}
              </span>
            </div>
          </div>

          {/* TAB 1: DISH OVERVIEW */}
          {activeTab === 'details' && (
            <div className="space-y-6 animate-fade-in">
              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-1">
                  Culinary Description
                </h4>
                <p className="text-sm text-stone-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Ingredients list */}
              {item.ingredients && item.ingredients.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-2">
                    Key Artisanal Ingredients
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {item.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 text-xs"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons & Customizations */}
              {item.addons && item.addons.length > 0 && (
                <div className="pt-2 border-t border-stone-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-3 flex items-center justify-between">
                    <span>Available Add-ons & Pairing</span>
                    <span className="text-[10px] text-stone-400 font-normal lowercase">(optional)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {item.addons.map((addon) => {
                      const isChecked = selectedAddons.some(a => a.id === addon.id);
                      return (
                        <button
                          key={addon.id}
                          type="button"
                          onClick={() => toggleAddon(addon)}
                          className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                            isChecked
                              ? 'bg-amber-500/15 border-amber-500/60 text-white'
                              : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:border-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                              isChecked ? 'bg-amber-500 border-amber-500 text-stone-950' : 'border-stone-600'
                            }`}>
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-xs font-medium">{addon.name}</span>
                          </div>
                          <span className="text-xs font-bold text-amber-400">
                            +{formatINR(addon.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick Prompt to Read/Write Reviews */}
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-amber-500/20 flex items-center justify-between gap-4">
                <div className="text-xs">
                  <span className="font-bold text-white block">Guest Reviews for {item.name}</span>
                  <span className="text-stone-400">Rated {averageRating} ★ based on {totalCount} verified dining reviews</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors"
                >
                  View Reviews
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOMER REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Star Breakdown & Overall Summary */}
              <div className="p-5 rounded-2xl bg-stone-950/80 border border-amber-500/20 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                {/* Left Big Score */}
                <div className="sm:col-span-4 text-center sm:border-r border-stone-800 sm:pr-4">
                  <div className="font-serif text-4xl font-extrabold text-amber-400">{averageRating}</div>
                  <div className="flex items-center justify-center gap-1 my-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        className={`w-4 h-4 ${
                          s <= Math.round(Number(averageRating))
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-700'
                        }`} 
                      />
                    ))}
                  </div>
                  <div className="text-xs text-stone-400">
                    Based on <span className="font-bold text-white">{totalCount} reviews</span>
                  </div>
                </div>

                {/* Right Star Breakdown Bars */}
                <div className="sm:col-span-8 space-y-1.5 text-xs">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = starBreakdown?.[star] || 0;
                    const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="w-12 text-stone-400 flex items-center gap-0.5 shrink-0">
                          <span>{star}</span>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-stone-900 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500" 
                            style={{ width: `${pct}%` }} 
                          />
                        </div>
                        <span className="w-8 text-right text-stone-400 font-mono text-[11px] shrink-0">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Published Reviews List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Published Reviews ({itemReviews.length})
                </h4>

                {itemReviews.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-stone-900/60 border border-stone-800 text-stone-400 text-xs">
                    No published reviews for {item.name} yet. Be the first to share your culinary feedback!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {itemReviews.map((rev) => {
                      const dateStr = rev.createdAt 
                        ? new Date(rev.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                        : 'Recent Visit';

                      return (
                        <div key={rev.id} className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs">{rev.customerName}</span>
                            <span className="text-[11px] text-stone-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-stone-500" />
                              <span>{dateStr}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star 
                                key={s} 
                                className={`w-3.5 h-3.5 ${
                                  s <= rev.rating 
                                    ? 'fill-amber-400 text-amber-400' 
                                    : 'text-stone-700'
                                }`} 
                              />
                            ))}
                          </div>

                          <p className="text-xs text-stone-300 leading-relaxed italic">
                            "{rev.review}"
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Leave a Review for this Dish Form */}
              <div className="p-5 rounded-2xl bg-[#130d08] border border-amber-500/25 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>Leave a Review for {item.name}</span>
                </h4>

                {reviewSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Review Submitted!</span>
                      <span>Your feedback has been received and will appear publicly once approved by our moderation team.</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-400 font-semibold mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={revName}
                        onChange={(e) => setRevName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 font-semibold mb-1">Email Address</label>
                      <input
                        type="email"
                        value={revEmail}
                        onChange={(e) => setRevEmail(e.target.value)}
                        placeholder="e.g. priya@example.com"
                        className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Star Selector */}
                  <div>
                    <label className="block text-stone-400 font-semibold mb-1">Your Rating *</label>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-900 border border-stone-800">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRevRating(s)}
                          className="p-1 hover:scale-125 transition-transform"
                          aria-label={`Select ${s} stars`}
                        >
                          <Star 
                            className={`w-5 h-5 ${
                              s <= revRating 
                                ? 'fill-amber-400 text-amber-400' 
                                : 'text-stone-700'
                            }`} 
                          />
                        </button>
                      ))}
                      <span className="ml-2 font-bold text-amber-300 text-xs">{revRating} / 5 Stars</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-400 font-semibold mb-1">
                      Booking ID / Token <span className="text-stone-500 lowercase">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={revBookingId}
                      onChange={(e) => setRevBookingId(e.target.value)}
                      placeholder="e.g. SUN-2026-00128"
                      className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500 uppercase font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 font-semibold mb-1">Your Culinary Review *</label>
                    <textarea
                      rows="3"
                      required
                      minLength="10"
                      maxLength="500"
                      value={revComment}
                      onChange={(e) => setRevComment(e.target.value)}
                      placeholder={`Tell us what you liked about ${item.name}...`}
                      className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                    />
                    <div className="flex justify-between text-[10px] text-stone-500 mt-0.5">
                      <span>Min 10 characters</span>
                      <span>{revComment.length}/500</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingReview ? 'Submitting Review...' : `Submit Review for ${item.name}`}</span>
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer with Quantity and Add Button */}
        <div className="p-4 sm:p-5 bg-[#130e0a] border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Quantity:</span>
            <div className="flex items-center border border-stone-700 rounded-xl bg-stone-900 overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2.5 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-bold text-sm text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-2.5 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {item.isAvailable ? (
              <>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-white font-semibold text-xs transition-all active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Add to Cart ({formatINR(grandTotal)})</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToCartAndCheckout}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-glow transition-all active:scale-95"
                >
                  <span>Order Now</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-stone-900 border border-stone-800 text-rose-400 font-bold text-xs cursor-not-allowed"
              >
                <span>Out of Stock</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
