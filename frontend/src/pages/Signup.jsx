import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { registerUser } from '../services/auth.api';

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit } = useForm();
  const verificationToken = location.state?.verificationToken || '';
  const email = location.state?.email || '';
  const name = location.state?.name || '';

  const onSubmit = async (data) => {
    try {
      const response = await registerUser({
        name: data.name || name,
        email: data.email || email,
        password: data.password,
        phone: data.phone,
        shopName: data.shopName,
        preferredLanguage: data.preferredLanguage,
        verificationToken,
      });

      toast.success(response?.data?.message || 'Account created successfully.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-emerald-500/10 lg:p-10">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-semibold text-white">Create your store account</h1>
          <p className="mt-3 text-sm leading-7 text-slate-400">Set up your shop details and get started in minutes.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Full Name</label>
              <input {...register('name')} defaultValue={name} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Email</label>
              <input {...register('email')} defaultValue={email} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Phone</label>
              <input {...register('phone', { required: true })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Shop Name</label>
              <input {...register('shopName', { required: true })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Preferred Language</label>
              <select {...register('preferredLanguage')} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none">
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Marathi">Marathi</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Password</label>
              <input type="password" {...register('password', { required: true })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">Confirm Password</label>
              <input type="password" {...register('confirmPassword', { required: true })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none" />
            </div>
            <div className="md:col-span-2">
              <button className="w-full rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-black transition hover:bg-emerald-400">
                Create Account
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
