import { useState, useEffect } from 'react';
import { fetchOrders, updateOrderStatus } from '../api/client';
import type { Order, OrderStatus } from '../api/client';

const statusColors: Record<string, string> = {
  creado: 'bg-slate-800 text-slate-100 border-slate-600',
  preparando: 'bg-amber-500/10 text-amber-300 border-amber-400/60',
  listo: 'bg-sky-500/10 text-sky-300 border-sky-400/60',
  entregado: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/60',
  cancelado: 'bg-rose-500/10 text-rose-300 border-rose-400/60',
  desconocido: 'bg-slate-800 text-slate-200 border-slate-600',
};

const statusOptions: OrderStatus[] = [
  'creado', 'preparando', 'listo', 'entregado', 'cancelado',
];

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('todas');
  const [updating, setUpdating] = useState<number | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchOrders();
      setOrders(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      setUpdating(orderId);
      setMessage(null);
      await updateOrderStatus(orderId, newStatus);
      setMessage(`✅ Pedido #${orderId} → ${newStatus}`);
      await loadOrders();
    } catch (e: any) {
      setMessage(`❌ Error: ${e.message}`);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === 'todas'
    ? orders
    : orders.filter((o) => o.status === filter);

  const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

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
          <button onClick={loadOrders} className="ml-2 underline">Reintentar</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {['todas', ...statusOptions].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-xl border p-3 text-center transition-colors ${
              filter === s
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-slate-800 bg-slate-900/70 hover:border-slate-600'
            }`}
          >
            <p className="text-lg font-bold text-slate-100">
              {s === 'todas' ? orders.length : (statusCounts[s] || 0)}
            </p>
            <p className="text-[10px] text-slate-400 capitalize">{s === 'todas' ? 'Todas' : s}</p>
          </button>
        ))}
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">Cargando pedidos...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">No hay pedidos {filter !== 'todas' ? `en estado "${filter}"` : ''}.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800">
                <th className="text-left px-4 py-3 text-slate-400 font-medium">ID</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Productos</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Estado</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Cambiar estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-slate-100">#{o.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {o.products.length > 0
                        ? o.products.map((name, i) => (
                            <span key={i} className="inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                              {name}
                            </span>
                          ))
                        : <span className="text-slate-500">-</span>
                      }
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${statusColors[o.status] || statusColors.desconocido}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        disabled={updating === o.id}
                        className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {updating === o.id && (
                        <span className="text-[10px] text-slate-400">Actualizando...</span>
                      )}
                    </div>
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
