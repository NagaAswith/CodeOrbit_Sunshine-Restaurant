import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { initialData } from '../data/initialData';
import { getStoredData, saveStoredData, resetStoredData } from '../utils/storage';
import { generateBookingId, generateToken } from '../utils/formatters';

const RestaurantContext = createContext(null);

export function RestaurantProvider({ children }) {
  // Master state initialized from localStorage
  const [data, setData] = useState(() => getStoredData(initialData));

  // Customer Shopping Cart (persisted in separate session storage key or inside main state)
  const [cart, setCart] = useState(() => {
    try {
      const stored = sessionStorage.getItem('sunshine_customer_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Food Detail Modal state
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);
  // Cart Drawer open/close state
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync state to localStorage whenever `data` changes
  useEffect(() => {
    saveStoredData(data);
  }, [data]);

  // Sync cart to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('sunshine_customer_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Listen for storage events from other tabs or windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'sunshine_restaurant_db_v1' && e.newValue) {
        try {
          setData(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
    };
    const handleCustomUpdate = (e) => {
      if (e.detail) {
        setData(e.detail);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sunshine_db_updated', handleCustomUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sunshine_db_updated', handleCustomUpdate);
    };
  }, []);

  // ----------------------------------------------------------------------
  // MENU OPERATIONS
  // ----------------------------------------------------------------------
  const addMenuItem = useCallback((item) => {
    setData(prev => {
      const newItem = {
        ...item,
        id: `menu-${Date.now()}`,
        price: Number(item.price),
        spiceLevel: Number(item.spiceLevel || 0),
        isVeg: Boolean(item.isVeg),
        isAvailable: item.isAvailable !== undefined ? Boolean(item.isAvailable) : true,
        isPopular: Boolean(item.isPopular),
        isChefSpecial: Boolean(item.isChefSpecial),
        ingredients: Array.isArray(item.ingredients) ? item.ingredients : (item.ingredients ? item.ingredients.split(',').map(s => s.trim()) : []),
        addons: Array.isArray(item.addons) ? item.addons : []
      };
      return {
        ...prev,
        menu: [newItem, ...prev.menu]
      };
    });
  }, []);

  const updateMenuItem = useCallback((id, updates) => {
    setData(prev => ({
      ...prev,
      menu: prev.menu.map(item => item.id === id ? { ...item, ...updates } : item)
    }));
  }, []);

  const deleteMenuItem = useCallback((id) => {
    setData(prev => ({
      ...prev,
      menu: prev.menu.filter(item => item.id !== id)
    }));
  }, []);

  const toggleMenuAvailability = useCallback((id) => {
    setData(prev => ({
      ...prev,
      menu: prev.menu.map(item => item.id === id ? { ...item, isAvailable: !item.isAvailable } : item)
    }));
  }, []);

  // ----------------------------------------------------------------------
  // EVENT OPERATIONS
  // ----------------------------------------------------------------------
  const addEvent = useCallback((event) => {
    setData(prev => {
      const newEvent = {
        ...event,
        id: `event-${Date.now()}`,
        availableSeats: Number(event.availableSeats || 20),
        isActive: true
      };
      return {
        ...prev,
        events: [newEvent, ...prev.events]
      };
    });
  }, []);

  const updateEvent = useCallback((id, updates) => {
    setData(prev => ({
      ...prev,
      events: prev.events.map(ev => ev.id === id ? { ...ev, ...updates } : ev)
    }));
  }, []);

  const deleteEvent = useCallback((id) => {
    setData(prev => ({
      ...prev,
      events: prev.events.filter(ev => ev.id !== id)
    }));
  }, []);

  const toggleEventActive = useCallback((id) => {
    setData(prev => ({
      ...prev,
      events: prev.events.map(ev => ev.id === id ? { ...ev, isActive: !ev.isActive } : ev)
    }));
  }, []);

  // ----------------------------------------------------------------------
  // TIME SLOT OPERATIONS
  // ----------------------------------------------------------------------
  const addTimeSlot = useCallback((slot) => {
    setData(prev => {
      const newSlot = {
        ...slot,
        id: `slot-${Date.now()}`,
        maxBookings: Number(slot.maxBookings || 10),
        availableSeats: Number(slot.availableSeats || slot.maxBookings || 10),
        isActive: true
      };
      return {
        ...prev,
        timeSlots: [...prev.timeSlots, newSlot]
      };
    });
  }, []);

  const updateTimeSlot = useCallback((id, updates) => {
    setData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map(slot => slot.id === id ? { ...slot, ...updates } : slot)
    }));
  }, []);

  const deleteTimeSlot = useCallback((id) => {
    setData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter(slot => slot.id !== id)
    }));
  }, []);

  const toggleTimeSlotActive = useCallback((id) => {
    setData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map(slot => slot.id === id ? { ...slot, isActive: !slot.isActive } : slot)
    }));
  }, []);

  // ----------------------------------------------------------------------
  // PRICING & SETTINGS OPERATIONS
  // ----------------------------------------------------------------------
  const updatePricing = useCallback((newPricing) => {
    setData(prev => ({
      ...prev,
      pricing: { ...prev.pricing, ...newPricing }
    }));
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  }, []);

  // ----------------------------------------------------------------------
  // BOOKING OPERATIONS
  // ----------------------------------------------------------------------
  const createBooking = useCallback((bookingData) => {
    const sequence = (data.bookings?.length || 0) + 129;
    const newId = generateBookingId(sequence);
    const newToken = generateToken();

    const newBooking = {
      ...bookingData,
      id: newId,
      token: newToken,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    setData(prev => {
      // update or create customer record
      const existingCust = prev.customers.find(c => 
        (c.phone && c.phone === bookingData.phone) || 
        (c.email && c.email.toLowerCase() === (bookingData.email || '').toLowerCase())
      );

      let updatedCustomers;
      if (existingCust) {
        updatedCustomers = prev.customers.map(c => c.id === existingCust.id ? {
          ...c,
          bookingsCount: c.bookingsCount + 1,
          totalSpend: c.totalSpend + Number(bookingData.amount || 0),
          lastVisit: bookingData.date
        } : c);
      } else {
        const newCust = {
          id: `cust-${Date.now()}`,
          name: bookingData.customerName,
          phone: bookingData.phone,
          email: bookingData.email || `${bookingData.customerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          bookingsCount: 1,
          totalSpend: Number(bookingData.amount || 0),
          lastVisit: bookingData.date,
          status: 'New Guest'
        };
        updatedCustomers = [newCust, ...prev.customers];
      }

      return {
        ...prev,
        bookings: [newBooking, ...prev.bookings],
        customers: updatedCustomers
      };
    });

    return newBooking;
  }, [data.bookings]);

  const updateBookingStatus = useCallback((id, status) => {
    setData(prev => ({
      ...prev,
      bookings: prev.bookings.map(b => b.id === id ? { ...b, status } : b)
    }));
  }, []);

  const editBooking = useCallback((id, updates) => {
    setData(prev => ({
      ...prev,
      bookings: prev.bookings.map(b => b.id === id ? { ...b, ...updates } : b)
    }));
  }, []);

  const deleteBooking = useCallback((id) => {
    setData(prev => ({
      ...prev,
      bookings: prev.bookings.filter(b => b.id !== id)
    }));
  }, []);

  // Token Verification
  const verifyToken = useCallback((token) => {
    if (!token) return null;
    const cleanToken = token.trim().toUpperCase();
    return data.bookings.find(b => 
      b.token.toUpperCase() === cleanToken || 
      b.id.toUpperCase() === cleanToken
    ) || null;
  }, [data.bookings]);

  const checkInWithToken = useCallback((token) => {
    const booking = verifyToken(token);
    if (!booking) return { success: false, message: 'Invalid or expired token.' };
    
    updateBookingStatus(booking.id, 'Checked In');
    return { success: true, booking: { ...booking, status: 'Checked In' } };
  }, [verifyToken, updateBookingStatus]);

  // ----------------------------------------------------------------------
  // CUSTOMER REVIEW OPERATIONS
  // ----------------------------------------------------------------------
  const addReview = useCallback((reviewData) => {
    const sanitize = (text) => (typeof text === 'string' ? text.replace(/<[^>]*>?/gm, '').trim() : '');
    const newReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      customerName: sanitize(reviewData.customerName) || 'Valued Guest',
      email: sanitize(reviewData.email) || undefined,
      rating: Math.min(5, Math.max(1, Number(reviewData.rating) || 5)),
      category: sanitize(reviewData.category) || 'Overall Experience',
      review: sanitize(reviewData.review),
      menuItemId: reviewData.menuItemId || null,
      bookingId: sanitize(reviewData.bookingId) || undefined,
      status: reviewData.status || 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      reviews: [newReview, ...(prev.reviews || [])]
    }));
    return newReview;
  }, []);

  const updateReviewStatus = useCallback((id, status) => {
    setData(prev => ({
      ...prev,
      reviews: (prev.reviews || []).map(r => r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r)
    }));
  }, []);

  const deleteReview = useCallback((id) => {
    setData(prev => ({
      ...prev,
      reviews: (prev.reviews || []).filter(r => r.id !== id)
    }));
  }, []);

  // ----------------------------------------------------------------------
  // CART OPERATIONS
  // ----------------------------------------------------------------------
  const addToCart = useCallback((menuItem, quantity = 1, selectedAddons = []) => {
    setCart(prev => {
      // generate unique cart item key based on item ID and addons
      const addonIds = selectedAddons.map(a => a.id).sort().join(',');
      const cartItemId = `${menuItem.id}-${addonIds}`;

      const existingIndex = prev.findIndex(item => item.cartItemId === cartItemId);
      const addonsPrice = selectedAddons.reduce((sum, a) => sum + Number(a.price), 0);
      const unitPrice = Number(menuItem.price) + addonsPrice;

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          itemTotal: newQty * unitPrice
        };
        return updated;
      } else {
        const newCartItem = {
          cartItemId,
          menuItemId: menuItem.id,
          name: menuItem.name,
          category: menuItem.category,
          price: menuItem.price,
          unitPrice,
          quantity,
          addons: selectedAddons,
          image: menuItem.image,
          isVeg: menuItem.isVeg,
          itemTotal: unitPrice * quantity
        };
        return [...prev, newCartItem];
      }
    });
  }, []);

  const updateCartQuantity = useCallback((cartItemId, newQty) => {
    setCart(prev => {
      if (newQty <= 0) {
        return prev.filter(item => item.cartItemId !== cartItemId);
      }
      return prev.map(item => item.cartItemId === cartItemId ? {
        ...item,
        quantity: newQty,
        itemTotal: item.unitPrice * newQty
      } : item);
    });
  }, []);

  const removeFromCart = useCallback((cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Cart calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.itemTotal || 0), 0);
  }, [cart]);

  const gstPercent = data.settings?.gstPercent || 5;
  const cartTax = useMemo(() => {
    return Math.round((cartSubtotal * gstPercent) / 100);
  }, [cartSubtotal, gstPercent]);

  const cartTotal = useMemo(() => {
    return cartSubtotal + cartTax;
  }, [cartSubtotal, cartTax]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // ----------------------------------------------------------------------
  // RESET DEMO DATA
  // ----------------------------------------------------------------------
  const resetAllData = useCallback(() => {
    const fresh = resetStoredData(initialData);
    setData(fresh);
    setCart([]);
  }, []);

  // Compute live dashboard metrics
  const liveStats = useMemo(() => {
    const totalBookings = data.bookings.length;
    const pending = data.bookings.filter(b => b.status === 'Pending').length;
    const confirmed = data.bookings.filter(b => b.status === 'Confirmed').length;
    const checkedIn = data.bookings.filter(b => b.status === 'Checked In').length;
    const completed = data.bookings.filter(b => b.status === 'Completed').length;
    const cancelled = data.bookings.filter(b => b.status === 'Cancelled').length;

    // Calculate revenue from active non-cancelled bookings
    const totalRevenue = data.bookings
      .filter(b => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + Number(b.amount || 0), 0);

    return {
      totalBookings: totalBookings + 120, // base demo offset
      todayBookings: 24,
      pending,
      confirmed,
      checkedIn,
      completed,
      cancelled,
      todayRevenue: 48650,
      totalRevenue: totalRevenue + 142000
    };
  }, [data.bookings]);

  // Derived Review Statistics
  const reviews = useMemo(() => data.reviews || [], [data.reviews]);
  const publishedReviews = useMemo(() => {
    return reviews.filter(r => (r.status || '').toLowerCase() === 'published');
  }, [reviews]);

  const starBreakdown = useMemo(() => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    publishedReviews.forEach(r => {
      const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
      breakdown[star] = (breakdown[star] || 0) + 1;
    });
    return breakdown;
  }, [publishedReviews]);

  const reviewStats = useMemo(() => {
    const pub = publishedReviews;
    if (pub.length === 0) {
      return { averageRating: '5.0', totalCount: 0, starBreakdown };
    }
    const sum = pub.reduce((acc, r) => acc + Number(r.rating || 5), 0);
    const avg = (sum / pub.length).toFixed(1);
    return {
      averageRating: avg,
      totalCount: pub.length,
      starBreakdown
    };
  }, [publishedReviews, starBreakdown]);

  // Product specific reviews & rating calculation
  const getProductReviewStats = useCallback((menuItemId) => {
    if (!menuItemId) {
      return { averageRating: '5.0', totalCount: 0, reviews: [], starBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }
    const itemReviews = publishedReviews.filter(r => r.menuItemId === menuItemId);
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    itemReviews.forEach(r => {
      const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
      breakdown[star] = (breakdown[star] || 0) + 1;
    });

    if (itemReviews.length === 0) {
      return {
        averageRating: '5.0',
        totalCount: 0,
        reviews: [],
        starBreakdown: breakdown
      };
    }

    const sum = itemReviews.reduce((acc, r) => acc + Number(r.rating || 5), 0);
    const avg = (sum / itemReviews.length).toFixed(1);
    return {
      averageRating: avg,
      totalCount: itemReviews.length,
      reviews: itemReviews,
      starBreakdown: breakdown
    };
  }, [publishedReviews]);

  const contextValue = {
    // State
    menu: data.menu,
    events: data.events,
    timeSlots: data.timeSlots,
    pricing: data.pricing,
    settings: data.settings,
    bookings: data.bookings,
    customers: data.customers,
    reviews,
    publishedReviews,
    reviewStats,
    starBreakdown,
    getProductReviewStats,
    liveStats,

    // Modal & Drawer State
    selectedFoodItem,
    setSelectedFoodItem,
    isCartOpen,
    setIsCartOpen,

    // Cart
    cart,
    cartCount,
    cartSubtotal,
    cartTax,
    cartTotal,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,

    // CRUD
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuAvailability,

    addEvent,
    updateEvent,
    deleteEvent,
    toggleEventActive,

    addTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
    toggleTimeSlotActive,

    updatePricing,
    updateSettings,

    createBooking,
    updateBookingStatus,
    editBooking,
    deleteBooking,
    verifyToken,
    checkInWithToken,

    addReview,
    updateReviewStatus,
    deleteReview,

    resetAllData
  };

  return (
    <RestaurantContext.Provider value={contextValue}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}
