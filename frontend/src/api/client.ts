const API_BASE = ''; // Vite proxy redirige /api al backend

export interface Product {
  name: string;
  quantity: number;
  price: number;
  image?: string | null;
}

export type OrderStatus =
  | 'creado'
  | 'preparando'
  | 'listo'
  | 'entregado'
  | 'cancelado'
  | 'desconocido';

export interface Order {
  id: number;
  products: string[];
  status: OrderStatus;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

// ─── Productos ────────────────────────────────────────

export async function fetchProducts(): Promise<Product[]> {
  const data = await request<{ products: Product[] }>('/api/products');
  return data.products;
}

export async function fetchProduct(name: string): Promise<Product> {
  return request<Product>(`/api/products/${encodeURIComponent(name)}`);
}

// ─── Órdenes ──────────────────────────────────────────

export async function fetchOrders(): Promise<Order[]> {
  const data = await request<{ orders: Order[] }>('/api/orders');
  return data.orders;
}

export async function fetchOrder(id: number): Promise<Order> {
  return request<Order>(`/api/orders/${id}`);
}

export async function createOrder(products: string[]): Promise<{ orderId: number }> {
  return request<{ orderId: number }>('/api/orders', {
    method: 'POST',
    body: JSON.stringify({ products }),
  });
}

// ─── Admin ────────────────────────────────────────────

export async function addProduct(name: string, quantity: number, price: number): Promise<void> {
  await request('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify({ name, quantity, price }),
  });
}

export async function updateProduct(name: string, quantity: number, price: number): Promise<void> {
  await request(`/api/admin/products/${encodeURIComponent(name)}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity, price }),
  });
}

export async function removeProduct(name: string): Promise<void> {
  await request(`/api/admin/products/${encodeURIComponent(name)}`, {
    method: 'DELETE',
  });
}

export async function increaseStock(name: string, amount: number): Promise<void> {
  await request('/api/admin/stock/increase', {
    method: 'POST',
    body: JSON.stringify({ name, amount }),
  });
}

export async function decreaseStock(name: string, amount: number): Promise<void> {
  await request('/api/admin/stock/decrease', {
    method: 'POST',
    body: JSON.stringify({ name, amount }),
  });
}

export async function updateOrderStatus(orderId: number, status: string): Promise<void> {
  await request(`/api/admin/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export async function getAdmin(): Promise<string> {
  const data = await request<{ admin: string }>('/api/admin');
  return data.admin;
}

export async function setProductImage(name: string, url: string): Promise<void> {
  await request(`/api/admin/products/${encodeURIComponent(name)}/image`, {
    method: 'PUT',
    body: JSON.stringify({ url }),
  });
}

export async function removeProductImage(name: string): Promise<void> {
  await request(`/api/admin/products/${encodeURIComponent(name)}/image`, {
    method: 'DELETE',
  });
}

export async function transferAdmin(newAdmin: string): Promise<void> {
  await request('/api/admin/transfer', {
    method: 'POST',
    body: JSON.stringify({ newAdmin }),
  });
}
