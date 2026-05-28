// src/App.tsx
import { useState } from "react";
import { CartProvider } from "./context/CartContext";
import { AdminPanel } from "./components/AdminPanel";
import { ProductList } from "./components/productList";
import { OrderList } from "./components/orderList";

type View = "menu" | "admin" | "orders";

function App() {
  const [view, setView] = useState<View>("menu");

  return (
    <CartProvider>
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="font-semibold">TokenEats Dashboard</h1>
          <div className="space-x-2 text-sm">
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
            <button
              onClick={() => setView("admin")}
              className={`px-3 py-1 rounded-lg ${
                view === "admin"
                  ? "bg-emerald-500 text-slate-900"
                  : "text-slate-400 hover:bg-emerald-500/20"
              }`}
            >
              Admin (API)
            </button>
          </div>
        </div>
      </header>

      {view === "menu" && <ProductList />}
      {view === "orders" && <OrderList />}
      {view === "admin" && <AdminPanel />}
    </div>
    </CartProvider>
  );
}

export default App;
