import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Edit3, 
  Trash2, 
  UserCheck, 
  Plus, 
  X,
  FileSpreadsheet
} from 'lucide-react';

export default function AdminBookingsPage() {
  const { bookings, updateBookingStatus, editBooking, deleteBooking } = useRestaurant();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  // Modals state
  const [viewingBooking, setViewingBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== 'All' && b.status !== statusFilter) return false;
      if (typeFilter !== 'All' && b.bookingType !== typeFilter) return false;
      if (dateFilter && b.date !== dateFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = b.customerName?.toLowerCase().includes(q);
        const matchesPhone = b.phone?.toLowerCase().includes(q);
        const matchesId = b.id?.toLowerCase().includes(q);
        const matchesToken = b.token?.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesId && !matchesToken) return false;
      }

      return true;
    });
  }, [bookings, statusFilter, typeFilter, dateFilter, search]);

  const handleStatusChange = (id, newStatus) => {
    updateBookingStatus(id, newStatus);
    toast.success(`Booking status changed to ${newStatus}`);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete reservation ${id}?`)) {
      deleteBooking(id);
      toast.info(`Deleted reservation ${id}`);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Booking ID', 'Token', 'Customer Name', 'Phone', 'Email', 'Date', 'Time', 'Guests', 'Type', 'Room', 'Amount', 'Status'];
    const rows = filteredBookings.map(b => [
      b.id,
      b.token,
      `"${b.customerName}"`,
      b.phone,
      b.email || '',
      b.date,
      `"${b.time}"`,
      b.guests,
      b.bookingType,
      b.roomType,
      b.amount,
      b.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sunshine_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported bookings to CSV file!');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Checked In':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Pending':
        return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
      case 'Completed':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'Cancelled':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-stone-800 text-stone-300 border-stone-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header and Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Bookings Management</h2>
          <p className="text-xs text-stone-400">Search, filter, edit and track guest reservations and dining status</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#160f0a] border border-amber-500/20 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Customer, Phone, ID, Token..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Checked In">Checked In</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Booking Types</option>
              <option value="Dining">Dining</option>
              <option value="Birthday">Birthday</option>
              <option value="Anniversary">Anniversary</option>
              <option value="Family Gathering">Family Gathering</option>
              <option value="Private Event">Private Event</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-3xl bg-[#160f0a] border border-amber-500/20 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1a120c] border-b border-stone-800 text-stone-400 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Token</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Party</th>
                <th className="py-3.5 px-4">Type & Format</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-stone-400 text-xs">
                    No reservations matching current filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-white whitespace-nowrap">
                      {b.id}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        {b.token}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-white">{b.customerName}</div>
                      <div className="text-[11px] text-stone-400">{b.phone}</div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="text-white font-medium">{b.date}</div>
                      <div className="text-[11px] text-stone-400">{b.time}</div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-white whitespace-nowrap">
                      {b.guests} Guests
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="text-stone-300 font-medium">{b.bookingType}</div>
                      <div className="text-[10px] text-amber-400/80">{b.roomType}</div>
                    </td>
                    <td className="py-4 px-4 font-bold text-amber-400 whitespace-nowrap">
                      {formatINR(b.amount)}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {b.status !== 'Checked In' && b.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleStatusChange(b.id, 'Checked In')}
                            className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-stone-950 transition-colors"
                            title="Check In Guest"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {b.status === 'Pending' && (
                          <button
                            onClick={() => handleStatusChange(b.id, 'Confirmed')}
                            className="p-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-stone-950 transition-colors"
                            title="Confirm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => setViewingBooking(b)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingBooking({ ...b })}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-amber-400 hover:bg-stone-800 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {b.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleStatusChange(b.id, 'Cancelled')}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-800 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Booking Modal */}
      {editingBooking && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEditingBooking(null)}
        >
          <div 
            className="w-full max-w-lg bg-[#18120c] border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="font-serif text-xl font-bold text-white">Edit Reservation ({editingBooking.id})</h3>
              <button onClick={() => setEditingBooking(null)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                editBooking(editingBooking.id, editingBooking);
                toast.success('Reservation updated successfully');
                setEditingBooking(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={editingBooking.customerName}
                  onChange={(e) => setEditingBooking({ ...editingBooking, customerName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={editingBooking.date}
                    onChange={(e) => setEditingBooking({ ...editingBooking, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Headcount</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={editingBooking.guests}
                    onChange={(e) => setEditingBooking({ ...editingBooking, guests: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Status</label>
                  <select
                    value={editingBooking.status}
                    onChange={(e) => setEditingBooking({ ...editingBooking, status: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Checked In">Checked In</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Room / Format</label>
                  <select
                    value={editingBooking.roomType}
                    onChange={(e) => setEditingBooking({ ...editingBooking, roomType: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="VIP Table">VIP Table</option>
                    <option value="AC Room">AC Room</option>
                    <option value="Non-AC Room">Non-AC Room</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Special Notes</label>
                <textarea
                  rows="2"
                  value={editingBooking.specialRequest || ''}
                  onChange={(e) => setEditingBooking({ ...editingBooking, specialRequest: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Booking Modal */}
      {viewingBooking && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setViewingBooking(null)}
        >
          <div 
            className="w-full max-w-lg bg-[#18120c] border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div>
                <span className="text-[10px] text-amber-400 uppercase font-semibold">Booking ID</span>
                <h3 className="font-mono text-xl font-bold text-white">{viewingBooking.id}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase ${getStatusBadge(viewingBooking.status)}`}>
                {viewingBooking.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-stone-500 text-[10px] uppercase">Token</span>
                <div className="font-mono text-xl font-bold text-amber-400">{viewingBooking.token}</div>
              </div>
              <div>
                <span className="text-stone-500 text-[10px] uppercase">Guest</span>
                <div className="font-bold text-white text-sm">{viewingBooking.customerName}</div>
                <div className="text-stone-400">{viewingBooking.phone}</div>
              </div>
              <div>
                <span className="text-stone-500 text-[10px] uppercase">Date & Time</span>
                <div className="text-white font-medium">{viewingBooking.date} • {viewingBooking.time}</div>
              </div>
              <div>
                <span className="text-stone-500 text-[10px] uppercase">Format & Headcount</span>
                <div className="text-white font-medium">{viewingBooking.guests} Guests ({viewingBooking.roomType})</div>
              </div>
            </div>

            {viewingBooking.specialRequest && (
              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                <span className="text-amber-400 font-semibold block mb-0.5">Notes:</span>
                <p className="text-stone-300 italic">"{viewingBooking.specialRequest}"</p>
              </div>
            )}

            <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
              <span className="font-serif text-lg font-bold text-amber-400">{formatINR(viewingBooking.amount)}</span>
              <button
                onClick={() => setViewingBooking(null)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-stone-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
