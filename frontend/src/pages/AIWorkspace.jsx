import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, LoaderCircle, Mic, MicOff, SendHorizonal, Sparkles, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { createCustomer, createPaymentTransaction, createSaleTransaction, processAI } from '../services/app.api';

const defaultCustomerForm = {
  name: '',
  phone: '',
  address: '',
};

export default function AIWorkspace() {
  const [text, setText] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [statusText, setStatusText] = useState('Ready for voice capture.');
  const [preview, setPreview] = useState(null);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState(defaultCustomerForm);
  const [customerSaving, setCustomerSaving] = useState(false);
  const recognitionRef = useRef(null);
  const speechDetectedRef = useRef(false);
  const recognitionErrorRef = useRef(false);
  const processAfterStopRef = useRef(false);
  const transcriptRef = useRef('');

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isUnsupportedBrowser = /Code\/|Electron\//i.test(userAgent);
    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor || isUnsupportedBrowser) {
      setIsSupported(false);
      setStatusText('Speech recognition is unavailable here. Open in Chrome/Edge and allow microphone access.');
      return undefined;
    }

    // Keep support flag true; actual recognition instances are created on-demand when user clicks the microphone.
    setIsSupported(true);

    // Cleanup on unmount: stop any active recognition
    return () => {
      if (recognitionRef.current) {
        try {
          console.log('[Speech] cleanup: stopping recognition on unmount');
          recognitionRef.current.onresult = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onstart = null;
          recognitionRef.current.onnomatch = null;
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  // Create a fresh SpeechRecognition instance and wire handlers
  const createRecognition = () => {
    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionConstructor) return null;

    const recognition = new SpeechRecognitionConstructor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('[Speech] Recognition started');
      recognitionErrorRef.current = false;
      setStatusText('Listening for speech...');
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      console.log('[Speech] onresult', event);
      let interimTranscript = '';
      let finalTranscript = '';

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const chunk = result[0]?.transcript || '';
        if (result.isFinal) {
          finalTranscript += chunk;
        } else {
          interimTranscript += chunk;
        }
      }

      const combinedTranscript = `${finalTranscript} ${interimTranscript}`.trim();
      console.log('[Speech] Transcript update:', { finalTranscript, interimTranscript, combinedTranscript });

      if (combinedTranscript) {
        speechDetectedRef.current = true;
        transcriptRef.current = combinedTranscript;
        setTranscript(combinedTranscript);
        setText(combinedTranscript);
        setStatusText('Speech recognized. Ready to process.');
      }
    };

    recognition.onerror = (event) => {
      const err = event?.error || 'unknown';
      console.error('[Speech] error', err, event);
      recognitionErrorRef.current = true;
      setIsListening(false);

      let errorMessage = `Speech recognition error: ${err}`;
      switch (err) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone is not available. Check your device.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied.';
          break;
        case 'aborted':
          errorMessage = 'Speech recognition aborted.';
          break;
        case 'network':
          errorMessage = 'Network error during speech recognition.';
          break;
        default:
          errorMessage = `Speech recognition error: ${err}`;
      }

      setStatusText(errorMessage);
      toast.error(errorMessage);

      try {
        recognition.stop();
      } catch (stopErr) {
        // ignore
      }
    };

    recognition.onend = () => {
      console.log('[Speech] Recognition ended');
      setIsListening(false);

      // If we should process after stop and we have transcript, call processing
      if (processAfterStopRef.current && transcriptRef.current.trim()) {
        console.log('[Speech] Processing after stop with transcript:', transcriptRef.current);
        processAfterStopRef.current = false;
        handleProcessText(transcriptRef.current);
        return;
      }

      // No speech detected case
      if (!speechDetectedRef.current && !recognitionErrorRef.current) {
        console.log('[Speech] No speech detected on end');
        setStatusText('No voice detected. Please try again.');
        toast.error('No voice detected. Please try again.');
      }
    };

    recognition.onnomatch = () => {
      console.log('[Speech] No match');
      setStatusText('No recognizable speech was detected. Please try again.');
      toast.error('No recognizable speech was detected.');
    };

    return recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        console.log('[Speech] stopListening called');
        processAfterStopRef.current = true;
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('[Speech] stop error', err);
      }
    } else {
      setStatusText('No speech detected.');
      toast.error('No speech detected.');
    }
  };

  const requestMicrophoneAccess = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Microphone access is unavailable in this browser.');
    }

    // Request a short-lived stream to force permissions prompt; stop tracks after we get permission.
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    try {
      // keep for a tick to ensure permission has been granted in some browsers
      await new Promise((resolve) => setTimeout(resolve, 50));
    } finally {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const startListening = async () => {
    if (!isSupported) {
      toast.error('Speech recognition is not supported in this browser.');
      setStatusText('Speech recognition not supported.');
      return;
    }

    if (isListening) {
      return;
    }

    // Reset flags and UI
    speechDetectedRef.current = false;
    recognitionErrorRef.current = false;
    processAfterStopRef.current = true; // ensure we process after recognition ends
    transcriptRef.current = '';
    setTranscript('');
    setText('');
    setStatusText('Requesting microphone permission...');

    try {
      // Request microphone permission explicitly so browsers prompt first
      await requestMicrophoneAccess();
    } catch (error) {
      const message = error?.message || 'Unable to access the microphone.';
      setStatusText(message);
      toast.error(message);
      return;
    }

    try {
      // Prevent multiple instances
      if (recognitionRef.current && isListening) {
        console.log('[Speech] recognition already running');
        return;
      }

      // Create a fresh recognition instance for this session — some browsers behave more reliably this way
      recognitionRef.current = createRecognition();
      if (!recognitionRef.current) {
        setStatusText('Speech recognition unavailable.');
        toast.error('Speech recognition unavailable.');
        return;
      }

      // Reset flags
      speechDetectedRef.current = false;
      recognitionErrorRef.current = false;
      processAfterStopRef.current = true; // ensure we process after recognition ends
      transcriptRef.current = '';
      setTranscript('');
      setText('');

      recognitionRef.current.start();
      console.log('[Speech] recognition.start() called');
    } catch (error) {
      setIsListening(false);
      setStatusText('Unable to start microphone capture.');
      toast.error('Unable to start microphone capture.');
      console.error('Speech start error:', error);
    }
  };

  const handleProcessText = async (value) => {
    const note = (value || text).trim();
    if (!note) {
      toast.error('Please enter a transaction note.');
      return;
    }

    setIsProcessing(true);
    setPreview(null);
    setStatusText('Voice processing...');

    try {
      const response = await processAI({ text: note, saveTransaction: false });
      const payload = response?.data?.data || response?.data;
      setPreview(payload);

      if (payload?.success === false) {
        if (payload?.code === 'CUSTOMER_NOT_FOUND') {
          setCustomerForm((current) => ({ ...current, name: payload.customerName || '' }));
          setCustomerModalOpen(true);
          toast.error(payload?.message || 'Customer not found.');
        } else {
          toast.error(payload?.message || 'AI could not process that request.');
        }
      } else {
        toast.success('Speech recognized and preview ready.');
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'AI workflow failed.';
      setStatusText(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await handleProcessText(text);
  };

  const handleConfirmSave = async (customerOverride = null) => {
    if (!preview) {
      toast.error('No transaction preview available.');
      return;
    }

    const customerId = customerOverride?._id || preview?.customer?._id;
    if (!customerId) {
      toast.error('Customer is required to save this transaction.');
      return;
    }

    setIsSaving(true);
    setStatusText('Saving transaction...');

    try {
      if (preview.intent === 'SALE') {
        if (!preview.product?._id) {
          toast.error('No matching product was found for this transaction.');
          return;
        }

        await createSaleTransaction({
          customerId,
          inventoryId: preview.product._id,
          quantity: preview.extracted?.quantity || 1,
          paidAmount: preview.extracted?.paidAmount || 0,
          notes: preview.extracted?.notes || `AI extracted sale from: ${text}`,
          createdByAI: true,
        });
        toast.success('Transaction saved.');
      } else {
        await createPaymentTransaction({
          customerId,
          amount: preview.extracted?.paidAmount || 0,
          notes: preview.extracted?.notes || `AI extracted payment from: ${text}`,
        });
        toast.success('Payment saved.');
      }

      setStatusText('Transaction saved.');
      setPreview(null);
      setText('');
      setTranscript('');
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to save transaction.';
      setStatusText(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateCustomer = async (event) => {
    event.preventDefault();
    if (!customerForm.name.trim()) {
      toast.error('Customer name is required.');
      return;
    }

    setCustomerSaving(true);
    try {
      const response = await createCustomer(customerForm);
      const createdCustomer = response?.data?.data?.customer || response?.data?.customer || response?.data;
      setCustomerModalOpen(false);
      setCustomerForm(defaultCustomerForm);
      toast.success('Customer created successfully.');
      await handleConfirmSave(createdCustomer);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to create customer.');
    } finally {
      setCustomerSaving(false);
    }
  };

  const pendingAmount = preview?.extracted?.totalAmount && preview?.extracted?.paidAmount !== undefined
    ? Math.max(Number(preview.extracted.totalAmount || 0) - Number(preview.extracted.paidAmount || 0), 0)
    : 0;

  const previewTitle = preview?.intent === 'PAYMENT' ? 'Payment preview' : 'Transaction preview';

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">AI assistant</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Speak or type transaction intent</h2>
        <p className="mt-2 text-sm text-slate-400">The AI layer can turn plain-language messages into sales or payment entries and generate reminders instantly.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr] min-w-0">
        <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="min-w-0 w-full rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-emerald-300">
            <Sparkles className="h-5 w-5" />
            <h3 className="text-lg font-semibold text-white">Process transaction</h3>
          </div>

          <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>{isListening ? 'Listening...' : 'Voice transcript'}</span>
              <span className="text-emerald-300">{statusText}</span>
            </div>
            <div className="mt-3 min-h-[120px] rounded-[1rem] border border-white/10 bg-black/20 p-3 text-sm text-slate-200">
              {isListening ? (
                <div className="flex items-center gap-3 text-emerald-300">
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.1 }} className="inline-flex h-3 w-3 rounded-full bg-emerald-400" />
                  Listening for speech...
                </div>
              ) : (
              <p className="whitespace-pre-wrap break-words">{transcript || 'Tap record and speak naturally to capture a transaction.'}</p>
              )}
            </div>
          </div>

          <textarea value={text} onChange={(event) => setText(event.target.value)} rows="6" placeholder="Example: Ramesh ko 500 rupaye ka samaan diya" className="mt-5 min-w-0 w-full max-w-full break-words rounded-[1.25rem] border border-white/10 bg-slate-950/60 px-4 py-4 text-sm text-white outline-none" />

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="submit" disabled={isProcessing || isSaving} className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70">
              {isProcessing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <SendHorizonal className="h-4 w-4" />}
              {isProcessing ? 'Processing...' : 'Process'}
            </button>
            <button type="button" onClick={isListening ? stopListening : startListening} disabled={!isSupported} className="flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60">
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {isListening ? 'Stop recording' : 'Start recording'}
            </button>
          </div>
        </motion.form>

        <div className="min-w-0 w-full rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold text-white">Latest result</h3>
          {isProcessing ? (
            <div className="mt-4 space-y-3">
              {[1, 2].map((item) => (
                <div key={item} className="h-16 animate-pulse rounded-[1rem] border border-white/10 bg-slate-950/50" />
              ))}
            </div>
          ) : preview ? (
            <div className="mt-4 rounded-[1rem] border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100 break-words max-w-full">
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                <span>{previewTitle}</span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-emerald-50">
                <p><span className="text-slate-400">Customer:</span> {preview.customer?.name || preview.extracted?.customerName || 'Unknown'}</p>
                <p><span className="text-slate-400">Type:</span> {preview.intent === 'PAYMENT' ? 'Payment' : (preview.extracted?.paidAmount > 0 ? 'Partial' : 'Credit')}</p>
                <p><span className="text-slate-400">Product:</span> {preview.product?.productName || preview.extracted?.productName || 'Not specified'}</p>
                <p><span className="text-slate-400">Amount:</span> ₹{Number(preview.extracted?.totalAmount || preview.extracted?.paidAmount || 0).toFixed(2)}</p>
                <p><span className="text-slate-400">Pending amount:</span> ₹{pendingAmount.toFixed(2)}</p>
                <p><span className="text-slate-400">Status:</span> {pendingAmount > 0 ? 'Pending' : 'Cleared'}</p>
                <p><span className="text-slate-400">Notes:</span> {preview.extracted?.notes || 'No notes provided.'}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" onClick={() => handleConfirmSave()} disabled={isSaving} className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70">
                  {isSaving ? 'Saving...' : 'Confirm & save'}
                </button>
                <button type="button" onClick={() => setPreview(null)} className="rounded-2xl border border-emerald-400/30 px-4 py-2 text-sm text-emerald-200 transition hover:bg-emerald-500/20">
                  Clear
                </button>
                {preview?.code === 'CUSTOMER_NOT_FOUND' && (
                  <button type="button" onClick={() => setCustomerModalOpen(true)} className="flex items-center gap-2 rounded-2xl border border-emerald-400/30 px-4 py-2 text-sm text-emerald-200 transition hover:bg-emerald-500/20">
                    <UserPlus className="h-4 w-4" /> Create customer
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-[1rem] border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                No AI run yet. Try a simple sentence to create a transaction.
              </div>
            </div>
          )}
        </div>
      </div>

      {customerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-[1.5rem] border border-white/10 bg-slate-900 p-5 shadow-2xl">
            <h3 className="text-lg font-semibold text-white">Customer not found</h3>
            <p className="mt-2 text-sm text-slate-400">Would you like to create a new customer?</p>
            <form onSubmit={handleCreateCustomer} className="mt-4 space-y-3">
              <input required value={customerForm.name} onChange={(event) => setCustomerForm({ ...customerForm, name: event.target.value })} placeholder="Customer name" className="min-w-0 w-full break-words rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
              <input value={customerForm.phone} onChange={(event) => setCustomerForm({ ...customerForm, phone: event.target.value })} placeholder="Phone (optional)" className="min-w-0 w-full break-words rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
              <textarea value={customerForm.address} onChange={(event) => setCustomerForm({ ...customerForm, address: event.target.value })} rows="3" placeholder="Address (optional)" className="min-w-0 w-full break-words rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
              <div className="flex flex-wrap gap-3 pt-2">
                <button type="submit" disabled={customerSaving} className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70">
                  {customerSaving ? 'Creating...' : 'Create customer'}
                </button>
                <button type="button" onClick={() => setCustomerModalOpen(false)} className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
