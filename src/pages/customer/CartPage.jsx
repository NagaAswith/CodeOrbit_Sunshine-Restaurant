import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  CalendarDays, 
  Clock, 
  FileText,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function CartPage() {
  const { 
    cart, 
    cartCount, 
    cartSubtotal, 
    cartTax, 
    cartTotal, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    settings 
  } = useRestaurant();

  const navigate = useNavigate();
  const toast = useToast();
  const [kitchenNotes, setKitchenNotes] = useState('');

  const handleClear = () => {
    if (window.confirm('Clear all items from your dining cart?')) {
      clearCart();
      toast.info('Cart cleared');
    }
  };

  const handleProceedToReservation = () => {
    navigate('/reservation', { state: { preorderedItems: cart, kitchenNotes } });
  };

  return (
    <div className="min-h-screen bg-[#120d09] text-stone-100 pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Digital Menu</span>
          </Link>
        </div>

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Dining Cart & Pre-Order
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Review your selected delicacies before table reservation or takeaway.
            </p>
          </div>

          {cart.length > 0 && (
            <button
              onClick={handleClear}
              className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-rose-950/40 border border-stone-800 hover:border-rose-500/40 text-stone-400 hover:text-rose-400 text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {/* Main Cart Content */}
        {cart.length === 0 ? (
          <div className="bg-[#18120c] rounded-3xl border border-stone-800 p-12 text-center max-w-lg mx-auto space-y-5">
            <div className="w-20 h-20 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center mx-auto text-stone-500">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-white">Your cart is currently empty</h2>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm mx-auto">
              You haven't added any dishes yet. Browse our curated appetizers, biryanis, tandoor flatbreads, and desserts.
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-glow transition-all"
            >
              <span>Explore Digital Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Columns: Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-4 sm:p-5 rounded-2xl bg-[#18120c] border border-stone-800/80 hover:border-amber-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-stone-900 shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        <h3 className="font-serif text-base sm:text-lg font-bold text-white">
                          {item.name}
                        </h3>
                      </div>
                      <div className="text-xs text-amber-400/90 font-medium mt-0.5">
                        {formatINR(item.unitPrice)} each
                      </div>

                      {/* Add-ons Chips */}
                      {item.addons && item.addons.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.addons.map((a, i) => (
                            <span key={i} className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md">
                              +{a.name} ({formatINR(a.price)})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Row Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-800">
                    <div className="flex items-center border border-stone-700 rounded-xl bg-stone-900 overflow-hidden">
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                        className="p-2 text-stone-400 hover:text-white transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                        className="p-2 text-stone-400 hover:text-white transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="text-xs font-bold text-amber-400 text-sm">
                        {formatINR(item.itemTotal)}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-stone-500 hover:text-rose-400 p-1.5 transition-colors"
                      title="Remove item"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Special Instructions Note Box */}
              <div className="p-5 rounded-2xl bg-[#18120c] border border-stone-800 space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <FileText className="w-4 h-4" />
                  <span>Special Kitchen or Dietary Requests</span>
                </label>
                <textarea
                  value={kitchenNotes}
                  onChange={(e) => setKitchenNotes(e.target.value)}
                  rows="2"
                  placeholder="e.g. Less spicy, Jain preparation, allergies to peanuts, extra lime..."
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Right Column: Bill Summary Card */}
            <div className="space-y-6">
              <div className="bg-[#18120c] rounded-3xl border border-amber-500/20 p-6 space-y-5 shadow-xl">
                <h3 className="font-serif text-xl font-bold text-white pb-3 border-b border-stone-800">
                  Order Summary
                </h3>

                <div className="space-y-3 text-xs text-stone-300">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Items Subtotal ({cartCount})</span>
                    <span className="font-semibold text-white">{formatINR(cartSubtotal)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Restaurant GST ({settings.gstPercent || 5}%)</span>
                    <span className="font-semibold text-white">{formatINR(cartTax)}</span>
                  </div>

                  <div className="flex items-center justify-between text-emerald-400">
                    <span>Dining Service Charge</span>
                    <span className="font-semibold">Complimentary</span>
                  </div>

                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-base font-bold text-white">
                    <span>Total Due</span>
                    <span className="text-amber-400 text-xl font-serif">{formatINR(cartTotal)}</span>
                  </div>
                </div>

                {/* Primary Proceed Action */}
                <button
                  onClick={handleProceedToReservation}
                  className="w-full flex items-center justify-center gap-2 py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>Attach to Table Reservation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-stone-400 text-center leading-relaxed">
                  Your selected dishes will be automatically attached to your table reservation token.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
