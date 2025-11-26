import React, { useState } from "react";
import { AdminAddProduct } from "./components/adminAddProduct";
import { ProductList } from "./components/productList";

function App() {
  const [view, setView] = useState<"admin" | "catalog">("catalog");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="font-semibold">TokenEats Dashboard</h1>
          <div className="space-x-2 text-sm">
            <button
              onClick={() => setView("catalog")}
              className={`px-3 py-1 rounded-lg ${
                view === "catalog"
                  ? "bg-slate-800 text-slate-50"
                  : "text-slate-400 hover:bg-slate-800/60"
              }`}
            >
              Catálogo
            </button>
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
          </div>
        </div>
      </header>

      {view === "catalog" ? <ProductList /> : <AdminAddProduct />}
    </div>
  );
}

export default App;
