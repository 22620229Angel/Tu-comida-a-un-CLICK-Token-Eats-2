// src/components/productList.tsx
import React, { useEffect, useState } from "react";
import { fetchProducts } from "../stellar/productQueries";
import { createOrderForProducts } from "../stellar/orderActions";
import type { Product } from "../stellar/productQueries";

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [orderMessage, setOrderMessage] = useState<string | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);


  const handleCreateOrder = async () => {
    if (!selected) return;

    try {
      setCreatingOrder(true);
      setOrderMessage("Creando pedido en la blockchain…");

      // Por ahora creamos un pedido con UN solo producto
      const orderId = await createOrderForProducts([selected.name]);

      setOrderMessage(`✅ Pedido creado con ID #${orderId}`);
    } catch (e: any) {
      setOrderMessage(
        `❌ Error al crear el pedido: ${e.message ?? String(e)}`
      );
    } finally {
      setCreatingOrder(false);
    }
  };



  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchProducts();
        setProducts(result);
        if (result.length > 0) setSelected(result[0]); // seleccionar el primero por defecto
      } catch (e: any) {
        setError(e.message ?? String(e));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-semibold mb-1">
            Menú TokenEats – Comidas disponibles
          </h1>
          <p className="text-sm text-slate-400">
            Selecciona un platillo para ver sus detalles. Los datos se leen
            directamente del contrato Soroban en Testnet.
          </p>
        </header>

        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-sm text-slate-300">
              Cargando productos desde la blockchain…
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4">
            <p className="text-sm text-rose-200">
              Error al obtener productos: {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* GRID DE CARDS */}
            <div className="flex-1">
              {products.length === 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                  <p className="text-sm text-slate-300">
                    No hay productos registrados todavía.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((p) => {
                    const isSelected = selected?.name === p.name;
                    return (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => setSelected(p)}
                        className={[
                          "group relative flex flex-col items-start rounded-2xl border bg-slate-900/80 p-4 text-left shadow-lg transition",
                          "hover:border-emerald-400 hover:shadow-emerald-500/20",
                          isSelected
                            ? "border-emerald-500 ring-2 ring-emerald-500/60"
                            : "border-slate-800",
                        ].join(" ")}
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center text-xs text-slate-300 mb-3">
                          {p.name
                            .split(" ")
                            .slice(0, 2)
                            .map((w) => w[0]?.toUpperCase())
                            .join("")}
                        </div>

                        <h2 className="text-sm font-semibold text-slate-50 mb-1 line-clamp-2">
                          {p.name}
                        </h2>

                        <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                          Platillo disponible en TokenEats. Ideal para tu pedido
                          rápido.
                        </p>

                        <div className="mt-auto flex w-full items-center justify-between pt-3 border-t border-slate-800">
                          <span className="text-xs text-slate-400">
                            Stock:{" "}
                            <span className="font-semibold text-slate-100">
                              {p.quantity}
                            </span>
                          </span>
                          <span className="text-sm font-semibold text-emerald-400">
                            {p.price} XLM
                          </span>
                        </div>

                        <span className="absolute right-3 top-3 inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium text-slate-300 group-hover:border-emerald-400 group-hover:text-emerald-300">
                          {isSelected ? "Seleccionado" : "Ver"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* PANEL DE DETALLE */}
            <aside className="w-full lg:w-80 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
              {selected ? (
                <>
                  <h2 className="text-sm font-semibold text-slate-50 mb-1">
                    Detalle del platillo
                  </h2>
                  <p className="text-xs text-slate-400 mb-4">
                    Revisa los datos antes de añadirlo a un pedido o hacer
                    cambios desde el panel admin.
                  </p>

                  <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 mb-4">
                    <p className="text-sm font-semibold text-slate-50 mb-1">
                      {selected.name}
                    </p>
                    <p className="text-xs text-slate-400 mb-3">
                      Platillo registrado en el smart contract de TokenEats.
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">
                        Stock:{" "}
                        <span className="font-semibold">
                          {selected.quantity}
                        </span>
                      </span>
                      <span className="text-emerald-400 font-semibold">
                        {selected.price} XLM
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCreateOrder}
                    disabled={creatingOrder}
                    className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-900 shadow-md shadow-emerald-500/30
                              hover:bg-emerald-400 active:bg-emerald-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {creatingOrder ? "Creando pedido…" : "Añadir al pedido"}
                  </button>

                  {orderMessage && (
                    <p className="mt-3 text-[11px] text-slate-300">
                      {orderMessage}
                    </p>
                  )}


                  <p className="mt-3 text-[11px] text-slate-500">
                    * La lógica para crear pedidos la podemos conectar después
                    usando el método <code>create_order</code> del contrato.
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-300">
                  Selecciona un producto del menú para ver sus detalles.
                </p>
              )}
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};


