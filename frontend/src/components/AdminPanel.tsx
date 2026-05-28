import { useState, useEffect } from 'react';
import { getAdmin } from '../api/client';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';

type AdminTab = 'dashboard' | 'products' | 'orders';

export const AdminPanel: React.FC = () => {
  const [tab, setTab] = useState<AdminTab>('products');
  const [adminAddress, setAdminAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdmin()
      .then(setAdminAddress)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const tabs: { key: AdminTab; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'products', label: 'Productos' },
    { key: 'orders', label: 'Órdenes' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-semibold mb-1">Panel de Administración</h1>
          <p className="text-sm text-slate-400">
            Gestiona productos, stock y pedidos de TokenEats.
          </p>
        </header>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-800">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                tab === t.key
                  ? 'bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'dashboard' && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Dashboard</h2>
            {loading && <p className="text-sm text-slate-400">Cargando...</p>}
            {error && <p className="text-sm text-rose-400">Error: {error}</p>}
            {!loading && !error && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4">
                  <p className="text-xs text-slate-400 mb-1">Admin del contrato</p>
                  <p className="text-sm font-mono text-emerald-400 break-all">{adminAddress}</p>
                </div>
                <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4">
                  <p className="text-xs text-slate-400 mb-1">Red</p>
                  <p className="text-sm font-mono text-slate-200">Stellar Testnet</p>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'products' && <AdminProducts />}
        {tab === 'orders' && <AdminOrders />}
      </div>
    </div>
  );
};
