import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface WalletContextType {
  connected: boolean;
  publicKey: string | null;
  connecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      const freighter = await import('@stellar/freighter-api');
      const connected = await freighter.isConnected();
      if (!connected.isConnected) {
        setError('Freighter no está instalado o no está conectado');
        setConnecting(false);
        return;
      }
      const result = await freighter.getAddress();
      if (!result.address) {
        setError(result.error || 'No se pudo obtener la clave pública');
        setConnecting(false);
        return;
      }
      setPublicKey(result.address);
    } catch (err: any) {
      setError(err?.message || 'Error al conectar con Freighter');
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setPublicKey(null);
  }, []);

  return (
    <WalletContext.Provider value={{
      connected: !!publicKey,
      publicKey,
      connecting,
      error,
      connect,
      disconnect,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextType {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet debe usarse dentro de WalletProvider');
  return ctx;
}
