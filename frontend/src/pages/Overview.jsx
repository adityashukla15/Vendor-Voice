import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Package, CircleDollarSign, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDashboardOverview } from '../services/app.api';

export default function Overview() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const response = await getDashboardOverview();
        setSummary(response?.data?.data?.overview || null);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Unable to load dashboard.');
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  const cards = [
    { label: 'Total customers', value: summary?.totalCustomers ?? 0, icon: Users },
    { label: 'Products in stock', value: summary?.totalProducts ?? 0, icon: Package },
    { label: 'Outstanding', value: `₹${Number(summary?.outstandingAmount || 0).toFixed(2)}`, icon: CircleDollarSign },
    { label: 'Today sales', value: `₹${Number(summary?.todaySales || 0).toFixed(2)}`, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">Overview</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Your business pulse, in one view</h2>
        <p className="mt-2 text-sm text-slate-400">Monitor customers, stock, outstanding balances, and daily sales from a single workspace.</p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading dashboard...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ label, value, icon: Icon }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">{label}</p>
                <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-300">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-4 text-2xl font-semibold text-white">{value}</p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-emerald-500/20 to-transparent p-6">
          <div className="flex items-center gap-2 text-emerald-300">
            <TrendingUp className="h-5 w-5" />
            <h3 className="text-lg font-semibold text-white">Performance snapshot</h3>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-400">The dashboard now connects to the backend overview API so your key business numbers stay current without leaving the app.</p>
        </motion.div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-2 text-amber-300">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-lg font-semibold text-white">Low stock watch</h3>
          </div>
          <p className="mt-4 text-sm text-slate-400">{summary?.lowStockProducts ?? 0} items are at or below their threshold.</p>
        </div>
      </div>
    </div>
  );
}
