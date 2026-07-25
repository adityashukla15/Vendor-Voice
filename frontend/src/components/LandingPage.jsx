import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Sparkles, BarChart3, Bot, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: <Mic className="h-7 w-7" />,
    title: 'Voice-first transactions',
    description: 'Record sales and payments naturally with voice and let AI handle the rest.',
  },
  {
    icon: <Bot className="h-7 w-7" />,
    title: 'Smart AI extraction',
    description: 'Auto-identify customers, products, quantities, payments and ledger updates.',
  },
  {
    icon: <BarChart3 className="h-7 w-7" />,
    title: 'Live business insights',
    description: 'Monitor customers, inventory, balances and sales from one premium dashboard.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Inject Google Font for Space Grotesk on the homepage only
    const id = 'space-grotesk-font';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-10">
        <header className="mb-10 flex flex-col gap-4 rounded-[2rem] border border-emerald-500/20 bg-white/5 px-6 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-2 shadow-[0_18px_60px_-36px_rgba(16,185,129,0.9)]">
                {/* stylized VV monogram / microphone-shaped mark */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <defs>
                    <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>
                  </defs>
                  <circle cx="12" cy="12" r="10" fill="url(#g1)" opacity="0.95" />
                  <path d="M8 9c.6 1.2 1.5 2.6 2.6 3.5 1.1-.9 2-2.3 2.6-3.5" stroke="#022" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
                  <path d="M12 7v6" stroke="#022" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="9.2" y="15.2" width="5.6" height="1.8" rx="0.9" fill="#022" opacity="0.9" />
                </svg>
              </div>

              <div className="flex flex-col">
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 }}
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.22em' }}
                >
                  VENDOR VOICE
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }} className="text-xs text-slate-400">
                  AI-Powered Shop Management
                </motion.p>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-between sm:justify-end">
            <button onClick={() => navigate('/login')} className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10">
              Login
            </button>
            <button onClick={() => navigate('/register')} className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400">
              Get Started
            </button>
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
                <Sparkles className="h-4 w-4" />
                AI-powered shop management
              </div>
              <h1 className="text-5xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl">
                Your Shop, <span className="text-emerald-400">Managed by Voice.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                Vendor Voice brings together voice-driven transactions, AI extraction, smart reminders and live analytics in a beautifully modern experience.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-semibold text-black transition hover:bg-emerald-400">
                  Get Started <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={() => navigate('/login')} className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-200 backdrop-blur-xl transition hover:bg-white/10">
                  Explore Features
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-emerald-500/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-emerald-500/10 backdrop-blur-2xl">
                <div className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <div>
                    <p className="text-sm text-slate-400">Live workspace</p>
                    <p className="text-xl font-semibold text-white">Smart shop operations</p>
                  </div>
                  <div className="rounded-full bg-emerald-500/20 p-3 text-emerald-400">
                    <Mic className="h-6 w-6" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">Today's sales</p>
                    <p className="mt-2 text-3xl font-semibold text-white">₹24,500</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">Pending balances</p>
                    <p className="mt-2 text-3xl font-semibold text-emerald-400">₹8,200</p>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/20 to-transparent p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-emerald-500/20 p-2 text-emerald-400">
                      <Mic className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Listening to</p>
                      <p className="text-base font-semibold text-white">“Ramesh bought 2 kg sugar and paid 50”</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur-xl"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-emerald-500/10 p-3 text-emerald-400">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
