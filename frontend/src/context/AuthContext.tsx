import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface UserInfo {
  username: string;
  email?: string;
  name?: string;
}

interface AuthState {
  token: string | null;
  role: 'admin' | 'user' | null;
  user: UserInfo | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginWithFreighter: (publicKey: string) => Promise<void>;
  registerPasskey: (username: string) => Promise<void>;
  loginWithPasskey: (username?: string) => Promise<void>;
  logout: () => void;
  checkStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function storeToken(token: string | null) {
  if (token) {
    localStorage.setItem('tokeneats_token', token);
  } else {
    localStorage.removeItem('tokeneats_token');
  }
  if (!token) {
    localStorage.removeItem('tokeneats_role');
    localStorage.removeItem('tokeneats_user');
  }
}

function loadToken(): string | null {
  return localStorage.getItem('tokeneats_token');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(loadToken);
  const [role, setRole] = useState<'admin' | 'user' | null>(
    () => localStorage.getItem('tokeneats_role') as 'admin' | 'user' | null,
  );
  const [user, setUser] = useState<UserInfo | null>(
    () => {
      const u = localStorage.getItem('tokeneats_user');
      return u ? JSON.parse(u) : null;
    },
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/status');
      await res.json();
    } catch {
      // backend not available
    }
  }, []);

  function handleAuthResponse(data: any) {
    storeToken(data.token);
    setToken(data.token);
    const userRole = data.role || 'user';
    setRole(userRole);
    localStorage.setItem('tokeneats_role', userRole);
    const userInfo: UserInfo = { username: data.email || data.username || 'user' };
    if (data.name) userInfo.name = data.name;
    if (data.email) userInfo.email = data.email;
    setUser(userInfo);
    localStorage.setItem('tokeneats_user', JSON.stringify(userInfo));
  }

  const registerPasskey = useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const beginRes = await fetch('/api/auth/register/begin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const beginData = await beginRes.json();
      if (!beginRes.ok) { setError(beginData.error || 'Error al iniciar registro'); setLoading(false); return; }

      const { startRegistration } = await import('@simplewebauthn/browser');
      const regResponse = await startRegistration({ optionsJSON: beginData.options });

      const completeRes = await fetch('/api/auth/register/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...regResponse, username }),
      });
      const completeData = await completeRes.json();
      if (!completeRes.ok) { setError(completeData.error || 'Error al completar registro'); setLoading(false); return; }

      handleAuthResponse(completeData);
    } catch (err: any) {
      setError(err?.message || 'Error al registrar passkey');
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithPasskey = useCallback(async (username?: string) => {
    setLoading(true);
    setError(null);
    try {
      const beginRes = await fetch('/api/auth/login/begin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username || '' }),
      });
      const beginData = await beginRes.json();
      if (!beginRes.ok) { setError(beginData.error || 'Error al iniciar login'); setLoading(false); return; }

      const { startAuthentication } = await import('@simplewebauthn/browser');
      const authResponse = await startAuthentication({ optionsJSON: beginData.options });

      const completeRes = await fetch('/api/auth/login/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...authResponse, username: username || '' }),
      });
      const completeData = await completeRes.json();
      if (!completeRes.ok) { setError(completeData.error || 'Error al completar login'); setLoading(false); return; }

      handleAuthResponse(completeData);
    } catch (err: any) {
      setError(err?.message || 'Error al autenticar con passkey');
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithFreighter = useCallback(async (publicKey: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/freighter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicKey }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Error al autenticar con Freighter'); setLoading(false); return; }
      handleAuthResponse(data);
    } catch (err: any) {
      setError(err?.message || 'Error al conectar con Freighter');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    storeToken(null);
    setToken(null);
    setRole(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      token, role, user, loading, error,
      isAuthenticated: !!token,
      isAdmin: role === 'admin',
      loginWithFreighter, registerPasskey, loginWithPasskey,
      logout, checkStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}

export function getStoredToken(): string | null {
  return loadToken();
}
