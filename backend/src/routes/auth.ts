import { Router } from 'express';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import type { AuthenticatorTransportFuture } from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import { Keypair } from '@stellar/stellar-sdk';
import { config } from '../config';
import * as passkeyStore from '../lib/passkeyStore';
import { generateToken } from '../middleware/auth';
import { getAdmin } from '../lib/soroban';

const router = Router();

const rpName = config.rpName;
const rpID = config.rpId;
const origin = config.rpId === 'localhost'
  ? 'http://localhost:5173'
  : `https://${config.rpId}`;
const challengeStore = new Map<string, string>();

router.post('/register/begin', async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username?.trim()) {
      res.status(400).json({ error: 'Se requiere un nombre de usuario' });
      return;
    }
    const cleanUser = username.trim();

    let user = passkeyStore.findUser(cleanUser);
    if (!user) {
      user = passkeyStore.upsertUser(cleanUser, 'user');
    }

    const existingCreds = user.credentials.map(c => ({
      id: c.id,
      transports: c.transports as AuthenticatorTransportFuture[],
    }));

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userName: cleanUser,
      userDisplayName: cleanUser,
      attestationType: 'none',
      excludeCredentials: existingCreds,
      authenticatorSelection: {
        userVerification: 'required',
        residentKey: 'required',
      },
    });

    challengeStore.set(cleanUser, options.challenge);
    setTimeout(() => challengeStore.delete(cleanUser), 120_000);

    res.json({ options });
  } catch (err) {
    next(err);
  }
});

router.post('/register/complete', async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username?.trim()) {
      res.status(400).json({ error: 'Se requiere un nombre de usuario' });
      return;
    }
    const cleanUser = username.trim();
    const challenge = challengeStore.get(cleanUser);
    if (!challenge) {
      res.status(400).json({ error: 'Challenge expirado. Intenta de nuevo.' });
      return;
    }

    const verification = await verifyRegistrationResponse({
      response: req.body,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      res.status(400).json({ error: 'Verificación fallida' });
      return;
    }

    const { credential } = verification.registrationInfo;
    passkeyStore.upsertUser(cleanUser, 'user');
    passkeyStore.addCredential(cleanUser, {
      id: credential.id,
      publicKey: isoBase64URL.fromBuffer(credential.publicKey),
      counter: credential.counter,
      transports: credential.transports ?? ['internal'],
    });

    challengeStore.delete(cleanUser);

    const adminAddress = await getAdmin();
    const token = generateToken({ username: cleanUser, role: 'user', email: cleanUser });

    res.json({ verified: true, token, role: 'user', adminAddress, email: cleanUser });
  } catch (err) {
    next(err);
  }
});

router.post('/login/begin', async (req, res, next) => {
  try {
    const { username } = req.body;
    const creds = username
      ? passkeyStore.listCredentials(username)
      : [];

    if (creds.length === 0) {
      res.status(400).json({ error: 'No hay passkey registrada. Registra primero.' });
      return;
    }

    const allowCredentials = creds.map(c => ({
      id: c.id,
      transports: c.transports as AuthenticatorTransportFuture[],
    }));

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials,
      userVerification: 'preferred',
    });

    const loginUser = username || 'anonymous';
    challengeStore.set(loginUser, options.challenge);
    setTimeout(() => challengeStore.delete(loginUser), 120_000);

    res.json({ options });
  } catch (err) {
    next(err);
  }
});

router.post('/login/complete', async (req, res, next) => {
  try {
    let username = req.body.username || 'admin';
    const challenge = challengeStore.get(username);
    if (!challenge) {
      res.status(400).json({ error: 'Challenge expirado. Intenta de nuevo.' });
      return;
    }

    const credId = req.body.id as string;
    const stored = passkeyStore.findUserByCredentialId(credId);
    if (!stored) {
      res.status(400).json({ error: 'Credencial no encontrada' });
      return;
    }

    username = stored.user.username;

    const verification = await verifyAuthenticationResponse({
      response: req.body,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: stored.credential.id,
        publicKey: isoBase64URL.toBuffer(stored.credential.publicKey),
        counter: stored.credential.counter,
        transports: stored.credential.transports as AuthenticatorTransportFuture[],
      },
    });

    if (!verification.verified) {
      res.status(400).json({ error: 'Autenticación fallida' });
      return;
    }

    passkeyStore.updateCredential(username, credId, verification.authenticationInfo.newCounter);
    challengeStore.delete(username);

    const adminAddress = await getAdmin();
    const user = passkeyStore.findUser(username);
    const role = user?.role || 'user';
    const token = generateToken({ username, role, email: username });

    res.json({ verified: true, token, role, adminAddress, email: username });
  } catch (err) {
    next(err);
  }
});

router.post('/freighter', async (req, res, next) => {
  try {
    const { publicKey } = req.body;
    if (!publicKey) {
      res.status(400).json({ error: 'Falta campo: publicKey' });
      return;
    }

    const isAdmin = publicKey === config.adminPubkey;
    const role = isAdmin ? 'admin' : 'user';
    const adminAddress = await getAdmin();
    const token = generateToken({ username: publicKey, role, email: publicKey });

    res.json({ verified: true, token, role, adminAddress });
  } catch (err) {
    next(err);
  }
});

router.get('/status', async (_req, res, next) => {
  try {
    const adminAddress = await getAdmin();
    const creds = passkeyStore.listCredentials('admin');
    res.json({ registered: creds.length > 0, adminAddress });
  } catch (err) {
    next(err);
  }
});

export default router;
