import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar, 
  Clock, 
  Users, 
  Tag, 
  Sparkles, 
  X,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';

export default function AdminEventsPage() {
  const { events, addEvent, updateEvent, deleteEvent, toggleEventActive } = useRestaurant();
  const { isSuperAdmin, executeAdminMutation } = useAuth();
  const toast = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [form, setForm] = useState({
    title: '',
    date: 'Every Friday & Saturday',
    time: '7:00 PM – 11:00 PM',
    description: '',
    discount: '15% OFF',
    offerText: 'Complimentary dessert platter with reservations of 2 or more.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    availableSeats: 25,
    isActive: true
  });

  const handleToggle = async (ev) => {
    if (!isSuperAdmin) {
      toast.error('Super Administrator privileges required to toggle event visibility.');
      return;
    }
    const nextState = !ev.isActive;
    const result = await executeAdminMutation('EVENT_STATUS_TOGGLE', `Event "${ev.title}" set to ${nextState ? 'Active' : 'Inactive'}`);
    if (!result.success) {
      toast.error(result.error || 'Server rejected status update.');
      return;
    }
    toggleEventActive(ev.id);
    toast.info(`Event "${ev.title}" is now ${nextState ? 'Active' : 'Inactive'}`);
  };

  const handleDelete = async (ev) => {
    if (!isSuperAdmin) {
      toast.error('Super Administrator privileges required to delete events.');
      return;
    }
    if (window.confirm(`Delete event "${ev.title}"?`)) {
      const result = await executeAdminMutation('EVENT_DELETE', `Event "${ev.title}" (#${ev.id})`);
      if (!result.success) {
        toast.error(result.error || 'Server rejected event deletion.');
        return;
      }
      deleteEvent(ev.id);
      toast.success(`Deleted event`);
    }
  };

  const handleOpenAdd = () => {
    setForm({
      title: '',
      date: 'Upcoming Weekend',
      time: '7:30 PM – 10:30 PM',
      description: '',
      discount: '20% OFF',
      offerText: 'Special chef tasting menu included.',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      availableSeats: 20,
      isActive: true
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (ev) => {
    setEditingEvent(ev);
    setForm({ ...ev });
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (!isSuperAdmin) {
      toast.error('Super Administrator privileges required to create events.');
      return;
    }

    const result = await executeAdminMutation('EVENT_CREATE', `Created event: ${form.title}`);
    if (!result.success) {
      toast.error(result.error || 'Server rejected event creation.');
      return;
    }

    addEvent(form);
    toast.success(`Created event "${form.title}"`);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingEvent) return;

    if (!isSuperAdmin) {
      toast.error('Super Administrator privileges required to update events.');
      return;
    }

    const result = await executeAdminMutation('EVENT_UPDATE', `Updated event: ${form.title} (#${editingEvent.id})`);
    if (!result.success) {
      toast.error(result.error || 'Server rejected event update.');
      return;
    }

    updateEvent(editingEvent.id, form);
    toast.success(`Updated event "${form.title}"`);
    setEditingEvent(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Event Management</h2>
          <p className="text-xs text-stone-400">Manage live music nights, festival banquets, discounts, and seat allocations</p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-glow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Event</span>
          </button>
        )}
      </div>

      {/* Role Alert for Standard Admin */}
      {!isSuperAdmin && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold">Standard Admin View:</span> Restaurant promotional events and special nights are read-only. Creating, editing, or deleting events requires Super Administrator privileges.
          </div>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((ev) => (
          <div
            key={ev.id}
            className={`p-6 rounded-3xl bg-[#160f0a] border transition-all flex flex-col justify-between space-y-4 shadow-xl ${
              ev.isActive ? 'border-amber-500/20' : 'border-stone-800 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{ev.date}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{ev.time}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white">{ev.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px]">
                    {ev.discount}
                  </span>
                </div>
              </div>

              <p className="text-xs text-stone-400 leading-relaxed">
                {ev.description}
              </p>

              {ev.offerText && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                  <span>{ev.offerText}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-stone-300 pt-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>{ev.availableSeats} Seats Available</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
              <button
                onClick={() => handleToggle(ev)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                  ev.isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-stone-900 text-stone-500 border-stone-800'
                }`}
              >
                {ev.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{ev.isActive ? 'Active on Site' : 'Inactive'}</span>
              </button>

              {isSuperAdmin ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(ev)}
                    className="p-2 rounded-xl bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                    title="Edit Event"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(ev)}
                    className="p-2 rounded-xl bg-stone-900 text-stone-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <span className="text-[11px] text-stone-500 italic">Read-only</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {(isAddModalOpen || editingEvent) && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            setIsAddModalOpen(false);
            setEditingEvent(null);
          }}
        >
          <div 
            className="w-full max-w-lg bg-[#18120c] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="font-serif text-xl font-bold text-white">
                {isAddModalOpen ? 'Create New Event' : `Edit Event (${editingEvent?.title})`}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingEvent(null);
                }}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Royal Awadhi Food Festival"
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Date / Frequency *</label>
                  <input
                    type="text"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="e.g. Every Friday & Saturday"
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Time Range *</label>
                  <input
                    type="text"
                    required
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    placeholder="7:00 PM – 11:00 PM"
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Discount Tag</label>
                  <input
                    type="text"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    placeholder="e.g. 20% OFF"
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Available Seats</label>
                  <input
                    type="number"
                    min="1"
                    value={form.availableSeats}
                    onChange={(e) => setForm({ ...form, availableSeats: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Offer Details Text</label>
                <input
                  type="text"
                  value={form.offerText}
                  onChange={(e) => setForm({ ...form, offerText: e.target.value })}
                  placeholder="Complimentary chef dessert with reservations"
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Description</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the musical or dining event..."
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingEvent(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold"
                >
                  {isAddModalOpen ? 'Create Event' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
