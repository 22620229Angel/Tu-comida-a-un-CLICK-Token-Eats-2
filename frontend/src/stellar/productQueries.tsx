// src/stellar/productQueries.tsx
import { Client as ContractClient, networks } from "../bindings/src/index";

const SOROBAN_RPC = "https://soroban-testnet.stellar.org";

export interface Product {
  name: string;
  quantity: number;
  price: number;
}

// Client solo lectura (no firma, no Freighter)
function getReadOnlyClient() {
  return new ContractClient({
    contractId: networks.testnet.contractId,
    networkPassphrase: networks.testnet.networkPassphrase,
    rpcUrl: SOROBAN_RPC,
  });
}

export async function fetchProducts(): Promise<Product[]> {
  const client = getReadOnlyClient();

  // list_products -> nombres
  const txList = await client.list_products();
  const names = (txList.result ?? []) as string[];

  const products: Product[] = [];

  for (const name of names) {
    const txProd = await client.get_product({ name });
    const data = (txProd.result ?? []) as any[];

    if (data.length < 2) continue;

    const quantity = Number(data[0]);
    const price = Number(data[1]);

    products.push({ name, quantity, price });
  }

  return products;
}

