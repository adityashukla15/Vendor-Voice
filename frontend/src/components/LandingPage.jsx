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

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-10">
        <header className="mb-10 flex items-center justify-between rounded-full border border-emerald-500/20 bg-white/5 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-500/20 p-2 text-emerald-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.25em] text-emerald-400">VENDOR VOICE</p>
            </div>
          </div>
          <button onClick={() => navigate('/register')} className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/20">
            Get Started
          </button>
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
