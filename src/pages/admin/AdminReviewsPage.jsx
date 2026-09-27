import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Star, 
  Search, 
  CheckCircle, 
  EyeOff, 
  Trash2, 
  Clock, 
  MessageSquare, 
  User, 
  Mail, 
  Hash,
  AlertCircle,
  ShieldCheck,
  Utensils
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Overall Experience',
  'Food',
  'Service',
  'Ambience',
  'Staff',
  'Booking Experience'
];

export default function AdminReviewsPage() {
  const { reviews, menuItems, updateReviewStatus, deleteReview } = useRestaurant();
  const { isSuperAdmin, executeAdminMutation } = useAuth();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredReviews = useMemo(() => {
    return reviews.filter(rev => {
      // Status filter
      if (statusFilter !== 'All' && rev.status !== statusFilter) return false;
      // Rating filter
      if (ratingFilter !== 'All' && rev.rating !== Number(ratingFilter)) return false;
      // Category filter
      if (categoryFilter !== 'All' && rev.category !== categoryFilter) return false;
      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = (rev.customerName || '').toLowerCase().includes(q);
        const matchesReview = (rev.review || '').toLowerCase().includes(q);
        const matchesBooking = (rev.bookingId || '').toLowerCase().includes(q);
        const matchesEmail = (rev.email || '').toLowerCase().includes(q);
        if (!matchesName && !matchesReview && !matchesBooking && !matchesEmail) return false;
      }
      return true;
    });
  }, [reviews, statusFilter, ratingFilter, categoryFilter, search]);

  const handlePublish = async (rev) => {
    if (!isSuperAdmin) {
      toast.error('Super Administrator privileges required to moderate reviews.');
      return;
    }
    const result = await executeAdminMutation('REVIEW_PUBLISH', `Review #${rev.id} (${rev.customerName})`);
    if (!result.success) {
      toast.error(result.error || 'Authorization failed. Super Admin role required.');
      return;
    }
    updateReviewStatus(rev.id, 'Published');
    toast.success(`Published review from ${rev.customerName}! It is now visible to customers.`);
  };

  const handleHide = async (rev) => {
    if (!isSuperAdmin) {
      toast.error('Super Administrator privileges required to moderate reviews.');
      return;
    }
    const result = await executeAdminMutation('REVIEW_HIDE', `Review #${rev.id} (${rev.customerName})`);
    if (!result.success) {
      toast.error(result.error || 'Authorization failed. Super Admin role required.');
      return;
    }
    updateReviewStatus(rev.id, 'Hidden');
    toast.info(`Review from ${rev.customerName} has been hidden from public display.`);
  };

  const handleDelete = async (rev) => {
    if (!isSuperAdmin) {
      toast.error('Only Super Administrators can permanently delete customer reviews.');
      return;
    }
    if (window.confirm(`Permanently delete feedback from "${rev.customerName}"?`)) {
      const result = await executeAdminMutation('REVIEW_DELETE', `Review #${rev.id} (${rev.customerName})`);
      if (!result.success) {
        toast.error(result.error || 'Authorization failed. Super Admin role required.');
        return;
      }
      deleteReview(rev.id);
      toast.success(`Deleted review from ${rev.customerName}.`);
    }
  };

  const pendingCount = reviews.filter(r => r.status === 'Pending').length;
  const publishedCount = reviews.filter(r => r.status === 'Published').length;
  const hiddenCount = reviews.filter(r => r.status === 'Hidden').length;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Customer Feedback & Reviews</h2>
          <p className="text-xs text-stone-400">Moderate customer testimonials, approve pending reviews, or hide inappropriate feedback</p>
        </div>

        {/* Quick Stat Badges */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs">
            <span className="text-stone-400">Total: </span>
            <span className="font-bold text-white">{reviews.length}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
            <span className="text-stone-400">Published: </span>
            <span className="font-bold text-emerald-400">{publishedCount}</span>
          </div>
          {pendingCount > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-300 animate-pulse">
              <span className="text-stone-400">Pending: </span>
              <span className="font-bold text-amber-400">{pendingCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Role Notice for Standard Admin */}
      {!isSuperAdmin && (
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold">Standard Admin View:</span> Customer feedback is read-only. Approving pending reviews, publishing, hiding, and deleting reviews requires Super Administrator privileges.
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#160f0a] border border-amber-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, review, booking ID, or email..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Statuses ({reviews.length})</option>
              <option value="Pending">Pending ({pendingCount})</option>
              <option value="Published">Published ({publishedCount})</option>
              <option value="Hidden">Hidden ({hiddenCount})</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400">Rating:</span>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Reviews Table */}
      <div className="rounded-3xl bg-[#160f0a] border border-amber-500/20 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1a120c] border-b border-stone-800 text-stone-400 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Customer & Contact</th>
                <th className="py-3.5 px-4">Rating & Category</th>
                <th className="py-3.5 px-4">Review Content</th>
                <th className="py-3.5 px-4">Submitted Date</th>
                <th className="py-3.5 px-4">Moderation Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-stone-500">
                    No reviews found matching the current search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((rev) => {
                  const dateStr = rev.createdAt 
                    ? new Date(rev.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : 'Recent';

                  return (
                    <tr key={rev.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Customer Info & Dish */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-bold text-white text-sm">{rev.customerName}</div>
                        {rev.email && <div className="text-[11px] text-stone-400">{rev.email}</div>}
                        {rev.bookingId && (
                          <div className="text-[10px] text-amber-400/90 font-mono mt-0.5">
                            Token/ID: {rev.bookingId}
                          </div>
                        )}
                        {rev.menuItemId && (() => {
                          const item = menuItems.find(m => m.id === rev.menuItemId);
                          return (
                            <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300 font-medium">
                              <Utensils className="w-2.5 h-2.5 text-amber-400" />
                              <span>Dish: {item ? item.name : rev.menuItemId}</span>
                            </div>
                          );
                        })()}
                      </td>

                      {/* Rating & Category */}
                      <td className="py-4 px-4 whitespace-nowrap">
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
                          <span className="ml-1 font-bold text-white text-xs">{rev.rating}.0</span>
                        </div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-900 border border-stone-800 text-stone-300">
                          {rev.category}
                        </span>
                      </td>

                      {/* Review Text */}
                      <td className="py-4 px-4 max-w-md">
                        <p className="text-xs text-stone-200 leading-relaxed italic line-clamp-3">
                          "{rev.review}"
                        </p>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-stone-400 whitespace-nowrap text-[11px]">
                        {dateStr}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          rev.status === 'Published'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : rev.status === 'Pending'
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            : 'bg-stone-800 text-stone-400 border-stone-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            rev.status === 'Published'
                              ? 'bg-emerald-400'
                              : rev.status === 'Pending'
                              ? 'bg-amber-400 animate-pulse'
                              : 'bg-stone-500'
                          }`} />
                          <span>{rev.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        {isSuperAdmin ? (
                          <div className="flex items-center justify-end gap-1.5">
                            {rev.status !== 'Published' && (
                              <button
                                onClick={() => handlePublish(rev)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold transition-all hover:scale-105"
                                title="Approve and Publish to customer site"
                              >
                                Publish
                              </button>
                            )}

                            {rev.status !== 'Hidden' && (
                              <button
                                onClick={() => handleHide(rev)}
                                className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-[11px] font-semibold transition-all"
                                title="Hide from customer site"
                              >
                                Hide
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(rev)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                              title="Delete review"
                              aria-label={`Delete review from ${rev.customerName}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-stone-500 italic">Read-only</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
