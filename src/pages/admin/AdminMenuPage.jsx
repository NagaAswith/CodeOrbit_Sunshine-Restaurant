import React, { useState, useMemo, useRef } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/formatters';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Flame, 
  Sparkles, 
  Star, 
  X, 
  Upload,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';

const CATEGORIES = [
  'Starters',
  'Main Course',
  'Breads',
  'Rice & Biryani',
  'Desserts',
  'Beverages'
];

export default function AdminMenuPage() {
  const { 
    menu, 
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem, 
    toggleMenuAvailability 
  } = useRestaurant();

  const { isSuperAdmin, executeAdminMutation } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingItem, setEditingItem] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Form state for new / edited item
  const [formData, setFormData] = useState({
    name: '',
    category: 'Starters',
    price: 250,
    description: '',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    spiceLevel: 1,
    isAvailable: true,
    isPopular: false,
    isChefSpecial: false,
    ingredients: ''
  });

  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [menu, selectedCategory, search]);

  const handleToggle = async (item) => {
    const nextState = !item.isAvailable;
    const result = await executeAdminMutation('MENU_AVAILABILITY_TOGGLE', `${item.name} set to ${nextState ? 'Available' : 'Out of Stock'}`);
    if (!result.success) {
      toast.error(result.error || 'Permission denied.');
      return;
    }
    toggleMenuAvailability(item.id);
    toast.info(`${item.name} is now ${item.isAvailable ? 'Out of Stock' : 'Available'}`);
  };

  const handleDelete = async (item) => {
    if (!isSuperAdmin) {
      toast.error('Super Administrator privileges required to delete dishes.');
      return;
    }
    if (window.confirm(`Delete ${item.name} from the restaurant menu?`)) {
      const result = await executeAdminMutation('MENU_DELETE', `Dish: ${item.name} (#${item.id})`);
      if (!result.success) {
        toast.error(result.error || 'Server rejected dish deletion.');
        return;
      }
      deleteMenuItem(item.id);
      toast.success(`Deleted ${item.name}`);
    }
  };

  const handleOpenAdd = () => {
    setImageError(false);
    setFormData({
      name: '',
      category: 'Starters',
      price: 280,
      description: '',
      image: 'https://images.unsplash.com/photo-1567184109411-b28f2780e054?auto=format&fit=crop&w=800&q=80',
      isVeg: true,
      spiceLevel: 1,
      isAvailable: true,
      isPopular: false,
      isChefSpecial: false,
      ingredients: 'Fresh cottage cheese, Bell peppers, Aromatic spices'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setImageError(false);
    setEditingItem(item);
    setFormData({
      ...item,
      spiceLevel: item.spiceLevel !== undefined ? Number(item.spiceLevel) : 1,
      isAvailable: item.isAvailable !== undefined ? Boolean(item.isAvailable) : true,
      isVeg: item.isVeg !== undefined ? Boolean(item.isVeg) : true,
      ingredients: Array.isArray(item.ingredients) ? item.ingredients.join(', ') : item.ingredients || ''
    });
  };

  // Direct local file upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file. Please select a valid image (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size too large. Please select an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const img = new Image();
      img.onload = () => {
        // Optimize image resolution to max 800px on longest side for safe localStorage persistence
        const canvas = document.createElement('canvas');
        const maxDim = 800;
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
        setFormData(prev => ({ ...prev, image: optimizedUrl }));
        setImageError(false);
        toast.success('Local device image loaded successfully!');
      };
      img.onerror = () => {
        setFormData(prev => ({ ...prev, image: dataUrl }));
        setImageError(false);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (!isSuperAdmin) {
      toast.error('Super Administrator privileges required to create new menu items.');
      return;
    }

    const result = await executeAdminMutation('MENU_CREATE', `Created item: ${formData.name}`);
    if (!result.success) {
      toast.error(result.error || 'Server rejected dish creation.');
      return;
    }

    addMenuItem({
      ...formData,
      price: Number(formData.price),
      spiceLevel: Number(formData.spiceLevel),
      isAvailable: Boolean(formData.isAvailable),
      isVeg: Boolean(formData.isVeg),
      ingredients: formData.ingredients ? formData.ingredients.split(',').map(s => s.trim()) : []
    });

    toast.success(`Added ${formData.name} to menu!`);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!isSuperAdmin) {
      toast.error('Super Administrator privileges required to edit menu items.');
      return;
    }

    const result = await executeAdminMutation('MENU_UPDATE', `Updated item: ${formData.name} (#${editingItem.id})`);
    if (!result.success) {
      toast.error(result.error || 'Server rejected menu update.');
      return;
    }

    updateMenuItem(editingItem.id, {
      ...formData,
      price: Number(formData.price),
      spiceLevel: Number(formData.spiceLevel),
      isAvailable: Boolean(formData.isAvailable),
      isVeg: Boolean(formData.isVeg),
      ingredients: formData.ingredients ? formData.ingredients.split(',').map(s => s.trim()) : []
    });

    toast.success(`Updated ${formData.name}`);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Menu Item Management</h2>
          <p className="text-xs text-stone-400">Add, update pricing, spice levels, stock availability, and images in real-time</p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-glow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </button>
        )}
      </div>

      {/* Role Alert for Standard Admin */}
      {!isSuperAdmin && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold">Standard Admin Operations:</span> You can toggle dish stock availability (Available / Out of Stock) for shift service. Adding new dishes, editing pricing, and deleting items requires Super Administrator privileges.
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#160f0a] border border-amber-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dish name or category..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'All'
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'bg-stone-900 text-stone-400 hover:text-white'
            }`}
          >
            All Categories ({menu.length})
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-stone-900 text-stone-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Menu Management Table */}
      <div className="rounded-3xl bg-[#160f0a] border border-amber-500/20 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1a120c] border-b border-stone-800 text-stone-400 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Dish</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price (INR)</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Spice</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {filteredMenu.map(item => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover bg-stone-900 shrink-0 border border-stone-800"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div>
                        <div className="font-bold text-white text-sm">{item.name}</div>
                        <div className="text-[11px] text-stone-400 line-clamp-1 max-w-xs">{item.description}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-stone-300 whitespace-nowrap">
                    {item.category}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-amber-400 whitespace-nowrap">
                    {formatINR(item.price)}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.isVeg
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}>
                      {item.isVeg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-0.5" title={`Spice Level: ${item.spiceLevel || 0}/3`}>
                      {[1, 2, 3].map(lvl => (
                        <Flame
                          key={lvl}
                          className={`w-3.5 h-3.5 ${lvl <= (item.spiceLevel || 0) ? 'text-red-500 fill-red-500' : 'text-stone-700'}`}
                        />
                      ))}
                      <span className="text-[10px] text-stone-400 ml-1">
                        {item.spiceLevel === 1 ? 'Mild' : item.spiceLevel === 2 ? 'Medium' : item.spiceLevel === 3 ? 'Hot' : 'Mild'}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {item.isChefSpecial && (
                        <span className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20" title="Chef Special">
                          <Sparkles className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {item.isPopular && (
                        <span className="p-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20" title="Popular Item">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Stock Status column */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggle(item)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all flex items-center gap-1.5 ${
                        item.isAvailable
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                      }`}
                      title={item.isAvailable ? 'Click to mark Out of Stock' : 'Click to mark Available'}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${item.isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                      <span>{item.isAvailable ? 'Available' : 'Out of Stock'}</span>
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {isSuperAdmin ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-amber-400 hover:bg-stone-800 transition-colors"
                          title="Edit Dish Recipe & Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-800 transition-colors"
                          title="Delete Dish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-stone-500 italic">Toggle only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Food Item Modal */}
      {(isAddModalOpen || editingItem) && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => {
            setIsAddModalOpen(false);
            setEditingItem(null);
          }}
        >
          <div 
            className="w-full max-w-xl bg-[#18120c] border border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 shrink-0">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white truncate pr-2">
                {isAddModalOpen ? 'Add New Food Item' : `Edit Item (${editingItem?.name})`}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingItem(null);
                }}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1 py-2">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Food Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Paneer Tikka"
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Spice Level Control */}
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Spice Level</label>
                <select
                  value={formData.spiceLevel}
                  onChange={(e) => setFormData({ ...formData, spiceLevel: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value={1}>🌶 Mild</option>
                  <option value={2}>🌶🌶 Medium</option>
                  <option value={3}>🌶🌶🌶 Hot</option>
                </select>
              </div>

              {/* Image Management Section */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-stone-300 font-semibold">Dish Image</label>
                  <span className="text-[10px] text-stone-400">URL or Upload from Device</span>
                </div>

                {/* Image Live Preview */}
                <div className="flex items-center gap-3 p-2 rounded-xl bg-stone-900 border border-stone-800/80">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-stone-700">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onLoad={() => setImageError(false)}
                      onError={() => setImageError(true)}
                    />
                  </div>
                  <div className="flex-1 text-[11px]">
                    <div className="font-semibold text-white">Live Image Preview</div>
                    {imageError ? (
                      <span className="text-rose-400 flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Invalid image URL or failed to load.</span>
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1 mt-0.5">
                        <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Image loaded and ready</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Option 1: Any Valid URL */}
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value });
                      setImageError(false);
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Option 2: Upload from Device */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                    <span>OR Upload from Device</span>
                    <span className="text-[10px] text-stone-400">(JPG, PNG, WEBP)</span>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-amber-500/50 text-stone-300 hover:text-white transition-colors text-xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Choose Image from Device</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Culinary Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Char-grilled cottage cheese with aromatic spices..."
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Ingredients (Comma separated)</label>
                <input
                  type="text"
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  placeholder="Cottage Cheese, Yogurt, Degi Mirch, Garam Masala"
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Food Type: Mutually Exclusive Vegetarian vs Non-Vegetarian */}
              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">Food Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isVeg: true })}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      formData.isVeg
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-emerald-500 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </span>
                    <span>Vegetarian</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isVeg: false })}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      !formData.isVeg
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-sm'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-rose-500 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    </span>
                    <span>Non-Vegetarian</span>
                  </button>
                </div>
              </div>

              {/* Availability: Mutually Exclusive Available vs Out of Stock */}
              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">Availability Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isAvailable: true })}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      formData.isAvailable
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Available</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isAvailable: false })}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      !formData.isAvailable
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-sm'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span>Out of Stock</span>
                  </button>
                </div>
              </div>

              {/* Special Badges */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-900 border border-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isChefSpecial}
                    onChange={(e) => setFormData({ ...formData, isChefSpecial: e.target.checked })}
                    className="accent-amber-500 rounded"
                  />
                  <span>Chef's Special</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-900 border border-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="accent-amber-500 rounded"
                  />
                  <span>Popular Item</span>
                </label>
              </div>

              </div>

              {/* Actions Footer - Always visible & accessible on all screens */}
              <div className="pt-3.5 mt-2 flex items-center justify-end gap-2 border-t border-stone-800 shrink-0 bg-[#18120c]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-glow"
                >
                  {isAddModalOpen ? 'Create Item' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
