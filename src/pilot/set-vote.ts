/**
 * SET demo — boleta cifrada, commit en ledger local, recibo firmado Ed25519.
 * Fase beta: no sustituye elección nacional; recuento reproducible en entorno demo.
 */
import { existsSync, mkdirSync, readFileSync, appendFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { xchacha20poly1305 } from '@noble/ciphers/chacha.js';
import { ed25519 } from '@noble/curves/ed25519.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { randomBytes, utf8ToBytes } from '@noble/hashes/utils.js';

import { payloadHash } from '../db/sync/conflicts.js';
import { base64ToBytes, bytesToBase64, concatBytes } from '../protocol/encoding.js';

const DATA_DIR = join(process.cwd(), 'data');
const LEDGER_PATH = join(DATA_DIR, 'set-vote-ledger.jsonl');
const NODE_KEYS_PATH = join(DATA_DIR, 'set-demo-node-keys.json');
const TALLY_KEY_PATH = join(DATA_DIR, 'set-demo-tally-key.json');

const XNONCE_LENGTH = 24;

export interface SetVoteCommit {
  consultationId: string;
  ballotHash: string;
  ciphertext: string;
  voterTokenHash: string;
  committedAt: string;
  nodeSignature: string;
}

export interface SetVoteReceipt {
  receiptHash: string;
  ballotHash: string;
  consultationId: string;
  committedAt: string;
  nodeSignature: string;
  phase: 'SET-CNE-1-beta';
}

type NodeKeys = { publicKey: string; secretKey: string };
type TallyKey = { key: string };

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function loadNodeKeys(): NodeKeys {
  ensureDataDir();
  if (!existsSync(NODE_KEYS_PATH)) {
    const kp = ed25519.keygen();
    const keys: NodeKeys = {
      publicKey: bytesToBase64(kp.publicKey),
      secretKey: bytesToBase64(kp.secretKey),
    };
    writeFileSync(NODE_KEYS_PATH, `${JSON.stringify(keys, null, 2)}\n`);
    return keys;
  }
  return JSON.parse(readFileSync(NODE_KEYS_PATH, 'utf8')) as NodeKeys;
}

function loadTallyKey(): Uint8Array {
  ensureDataDir();
  if (!existsSync(TALLY_KEY_PATH)) {
    const key = randomBytes(32);
    writeFileSync(
      TALLY_KEY_PATH,
      `${JSON.stringify({ key: bytesToBase64(key) }, null, 2)}\n`,
    );
    return key;
  }
  const parsed = JSON.parse(readFileSync(TALLY_KEY_PATH, 'utf8')) as TallyKey;
  return base64ToBytes(parsed.key);
}

function encryptBallot(consultationId: string, optionId: string): string {
  const key = loadTallyKey();
  const xnonce = randomBytes(XNONCE_LENGTH);
  const plaintext = utf8ToBytes(JSON.stringify({ consultationId, optionId }));
  const cipher = xchacha20poly1305(key, xnonce);
  const encrypted = cipher.encrypt(plaintext);
  return bytesToBase64(concatBytes(xnonce, encrypted));
}

function decryptBallot(ciphertext: string): { consultationId: string; optionId: string } {
  const key = loadTallyKey();
  const packed = base64ToBytes(ciphertext);
  const xnonce = packed.slice(0, XNONCE_LENGTH);
  const encrypted = packed.slice(XNONCE_LENGTH);
  const cipher = xchacha20poly1305(key, xnonce);
  const plaintext = cipher.decrypt(encrypted);
  return JSON.parse(new TextDecoder().decode(plaintext)) as {
    consultationId: string;
    optionId: string;
  };
}

function readCommits(): SetVoteCommit[] {
  if (!existsSync(LEDGER_PATH)) return [];
  return readFileSync(LEDGER_PATH, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as SetVoteCommit);
}

function canonicalCommitFields(commit: Omit<SetVoteCommit, 'nodeSignature'>) {
  return JSON.stringify({
    consultationId: commit.consultationId,
    ballotHash: commit.ballotHash,
    ciphertext: commit.ciphertext,
    voterTokenHash: commit.voterTokenHash,
    committedAt: commit.committedAt,
  });
}

function signCommit(commit: Omit<SetVoteCommit, 'nodeSignature'>, secretKey: Uint8Array): string {
  return bytesToBase64(ed25519.sign(utf8ToBytes(canonicalCommitFields(commit)), secretKey));
}

export function verifySetCommit(commit: SetVoteCommit): boolean {
  const keys = loadNodeKeys();
  const { nodeSignature, ...rest } = commit;
  try {
    return ed25519.verify(
      base64ToBytes(nodeSignature),
      utf8ToBytes(canonicalCommitFields(rest)),
      base64ToBytes(keys.publicKey),
    );
  } catch {
    return false;
  }
}

/** Emite voto cifrado, commit firmado y recibo verificable — sin PII en ledger público. */
export function castSetVote(params: {
  consultationId: string;
  optionId: string;
  voterToken: string;
}): SetVoteReceipt {
  ensureDataDir();
  const { consultationId, optionId, voterToken } = params;
  const voterTokenHash = payloadHash({ voterToken });

  const existing = readCommits().find(
    (c) => c.consultationId === consultationId && c.voterTokenHash === voterTokenHash,
  );
  if (existing) {
    throw new Error('Voto duplicado — un token anónimo por consulta');
  }

  const ciphertext = encryptBallot(consultationId, optionId);
  const ballotHash = payloadHash({ consultationId, ciphertext, voterTokenHash });
  const committedAt = new Date().toISOString();

  const keys = loadNodeKeys();
  const secretKey = base64ToBytes(keys.secretKey);
  const commitBody = {
    consultationId,
    ballotHash,
    ciphertext,
    voterTokenHash,
    committedAt,
  };
  const nodeSignature = signCommit(commitBody, secretKey);

  const commit: SetVoteCommit = { ...commitBody, nodeSignature };
  appendFileSync(LEDGER_PATH, `${JSON.stringify(commit)}\n`);

  const receiptHash = payloadHash({
    ballotHash,
    consultationId,
    committedAt,
    phase: 'SET-CNE-1-beta',
  });

  return {
    receiptHash,
    ballotHash,
    consultationId,
    committedAt,
    nodeSignature,
    phase: 'SET-CNE-1-beta',
  };
}

/** Recuento reproducible desde ledger firmado (demo — clave tally en nodo). */
export function tallySetVotes(consultationId: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const commit of readCommits()) {
    if (commit.consultationId !== consultationId) continue;
    if (!verifySetCommit(commit)) continue;
    const { optionId } = decryptBallot(commit.ciphertext);
    counts[optionId] = (counts[optionId] ?? 0) + 1;
  }
  return counts;
}

export function getSetLedgerStats(consultationId: string) {
  const commits = readCommits().filter((c) => c.consultationId === consultationId);
  const verified = commits.filter(verifySetCommit).length;
  return {
    commitCount: commits.length,
    verifiedCount: verified,
    lastCommittedAt: commits.at(-1)?.committedAt ?? null,
  };
}
