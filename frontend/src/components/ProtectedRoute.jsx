import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030712] text-slate-300">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 px-6 py-5 text-center shadow-2xl shadow-emerald-500/10">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">Checking authentication</p>
          <p className="mt-3 text-lg font-medium text-white">Please wait…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !user) {
    return <Navigate to="/register" replace />;
  }

  return children;
}
