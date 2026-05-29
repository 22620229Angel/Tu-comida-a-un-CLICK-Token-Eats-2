import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORE_PATH = path.resolve(__dirname, '..', 'data', 'orders.json');

export interface OrderMeta {
  orderId: number;
  userName: string;
  address: string;
  walletAddress?: string;
  paid: boolean;
  paidAt?: string;
  totalXlm: number;
  createdAt: string;
}

function load(): OrderMeta[] {
  if (!existsSync(STORE_PATH)) return [];
  return JSON.parse(readFileSync(STORE_PATH, 'utf-8'));
}

function save(data: OrderMeta[]): void {
  writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export function saveOrderMeta(meta: OrderMeta): void {
  const all = load();
  const idx = all.findIndex(o => o.orderId === meta.orderId);
  if (idx >= 0) {
    all[idx] = meta;
  } else {
    all.push(meta);
  }
  save(all);
}

export function getOrderMeta(orderId: number): OrderMeta | undefined {
  return load().find(o => o.orderId === orderId);
}

export function getAllOrderMeta(): OrderMeta[] {
  return load();
}

export function markAsPaid(orderId: number, walletAddress: string): OrderMeta | undefined {
  const all = load();
  const meta = all.find(o => o.orderId === orderId);
  if (meta) {
    meta.paid = true;
    meta.paidAt = new Date().toISOString();
    meta.walletAddress = walletAddress;
    save(all);
  }
  return meta;
}
