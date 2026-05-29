import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORE_PATH = path.resolve(__dirname, '..', 'data', 'passkeys.json');

interface StoredCredential {
  id: string;
  publicKey: string;
  counter: number;
  transports: string[];
}

interface StoredUser {
  id: string;
  username: string;
  role: 'admin' | 'user';
  credentials: StoredCredential[];
}

function load(): StoredUser[] {
  if (!existsSync(STORE_PATH)) return [];
  return JSON.parse(readFileSync(STORE_PATH, 'utf-8'));
}

function save(users: StoredUser[]): void {
  writeFileSync(STORE_PATH, JSON.stringify(users, null, 2), 'utf-8');
}

export function findUser(username: string): StoredUser | undefined {
  return load().find(u => u.username === username);
}

export function findUserByCredentialId(id: string): { user: StoredUser; credential: StoredCredential } | undefined {
  const users = load();
  for (const user of users) {
    const cred = user.credentials.find(c => c.id === id);
    if (cred) return { user, credential: cred };
  }
}

export function upsertUser(username: string, role: 'admin' | 'user' = 'user'): StoredUser {
  const users = load();
  let user = users.find(u => u.username === username);
  if (!user) {
    user = {
      id: username,
      username,
      role,
      credentials: [],
    };
    users.push(user);
  }
  save(users);
  return user;
}

export function addCredential(username: string, cred: StoredCredential): void {
  const users = load();
  const user = users.find(u => u.username === username);
  if (!user) throw new Error('User not found');
  user.credentials.push(cred);
  save(users);
}

export function updateCredential(username: string, credId: string, counter: number): void {
  const users = load();
  const user = users.find(u => u.username === username);
  if (!user) throw new Error('User not found');
  const cred = user.credentials.find(c => c.id === credId);
  if (!cred) throw new Error('Credential not found');
  cred.counter = counter;
  save(users);
}

export function listCredentials(username: string): StoredCredential[] {
  const user = findUser(username);
  return user?.credentials ?? [];
}
