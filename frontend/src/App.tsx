import { useState } from "react";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { WalletProvider } from "./context/WalletContext";
import { AdminPanel } from "./components/AdminPanel";
import { ProductList } from "./components/productList";
import { OrderList } from "./components/orderList";
import { PasskeyLogin } from "./components/PasskeyLogin";

type View = "menu" | "admin" | "orders";

function AppContent() {
  const [view, setView] = useState<View>("menu");
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950">
        <PasskeyLogin />
      </div>
    );
  }

  return (
    <WalletProvider>
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
            <h1
              className="font-semibold cursor-pointer hover:text-emerald-400 transition-colors"
              onClick={() => setView("menu")}
            >
              TokenEats
            </h1>
            <div className="flex items-center gap-3">
              <nav className="space-x-2 text-sm">
                <button
                  onClick={() => setView("menu")}
                  className={`px-3 py-1 rounded-lg ${
                    view === "menu"
                      ? "bg-slate-800 text-slate-50"
                      : "text-slate-400 hover:bg-slate-800/60"
                  }`}
                >
                  Menú
                </button>
                <button
                  onClick={() => setView("orders")}
                  className={`px-3 py-1 rounded-lg ${
                    view === "orders"
                      ? "bg-slate-800 text-slate-50"
                      : "text-slate-400 hover:bg-slate-800/60"
                  }`}
                >
                  Pedidos
                </button>
                {isAdmin && (
                  <button
                    onClick={() => setView("admin")}
                    className={`px-3 py-1 rounded-lg ${
                      view === "admin"
                        ? "bg-emerald-500 text-slate-900"
                        : "text-slate-400 hover:bg-emerald-500/20"
                    }`}
                  >
                    Admin
                  </button>
                )}
              </nav>
              <div className="flex items-center gap-2 border-l border-slate-700 pl-3">
                <span className="text-xs text-slate-400 max-w-[120px] truncate">
                  {user?.name || user?.email || user?.username}
                </span>
                {isAdmin && (
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">admin</span>
                )}
                <button
                  onClick={logout}
                  className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                >
                  Salir
                </button>
              </div>
            </div>
          </div>
        </header>

        {view === "menu" && <ProductList />}
        {view === "orders" && <OrderList />}
        {view === "admin" && isAdmin && <AdminPanel />}
      </div>
    </WalletProvider>
  );
}

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </CartProvider>
  );
}

export default App;
