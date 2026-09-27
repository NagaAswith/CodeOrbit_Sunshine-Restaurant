import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  ShieldCheck, 
  UtensilsCrossed, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye,
  EyeOff,
  AlertCircle,
  Home
} from 'lucide-react';

export default function AdminLoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  // Development-only rate-limit reset helper (no visible UI button)
  React.useEffect(() => {
    if (import.meta.env.DEV) {
      window.__resetDevRateLimit = async () => {
        try {
          const res = await fetch('/api/dev/reset-rate-limit', { method: 'POST' });
          const data = await res.json();
          setErrorMessage('');
          toast.success('Local dev rate limits cleared!');
          return data;
        } catch (err) {
          console.error('[Dev] Rate limit reset error:', err);
        }
      };
      console.info('[Dev Auth Helper] To reset local rate limits, call window.__resetDevRateLimit() or double-click the error alert.');
      return () => {
        delete window.__resetDevRateLimit;
      };
    }
  }, [toast]);

  const handleDevErrorDoubleClick = () => {
    if (import.meta.env.DEV && errorMessage.includes('failed login attempts')) {
      if (typeof window.__resetDevRateLimit === 'function') {
        window.__resetDevRateLimit();
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        toast.success(`Signed in successfully as ${res.user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}!`);
        navigate('/admin');
      } else {
        setErrorMessage(res.error || 'Invalid email or password.');
        toast.error(res.error || 'Authentication failed');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0906] text-stone-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Card Container */}
        <div className="bg-[#160f0a] border border-amber-500/25 rounded-3xl p-8 shadow-2xl space-y-6">
          
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 p-0.5 shadow-glow mx-auto mb-3">
              <div className="w-full h-full bg-[#1c150f] rounded-[14px] flex items-center justify-center">
                <UtensilsCrossed className="w-7 h-7 text-amber-400" />
              </div>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
              SUNSHINE
            </h1>
            <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Restaurant Admin Console
            </p>
            <p className="text-xs text-stone-400">
              Sign in to manage bookings, verify entry tokens, menu, and pricing.
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div 
              onDoubleClick={handleDevErrorDoubleClick}
              title={import.meta.env.DEV && errorMessage.includes('failed login attempts') ? 'Double-click to reset rate limit in local development' : undefined}
              className={`p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2.5 animate-shake ${import.meta.env.DEV && errorMessage.includes('failed login attempts') ? 'cursor-pointer' : ''}`}
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter admin email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-amber-400 p-1 rounded-md transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="flex items-center gap-1.5 text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Encrypted Session</span>
              </span>
              <span className="text-stone-500 italic">Authorised Personnel Only</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Login to Admin Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Bottom link to Customer App */}
          <div className="pt-4 border-t border-stone-800 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-400 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return to Customer Website</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
