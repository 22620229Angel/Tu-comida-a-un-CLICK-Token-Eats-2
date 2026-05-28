import {
  rpc,
  TransactionBuilder,
  Contract,
  nativeToScVal,
  scValToNative,
  Keypair,
  xdr,
} from '@stellar/stellar-sdk';
import { config } from '../config';

const { Api: { GetTransactionStatus, isSimulationError, isSimulationSuccess } } = rpc;

const server = new rpc.Server(config.rpcUrl);
const contract = new Contract(config.contractId);

const adminKp = config.adminSecretKey ? Keypair.fromSecret(config.adminSecretKey) : null;
const operatorKp = config.operatorSecretKey ? Keypair.fromSecret(config.operatorSecretKey) : null;

function ensureAdminKp(): Keypair {
  if (!adminKp) throw new Error('ADMIN_SECRET_KEY no configurada en .env');
  return adminKp;
}

function ensureOperatorKp(): Keypair {
  if (!operatorKp) throw new Error('OPERATOR_SECRET_KEY no configurada en .env');
  return operatorKp;
}

async function simulate(method: string, ...args: xdr.ScVal[]) {
  const kp = ensureOperatorKp();
  const account = await server.getAccount(kp.publicKey());
  const tx = new TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: config.networkPassphrase,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();
  return server.simulateTransaction(tx);
}

function extractScVal(sim: rpc.Api.SimulateTransactionResponse): xdr.ScVal {
  if (isSimulationError(sim)) {
    throw new Error(`Simulación falló: ${sim.error}`);
  }
  return sim.result!.retval;
}

async function simulateAndSend(keypair: Keypair, method: string, ...args: xdr.ScVal[]) {
  const account = await server.getAccount(keypair.publicKey());

  let tx = new TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: config.networkPassphrase,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  tx = await server.prepareTransaction(tx);
  tx.sign(keypair);

  const sendResp = await server.sendTransaction(tx);

  if (sendResp.status !== 'PENDING') {
    throw new Error(`Envío falló: ${JSON.stringify(sendResp)}`);
  }

  for (let i = 0; i < 15; i++) {
    const getTxResp = await server.getTransaction(sendResp.hash);
    if (getTxResp.status === GetTransactionStatus.SUCCESS) {
      return getTxResp;
    }
    if (getTxResp.status === GetTransactionStatus.FAILED) {
      throw new Error(`Transacción falló: ${JSON.stringify(getTxResp)}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  throw new Error('Timeout esperando confirmación de la transacción');
}

// ─── Productos ────────────────────────────────────────

export async function listProducts(): Promise<string[]> {
  const sim = await simulate('list_products');
  return scValToNative(extractScVal(sim)) as string[];
}

export async function getProduct(name: string): Promise<{ quantity: number; price: number } | null> {
  const sim = await simulate('get_product', nativeToScVal(name, { type: 'string' }));
  const data = scValToNative(extractScVal(sim)) as number[];
  if (data.length < 2) return null;
  return { quantity: data[0], price: data[1] };
}

export async function addProduct(name: string, quantity: number, price: number): Promise<void> {
  const kp = ensureAdminKp();
  await simulateAndSend(kp, 'add_product',
    nativeToScVal(name, { type: 'string' }),
    nativeToScVal(quantity, { type: 'i32' }),
    nativeToScVal(price, { type: 'i32' }),
  );
}

export async function updateProduct(name: string, quantity: number, price: number): Promise<void> {
  const kp = ensureAdminKp();
  await simulateAndSend(kp, 'update_product',
    nativeToScVal(name, { type: 'string' }),
    nativeToScVal(quantity, { type: 'i32' }),
    nativeToScVal(price, { type: 'i32' }),
  );
}

export async function removeProduct(name: string): Promise<void> {
  const kp = ensureAdminKp();
  await simulateAndSend(kp, 'remove_product', nativeToScVal(name, { type: 'string' }));
}

export async function increaseStock(name: string, amount: number): Promise<void> {
  const kp = ensureAdminKp();
  await simulateAndSend(kp, 'increase_stock',
    nativeToScVal(name, { type: 'string' }),
    nativeToScVal(amount, { type: 'i32' }),
  );
}

export async function decreaseStock(name: string, amount: number): Promise<void> {
  const kp = ensureAdminKp();
  await simulateAndSend(kp, 'decrease_stock',
    nativeToScVal(name, { type: 'string' }),
    nativeToScVal(amount, { type: 'i32' }),
  );
}

// ─── Órdenes ──────────────────────────────────────────

export async function listOrders(): Promise<number[]> {
  const sim = await simulate('list_orders');
  return scValToNative(extractScVal(sim)) as number[];
}

export async function getOrder(orderId: number): Promise<string[]> {
  const sim = await simulate('get_order', nativeToScVal(orderId, { type: 'u32' }));
  return scValToNative(extractScVal(sim)) as string[];
}

export async function createOrder(products: string[]): Promise<number> {
  const kp = ensureOperatorKp();
  const productsScVal = xdr.ScVal.scvVec(products.map(p => xdr.ScVal.scvString(p)));

  const account = await server.getAccount(kp.publicKey());
  let tx = new TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: config.networkPassphrase,
  })
    .addOperation(contract.call('create_order', productsScVal))
    .setTimeout(30)
    .build();

  tx = await server.prepareTransaction(tx);
  tx.sign(kp);

  const sendResp = await server.sendTransaction(tx);

  if (sendResp.status !== 'PENDING') {
    throw new Error(`Envío falló: ${JSON.stringify(sendResp)}`);
  }

  for (let i = 0; i < 15; i++) {
    const getTxResp = await server.getTransaction(sendResp.hash);
    if (getTxResp.status === GetTransactionStatus.SUCCESS && getTxResp.returnValue) {
      return scValToNative(getTxResp.returnValue) as number;
    }
    if (getTxResp.status === GetTransactionStatus.FAILED) {
      throw new Error(`Transacción falló: ${JSON.stringify(getTxResp)}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  throw new Error('Timeout esperando confirmación de la transacción');
}

export async function updateOrderStatus(orderId: number, status: string): Promise<void> {
  const kp = ensureAdminKp();
  await simulateAndSend(kp, 'update_order_status',
    nativeToScVal(orderId, { type: 'u32' }),
    nativeToScVal(status, { type: 'string' }),
  );
}

// ─── Admin ────────────────────────────────────────────

export async function getAdmin(): Promise<string> {
  const sim = await simulate('get_admin');
  return scValToNative(extractScVal(sim)) as string;
}

export async function transferAdmin(newAdmin: string): Promise<void> {
  const kp = ensureAdminKp();
  await simulateAndSend(kp, 'transfer_admin', nativeToScVal(newAdmin, { type: 'string' }));
}
