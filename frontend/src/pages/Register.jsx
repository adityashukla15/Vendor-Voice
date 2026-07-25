import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, ShieldCheck, Lock, UserRound, Smartphone, Store, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { sendOTP, verifyOTP, registerUser, loginUser } from '../services/auth.api';
import { useAuth } from '../context/AuthContext';

const tabs = [
  { id: 'signup', label: 'Sign Up' },
  { id: 'login', label: 'Login' },
];

export default function Register() {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('signup');
  const [isLoading, setIsLoading] = useState(false);
  const [otpStage, setOtpStage] = useState('collect');
  const [pendingUser, setPendingUser] = useState(null);
  const [verificationToken, setVerificationToken] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const signupForm = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      shopName: '',
      preferredLanguage: 'English',
      confirmPassword: '',
    },
  });
  const loginForm = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const otpForm = useForm({
    defaultValues: {
      otp: '',
    },
  });

  const handleSendOTP = async (data) => {
    setIsLoading(true);
    try {
      const response = await sendOTP({
        name: data.name,
        email: data.email,
        purpose: 'REGISTER',
      });

      const otpCode = response?.data?.data?.otp || response?.data?.otp || '';
      setPendingUser({ name: data.name, email: data.email });
      setDemoOtp(otpCode);
      if (otpCode) {
        otpForm.setValue('otp', otpCode);
      }
      setOtpStage('verify');
      toast.success(otpCode ? `OTP ready: ${otpCode}` : 'OTP sent successfully.');
    } catch (error) {
      console.error('OTP send failed', error);
      toast.error(error?.response?.data?.message || error?.message || 'Unable to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!pendingUser) return;
    setIsLoading(true);
    try {
      const response = await sendOTP({
        name: pendingUser.name,
        email: pendingUser.email,
        purpose: 'REGISTER',
      });
      const otpCode = response?.data?.data?.otp || response?.data?.otp || '';
      setDemoOtp(otpCode);
      if (otpCode) {
        otpForm.setValue('otp', otpCode);
      }
      toast.success(otpCode ? `OTP resent: ${otpCode}` : 'OTP resent successfully.');
    } catch (error) {
      console.error('OTP resend failed', error);
      toast.error(error?.response?.data?.message || error?.message || 'Unable to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (data) => {
    if (!pendingUser) return;
    setIsLoading(true);
    try {
      const response = await verifyOTP({
        email: pendingUser.email,
        otp: data.otp,
        purpose: 'REGISTER',
      });

      setVerificationToken(response?.data?.data?.verificationToken || '');
      setOtpStage('account');
      toast.success('OTP verified successfully.');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (!pendingUser || !verificationToken) {
      toast.error('Please verify your OTP first.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await registerUser({
        name: pendingUser.name,
        email: pendingUser.email,
        password: data.password,
        phone: data.phone,
        shopName: data.shopName,
        preferredLanguage: data.preferredLanguage,
        verificationToken,
      });

      setUser(response?.data?.data?.user || null);
      setIsAuthenticated(true);
      toast.success(response?.data?.message || 'Account created successfully.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Account creation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (data) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <button onClick={() => navigate('/')} className="flex w-fit items-center gap-2 text-sm text-slate-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back home
        </button>

        <div className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 shadow-2xl shadow-emerald-500/10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-gradient-to-br from-emerald-500/20 to-transparent p-8 lg:p-10">
            <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="mt-6 text-3xl font-semibold text-white">Welcome to Vendor Voice</h1>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Create your account or sign in instantly. The experience stays on one smooth screen with animated transitions.
            </p>

            <div className="mt-8 flex rounded-full border border-white/10 bg-white/5 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? 'bg-emerald-500 text-black' : 'text-slate-300 hover:text-white'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="p-8 lg:p-10">
            <AnimatePresence mode="wait">
              {activeTab === 'signup' ? (
                <motion.div
                  key={otpStage}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  {otpStage === 'collect' && (
                    <form onSubmit={signupForm.handleSubmit(handleSendOTP)} className="space-y-5">
                      <div>
                        <label className="mb-2 block text-sm text-slate-300">Name</label>
                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                          <UserRound className="h-4 w-4 text-slate-400" />
                          <input {...signupForm.register('name', { required: true })} className="w-full bg-transparent text-sm text-white outline-none" placeholder="Your full name" />
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm text-slate-300">Email</label>
                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <input {...signupForm.register('email', { required: true })} className="w-full bg-transparent text-sm text-white outline-none" placeholder="you@example.com" />
                        </div>
                      </div>
                      <button disabled={isLoading} className="w-full rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70">
                        {isLoading ? 'Sending...' : 'Send OTP'}
                      </button>
                    </form>
                  )}

                  {otpStage === 'verify' && (
                    <form onSubmit={otpForm.handleSubmit(handleVerifyOTP)} className="space-y-5">
                      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                        We sent a 6-digit OTP to <span className="font-semibold text-white">{pendingUser?.email}</span>.
                        {demoOtp && (
                          <div className="mt-2 font-semibold tracking-[0.35em] text-white">OTP: {demoOtp}</div>
                        )}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm text-slate-300">Enter OTP</label>
                        <input {...otpForm.register('otp', { required: true })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-lg tracking-[0.35em] text-white outline-none" placeholder="000000" />
                      </div>
                      <button disabled={isLoading} className="w-full rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70">
                        {isLoading ? 'Verifying...' : 'Verify OTP'}
                      </button>
                      <button type="button" onClick={handleResendOTP} className="w-full text-sm text-slate-400 transition hover:text-white">
                        Resend OTP
                      </button>
                    </form>
                  )}

                  {otpStage === 'account' && (
                    <form onSubmit={signupForm.handleSubmit(handleCreateAccount)} className="space-y-5">
                      <div className="flex items-center gap-2 text-sm text-emerald-300">
                        <CheckCircle2 className="h-4 w-4" /> OTP verified. Create your account now.
                      </div>
                      <div>
                        <label className="mb-2 block text-sm text-slate-300">Password</label>
                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                          <Lock className="h-4 w-4 text-slate-400" />
                          <input type={showPassword ? 'text' : 'password'} {...signupForm.register('password', { required: true })} className="w-full bg-transparent text-sm text-white outline-none" placeholder="Create a password" />
                          <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="text-slate-400">
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm text-slate-300">Confirm Password</label>
                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                          <Lock className="h-4 w-4 text-slate-400" />
                          <input type={showConfirmPassword ? 'text' : 'password'} {...signupForm.register('confirmPassword', { required: true })} className="w-full bg-transparent text-sm text-white outline-none" placeholder="Confirm password" />
                          <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className="text-slate-400">
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm text-slate-300">Phone</label>
                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                          <Smartphone className="h-4 w-4 text-slate-400" />
                          <input {...signupForm.register('phone', { required: true })} className="w-full bg-transparent text-sm text-white outline-none" placeholder="Phone number" />
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm text-slate-300">Shop Name</label>
                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                          <Store className="h-4 w-4 text-slate-400" />
                          <input {...signupForm.register('shopName', { required: true })} className="w-full bg-transparent text-sm text-white outline-none" placeholder="Your shop name" />
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm text-slate-300">Preferred Language</label>
                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                          <Sparkles className="h-4 w-4 text-slate-400" />
                          <select {...signupForm.register('preferredLanguage')} className="w-full bg-transparent text-sm text-white outline-none">
                            <option value="English" className="text-slate-900">English</option>
                            <option value="Hindi" className="text-slate-900">Hindi</option>
                            <option value="Marathi" className="text-slate-900">Marathi</option>
                          </select>
                        </div>
                      </div>
                      <button disabled={isLoading} className="w-full rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70">
                        {isLoading ? 'Creating account...' : 'Create Account'}
                      </button>
                    </form>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Email</label>
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <input {...loginForm.register('email', { required: true })} className="w-full bg-transparent text-sm text-white outline-none" placeholder="you@example.com" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Password</label>
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <Lock className="h-4 w-4 text-slate-400" />
                        <input type="password" {...loginForm.register('password', { required: true })} className="w-full bg-transparent text-sm text-white outline-none" placeholder="Enter your password" />
                      </div>
                    </div>
                    <button disabled={isLoading} className="w-full rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70">
                      {isLoading ? 'Signing in...' : 'Login'}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
