// src/components/AdminAddProduct.tsx
import React, { useState } from "react";
import { addProductWithFreighter } from "../stellar/adminActions";

export const AdminAddProduct: React.FC = () => {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("0");
  const [price, setPrice] = useState("0");
  const [status, setStatus] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setStatus("Conectando con Freighter y firmando la transacción...");
      await addProductWithFreighter(
        name,
        parseInt(qty, 10),
        parseInt(price, 10)
      );
      setStatus("✅ Producto agregado correctamente");
      setName("");
      setQty("0");
      setPrice("0");
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message ?? String(err)}`);
    }
  };

  const isSuccess = status.startsWith("✅");
  const isError = status.startsWith("❌");

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl backdrop-blur-sm p-6">
        <h2 className="text-xl font-semibold text-slate-50 mb-1">
          Panel Admin – Agregar producto
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          Conecta tu cuenta admin en Freighter y registra nuevos productos para
          TokenEats.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200">
              Nombre
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Ej. Hamburguesa clásica"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200">
              Cantidad
            </label>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              min={0}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200">
              Precio
            </label>
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-flex items-center rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300">
                XLM
              </span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                min={0}
                step={1}
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold
                       text-slate-900 shadow-md shadow-emerald-500/30 hover:bg-emerald-400 active:bg-emerald-500
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900
                       transition-colors"
          >
            Agregar producto con Freighter
          </button>
        </form>

        {status && (
          <p
            className={`mt-4 text-sm ${
              isSuccess
                ? "text-emerald-400"
                : isError
                ? "text-rose-400"
                : "text-slate-300"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
};
