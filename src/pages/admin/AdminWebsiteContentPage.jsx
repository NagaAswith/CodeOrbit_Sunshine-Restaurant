import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  FileEdit, 
  Save, 
  Sparkles, 
  Megaphone, 
  LayoutTemplate, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminWebsiteContentPage() {
  const { settings, updateSettings } = useRestaurant();
  const { isSuperAdmin, executeAdminMutation } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    heroTitle: settings.heroTitle || settings.tagline || 'Good food. Great moments.',
    heroSubtitle: settings.heroSubtitle || settings.subtitle || 'Fine Gastronomy & Artisanal Dining',
    heroDescription: settings.heroDescription || 'Discover fresh flavours, memorable dining and experiences made for every occasion. From slow-simmered handi delicacies to sizzling clay-oven grills.',
    announcement: settings.announcement || "Grand Awadhi Degustation Festival this weekend • Complimentary Chef's Tasting with reservations of 4 or more!",
    announcementEnabled: settings.announcementEnabled !== false,
    announcementLink: settings.announcementLink || '/events',
    aboutText: settings.aboutText || "SUNSHINE is born out of a deep reverence for fine culinary traditions, exquisite ingredients, and memorable gatherings. Every meal is an unhurried journey through vibrant spices, artisanal presentation, and heartfelt warmth.",
    footerAboutText: settings.footerAboutText || "Crafted with culinary reverence, locally-sourced produce, and centuries of authentic gastronomy.",
    footerCopyright: settings.footerCopyright || "SUNSHINE Restaurant & Dining Experience. All rights reserved."
  });

  const handleSave = async (e) => {
    e.preventDefault();

    if (!isSuperAdmin) {
      toast.error('Super Administrator privileges required to update website CMS content.');
      return;
    }

    const result = await executeAdminMutation('WEBSITE_CONTENT_UPDATE', 'Hero, Announcements, and Footer Content');
    if (!result.success) {
      toast.error(result.error || 'Server rejected CMS update. Super Admin role required.');
      return;
    }

    updateSettings(form);
    toast.success('Website content updated! Changes are live across customer pages.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-amber-400" />
            <span>Website Content & CMS</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Manage public homepage hero messaging, promotional announcement banners, about story, and footer metadata
          </p>
        </div>

        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-stone-300 hover:text-white text-xs transition-colors self-start sm:self-auto"
        >
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>View Live Site</span>
        </Link>
      </div>

      {/* Role Alert for Standard Admin */}
      {!isSuperAdmin && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold">Standard Admin View:</span> Website content editing is restricted to Super Administrators. You can inspect the current CMS text in read-only mode.
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Hero Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#160f0a] border border-amber-500/20 shadow-xl space-y-5">
          <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-stone-800">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Homepage Hero Section</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">Hero Headline Title *</label>
              <input
                type="text"
                required
                disabled={!isSuperAdmin}
                value={form.heroTitle}
                onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500 disabled:opacity-60"
              />
              <span className="block text-[10px] text-stone-400 mt-1">Appears as the prominent primary headline on the homepage.</span>
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">Hero Subtitle Badge</label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={form.heroSubtitle}
                onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500 disabled:opacity-60"
              />
              <span className="block text-[10px] text-stone-400 mt-1">Pill badge shown above the main title.</span>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-stone-300 font-semibold mb-1.5">Hero Supporting Description</label>
              <textarea
                rows="3"
                disabled={!isSuperAdmin}
                value={form.heroDescription}
                onChange={(e) => setForm({ ...form, heroDescription: e.target.value })}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500 disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Promotional Banner / Announcements */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#160f0a] border border-amber-500/20 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-amber-400" />
              <span>Promotional Announcement Banner</span>
            </h3>

            {/* Toggle Active Switch */}
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <span className="text-stone-400 font-medium">Display on Site:</span>
              <input
                type="checkbox"
                disabled={!isSuperAdmin}
                checked={form.announcementEnabled}
                onChange={(e) => setForm({ ...form, announcementEnabled: e.target.checked })}
                className="w-4 h-4 text-amber-500 rounded bg-stone-900 border-stone-700 focus:ring-amber-500 focus:ring-offset-stone-950"
              />
              <span className={`text-[11px] font-bold ${form.announcementEnabled ? 'text-emerald-400' : 'text-stone-500'}`}>
                {form.announcementEnabled ? 'Active' : 'Disabled'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-stone-300 font-semibold mb-1.5">Announcement / Alert Message</label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={form.announcement}
                onChange={(e) => setForm({ ...form, announcement: e.target.value })}
                placeholder="e.g. Special weekend degustation menu available..."
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">Action Link Route</label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={form.announcementLink}
                onChange={(e) => setForm({ ...form, announcementLink: e.target.value })}
                placeholder="/events or /reservation"
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500 disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Section 3: About Story & Philosophy */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#160f0a] border border-amber-500/20 shadow-xl space-y-5">
          <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-stone-800">
            <FileEdit className="w-4 h-4 text-amber-400" />
            <span>Culinary Heritage & About Text</span>
          </h3>

          <div className="text-xs">
            <label className="block text-stone-300 font-semibold mb-1.5">Restaurant Heritage Philosophy</label>
            <textarea
              rows="4"
              disabled={!isSuperAdmin}
              value={form.aboutText}
              onChange={(e) => setForm({ ...form, aboutText: e.target.value })}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500 disabled:opacity-60"
            />
            <span className="block text-[10px] text-stone-400 mt-1">Rendered on the /about page and dining philosophy sections.</span>
          </div>
        </div>

        {/* Section 4: Footer Information */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#160f0a] border border-amber-500/20 shadow-xl space-y-5">
          <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-stone-800">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Footer Metadata & Branding</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">Footer Short Blurb</label>
              <textarea
                rows="2"
                disabled={!isSuperAdmin}
                value={form.footerAboutText}
                onChange={(e) => setForm({ ...form, footerAboutText: e.target.value })}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">Copyright Statement</label>
              <textarea
                rows="2"
                disabled={!isSuperAdmin}
                value={form.footerCopyright}
                onChange={(e) => setForm({ ...form, footerCopyright: e.target.value })}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500 disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        {isSuperAdmin && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-glow hover:scale-105 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Publish Content Changes</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
