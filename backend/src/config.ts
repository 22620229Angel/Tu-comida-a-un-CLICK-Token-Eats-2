import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  rpcUrl: process.env.SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org',
  networkPassphrase: process.env.NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
  contractId: process.env.CONTRACT_ID || 'CCQBTU4VX7SPGJMQZ6PDEHWUKNXYLKCD2V35ITY4NU6JCNX45PKKHMMP',
  adminSecretKey: process.env.ADMIN_SECRET_KEY || '',
  operatorSecretKey: process.env.OPERATOR_SECRET_KEY || '',
};
