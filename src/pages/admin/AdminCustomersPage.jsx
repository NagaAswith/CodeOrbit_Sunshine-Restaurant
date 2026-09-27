import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatINR } from '../../utils/formatters';
import { 
  Users, 
  Search, 
  Eye, 
  CalendarDays, 
  Clock, 
  Phone, 
  Mail, 
  DollarSign, 
  X,
  Award,
  Sparkles
} from 'lucide-react';

export default function AdminCustomersPage() {
  const { customers, bookings } = useRestaurant();
  const [search, setSearch] = useState('');
  const [selectedCust, setSelectedCust] = useState(null);

  const filtered = customers.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email?.toLowerCase().includes(q);
  });

  // Get past bookings for the selected customer
  const customerHistory = selectedCust ? bookings.filter(b => 
    b.phone === selectedCust.phone || 
    (b.customerName && b.customerName.toLowerCase() === selectedCust.name.toLowerCase())
  ) : [];

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div>
        <h2 className="font-serif text-2xl font-bold text-white">Customer Relationship Directory</h2>
        <p className="text-xs text-stone-400">View frequent dining guests, loyalty status, total spend and past reservation records</p>
      </div>

      {/* Search */}
      <div className="p-4 rounded-3xl bg-[#160f0a] border border-amber-500/20 shadow-xl max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone or email..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-3xl bg-[#160f0a] border border-amber-500/20 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1a120c] border-b border-stone-800 text-stone-400 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Bookings Count</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-4">Last Visit</th>
                <th className="py-3.5 px-4">Guest Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {filtered.map(cust => (
                <tr key={cust.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-bold text-white whitespace-nowrap">
                    {cust.name}
                  </td>
                  <td className="py-4 px-4 text-stone-300 font-mono whitespace-nowrap">
                    {cust.phone}
                  </td>
                  <td className="py-4 px-4 text-stone-400 whitespace-nowrap">
                    {cust.email || '—'}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="font-bold text-white bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800">
                      {cust.bookingsCount} visits
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-amber-400 whitespace-nowrap">
                    {formatINR(cust.totalSpend)}
                  </td>
                  <td className="py-4 px-4 text-stone-400 whitespace-nowrap">
                    {cust.lastVisit || 'Recent'}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      cust.status === 'VIP Guest'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : cust.status === 'Corporate'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : 'bg-stone-800 text-stone-300 border-stone-700'
                    }`}>
                      {cust.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedCust(cust)}
                      className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-400 border border-stone-800 text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>History</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile & History Modal */}
      {selectedCust && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedCust(null)}
        >
          <div 
            className="w-full max-w-xl bg-[#18120c] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-lg">
                  {selectedCust.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">{selectedCust.name}</h3>
                  <span className="text-xs text-amber-400">{selectedCust.status}</span>
                </div>
              </div>
              <button onClick={() => setSelectedCust(null)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Overview Stats */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800">
                <span className="text-stone-400 text-[10px] uppercase block">Lifetime Bookings</span>
                <span className="text-lg font-bold text-white mt-1 block">{selectedCust.bookingsCount}</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800">
                <span className="text-stone-400 text-[10px] uppercase block">Total Spend</span>
                <span className="text-lg font-bold text-amber-400 mt-1 block">{formatINR(selectedCust.totalSpend)}</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800">
                <span className="text-stone-400 text-[10px] uppercase block">Last Visited</span>
                <span className="text-xs font-bold text-white mt-2 block">{selectedCust.lastVisit}</span>
              </div>
            </div>

            {/* Reservation History */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                Booking History ({customerHistory.length} records)
              </h4>

              <div className="space-y-2.5">
                {customerHistory.length === 0 ? (
                  <p className="text-xs text-stone-400 py-3 text-center">No past reservations recorded yet.</p>
                ) : (
                  customerHistory.map(b => (
                    <div key={b.id} className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-mono font-bold text-white">{b.id} • Token: <span className="text-amber-400">{b.token}</span></div>
                        <div className="text-stone-400 text-[11px] mt-0.5">{b.date} at {b.time} ({b.guests} Guests)</div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-amber-400 block">{formatINR(b.amount)}</span>
                        <span className="text-[10px] text-stone-400 uppercase">{b.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800 flex justify-end">
              <button
                onClick={() => setSelectedCust(null)}
                className="px-5 py-2.5 rounded-xl bg-stone-800 text-stone-200 text-xs font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
