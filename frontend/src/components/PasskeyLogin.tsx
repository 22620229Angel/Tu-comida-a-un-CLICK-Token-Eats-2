import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function PasskeyLogin() {
  const { registerPasskey, loginWithPasskey, loginWithFreighter, loading, error } = useAuth();
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState<"select" | "passkey-register" | "passkey-login">("select");

  const handleFreighterAdmin = async () => {
    try {
      const freighter = await import('@stellar/freighter-api');
      const result = await freighter.requestAccess();
      if (!result.address) {
        alert(result.error || 'Freighter no respondió. Asegúrate de tener la extensión instalada y desbloqueada.');
        return;
      }
      await loginWithFreighter(result.address);
    } catch (err: any) {
      alert(err?.message || 'Error al conectar con Freighter');
    }
  };

  const handleRegister = () => {
    if (!username.trim()) return;
    registerPasskey(username.trim());
  };

  const handleLogin = () => {
    loginWithPasskey(username.trim() || undefined);
  };

  if (mode === "passkey-register") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md space-y-4">
          <h2 className="text-xl font-semibold text-slate-100 text-center">Registrar con huella</h2>
          <input
            type="text"
            placeholder="Tu correo o nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            onClick={handleRegister}
            disabled={loading || !username.trim()}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white rounded-xl font-medium transition-colors"
          >
            {loading ? 'Procesando…' : 'Registrar con huella'}
          </button>
          <button onClick={() => setMode("select")} className="w-full text-xs text-slate-500 hover:text-slate-300 transition-colors">
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (mode === "passkey-login") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md space-y-4">
          <h2 className="text-xl font-semibold text-slate-100 text-center">Acceder con huella</h2>
          <input
            type="text"
            placeholder="Tu correo (opcional si ya registraste)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white rounded-xl font-medium transition-colors"
          >
            {loading ? 'Procesando…' : 'Acceder con huella'}
          </button>
          <button onClick={() => setMode("select")} className="w-full text-xs text-slate-500 hover:text-slate-300 transition-colors">
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md space-y-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-100">TokenEats</h2>
          <p className="text-sm text-slate-400 mt-1">Inicia sesión para pedir comida</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          onClick={() => setMode("passkey-register")}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Registrarse con huella
        </button>

        <button
          onClick={() => setMode("passkey-login")}
          className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
        >
          Ya tengo cuenta — acceder con huella
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-slate-900 px-2 text-slate-500">admin</span>
          </div>
        </div>

        <button
          onClick={handleFreighterAdmin}
          disabled={loading}
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          {loading ? 'Conectando…' : 'Admin — conectar Freighter'}
        </button>

        <p className="text-xs text-slate-500 text-center">
          Usuarios: registra con huella. Admin: conecta tu billetera Stellar (Freighter).
        </p>
      </div>
    </div>
  );
}
