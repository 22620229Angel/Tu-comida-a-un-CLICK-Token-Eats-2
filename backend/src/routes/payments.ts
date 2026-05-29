import { Router } from 'express';
import {
  rpc,
  TransactionBuilder,
  BASE_FEE,
  Keypair,
  Operation,
  Asset,
} from '@stellar/stellar-sdk';
import { config } from '../config';
import { markAsPaid } from '../lib/orderStore';

const router = Router();
const server = new rpc.Server(config.rpcUrl);

router.post('/prepare', async (req, res, next) => {
  try {
    const { amount, destination, source } = req.body;
    if (!amount || !destination || !source) {
      res.status(400).json({ error: 'Faltan campos: amount, destination, source' });
      return;
    }

    const account = await server.getAccount(source);
    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: config.networkPassphrase,
    })
      .addOperation(
        Operation.payment({
          destination,
          amount: amount.toString(),
          asset: Asset.native(),
        }),
      )
      .setTimeout(30)
      .build();

    const simulated = await server.simulateTransaction(tx);
    if (rpc.Api.isSimulationError(simulated)) {
      res.status(400).json({ error: `Simulación falló: ${simulated.error}` });
      return;
    }

    const prepared = await server.prepareTransaction(tx);

    res.json({
      xdr: prepared.toXDR(),
      networkPassphrase: config.networkPassphrase,
      networkUrl: config.rpcUrl,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/submit', async (req, res, next) => {
  try {
    const { xdr, orderId } = req.body;
    if (!xdr) {
      res.status(400).json({ error: 'Falta campo: xdr' });
      return;
    }

    const tx = TransactionBuilder.fromXDR(xdr, config.networkPassphrase);
    const result = await server.sendTransaction(tx);

    if (result.status !== 'PENDING') {
      res.status(400).json({ error: `Envío falló: ${JSON.stringify(result)}` });
      return;
    }

    const txHash = result.hash;
    for (let i = 0; i < 15; i++) {
      const txResult = await server.getTransaction(txHash);
      if (txResult.status === rpc.Api.GetTransactionStatus.SUCCESS) {
        if (orderId) {
          const sourceAccount = 'sourceAccount' in tx
            ? (tx as any).sourceAccount?.accountId() || ''
            : '';
          markAsPaid(orderId, sourceAccount);
        }
        res.json({ success: true, hash: txHash });
        return;
      }
      if (txResult.status === rpc.Api.GetTransactionStatus.FAILED) {
        res.status(400).json({ error: 'Transacción falló en la red' });
        return;
      }
      await new Promise(r => setTimeout(r, 1000));
    }

    res.status(400).json({ error: 'Timeout esperando confirmación' });
  } catch (err) {
    next(err);
  }
});

router.get('/admin-address', (_req, res) => {
  const kp = config.adminSecretKey
    ? Keypair.fromSecret(config.adminSecretKey)
    : null;
  res.json({ address: kp?.publicKey() || 'GCWZ7TBXSX2RRDUJ3KDQ42A5JSUG5LFEGUJ6WHPXN274YDOAL7ZZFSZJ' });
});

export default router;
