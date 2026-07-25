import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Sparkles, SendHorizonal } from 'lucide-react';
import toast from 'react-hot-toast';
import { processAI, sendWhatsAppReminder } from '../services/app.api';

export default function AIWorkspace() {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!text.trim()) {
      toast.error('Please enter a transaction note.');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await processAI({ text });
      const payload = response?.data?.data || response?.data;
      setResult(payload);
      if (payload?.success === false) {
        toast.error(payload?.message || 'AI could not process that request.');
      } else {
        toast.success('AI transaction processed.');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'AI workflow failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReminder = async () => {
    if (!result?.transaction?.customer) {
      toast.error('No customer linked to this transaction.');
      return;
    }

    try {
      const response = await sendWhatsAppReminder({ customerId: result.transaction.customer, shopName: 'Vendor Voice' });
      window.open(response?.data?.data?.link, '_blank', 'noopener,noreferrer');
      toast.success('Reminder link ready.');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to create reminder.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">AI assistant</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Speak or type transaction intent</h2>
        <p className="mt-2 text-sm text-slate-400">The AI layer can turn plain-language messages into sales or payment entries and generate reminders instantly.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-emerald-300">
            <Sparkles className="h-5 w-5" />
            <h3 className="text-lg font-semibold text-white">Process transaction</h3>
          </div>
          <textarea value={text} onChange={(event) => setText(event.target.value)} rows="7" placeholder="Example: Sale of 3 shirts to Ramesh for 1500 rupees, paid 500" className="mt-5 w-full rounded-[1.25rem] border border-white/10 bg-slate-950/60 px-4 py-4 text-sm text-white outline-none" />
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400">
              <SendHorizonal className="h-4 w-4" /> {isProcessing ? 'Processing...' : 'Process'}
            </button>
            <button type="button" className="flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5">
              <Mic className="h-4 w-4" /> Voice ready
            </button>
          </div>
        </motion.form>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold text-white">Latest result</h3>
          {result ? (
            <div className="mt-4 rounded-[1rem] border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              <pre className="whitespace-pre-wrap text-sm text-emerald-50">{JSON.stringify(result, null, 2)}</pre>
              {result?.success && result?.transaction && (
                <button onClick={handleReminder} className="mt-4 rounded-2xl border border-emerald-400/30 px-4 py-2 text-sm text-emerald-200 transition hover:bg-emerald-500/20">
                  Send WhatsApp reminder
                </button>
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-400">No AI run yet. Try a simple sentence to create a transaction.</p>
          )}
        </div>
      </div>
    </div>
  );
}
