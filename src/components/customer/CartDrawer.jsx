import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  CalendarDays,
  Sparkles
} from 'lucide-react';

export default function CartDrawer() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
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

  if (!isCartOpen) return null;

  const handleProceedToBooking = () => {
    setIsCartOpen(false);
    navigate('/reservation');
  };

  const handleClear = () => {
    if (window.confirm('Clear all items from your cart?')) {
      clearCart();
      toast.info('Cart cleared');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsCartOpen(false)}
    >
      <div 
        className="absolute inset-y-0 right-0 max-w-full flex pl-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md bg-[#160f0a] border-l border-amber-500/20 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-5 bg-[#1a120c] border-b border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-white">Your Dining Cart</h2>
                <span className="text-xs text-stone-400">{cartCount} {cartCount === 1 ? 'item' : 'items'} selected</span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-200">Your cart is currently empty</h3>
                  <p className="text-xs text-stone-400 mt-1 max-w-xs">
                    Explore our artisanal appetizers, curries, tandoor specials, and desserts to add to your dining experience.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/menu');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-glow transition-all"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-4 rounded-2xl bg-[#1c150f] border border-stone-800/80 hover:border-amber-500/30 transition-all flex gap-3.5"
                >
                  {/* Item Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover bg-stone-900 shrink-0"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                    }}
                  />

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          <h4 className="text-sm font-bold text-white line-clamp-1">{item.name}</h4>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-stone-500 hover:text-rose-400 p-1 transition-colors"
                          title="Remove item"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Add-ons list if any */}
                      {item.addons && item.addons.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.addons.map((a, i) => (
                            <span key={i} className="text-[10px] text-amber-400/80 bg-amber-500/10 px-1.5 py-0.5 rounded">
                              +{a.name} ({formatINR(a.price)})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-800/60">
                      <span className="text-xs font-bold text-amber-400">
                        {formatINR(item.itemTotal)}
                      </span>

                      {/* Stepper */}
                      <div className="flex items-center border border-stone-700 rounded-lg bg-stone-900 overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1 text-stone-400 hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1 text-stone-400 hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Billing Section */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#130e09] border-t border-amber-500/20 space-y-4">
              <div className="space-y-1.5 text-xs text-stone-400">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="text-stone-200 font-medium">{formatINR(cartSubtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Restaurant GST ({settings.gstPercent || 5}%)</span>
                  <span className="text-stone-200 font-medium">{formatINR(cartTax)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-sm font-bold text-white">
                  <span>Total Amount</span>
                  <span className="text-amber-400 text-base">{formatINR(cartTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={handleProceedToBooking}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>Reserve Table with these items</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/menu');
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-semibold transition-colors"
                  >
                    Continue Ordering
                  </button>
                  <button
                    onClick={handleClear}
                    className="py-2 px-3 rounded-xl bg-stone-900 hover:bg-rose-950/40 border border-stone-800 hover:border-rose-500/40 text-stone-400 hover:text-rose-400 text-xs transition-colors"
                    title="Clear all cart items"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
