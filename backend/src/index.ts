import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { requireAdmin } from './middleware/auth';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import adminRouter from './routes/admin';
import authRouter from './routes/auth';
import paymentsRouter from './routes/payments';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
app.use(express.static(frontendDist));

app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`TokenEats API corriendo en http://localhost:${config.port}`);
  console.log(`  RPC: ${config.rpcUrl}`);
  console.log(`  Contract: ${config.contractId}`);
});
