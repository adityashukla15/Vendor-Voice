import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { verifyOTP } from '../services/auth.api';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm();
  const email = location.state?.email || '';
  const name = location.state?.name || '';

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await verifyOTP({
        email,
        otp: data.otp,
        purpose: 'REGISTER',
      });

      toast.success(response?.data?.message || 'OTP verified successfully.');
      navigate('/signup', { state: { verificationToken: response?.data?.data?.verificationToken, email, name } });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <button onClick={() => navigate('/register')} className="flex w-fit items-center gap-2 text-sm text-slate-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-emerald-500/20 bg-slate-900/70 p-8 shadow-2xl shadow-emerald-500/10 lg:p-10">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
            <h1 className="text-2xl font-semibold text-white">Verify your email</h1>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-400">We sent a 6-digit code to <span className="text-white">{email || 'your email'}</span>.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <input {...register('otp', { required: true })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-lg tracking-[0.35em] text-white outline-none" placeholder="000000" />
            <button disabled={isLoading} className="w-full rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70">
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
