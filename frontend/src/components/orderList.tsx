// src/components/orderList.tsx
import React, { useEffect, useState } from "react";
import { fetchOrders } from "../stellar/orderQueries";
import type { Order, OrderStatus } from "../stellar/orderQueries";
import { updateOrderStatus } from "../stellar/orderActions";


const statusColors: Record<string, string> = {
  creado: "bg-slate-800 text-slate-100 border-slate-600",
  preparando: "bg-amber-500/10 text-amber-300 border-amber-400/60",
  listo: "bg-sky-500/10 text-sky-300 border-sky-400/60",
  entregado: "bg-emerald-500/10 text-emerald-300 border-emerald-400/60",
  cancelado: "bg-rose-500/10 text-rose-300 border-rose-400/60",
  desconocido: "bg-slate-800 text-slate-200 border-slate-600",
};

export const OrderList: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<Order | null>(null);
    const [updating, setUpdating] = useState(false);
    const [statusMsg, setStatusMsg] = useState<string | null>(null);

    const statusOptions: OrderStatus[] = [
    "creado",
    "preparando",
    "listo",
    "entregado",
    "cancelado",
    ];

    const loadOrders = async () => {
        try {
            setLoading(true);
            const result = await fetchOrders();
            setOrders(result);
            if (result.length > 0) setSelected(result[0]);
        } catch (e: any) {
            setError(e.message ?? String(e));
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
    loadOrders();
    }, []);


    const handleStatusChange = async (newStatus: OrderStatus) => {
        if (!selected) return;

        try {
            setUpdating(true);
            setStatusMsg("Actualizando estado del pedido en la blockchain…");

            await updateOrderStatus(selected.id, newStatus);

            setStatusMsg("✅ Estado actualizado correctamente.");

            // Volvemos a cargar pedidos para refrescar la vista
            await loadOrders();

            // Re-seleccionar el pedido con su nuevo estado
            const updated = (orders ?? []).find((o) => o.id === selected.id);
            if (updated) setSelected(updated);
        } catch (e: any) {
            setStatusMsg(
            `❌ Error al actualizar el estado: ${e.message ?? String(e)}`
            );
        } finally {
            setUpdating(false);
        }
    };



  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-semibold mb-1">
            Pedidos – TokenEats (Testnet)
          </h1>
          <p className="text-sm text-slate-400">
            Listado de pedidos almacenados en el contrato Soroban. Selecciona
            uno para ver sus productos.
          </p>
        </header>

        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-sm text-slate-300">
              Cargando pedidos desde la blockchain…
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4">
            <p className="text-sm text-rose-200">
              Error al obtener pedidos: {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* GRID DE PEDIDOS */}
            <div className="flex-1">
              {orders.length === 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                  <p className="text-sm text-slate-300">
                    Aún no hay pedidos registrados.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {orders.map((o) => {
                    const isSelected = selected?.id === o.id;
                    const statusClass =
                      statusColors[o.status] ?? statusColors.desconocido;
                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => setSelected(o)}
                        className={[
                          "relative flex flex-col rounded-2xl border bg-slate-900/80 p-4 text-left shadow-lg transition",
                          "hover:border-emerald-400 hover:shadow-emerald-500/20",
                          isSelected
                            ? "border-emerald-500 ring-2 ring-emerald-500/60"
                            : "border-slate-800",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-400">
                            Pedido #
                            <span className="font-semibold text-slate-100">
                              {o.id}
                            </span>
                          </span>
                          <span
                            className={[
                              "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize",
                              statusClass,
                            ].join(" ")}
                          >
                            {o.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                          {o.products.length > 0
                            ? o.products.join(", ")
                            : "Sin productos asociados."}
                        </p>

                        <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-800">
                          <span className="text-[11px] text-slate-400">
                            Productos:
                            <span className="ml-1 font-semibold text-slate-100">
                              {o.products.length}
                            </span>
                          </span>
                          <span className="text-[11px] text-slate-500">
                            ID: {o.id}
                          </span>
                        </div>
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
                    Detalle del pedido #{selected.id}
                  </h2>
                  <p className="text-xs text-slate-400 mb-4">
                    Productos y estado actual según el contrato.
                  </p>

                    <div className="mb-4 space-y-2">
                        <span
                            className={[
                            "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold capitalize",
                            statusColors[selected.status],
                            ].join(" ")}
                        >
                            Estado actual: {selected.status}
                        </span>

                        <div className="text-[11px] text-slate-400">
                            <label className="block mb-1">
                            Cambiar estado (requiere cuenta admin en Freighter):
                            </label>
                            <select
                            value={selected.status}
                            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                            disabled={updating}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-100
                                        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                                        disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                            {statusOptions.map((s) => (
                                <option key={s} value={s}>
                                {s}
                                </option>
                            ))}
                            </select>
                        </div>
                    </div>


                  <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 mb-4">
                    <p className="text-xs font-semibold text-slate-200 mb-2">
                      Productos en el pedido
                    </p>
                    {selected.products.length === 0 ? (
                      <p className="text-[11px] text-slate-400">
                        Este pedido no tiene productos registrados.
                      </p>
                    ) : (
                      <ul className="space-y-1">
                        {selected.products.map((name, idx) => (
                          <li
                            key={`${selected.id}-${idx}-${name}`}
                            className="text-[11px] text-slate-200 flex items-center gap-2"
                          >
                            <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[9px] text-slate-300">
                              {idx + 1}
                            </span>
                            <span>{name}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                    {statusMsg && (
                         <p className="mt-2 text-[11px] text-slate-300">{statusMsg}</p>
                    )}


                  <p className="text-[11px] text-slate-500">
                    * La actualización de estado se hace desde el panel admin
                    usando el método <code>update_order_status</code>.
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-300">
                  Selecciona un pedido del listado para ver sus detalles.
                </p>
              )}
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};
