import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  rpcUrl: process.env.SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org',
  networkPassphrase: process.env.NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
  contractId: process.env.CONTRACT_ID || 'CC7EVOODA3S5ZNOOQM475RHTETMISZGOJPPGWCIVK2QBGQ4XFH4PNB5U',
  adminSecretKey: process.env.ADMIN_SECRET_KEY || '',
  operatorSecretKey: process.env.OPERATOR_SECRET_KEY || '',
  jwtSecret: process.env.JWT_SECRET || 'tokeneats-dev-secret-change-in-prod',
  rpId: process.env.RP_ID || 'localhost',
  rpName: process.env.RP_NAME || 'TokenEats',
  adminPubkey: process.env.ADMIN_PUBKEY || 'GCWZ7TBXSX2RRDUJ3KDQ42A5JSUG5LFEGUJ6WHPXN274YDOAL7ZZFSZJ',
};
