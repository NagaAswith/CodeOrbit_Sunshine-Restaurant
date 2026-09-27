import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { 
  Star, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Calendar, 
  Filter, 
  Award,
  Sparkles,
  Heart,
  User,
  UtensilsCrossed
} from 'lucide-react';

const CATEGORIES = [
  'Overall Experience',
  'Food',
  'Service',
  'Ambience',
  'Staff',
  'Booking Experience'
];

export default function ReviewsPage() {
  const { publishedReviews, reviewStats, addReview, menu, starBreakdown } = useRestaurant();
  const toast = useToast();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('All');
  const [selectedDishFilter, setSelectedDishFilter] = useState('All');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('Overall Experience');
  const [selectedMenuItemId, setSelectedMenuItemId] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return publishedReviews.filter(r => {
      if (selectedCategory !== 'All' && r.category !== selectedCategory) return false;
      if (selectedRatingFilter !== 'All' && r.rating !== Number(selectedRatingFilter)) return false;
      if (selectedDishFilter !== 'All' && r.menuItemId !== selectedDishFilter) return false;
      return true;
    });
  }, [publishedReviews, selectedCategory, selectedRatingFilter, selectedDishFilter]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please provide your name.');
      return;
    }

    if (!review.trim() || review.trim().length < 10) {
      toast.error('Please write a review of at least 10 characters.');
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      addReview({
        customerName: name.trim(),
        email: email.trim() || undefined,
        rating: Number(rating),
        category,
        menuItemId: selectedMenuItemId || undefined,
        review: review.trim(),
        bookingId: bookingId.trim() || undefined,
        status: 'Pending'
      });

      setIsSubmitting(false);
      setSubmittedSuccess(true);
      toast.success('Thank you for your feedback! Your review has been submitted for moderation.');

      // Reset form
      setName('');
      setEmail('');
      setRating(5);
      setCategory('Overall Experience');
      setSelectedMenuItemId('');
      setBookingId('');
      setReview('');
    }, 400);
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest">
          <span>Guest Stories & Dining Reviews</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Feedback & Guest Experiences
        </h1>
        <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
          Read genuine impressions from guests who dined at SUNSHINE, or share your own culinary journey with us.
        </p>

        {/* Live Aggregated Rating Trust Card */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-6 p-6 rounded-3xl bg-[#18120c] border border-amber-500/20 shadow-2xl max-w-2xl mx-auto">
          {/* Big Score Box */}
          <div className="flex items-center gap-4 sm:border-r border-stone-800 sm:pr-6 shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 text-stone-950 flex items-center justify-center font-serif text-3xl font-extrabold shadow-glow">
              {reviewStats.averageRating}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-4 h-4 ${
                      star <= Math.round(Number(reviewStats.averageRating)) 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-stone-700'
                    }`} 
                  />
                ))}
              </div>
              <div className="text-xs text-stone-300 mt-1">
                Overall Average Rating
              </div>
              <div className="text-[11px] text-stone-400">
                Based on <span className="font-bold text-white">{reviewStats.totalCount} published reviews</span>
              </div>
            </div>
          </div>

          {/* Star Breakdown Summary Bars */}
          <div className="flex-1 w-full space-y-1.5 text-xs">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = starBreakdown?.[star] || 0;
              const total = reviewStats.totalCount || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-10 text-[11px] text-stone-400 flex items-center gap-0.5 shrink-0">
                    <span>{star}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-stone-900 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                  <span className="w-6 text-right text-stone-400 font-mono text-[10px] shrink-0">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Feedback Submission Form (5 cols) */}
        <div className="lg:col-span-5 bg-[#18120c] rounded-3xl border border-amber-500/20 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <span>Share Your Feedback</span>
            </h2>
            <p className="text-xs text-stone-400">
              We appreciate your feedback regarding our food, service, and dining atmosphere.
            </p>
          </div>

          {submittedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-emerald-200">Thank you for your feedback!</span>
                <span className="text-stone-300">Your review has been successfully submitted and will appear in our public reviews after review by our concierge.</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Customer Name */}
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul.sharma@example.com"
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Star Rating Selector */}
            <div>
              <label className="block text-stone-300 font-semibold mb-2 uppercase tracking-wider text-[11px]">
                Rating *
              </label>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-900 border border-stone-800">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-125 transition-transform"
                    aria-label={`Select ${star} stars`}
                  >
                    <Star 
                      className={`w-6 h-6 transition-colors ${
                        star <= rating 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'text-stone-700 hover:text-amber-500/50'
                      }`} 
                    />
                  </button>
                ))}
                <span className="ml-3 font-bold text-amber-300 text-sm">
                  {rating} / 5 Stars
                </span>
              </div>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                Feedback Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-500 font-medium"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Product / Menu Item Dropdown (For Food specific reviews) */}
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                Dish / Menu Item {category === 'Food' ? '(Recommended)' : '(Optional)'}
              </label>
              <select
                value={selectedMenuItemId}
                onChange={(e) => setSelectedMenuItemId(e.target.value)}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="">-- General Restaurant Review (Whole Experience) --</option>
                {menu.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.category})
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-stone-500 mt-1 block">
                Select a dish to attach your rating directly to its product card and details.
              </span>
            </div>

            {/* Booking ID (Optional) */}
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                Booking ID or Token <span className="text-stone-500 lowercase">(optional)</span>
              </label>
              <input
                type="text"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                placeholder="e.g. SUN-2026-00128 or A7K42"
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 uppercase font-mono"
              />
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                Review / Feedback *
              </label>
              <textarea
                rows="4"
                required
                minLength="10"
                maxLength="500"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Tell us about your culinary experience, ambience, and hospitality..."
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 leading-relaxed"
              />
              <div className="flex justify-between items-center text-[10px] text-stone-500 mt-1">
                <span>Minimum 10 characters</span>
                <span>{review.length}/500</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Public Reviews Display (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-[#18120c] border border-amber-500/20 shadow-xl flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                <span className="text-stone-400 font-semibold flex items-center gap-1 shrink-0">
                  <Filter className="w-3.5 h-3.5 text-amber-400" />
                  <span>Category:</span>
                </span>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap font-medium ${
                    selectedCategory === 'All'
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'bg-stone-900 text-stone-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap font-medium ${
                      selectedCategory === cat
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'bg-stone-900 text-stone-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Rating Filter */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-stone-400 font-semibold">Stars:</span>
                <select
                  value={selectedRatingFilter}
                  onChange={(e) => setSelectedRatingFilter(e.target.value)}
                  className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-white text-xs"
                >
                  <option value="All">All Stars</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>

            {/* Filter by Specific Dish */}
            <div className="flex items-center gap-2 pt-2 border-t border-stone-800/80">
              <span className="text-stone-400 font-semibold shrink-0">Filter by Dish:</span>
              <select
                value={selectedDishFilter}
                onChange={(e) => setSelectedDishFilter(e.target.value)}
                className="w-full sm:w-auto p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-white text-xs"
              >
                <option value="All">All Dishes & General Reviews</option>
                {menu.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reviews List */}
          {filteredReviews.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#18120c] border border-stone-800 space-y-3">
              <MessageSquare className="w-10 h-10 text-stone-600 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-white">No reviews found in this filter</h3>
              <p className="text-xs text-stone-400">Be the first to share your experience in this category!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((rev) => {
                const dateStr = rev.createdAt 
                  ? new Date(rev.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                  : 'Recent Visit';

                const menuItem = rev.menuItemId ? menu.find(m => m.id === rev.menuItemId) : null;

                return (
                  <article
                    key={rev.id}
                    className="p-6 rounded-3xl bg-[#18120c] border border-amber-500/15 hover:border-amber-500/30 transition-all shadow-xl space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 shadow-sm">
                          <div className="w-full h-full bg-[#1c150f] rounded-full flex items-center justify-center text-amber-400 font-bold text-xs uppercase">
                            {rev.customerName.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-sm">
                            {rev.customerName}
                          </h3>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] text-amber-400 font-medium">
                              {rev.category}
                            </span>
                            {menuItem && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 text-[10px] font-semibold border border-amber-500/30">
                                <UtensilsCrossed className="w-2.5 h-2.5" />
                                <span>{menuItem.name}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-0.5 justify-end">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-3.5 h-3.5 ${
                                star <= rev.rating 
                                  ? 'fill-amber-400 text-amber-400' 
                                  : 'text-stone-700'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-stone-500 mt-1 block">
                          {dateStr}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed italic">
                      "{rev.review}"
                    </p>

                    {rev.bookingId && (
                      <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-stone-500">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Verified Dining Guest</span>
                        </span>
                        <span className="font-mono text-amber-400/80">Token: {rev.bookingId}</span>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
