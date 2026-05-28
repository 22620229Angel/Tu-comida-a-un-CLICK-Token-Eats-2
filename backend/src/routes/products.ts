import { Router } from 'express';
import { listProducts, getProduct } from '../lib/soroban';
import { getProductImage, getAllImages } from '../lib/images';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const names = await listProducts();
    const products = [];
    const allImages = getAllImages();

    for (const name of names) {
      const data = await getProduct(name);
      if (data) {
        products.push({
          name,
          quantity: data.quantity,
          price: data.price,
          image: allImages[name] || null,
        });
      }
    }

    res.json({ products });
  } catch (err) {
    next(err);
  }
});

router.get('/:name', async (req, res, next) => {
  try {
    const data = await getProduct(req.params.name);
    if (!data) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }
    res.json({
      name: req.params.name,
      ...data,
      image: getProductImage(req.params.name),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
