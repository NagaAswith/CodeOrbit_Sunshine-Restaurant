import React, { useState, useRef, useMemo } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Image as ImageIcon, 
  Upload, 
  Plus, 
  Copy, 
  Check, 
  ExternalLink, 
  Search, 
  Filter, 
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Trash2
} from 'lucide-react';

export default function AdminMediaPage() {
  const { menu, events } = useRestaurant();
  const { isSuperAdmin, executeAdminMutation } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [copiedUrl, setCopiedUrl] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [customUploads, setCustomUploads] = useState(() => {
    try {
      const saved = localStorage.getItem('sunshine_media_uploads');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [urlInput, setUrlInput] = useState('');
  const [urlLabel, setUrlLabel] = useState('');
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);

  // Combine menu images, event images, and custom uploaded media
  const allMedia = useMemo(() => {
    const list = [];

    // 1. Menu items
    menu.forEach(item => {
      if (item.image) {
        list.push({
          id: `menu-media-${item.id}`,
          title: item.name,
          category: 'Menu Dish',
          source: item.image,
          date: 'Catalog Asset'
        });
      }
    });

    // 2. Events
    events.forEach(ev => {
      if (ev.image) {
        list.push({
          id: `event-media-${ev.id}`,
          title: ev.title,
          category: 'Event Banner',
          source: ev.image,
          date: ev.date || 'Event Asset'
        });
      }
    });

    // 3. Custom Uploads
    customUploads.forEach(c => {
      list.push(c);
    });

    return list;
  }, [menu, events, customUploads]);

  const filteredMedia = useMemo(() => {
    return allMedia.filter(m => {
      if (filterType !== 'All' && m.category !== filterType) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return m.title.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [allMedia, filterType, search]);

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url);
      toast.success('Image URL copied to clipboard! You can paste it into Menu or Event forms.');
      setTimeout(() => setCopiedUrl(null), 2500);
    });
  };

  // Secure File Upload Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isSuperAdmin) {
      toast.error('Super Administrator privileges required to upload media assets.');
      return;
    }

    // 1. Validate MIME type
    if (!file.type || !file.type.startsWith('image/')) {
      toast.error('Security alert: Only valid image MIME types (JPEG, PNG, WEBP, GIF) are accepted.');
      return;
    }

    // 2. Reject executable / non-image extensions
    const forbiddenExts = ['.php', '.js', '.html', '.exe', '.bat', '.ps1', '.sh', '.py'];
    const nameLower = file.name.toLowerCase();
    if (forbiddenExts.some(ext => nameLower.endsWith(ext))) {
      toast.error('Security alert: Executable and script files are strictly blocked.');
      return;
    }

    // 3. File size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds the 5MB safety limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target.result;
      const img = new Image();

      img.onload = async () => {
        // Optimize canvas bounds to max 1200px
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const optimizedUrl = canvas.toDataURL('image/jpeg', 0.88);

        // Server-side mutation check
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const result = await executeAdminMutation('MEDIA_UPLOAD', `Uploaded image: ${safeName} (${Math.round(file.size / 1024)}KB)`);
        if (!result.success) {
          toast.error(result.error || 'Server rejected media upload.');
          return;
        }

        const newEntry = {
          id: `custom-media-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, ''),
          category: 'Uploaded Asset',
          source: optimizedUrl,
          date: new Date().toLocaleDateString('en-GB')
        };

        const updated = [newEntry, ...customUploads];
        setCustomUploads(updated);
        try {
          localStorage.setItem('sunshine_media_uploads', JSON.stringify(updated.slice(0, 15)));
        } catch {
          // Local storage quota fallback
        }

        toast.success(`Image "${file.name}" uploaded and optimized successfully!`);
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddUrl = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    if (!isSuperAdmin) {
      toast.error('Super Administrator privileges required to register media assets.');
      return;
    }

    try {
      const parsed = new URL(urlInput);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        toast.error('Please enter a valid HTTP or HTTPS image URL.');
        return;
      }
    } catch {
      toast.error('Please enter a valid URL.');
      return;
    }

    const result = await executeAdminMutation('MEDIA_UPLOAD', `Registered external URL: ${urlInput}`);
    if (!result.success) {
      toast.error(result.error || 'Server rejected media registration.');
      return;
    }

    const newEntry = {
      id: `custom-url-${Date.now()}`,
      title: urlLabel.trim() || 'External Media Asset',
      category: 'External Asset',
      source: urlInput.trim(),
      date: new Date().toLocaleDateString('en-GB')
    };

    const updated = [newEntry, ...customUploads];
    setCustomUploads(updated);
    try {
      localStorage.setItem('sunshine_media_uploads', JSON.stringify(updated.slice(0, 15)));
    } catch {
      // quota fallback
    }

    toast.success('External image asset added to media library!');
    setUrlInput('');
    setUrlLabel('');
    setIsUrlModalOpen(false);
  };

  const handleDeleteCustom = (id) => {
    if (!isSuperAdmin) {
      toast.error('Super Administrator privileges required.');
      return;
    }
    const filtered = customUploads.filter(c => c.id !== id);
    setCustomUploads(filtered);
    localStorage.setItem('sunshine_media_uploads', JSON.stringify(filtered));
    toast.info('Asset removed from library.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-amber-400" />
            <span>Media Library & Assets</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Manage food photography, promotional event banners, and upload optimized assets
          </p>
        </div>

        {isSuperAdmin && (
          <div className="flex items-center gap-2.5">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-glow transition-all active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Local Image</span>
            </button>

            <button
              onClick={() => setIsUrlModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-stone-300 hover:text-white text-xs font-semibold transition-colors"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add External URL</span>
            </button>
          </div>
        )}
      </div>

      {/* Role Alert for Standard Admin */}
      {!isSuperAdmin && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold">Standard Admin View:</span> Media library is in read-only inspection mode. Uploading new images or registering asset URLs requires Super Administrator privileges.
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#160f0a] border border-amber-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets by name or category..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-stone-400">Category:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Assets ({allMedia.length})</option>
            <option value="Menu Dish">Menu Dishes</option>
            <option value="Event Banner">Event Banners</option>
            <option value="Uploaded Asset">Uploaded Assets</option>
            <option value="External Asset">External Assets</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredMedia.length === 0 ? (
          <div className="col-span-full py-16 text-center text-stone-500 bg-[#160f0a] rounded-3xl border border-stone-800">
            No media assets found matching the query.
          </div>
        ) : (
          filteredMedia.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl bg-[#18120c] border border-stone-800 hover:border-amber-500/40 overflow-hidden shadow-lg transition-all flex flex-col"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-square w-full bg-stone-950 overflow-hidden">
                <img
                  src={item.source}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-stone-950/80 backdrop-blur-sm border border-stone-700 text-[10px] text-amber-300 font-semibold">
                  {item.category}
                </div>

                {/* Copy Overlay */}
                <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <button
                    onClick={() => copyToClipboard(item.source)}
                    className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-transform active:scale-90"
                    title="Copy Image URL"
                  >
                    {copiedUrl === item.source ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <a
                    href={item.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 hover:text-white"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {item.id.startsWith('custom-') && isSuperAdmin && (
                    <button
                      onClick={() => handleDeleteCustom(item.id)}
                      className="p-2 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-900"
                      title="Remove from custom uploads"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Caption */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div className="text-xs font-bold text-white truncate" title={item.title}>
                  {item.title}
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-400 mt-1">
                  <span>{item.date}</span>
                  <button
                    onClick={() => copyToClipboard(item.source)}
                    className="text-amber-400 hover:underline flex items-center gap-0.5 font-medium"
                  >
                    <span>Copy URL</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* External URL Modal */}
      {isUrlModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsUrlModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#18120c] border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="font-serif text-lg font-bold text-white">Add External Image URL</h3>
              <button
                onClick={() => setIsUrlModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUrl} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Asset Label *</label>
                <input
                  type="text"
                  required
                  value={urlLabel}
                  onChange={(e) => setUrlLabel(e.target.value)}
                  placeholder="e.g. Signature Handi Biryani Special"
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Image URL (HTTP/HTTPS) *</label>
                <input
                  type="url"
                  required
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUrlModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-colors"
                >
                  Add to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
