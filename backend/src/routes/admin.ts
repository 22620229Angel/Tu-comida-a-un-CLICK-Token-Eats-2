import { Router } from 'express';
import {
  addProduct,
  updateProduct,
  removeProduct,
  increaseStock,
  decreaseStock,
  updateOrderStatus,
  transferAdmin,
  getAdmin,
} from '../lib/soroban';
import { setProductImage, removeProductImage, getProductImage } from '../lib/images';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const admin = await getAdmin();
    res.json({ admin });
  } catch (err) {
    next(err);
  }
});

router.post('/products', async (req, res, next) => {
  try {
    const { name, quantity, price } = req.body;
    if (!name || quantity === undefined || price === undefined) {
      res.status(400).json({ error: 'Faltan campos: name, quantity, price' });
      return;
    }
    await addProduct(name, Number(quantity), Number(price));
    res.status(201).json({ message: 'Producto agregado correctamente' });
  } catch (err) {
    next(err);
  }
});

router.put('/products/:name', async (req, res, next) => {
  try {
    const { quantity, price } = req.body;
    if (quantity === undefined || price === undefined) {
      res.status(400).json({ error: 'Faltan campos: quantity, price' });
      return;
    }
    await updateProduct(req.params.name, Number(quantity), Number(price));
    res.json({ message: 'Producto actualizado correctamente' });
  } catch (err) {
    next(err);
  }
});

router.delete('/products/:name', async (req, res, next) => {
  try {
    await removeProduct(req.params.name);
    removeProductImage(req.params.name);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    next(err);
  }
});

router.get('/products/:name/image', async (req, res, next) => {
  try {
    const url = getProductImage(req.params.name);
    res.json({ name: req.params.name, image: url });
  } catch (err) {
    next(err);
  }
});

router.put('/products/:name/image', async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url) {
      res.status(400).json({ error: 'Falta campo: url' });
      return;
    }
    setProductImage(req.params.name, url);
    res.json({ message: 'Imagen actualizada correctamente', image: url });
  } catch (err) {
    next(err);
  }
});

router.delete('/products/:name/image', async (req, res, next) => {
  try {
    removeProductImage(req.params.name);
    res.json({ message: 'Imagen eliminada correctamente' });
  } catch (err) {
    next(err);
  }
});

router.post('/stock/increase', async (req, res, next) => {
  try {
    const { name, amount } = req.body;
    if (!name || amount === undefined) {
      res.status(400).json({ error: 'Faltan campos: name, amount' });
      return;
    }
    await increaseStock(name, Number(amount));
    res.json({ message: 'Stock incrementado' });
  } catch (err) {
    next(err);
  }
});

router.post('/stock/decrease', async (req, res, next) => {
  try {
    const { name, amount } = req.body;
    if (!name || amount === undefined) {
      res.status(400).json({ error: 'Faltan campos: name, amount' });
      return;
    }
    await decreaseStock(name, Number(amount));
    res.json({ message: 'Stock decrementado' });
  } catch (err) {
    next(err);
  }
});

router.put('/orders/:id/status', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ error: 'Falta campo: status' });
      return;
    }
    await updateOrderStatus(id, status);
    res.json({ message: 'Estado actualizado correctamente' });
  } catch (err) {
    next(err);
  }
});

router.post('/transfer', async (req, res, next) => {
  try {
    const { newAdmin } = req.body;
    if (!newAdmin) {
      res.status(400).json({ error: 'Falta campo: newAdmin' });
      return;
    }
    await transferAdmin(newAdmin);
    res.json({ message: 'Admin transferido correctamente' });
  } catch (err) {
    next(err);
  }
});

export default router;
