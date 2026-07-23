import { createHash, randomBytes } from 'node:crypto';

export function generateIngestToken(): string {
  return randomBytes(32).toString('hex');
}

export function hashIngestToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

export function verifyIngestToken(token: string, hash: string): boolean {
  const candidate = hashIngestToken(token);
  return candidate.length === hash.length && candidate === hash;
}
