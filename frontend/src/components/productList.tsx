// src/components/productList.tsx
import React, { useEffect, useState } from "react";
import { fetchProducts } from "../stellar/productQueries";
import type { Product } from "../stellar/productQueries";

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchProducts();
        setProducts(result);
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
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">
          Catálogo de productos – TokenEats
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          Productos leídos directamente del contrato Soroban en Testnet.
        </p>

        {loading && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-sm text-slate-300">
              Cargando productos desde la blockchain…
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-4 mb-4">
            <p className="text-sm text-rose-200">
              Error al obtener productos: {error}
            </p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-sm text-slate-300">
              No hay productos registrados todavía.
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/70 shadow-xl">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-900/80 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">
                    Producto
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">
                    Cantidad
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">
                    Precio (XLM)
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.name}
                    className="border-t border-slate-800/70 hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-slate-100">
                      {p.name}
                    </td>
                    <td className="px-4 py-3 text-slate-200">{p.quantity}</td>
                    <td className="px-4 py-3 text-emerald-400 font-semibold">
                      {p.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
