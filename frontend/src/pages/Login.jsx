import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { loginUser } from '../services/auth.api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuth();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      });
      setUser(response?.data?.data?.user || null);
      setIsAuthenticated(true);
      toast.success(response?.data?.message || 'Login successful.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-emerald-500/10 lg:p-10">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
          <p className="mt-3 text-sm leading-7 text-slate-400">Sign in to continue managing your business.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Email</label>
              <input {...register('email', { required: true })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Password</label>
              <input type="password" {...register('password', { required: true })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none" />
            </div>
            <button className="w-full rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-black transition hover:bg-emerald-400">
              Login
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
