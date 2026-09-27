import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Users, 
  X, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminTimeSlotsPage() {
  const { timeSlots, addTimeSlot, updateTimeSlot, deleteTimeSlot, toggleTimeSlotActive } = useRestaurant();
  const { isSuperAdmin, executeAdminMutation } = useAuth();
  const toast = useToast();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  const [form, setForm] = useState({
    startTime: '06:00 PM',
    endTime: '07:00 PM',
    maxBookings: 15,
    availableSeats: 15,
    isActive: true
  });

  const handleToggle = async (slot) => {
    if (!isSuperAdmin) {
      toast.error('Super Administrator privileges required to enable or disable time slots.');
      return;
    }
    const nextState = !slot.isActive;
    const result = await executeAdminMutation('TIMESLOT_STATUS_TOGGLE', `Slot ${slot.startTime}–${slot.endTime} set to ${nextState ? 'Active' : 'Disabled'}`);
    if (!result.success) {
      toast.error(result.error || 'Server rejected status update.');
      return;
    }
    toggleTimeSlotActive(slot.id);
    toast.info(`Slot ${slot.startTime} – ${slot.endTime} is now ${nextState ? 'Active' : 'Disabled'}`);
  };

  const handleDelete = async (slot) => {
    if (!isSuperAdmin) {
      toast.error('Super Administrator privileges required to delete time slots.');
      return;
    }
    if (window.confirm(`Delete time slot ${slot.startTime} – ${slot.endTime}?`)) {
      const result = await executeAdminMutation('TIMESLOT_DELETE', `Slot ${slot.startTime}–${slot.endTime} (#${slot.id})`);
      if (!result.success) {
        toast.error(result.error || 'Server rejected time slot deletion.');
        return;
      }
      deleteTimeSlot(slot.id);
      toast.success('Time slot deleted');
    }
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      toast.error('Super Administrator privileges required to create time slots.');
      return;
    }
    const result = await executeAdminMutation('TIMESLOT_CREATE', `Slot ${form.startTime}–${form.endTime} (max ${form.maxBookings})`);
    if (!result.success) {
      toast.error(result.error || 'Server rejected time slot creation.');
      return;
    }
    addTimeSlot({
      ...form,
      maxBookings: Number(form.maxBookings),
      availableSeats: Number(form.availableSeats)
    });
    toast.success('Time slot added successfully!');
    setIsAddOpen(false);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingSlot) return;
    if (!isSuperAdmin) {
      toast.error('Super Administrator privileges required to update time slots.');
      return;
    }
    const result = await executeAdminMutation('TIMESLOT_UPDATE', `Updated slot ${form.startTime}–${form.endTime} (#${editingSlot.id})`);
    if (!result.success) {
      toast.error(result.error || 'Server rejected time slot update.');
      return;
    }
    updateTimeSlot(editingSlot.id, {
      ...form,
      maxBookings: Number(form.maxBookings),
      availableSeats: Number(form.availableSeats)
    });
    toast.success('Time slot updated!');
    setEditingSlot(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Time Slot & Capacity Management</h2>
          <p className="text-xs text-stone-400">Configure reservation service shifts, maximum booking thresholds and real-time seat availability</p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={() => {
              setForm({
                startTime: '05:30 PM',
                endTime: '06:30 PM',
                maxBookings: 12,
                availableSeats: 12,
                isActive: true
              });
              setIsAddOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-glow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Time Slot</span>
          </button>
        )}
      </div>

      {/* Role Alert for Standard Admin */}
      {!isSuperAdmin && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold">Standard Admin View:</span> Table service time slots and shift capacity limits are read-only. Adding, editing, or removing time slots requires Super Administrator privileges.
          </div>
        </div>
      )}

      {/* Slots Table */}
      <div className="rounded-3xl bg-[#160f0a] border border-amber-500/20 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1a120c] border-b border-stone-800 text-stone-400 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Shift Time Window</th>
                <th className="py-3.5 px-4">Max Bookings Capacity</th>
                <th className="py-3.5 px-4">Available Seats Remaining</th>
                <th className="py-3.5 px-4">Customer Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {timeSlots.map(slot => (
                <tr key={slot.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-white text-sm">
                    {slot.startTime} – {slot.endTime}
                  </td>

                  <td className="py-4 px-4 text-stone-300 font-semibold">
                    {slot.maxBookings} Tables / Groups
                  </td>

                  <td className="py-4 px-4">
                    <span className={`font-bold ${slot.availableSeats <= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {slot.availableSeats} Seats Available
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggle(slot)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors flex items-center gap-1.5 ${
                        slot.isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-stone-800 text-stone-500 border-stone-700'
                      }`}
                    >
                      {slot.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{slot.isActive ? 'Active on Reservation' : 'Disabled'}</span>
                    </button>
                  </td>

                  <td className="py-4 px-4 text-right">
                    {isSuperAdmin ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingSlot(slot);
                            setForm({ ...slot });
                          }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-amber-400 hover:bg-stone-800 transition-colors"
                          title="Edit Slot"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(slot)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-800 transition-colors"
                          title="Delete Slot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-stone-500 italic">Read-only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(isAddOpen || editingSlot) && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            setIsAddOpen(false);
            setEditingSlot(null);
          }}
        >
          <div 
            className="w-full max-w-md bg-[#18120c] border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="font-serif text-lg font-bold text-white">
                {isAddOpen ? 'Add Operational Time Slot' : 'Edit Time Slot'}
              </h3>
              <button
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingSlot(null);
                }}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={isAddOpen ? handleSaveAdd : handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Start Time *</label>
                  <input
                    type="text"
                    required
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    placeholder="06:00 PM"
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">End Time *</label>
                  <input
                    type="text"
                    required
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    placeholder="07:00 PM"
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Max Bookings *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.maxBookings}
                    onChange={(e) => setForm({ ...form, maxBookings: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Available Seats *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.availableSeats}
                    onChange={(e) => setForm({ ...form, availableSeats: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingSlot(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold"
                >
                  {isAddOpen ? 'Add Slot' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
