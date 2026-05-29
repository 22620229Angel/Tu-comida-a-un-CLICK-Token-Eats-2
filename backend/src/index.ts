import express from 'express';
import cors from 'cors';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { requireAdmin } from './middleware/auth';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import adminRouter from './routes/admin';
import authRouter from './routes/auth';
import paymentsRouter from './routes/payments';

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
      auth: '/api/auth',
    },
  });
});

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/admin', requireAdmin, adminRouter);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`TokenEats API corriendo en http://localhost:${config.port}`);
  console.log(`  RPC: ${config.rpcUrl}`);
  console.log(`  Contract: ${config.contractId}`);
});
