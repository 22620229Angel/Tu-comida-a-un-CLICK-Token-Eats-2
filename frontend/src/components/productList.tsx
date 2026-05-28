import React, { useEffect, useState } from "react";
import { fetchProducts, createOrder } from "../api/client";
import type { Product } from "../api/client";
import { useCart } from "../context/CartContext";

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [orderMsg, setOrderMsg] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const { items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchProducts();
        setProducts(result);
        const qs: Record<string, number> = {};
        result.forEach((p) => (qs[p.name] = 1));
        setQuantities(qs);
      } catch (e: any) {
        setError(e.message ?? String(e));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCreateOrder = async () => {
    if (items.length === 0) return;
    try {
      setCreating(true);
      setOrderMsg("Creando pedido en la blockchain…");
      const productNames = items.flatMap((i) => Array(i.quantity).fill(i.name));
      const { orderId } = await createOrder(productNames);
      setOrderMsg(`✅ Pedido #${orderId} creado con ${totalItems} producto(s)`);
      clearCart();
    } catch (e: any) {
      setOrderMsg(`❌ Error: ${e.message ?? String(e)}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Menú TokenEats</h1>
            <p className="text-sm text-slate-400">
              Agrega productos al carrito y crea tu pedido.
            </p>
          </div>
          {totalItems > 0 && (
            <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-4 py-2">
              <span className="text-sm font-semibold text-emerald-400">{totalItems} items</span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-sm font-bold text-emerald-400">{totalPrice} XLM</span>
            </div>
          )}
        </header>

        {error && (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 text-sm text-rose-200">
            Error: {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Grid de productos */}
          <div className="flex-1">
            {loading && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <p className="text-sm text-slate-400">Cargando productos…</p>
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <p className="text-sm text-slate-400">No hay productos registrados.</p>
              </div>
            )}

            {!loading && !error && products.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => {
                  const inCart = items.find((i) => i.name === p.name);
                  const qty = quantities[p.name] || 1;
                  return (
                    <div
                      key={p.name}
                      className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg overflow-hidden"
                    >
                      <div className="w-full h-32 bg-slate-800/60 flex items-center justify-center overflow-hidden">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            <span className="text-2xl font-bold text-slate-600">
                              {p.name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                      <h2 className="text-sm font-semibold text-slate-50 mb-1">{p.name}</h2>
                      <p className="text-xs text-slate-400 mb-3 line-clamp-2">Platillo disponible en TokenEats.</p>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-800 mb-3">
                        <span className="text-xs text-slate-400">
                          Stock: <span className={`font-semibold ${p.quantity > 0 ? 'text-slate-100' : 'text-rose-400'}`}>{p.quantity}</span>
                        </span>
                        <span className="text-sm font-semibold text-emerald-400">{p.price} XLM</span>
                      </div>

                      <div className="flex items-center gap-2 mt-auto">
                        <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950">
                          <button
                            onClick={() => setQuantities({ ...quantities, [p.name]: Math.max(1, qty - 1) })}
                            className="px-2 py-1 text-xs text-slate-300 hover:text-slate-50 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-2 py-1 text-xs font-semibold text-slate-100 min-w-[24px] text-center">{qty}</span>
                          <button
                            onClick={() => setQuantities({ ...quantities, [p.name]: qty + 1 })}
                            className="px-2 py-1 text-xs text-slate-300 hover:text-slate-50 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => addItem(p.name, p.price, qty)}
                          disabled={p.quantity === 0}
                          className="flex-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {inCart ? `+${qty}` : 'Agregar'}
                        </button>
                      </div>

                      {inCart && (
                        <p className="mt-2 text-[10px] text-emerald-400 text-center">
                          {inCart.quantity} en carrito
                        </p>
                      )}
                    </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Panel de carrito */}
          <aside className="w-full lg:w-80 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl flex flex-col">
            <h2 className="text-sm font-semibold text-slate-50 mb-1">Tu carrito</h2>
            <p className="text-xs text-slate-400 mb-4">
              {totalItems === 0 ? 'Aún no has agregado productos.' : `${totalItems} producto(s) — ${totalPrice} XLM`}
            </p>

            {items.length > 0 && (
              <div className="flex-1 space-y-2 mb-4 max-h-[400px] overflow-y-auto">
                {items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-xl bg-slate-950/60 border border-slate-800 p-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-200 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400">{item.price} XLM c/u</p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => updateQuantity(item.name, item.quantity - 1)}
                        className="w-6 h-6 rounded bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-semibold text-slate-100">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.name, item.quantity + 1)}
                        className="w-6 h-6 rounded bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 transition-colors"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.name)}
                        className="w-6 h-6 rounded bg-rose-500/20 text-xs text-rose-300 hover:bg-rose-500/30 transition-colors ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {orderMsg && (
              <div className={`text-[11px] mb-3 ${orderMsg.startsWith('✅') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {orderMsg}
              </div>
            )}

            {items.length > 0 && (
              <div className="space-y-2 mt-auto pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Total</span>
                  <span className="font-bold text-emerald-400">{totalPrice} XLM</span>
                </div>
                <button
                  onClick={handleCreateOrder}
                  disabled={creating}
                  className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-md shadow-emerald-500/30 hover:bg-emerald-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {creating ? 'Creando pedido…' : `Ordenar (${totalItems})`}
                </button>
                <button
                  onClick={clearCart}
                  disabled={creating}
                  className="w-full rounded-lg bg-slate-800 px-4 py-2 text-xs text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};
