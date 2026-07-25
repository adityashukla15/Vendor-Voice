import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Users, Pencil, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { createCustomer, deleteCustomer, getCustomers, updateCustomer } from '../services/app.api';

const defaultForm = {
  name: '',
  phone: '',
  address: '',
};

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  const loadCustomers = async () => {
    try {
      const response = await getCustomers();
      setCustomers(response?.data?.data?.customers || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to load customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await updateCustomer(editingId, form);
        toast.success('Customer updated.');
      } else {
        await createCustomer(form);
        toast.success('Customer added.');
      }

      setForm(defaultForm);
      setEditingId(null);
      loadCustomers();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Customer update failed.');
    }
  };

  const handleEdit = (customer) => {
    setEditingId(customer._id);
    setForm({
      name: customer.name || '',
      phone: customer.phone || '',
      address: customer.address || '',
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      toast.success('Customer removed.');
      loadCustomers();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to delete customer.');
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const term = search.toLowerCase();
    return !term || customer.name?.toLowerCase().includes(term) || customer.phone?.includes(term);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">Customers</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Keep customer records tidy</h2>
          <p className="mt-2 text-sm text-slate-400">Add addresses and phone details so reminders and AI workflows stay accurate.</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customers" className="bg-transparent text-sm text-white outline-none" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-emerald-300">
            <PlusCircle className="h-5 w-5" />
            <h3 className="text-lg font-semibold text-white">{editingId ? 'Update customer' : 'Create customer'}</h3>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Customer name</label>
              <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Phone</label>
              <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Address</label>
              <textarea value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} rows="4" className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400">
              {editingId ? 'Save changes' : 'Add customer'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm(defaultForm); }} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5">
                Cancel
              </button>
            )}
          </div>
        </motion.form>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-emerald-300">
            <Users className="h-5 w-5" />
            <h3 className="text-lg font-semibold text-white">Customer directory</h3>
          </div>

          {loading ? (
            <p className="mt-6 text-sm text-slate-400">Loading customers...</p>
          ) : filteredCustomers.length === 0 ? (
            <p className="mt-6 text-sm text-slate-400">No customers found.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {filteredCustomers.map((customer) => (
                <div key={customer._id} className="rounded-[1rem] border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{customer.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{customer.phone || 'No phone added'}</p>
                      <p className="mt-1 text-sm text-slate-400">{customer.address || 'No address added'}</p>
                    </div>
                    <div className="text-right text-sm text-emerald-300">
                      <p>₹{Number(customer.outstandingBalance || 0).toFixed(2)}</p>
                      <p className="text-xs text-slate-500">outstanding</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-end gap-2">
                    <button type="button" onClick={() => handleEdit(customer)} className="rounded-full p-2 transition hover:bg-white/10">
                      <Pencil className="h-4 w-4 text-emerald-300" />
                    </button>
                    <button type="button" onClick={() => handleDelete(customer._id)} className="rounded-full p-2 transition hover:bg-white/10">
                      <Trash2 className="h-4 w-4 text-rose-300" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
