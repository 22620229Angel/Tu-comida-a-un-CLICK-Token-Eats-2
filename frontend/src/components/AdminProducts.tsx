import { useState, useEffect } from 'react';
import {
  fetchProducts,
  addProduct,
  updateProduct,
  removeProduct,
  increaseStock,
  decreaseStock,
  setProductImage,
  removeProductImage,
} from '../api/client';
import type { Product } from '../api/client';

interface FormData {
  name: string;
  quantity: string;
  price: string;
  image: string;
}

const emptyForm: FormData = { name: '', quantity: '0', price: '0', image: '' };

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [stockOps, setStockOps] = useState<Record<string, string>>({});

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProducts();
      setProducts(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setMessage(null);
      const qty = parseInt(form.quantity, 10);
      const price = parseInt(form.price, 10);
      if (isNaN(qty) || isNaN(price)) {
        setMessage('❌ Cantidad y precio deben ser números');
        return;
      }

      if (editing) {
        await updateProduct(editing.name, qty, price);
        if (form.image) {
          await setProductImage(editing.name, form.image);
        } else {
          await removeProductImage(editing.name);
        }
        setMessage('✅ Producto actualizado');
      } else {
        await addProduct(form.name, qty, price);
        if (form.image) {
          await setProductImage(form.name, form.image);
        }
        setMessage('✅ Producto agregado');
      }
      resetForm();
      await loadProducts();
    } catch (e: any) {
      setMessage(`❌ Error: ${e.message}`);
    }
  };

  const handleDelete = async (name: string) => {
    if (!window.confirm(`¿Eliminar "${name}"? Solo si el stock es 0.`)) return;
    try {
      setMessage(null);
      await removeProduct(name);
      setMessage(`✅ "${name}" eliminado`);
      await loadProducts();
    } catch (e: any) {
      setMessage(`❌ Error: ${e.message}`);
    }
  };

  const handleEdit = (p: Product) => {
    setForm({ name: p.name, quantity: String(p.quantity), price: String(p.price), image: p.image || '' });
    setEditing(p);
    setShowForm(true);
  };

  const handleStock = async (name: string, type: 'increase' | 'decrease') => {
    const val = stockOps[name];
    const amount = parseInt(val, 10);
    if (isNaN(amount) || amount <= 0) {
      setMessage('❌ Ingresa una cantidad válida');
      return;
    }
    try {
      setMessage(null);
      if (type === 'increase') await increaseStock(name, amount);
      else await decreaseStock(name, amount);
      setMessage(`✅ Stock ${type === 'increase' ? 'incrementado' : 'decrementado'} en ${amount}`);
      setStockOps((prev) => ({ ...prev, [name]: '' }));
      await loadProducts();
    } catch (e: any) {
      setMessage(`❌ Error: ${e.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mensajes */}
      {message && (
        <div className={`rounded-xl border p-4 text-sm ${
          message.startsWith('✅') ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-200' :
          'border-rose-500/40 bg-rose-950/40 text-rose-200'
        }`}>
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-4 text-sm text-rose-200">
          Error al cargar: {error}
          <button onClick={loadProducts} className="ml-2 underline">Reintentar</button>
        </div>
      )}

      {/* Botón agregar / formulario */}
      {!showForm ? (
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400 transition-colors"
        >
          + Agregar producto
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
          <h3 className="text-sm font-semibold">{editing ? 'Editar producto' : 'Nuevo producto'}</h3>

          <div className="grid gap-4 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Nombre</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                disabled={!!editing}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                placeholder="Ej. Pizza"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Cantidad</label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                required
                min={0}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Precio (XLM)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                min={0}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">URL de imagen (opcional)</label>
            <input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {form.image && (
              <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-slate-700">
                <img
                  src={form.image}
                  alt="preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.style.display = 'none';
                    const parent = el.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = 'w-full h-full flex items-center justify-center bg-slate-800 text-[9px] text-slate-500';
                      fallback.textContent = 'Sin img';
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button type="submit" className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-emerald-400 transition-colors">
              {editing ? 'Actualizar' : 'Agregar'}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg bg-slate-800 px-4 py-2 text-xs text-slate-300 hover:bg-slate-700 transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Tabla de productos */}
      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">Cargando productos...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">No hay productos registrados.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800">
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Imagen</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Producto</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Stock</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Precio</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Ajustar Stock</th>
                <th className="text-right px-4 py-3 text-slate-400 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {products.map((p) => (
                <tr key={p.name} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-3">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-[9px] text-slate-500">Sin img</div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-100">{p.name}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${p.quantity > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {p.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-200">{p.price} XLM</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={1}
                        placeholder="0"
                        value={stockOps[p.name] || ''}
                        onChange={(e) => setStockOps({ ...stockOps, [p.name]: e.target.value })}
                        className="w-16 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <button
                        onClick={() => handleStock(p.name, 'increase')}
                        className="rounded bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                      >
                        + Stock
                      </button>
                      <button
                        onClick={() => handleStock(p.name, 'decrease')}
                        className="rounded bg-rose-500/20 px-2 py-1 text-xs text-rose-300 hover:bg-rose-500/30 transition-colors"
                      >
                        - Stock
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEdit(p)}
                      className="rounded bg-sky-500/20 px-3 py-1 text-xs text-sky-300 hover:bg-sky-500/30 transition-colors mr-1"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.name)}
                      className="rounded bg-rose-500/20 px-3 py-1 text-xs text-rose-300 hover:bg-rose-500/30 transition-colors"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
