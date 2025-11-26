// src/stellar/orderActions.ts
import { Client as ContractClient, networks } from "crud_productos2";
import {
  isConnected,
  requestAccess,
  getNetworkDetails,
  signTransaction as freighterSignTransaction,
} from "@stellar/freighter-api";
import type { SignTransaction } from "@stellar/stellar-sdk/contract";

// Client firmado para crear pedidos (no requiere ser admin)
async function getSignedClientForOrders() {
  const connected = await isConnected();
  if (!connected) {
    throw new Error("Freighter no está instalado o no está conectado.");
  }

  const access = await requestAccess();
  const address =
    typeof access === "string" ? access : access.address;

  const net = await getNetworkDetails();
  if (net.error) {
    throw new Error(`Error al obtener la red desde Freighter: ${net.error}`);
  }

  const rpcUrl = net.sorobanRpcUrl ?? "https://soroban-testnet.stellar.org";

  const client = new ContractClient({
    contractId: networks.testnet.contractId,
    networkPassphrase: networks.testnet.networkPassphrase,
    rpcUrl,
    publicKey: address,
    signTransaction: freighterSignTransaction as SignTransaction,
  });

  return client;
}

/**
 * Crea un pedido en el contrato con la lista de nombres de productos.
 * En tu caso lo usaremos con un solo producto: [selected.name]
 */
export async function createOrderForProducts(
  productNames: string[]
): Promise<number> {
  const client = await getSignedClientForOrders();

  // Llamada al método Soroban `create_order`
  const tx = await client.create_order({ products: productNames });

  // Freighter firma y se envía la tx
  const sent = await tx.signAndSend();

  // El contrato devuelve un u32 (id del pedido)
  const orderId = sent.result as unknown as number;
  return orderId;
}
