import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  KeyRound, 
  PlusCircle, 
  UtensilsCrossed, 
  Sparkles, 
  Clock, 
  DollarSign, 
  DoorClosed, 
  Users, 
  Settings, 
  LogOut, 
  X,
  ExternalLink,
  ChevronRight,
  Star,
  LayoutTemplate,
  Image as ImageIcon,
  ShieldCheck,
  Lock
} from 'lucide-react';

export default function AdminSidebar({ isOpen, onClose }) {
  const { adminUser, isSuperAdmin, logout } = useAuth();
  const { settings } = useRestaurant();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Token Verification', path: '/admin/token', icon: KeyRound },
    { name: 'Manual Booking', path: '/admin/manual-booking', icon: PlusCircle },
    { name: 'Menu Items', path: '/admin/menu', icon: UtensilsCrossed },
    { name: 'Events', path: '/admin/events', icon: Sparkles },
    { name: 'Time Slots', path: '/admin/time-slots', icon: Clock },
    { name: 'Table Pricing', path: '/admin/pricing#tables', icon: DollarSign },
    { name: 'Room Pricing', path: '/admin/pricing#rooms', icon: DoorClosed },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Feedback & Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Website Content', path: '/admin/website-content', icon: LayoutTemplate, superAdmin: true },
    { name: 'Media / Images', path: '/admin/media', icon: ImageIcon, superAdmin: true },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#140e0a] border-r border-amber-500/15 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Brand Logo */}
        <div>
          <div className="p-5 border-b border-amber-500/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 p-0.5 shadow-glow">
                <div className="w-full h-full bg-[#1c150f] rounded-[10px] flex items-center justify-center">
                  <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-white tracking-wider">
                  {settings.restaurantName || 'SUNSHINE'}
                </span>
                <span className="block text-[9px] uppercase tracking-widest text-amber-400 font-semibold">
                  Admin Console
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)] scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact 
                ? location.pathname === item.path 
                : location.pathname.startsWith(item.path.split('#')[0]);

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-glow'
                      : 'text-stone-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-amber-400 group-hover:scale-110 transition-transform'}`} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.superAdmin && !isActive && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold uppercase">
                        Super
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-stone-950" />}
                  </div>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="p-4 border-t border-amber-500/15 bg-[#100a06] space-y-3">
          {/* Quick link to Customer Site */}
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white text-xs border border-stone-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>View Customer Site</span>
          </button>

          {/* User Profile Card */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 truncate">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${
                isSuperAdmin 
                  ? 'bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 border-amber-300 font-extrabold shadow-glow' 
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }`}>
                {isSuperAdmin ? 'SA' : 'VR'}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                  <span className="truncate">{adminUser?.name || 'Administrator'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                    isSuperAdmin
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-stone-800 text-stone-400'
                  }`}>
                    {isSuperAdmin ? 'Super Admin' : 'Standard Admin'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
