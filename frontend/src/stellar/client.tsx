// src/stellar/client.ts
import { Client as ContractClient, networks } from "crud_productos2";
import type { SignTransaction } from "@stellar/stellar-sdk/contract";
import {
  isConnected,
  requestAccess,
  getNetworkDetails,
  signTransaction as freighterSignTransaction,
} from "@stellar/freighter-api";

const ADMIN_PUBKEY =
  "GCJ4SFCREM2UTD4XE53WQ7IDQISBA3LXHAA4YHJFDRH2JYCVKLFX3PUX";

const FALLBACK_SOROBAN_RPC = "https://soroban-testnet.stellar.org";

export async function getTokenEatsClient() {
  // 1) Verificar Freighter
  const connected = await isConnected();
  if (!connected) {
    throw new Error("Freighter no está instalado o no está conectado.");
  }

  // 2) Pedir acceso a la cuenta
  const access = await requestAccess();
  const address =
    typeof access === "string" ? access : access.address; // depende de la versión de freighter-api

  // 3) Asegurar que sea la cuenta admin (la del contrato)
  if (address !== ADMIN_PUBKEY) {
    throw new Error(
      "Debes conectar Freighter con la cuenta ADMIN para agregar productos."
    );
  }

  // 4) Obtener detalles de red desde Freighter
  const net = await getNetworkDetails();
  if (net.error) {
    throw new Error(`Error al obtener la red desde Freighter: ${net.error}`);
  }

  const rpcUrl = net.sorobanRpcUrl ?? FALLBACK_SOROBAN_RPC;

 const client = new ContractClient({
  contractId: networks.testnet.contractId,
  networkPassphrase: networks.testnet.networkPassphrase,
  rpcUrl,
  publicKey: address,

  // 👇 Aquí ya no hacemos wrapper, solo pasamos la función de Freighter
  signTransaction: freighterSignTransaction as SignTransaction,
});


  return client;
}
