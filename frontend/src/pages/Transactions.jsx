import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ReceiptText, PlusCircle, DollarSign, CircleDollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { createPaymentTransaction, createSaleTransaction, getCustomers, getInventory, getTransactions } from '../services/app.api';

const saleFormDefault = {
  customerId: '',
  inventoryId: '',
  quantity: '1',
  paidAmount: '0',
  notes: '',
};

const paymentFormDefault = {
  customerId: '',
  amount: '',
  notes: '',
};

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saleForm, setSaleForm] = useState(saleFormDefault);
  const [paymentForm, setPaymentForm] = useState(paymentFormDefault);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const loadData = async () => {
    try {
      const [transactionsResponse, customersResponse, productsResponse] = await Promise.all([
        getTransactions(),
        getCustomers(),
        getInventory(),
      ]);
      setTransactions(transactionsResponse?.data?.data?.transactions || []);
      setCustomers(customersResponse?.data?.data?.customers || []);
      setProducts(productsResponse?.data?.data?.products || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to load transactions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaleSubmit = async (event) => {
    event.preventDefault();

    try {
      await createSaleTransaction({
        ...saleForm,
        quantity: Number(saleForm.quantity),
        paidAmount: Number(saleForm.paidAmount),
      });
      toast.success('Sale recorded.');
      setSaleForm(saleFormDefault);
      loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to record sale.');
    }
  };

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();

    try {
      await createPaymentTransaction({
        ...paymentForm,
        amount: Number(paymentForm.amount),
      });
      toast.success('Payment recorded.');
      setPaymentForm(paymentFormDefault);
      loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to record payment.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">Transactions</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Capture sales and payments</h2>
        <p className="mt-2 text-sm text-slate-400">Use the forms below to log transactions directly or rely on the AI assistant for speech-driven entries.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSaleSubmit} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-emerald-300">
            <PlusCircle className="h-5 w-5" />
            <h3 className="text-lg font-semibold text-white">Record sale</h3>
          </div>
          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Customer</label>
              <select required value={saleForm.customerId} onChange={(event) => setSaleForm({ ...saleForm, customerId: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none">
                <option value="">Select customer</option>
                {customers.map((customer) => <option key={customer._id} value={customer._id}>{customer.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Product</label>
              <select required value={saleForm.inventoryId} onChange={(event) => setSaleForm({ ...saleForm, inventoryId: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none">
                <option value="">Select product</option>
                {products.map((product) => <option key={product._id} value={product._id}>{product.productName}</option>)}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Quantity</label>
                <input required type="number" min="1" value={saleForm.quantity} onChange={(event) => setSaleForm({ ...saleForm, quantity: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Paid amount</label>
                <input type="number" min="0" value={saleForm.paidAmount} onChange={(event) => setSaleForm({ ...saleForm, paidAmount: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Notes</label>
              <textarea value={saleForm.notes} onChange={(event) => setSaleForm({ ...saleForm, notes: event.target.value })} rows="3" className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
            </div>
          </div>
          <button className="mt-5 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400">Save sale</button>
        </motion.form>

        <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={handlePaymentSubmit} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-emerald-300">
            <DollarSign className="h-5 w-5" />
            <h3 className="text-lg font-semibold text-white">Record payment</h3>
          </div>
          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Customer</label>
              <select required value={paymentForm.customerId} onChange={(event) => setPaymentForm({ ...paymentForm, customerId: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none">
                <option value="">Select customer</option>
                {customers.map((customer) => <option key={customer._id} value={customer._id}>{customer.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Amount</label>
              <input required type="number" min="1" value={paymentForm.amount} onChange={(event) => setPaymentForm({ ...paymentForm, amount: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Notes</label>
              <textarea value={paymentForm.notes} onChange={(event) => setPaymentForm({ ...paymentForm, notes: event.target.value })} rows="3" className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
            </div>
          </div>
          <button className="mt-5 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400">Save payment</button>
        </motion.form>
      </div>

      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-2 text-emerald-300">
          <ReceiptText className="h-5 w-5" />
          <h3 className="text-lg font-semibold text-white">Recent transactions</h3>
        </div>
        {loading ? (
          <p className="mt-4 text-sm text-slate-400">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">No transactions yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction._id} className="rounded-[1rem] border border-white/10 bg-slate-950/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{transaction.transactionType === 'PAYMENT' ? 'Payment' : 'Sale'}</p>
                    <p className="mt-1 text-sm text-slate-400">{transaction.customer?.name || 'Unknown customer'} · {transaction.inventory?.productName || 'No product'}</p>
                  </div>
                  <div className="text-right text-sm text-emerald-300">
                    <p>₹{Number(transaction.totalAmount || transaction.paidAmount || 0).toFixed(2)}</p>
                    <p className="text-xs text-slate-500">{transaction.paymentType}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
