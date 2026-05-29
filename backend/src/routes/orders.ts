import { Router } from 'express';
import { listOrders, getOrder, createOrder } from '../lib/soroban';
import { saveOrderMeta, getOrderMeta, getAllOrderMeta, markAsPaid, type OrderMeta } from '../lib/orderStore';

const router = Router();

const knownStatuses = new Set([
  'creado', 'preparando', 'listo', 'entregado', 'cancelado',
]);

function enrichOrder(id: number, data: string[]) {
  let status = 'desconocido';
  let products = data;

  const last = data[data.length - 1];
  if (last && knownStatuses.has(last)) {
    status = last;
    products = data.slice(0, -1);
  }

  const meta = getOrderMeta(id);

  return { id, products, status, ...(meta ? {
    userName: meta.userName,
    address: meta.address,
    paid: meta.paid,
    totalXlm: meta.totalXlm,
    createdAt: meta.createdAt,
  } : {}) };
}

router.get('/', async (_req, res, next) => {
  try {
    const ids = await listOrders();
    const orders = [];

    for (const id of ids) {
      const data = await getOrder(id);
      orders.push(enrichOrder(id, data));
    }

    res.json({ orders });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    const data = await getOrder(id);
    res.json(enrichOrder(id, data));
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { products, name, address, totalXlm } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      res.status(400).json({ error: 'Se requiere un array de productos' });
      return;
    }

    const orderId = await createOrder(products);

    saveOrderMeta({
      orderId,
      userName: name || 'Anónimo',
      address: address || '',
      totalXlm: totalXlm || 0,
      paid: false,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      orderId,
      products,
      status: 'creado',
      name: name || 'Anónimo',
      address: address || '',
    });
  } catch (err) {
    next(err);
  }
});

export default router;
