import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import { 
  DollarSign, 
  DoorClosed, 
  Check, 
  Save, 
  Sparkles, 
  Layers,
  Info,
  AlertCircle
} from 'lucide-react';

export default function AdminPricingPage() {
  const { pricing, updatePricing } = useRestaurant();
  const { isSuperAdmin, executeAdminMutation } = useAuth();
  const toast = useToast();
  const location = useLocation();

  const [form, setForm] = useState({ ...pricing });

  useEffect(() => {
    setForm({ ...pricing });
  }, [pricing]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!isSuperAdmin) {
      toast.error('Super Administrator privileges required to modify restaurant pricing.');
      return;
    }

    const result = await executeAdminMutation('PRICING_UPDATE', `VIP Seat: ${form.vipSeatPrice}, Normal: ${form.normalSeatPrice}, AC Room: ${form.acRoomPrice}`);
    if (!result.success) {
      toast.error(result.error || 'Server rejected pricing update.');
      return;
    }

    updatePricing({
      vipSeatPrice: Number(form.vipSeatPrice),
      normalSeatPrice: Number(form.normalSeatPrice),
      acRoomPrice: Number(form.acRoomPrice),
      acRoomLabel: form.acRoomLabel,
      nonAcRoomPrice: Number(form.nonAcRoomPrice),
      nonAcRoomLabel: form.nonAcRoomLabel,
    });
    toast.success('Table & Room pricing updated! Live customer quotes recalculated.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      <div>
        <h2 className="font-serif text-2xl font-bold text-white">Table & Room Pricing Configuration</h2>
        <p className="text-xs text-stone-400">Configure cover charges for normal tables, VIP booths, and private dining banquet suites</p>
      </div>

      {/* Role Alert for Standard Admin */}
      {!isSuperAdmin && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold">Standard Admin View:</span> Table and suite pricing is read-only. Updating tariff prices requires Super Administrator privileges.
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: Table Pricing */}
        <div id="tables" className="p-6 sm:p-8 rounded-3xl bg-[#160f0a] border border-amber-500/20 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-400" />
              <span>Table Seating Cover Charges</span>
            </h3>
            <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">
              Per Guest Rate
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Normal Seat Price */}
            <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
              <div>
                <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1">
                  Normal Table Seat Price (₹) *
                </label>
                <p className="text-stone-400 text-[11px]">Standard central dining hall reservation per guest</p>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-amber-400">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.normalSeatPrice}
                  onChange={(e) => setForm({ ...form, normalSeatPrice: Number(e.target.value) })}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-white font-bold text-base focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* VIP Seat Price */}
            <div className="p-5 rounded-2xl bg-stone-900/60 border border-amber-500/30 space-y-3">
              <div>
                <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span>VIP Lounge Booth Seat Price (₹) *</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </label>
                <p className="text-stone-400 text-[11px]">Premium plush booth with tableside butler service</p>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-amber-400">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.vipSeatPrice}
                  onChange={(e) => setForm({ ...form, vipSeatPrice: Number(e.target.value) })}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-amber-400 font-bold text-base focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Room Pricing (Preserving Reference functionality) */}
        <div id="rooms" className="p-6 sm:p-8 rounded-3xl bg-[#160f0a] border border-amber-500/20 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              <DoorClosed className="w-5 h-5 text-amber-400" />
              <span>Private Dining & Banquet Room Pricing</span>
            </h3>
            <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">
              Fixed Space Booking
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            
            {/* AC Room Pricing */}
            <div className="p-5 rounded-2xl bg-stone-900/60 border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase tracking-wider text-xs">AC Private Room</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px]">
                  {form.acRoomLabel || 'Recommended'}
                </span>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">AC Room Fixed Price (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-amber-400">₹</span>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.acRoomPrice}
                    onChange={(e) => setForm({ ...form, acRoomPrice: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-white font-bold text-base focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Badge Tag Label</label>
                <input
                  type="text"
                  value={form.acRoomLabel}
                  onChange={(e) => setForm({ ...form, acRoomLabel: e.target.value })}
                  placeholder="e.g. Recommended"
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white"
                />
              </div>
            </div>

            {/* Non-AC Room Pricing */}
            <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase tracking-wider text-xs">Non-AC Courtyard Hall</span>
                <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 font-bold text-[10px]">
                  {form.nonAcRoomLabel || 'Budget Friendly'}
                </span>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Non-AC Room Fixed Price (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-amber-400">₹</span>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.nonAcRoomPrice}
                    onChange={(e) => setForm({ ...form, nonAcRoomPrice: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-white font-bold text-base focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Badge Tag Label</label>
                <input
                  type="text"
                  value={form.nonAcRoomLabel}
                  onChange={(e) => setForm({ ...form, nonAcRoomLabel: e.target.value })}
                  placeholder="e.g. Budget Friendly"
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Save Button */}
        {isSuperAdmin && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-glow hover:scale-105 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save All Pricing Changes</span>
            </button>
          </div>
        )}

      </form>
    </div>
  );
}
