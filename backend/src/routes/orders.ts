import { Router } from 'express';
import { listOrders, getOrder, createOrder } from '../lib/soroban';

const router = Router();

const knownStatuses = new Set([
  'creado', 'preparando', 'listo', 'entregado', 'cancelado',
]);

router.get('/', async (_req, res, next) => {
  try {
    const ids = await listOrders();
    const orders = [];

    for (const id of ids) {
      const data = await getOrder(id);
      let status = 'desconocido';
      let products = data;

      const last = data[data.length - 1];
      if (last && knownStatuses.has(last)) {
        status = last;
        products = data.slice(0, -1);
      }

      orders.push({ id, products, status });
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
    let status = 'desconocido';
    let products = data;

    const last = data[data.length - 1];
    if (last && knownStatuses.has(last)) {
      status = last;
      products = data.slice(0, -1);
    }

    res.json({ id, products, status });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      res.status(400).json({ error: 'Se requiere un array de productos' });
      return;
    }

    const orderId = await createOrder(products);
    res.status(201).json({ orderId, products, status: 'creado' });
  } catch (err) {
    next(err);
  }
});

export default router;
