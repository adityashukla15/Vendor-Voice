import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, Package, Users, ReceiptText, Sparkles, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Overview', to: '/dashboard', icon: LayoutGrid },
  { label: 'Inventory', to: '/dashboard/inventory', icon: Package },
  { label: 'Customers', to: '/dashboard/customers', icon: Users },
  { label: 'Transactions', to: '/dashboard/transactions', icon: ReceiptText },
  { label: 'AI Assistant', to: '/dashboard/ai', icon: Sparkles },
];

export default function AppShell({ children }) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center justify-between rounded-3xl border border-white/10 bg-slate-900/70 px-4 py-4 shadow-2xl shadow-emerald-500/10 backdrop-blur"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">Vendor Voice</p>
            <h1 className="mt-1 text-lg font-semibold text-white">Operations workspace</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 sm:block">
              {user?.shopName || 'Your Shop'}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </motion.header>

        <div className="flex flex-1 flex-col gap-4 lg:flex-row">
          <aside className="w-full rounded-3xl border border-white/10 bg-slate-900/70 p-3 shadow-2xl shadow-emerald-500/10 backdrop-blur lg:w-64 min-w-0">
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 min-w-0">
              <div className="rounded-full bg-emerald-500 p-2 text-black flex-shrink-0">
                <Menu className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">{user?.name || 'Merchant'}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email || 'merchant@example.com'}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map(({ label, to, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition ${isActive ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </aside>

          <main className="flex-1 rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-emerald-500/10 backdrop-blur sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
