import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Package, Pencil, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { createInventoryItem, deleteInventoryItem, getInventory, updateInventoryItem } from '../services/app.api';

const defaultForm = {
  productName: '',
  category: '',
  sku: '',
  quantity: '',
  unit: 'pcs',
  buyingPrice: '',
  sellingPrice: '',
  lowStockThreshold: '',
  barcode: '',
};

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  const loadProducts = async () => {
    try {
      const response = await getInventory();
      setProducts(response?.data?.data?.products || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to load inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        ...form,
        quantity: Number(form.quantity),
        buyingPrice: Number(form.buyingPrice),
        sellingPrice: Number(form.sellingPrice),
        lowStockThreshold: Number(form.lowStockThreshold || 0),
      };

      if (editingId) {
        await updateInventoryItem(editingId, payload);
        toast.success('Product updated.');
      } else {
        await createInventoryItem(payload);
        toast.success('Product added.');
      }

      setForm(defaultForm);
      setEditingId(null);
      loadProducts();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Inventory update failed.');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      productName: product.productName || '',
      category: product.category || '',
      sku: product.sku || '',
      quantity: product.quantity ?? '',
      unit: product.unit || 'pcs',
      buyingPrice: product.buyingPrice ?? '',
      sellingPrice: product.sellingPrice ?? '',
      lowStockThreshold: product.lowStockThreshold ?? '',
      barcode: product.barcode || '',
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteInventoryItem(id);
      toast.success('Product removed.');
      loadProducts();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to delete product.');
    }
  };

  const filteredProducts = products.filter((product) => {
    const term = search.toLowerCase();
    return !term || product.productName?.toLowerCase().includes(term) || product.sku?.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">Inventory</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Track stock and margins</h2>
          <p className="mt-2 text-sm text-slate-400">Add products, update prices, and keep low-stock items visible.</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="bg-transparent text-sm text-white outline-none" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-emerald-300">
            <PlusCircle className="h-5 w-5" />
            <h3 className="text-lg font-semibold text-white">{editingId ? 'Update product' : 'Create product'}</h3>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Product name</label>
              <input required value={form.productName} onChange={(event) => setForm({ ...form, productName: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Category</label>
                <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">SKU</label>
                <input value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Quantity</label>
                <input required type="number" min="0" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Unit</label>
                <input value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Buying price</label>
                <input required type="number" min="0" value={form.buyingPrice} onChange={(event) => setForm({ ...form, buyingPrice: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Selling price</label>
                <input required type="number" min="0" value={form.sellingPrice} onChange={(event) => setForm({ ...form, sellingPrice: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Low stock threshold</label>
                <input type="number" min="0" value={form.lowStockThreshold} onChange={(event) => setForm({ ...form, lowStockThreshold: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Barcode</label>
                <input value={form.barcode} onChange={(event) => setForm({ ...form, barcode: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
              </div>
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400">
              {editingId ? 'Save changes' : 'Add product'}
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
            <Package className="h-5 w-5" />
            <h3 className="text-lg font-semibold text-white">Current inventory</h3>
          </div>

          {loading ? (
            <p className="mt-6 text-sm text-slate-400">Loading inventory...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="mt-6 text-sm text-slate-400">No products found.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {filteredProducts.map((product) => (
                <div key={product._id} className="rounded-[1rem] border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{product.productName}</p>
                      <p className="mt-1 text-sm text-slate-400">{product.category || 'General'} · SKU {product.sku || '—'}</p>
                    </div>
                    <div className={`rounded-full px-3 py-1 text-xs ${Number(product.quantity) <= Number(product.lowStockThreshold || 0) ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                      {product.quantity} {product.unit || 'pcs'}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                    <span>₹{product.sellingPrice}</span>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => handleEdit(product)} className="rounded-full p-2 transition hover:bg-white/10">
                        <Pencil className="h-4 w-4 text-emerald-300" />
                      </button>
                      <button type="button" onClick={() => handleDelete(product._id)} className="rounded-full p-2 transition hover:bg-white/10">
                        <Trash2 className="h-4 w-4 text-rose-300" />
                      </button>
                    </div>
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
