import express from 'express';
import cors from 'cors';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import adminRouter from './routes/admin';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/api', (_req, res) => {
  res.json({
    name: 'TokenEats API',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      orders: '/api/orders',
      admin: '/api/admin',
    },
  });
});

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`TokenEats API corriendo en http://localhost:${config.port}`);
  console.log(`  RPC: ${config.rpcUrl}`);
  console.log(`  Contract: ${config.contractId}`);
});
