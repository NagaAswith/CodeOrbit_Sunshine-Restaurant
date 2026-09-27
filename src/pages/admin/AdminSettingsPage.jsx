import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Phone, 
  MessageSquare, 
  Mail, 
  MapPin, 
  Clock, 
  FileText,
  UtensilsCrossed,
  ShieldAlert,
  ShieldCheck,
  History,
  Lock,
  AlertCircle
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { settings, updateSettings, resetAllData } = useRestaurant();
  const { isSuperAdmin, adminUser, executeAdminMutation, fetchAuditLogs } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({ ...settings });
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const loadLogs = async () => {
    setLoadingLogs(true);
    try {
      const logs = await fetchAuditLogs();
      setAuditLogs(logs || []);
    } catch {
      setAuditLogs([]);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      toast.error('Super Administrator privileges required to update business settings.');
      return;
    }
    const result = await executeAdminMutation('SETTINGS_UPDATE', `Business settings updated by ${adminUser?.email}`);
    if (!result.success) {
      toast.error(result.error || 'Server rejected settings update. Super Admin role required.');
      return;
    }
    updateSettings(form);
    toast.success('Restaurant business settings saved successfully!');
    loadLogs();
  };

  const handleResetData = async () => {
    if (!isSuperAdmin) {
      toast.error('Only Super Administrators are permitted to reset factory demo data.');
      return;
    }
    if (window.confirm('Reset ALL demo data (menu, events, bookings, pricing, settings) back to factory defaults?')) {
      const result = await executeAdminMutation('DATA_RESET', 'Factory Defaults Reset');
      if (!result.success) {
        toast.error(result.error || 'Server rejected data reset.');
        return;
      }
      resetAllData();
      toast.success('All demo data restored to original state!');
      setForm({ ...settings });
      loadLogs();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      <div>
        <h2 className="font-serif text-2xl font-bold text-white">Business & Restaurant Settings</h2>
        <p className="text-xs text-stone-400">Configure brand identity, official contact details, operational shifts and culinary information</p>
      </div>

      {/* Role Alert */}
      {!isSuperAdmin && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold">Standard Admin View:</span> Business configurations, Google Maps URL, and contact settings are read-only. Modifications require Super Administrator privileges.
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Brand Information */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#160f0a] border border-amber-500/20 shadow-xl space-y-4">
          <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-stone-800">
            <UtensilsCrossed className="w-4 h-4 text-amber-400" />
            <span>Brand Identity & Tagline</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">Restaurant Brand Name *</label>
              <input
                type="text"
                required
                value={form.restaurantName}
                onChange={(e) => setForm({ ...form, restaurantName: e.target.value })}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">Subtitle</label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-stone-300 font-semibold mb-1.5">Official Brand Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Contact & Concierge */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#160f0a] border border-amber-500/20 shadow-xl space-y-4">
          <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-stone-800">
            <Phone className="w-4 h-4 text-amber-400" />
            <span>Contact & WhatsApp Concierge</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">Phone Number *</label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">WhatsApp Concierge Number</label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">Concierge Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-stone-300 font-semibold mb-1.5">Physical Restaurant Address</label>
              <input
                type="text"
                value={form.address || ''}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-stone-300 font-semibold mb-1.5">Google Maps URL</label>
              <input
                type="url"
                value={form.googleMapsUrl || ''}
                onChange={(e) => setForm({ ...form, googleMapsUrl: e.target.value })}
                placeholder="https://maps.google.com/?q=..."
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
              />
              <span className="block text-[11px] text-stone-400 mt-1">Used by customers to open the restaurant's live GPS navigation and directions.</span>
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#160f0a] border border-amber-500/20 shadow-xl space-y-4">
          <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-stone-800">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Operating Hours & Schedule</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">Opening Time</label>
              <input
                type="text"
                value={form.openingTime}
                onChange={(e) => setForm({ ...form, openingTime: e.target.value })}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">Closing Time</label>
              <input
                type="text"
                value={form.closingTime}
                onChange={(e) => setForm({ ...form, closingTime: e.target.value })}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">Business Days</label>
              <input
                type="text"
                value={form.businessDays}
                onChange={(e) => setForm({ ...form, businessDays: e.target.value })}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Culinary About Story */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#160f0a] border border-amber-500/20 shadow-xl space-y-4">
          <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-stone-800">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Culinary Story & Overview</span>
          </h3>

          <div className="text-xs">
            <label className="block text-stone-300 font-semibold mb-1.5">About Text (Appears on Customer Website)</label>
            <textarea
              rows="3"
              value={form.aboutText}
              onChange={(e) => setForm({ ...form, aboutText: e.target.value })}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            type="button"
            disabled={!isSuperAdmin}
            onClick={handleResetData}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-rose-950/40 border border-stone-800 hover:border-rose-500/40 text-stone-400 hover:text-rose-400 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Factory Demo Data</span>
          </button>

          {isSuperAdmin && (
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-glow hover:scale-105 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Business Settings</span>
            </button>
          )}
        </div>

      </form>

      {/* Security Audit Log & Operational Trail */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#160f0a] border border-amber-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            <span>Security Audit Log & Activity Trail</span>
          </h3>

          <button
            type="button"
            onClick={loadLogs}
            disabled={loadingLogs}
            className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-stone-300 text-xs flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${loadingLogs ? 'animate-spin text-amber-400' : 'text-stone-400'}`} />
            <span>Refresh Logs</span>
          </button>
        </div>

        <p className="text-xs text-stone-400">
          Immutable server-side recorded administrative mutations, role checks, and configuration updates. Sensitive credentials and passwords are strictly excluded from logging.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1a120c] border-b border-stone-800 text-stone-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Admin Role</th>
                <th className="py-2.5 px-3">Admin Email</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Target Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-mono text-[11px]">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-stone-500 font-sans">
                    No administrative mutations logged in this session yet.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 whitespace-nowrap text-stone-400">
                      {new Date(log.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.adminRole === 'super_admin'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-stone-800 text-stone-300'
                      }`}>
                        {log.adminRole}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-stone-300 whitespace-nowrap">
                      {log.adminEmail}
                    </td>
                    <td className="py-2.5 px-3 text-amber-300 font-bold whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-3 text-stone-300">
                      {log.target || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
