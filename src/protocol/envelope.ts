import { xchacha20poly1305 } from '@noble/ciphers/chacha.js';
import { randomBytes } from '@noble/ciphers/utils.js';
import { ed25519, x25519 } from '@noble/curves/ed25519.js';
import { hkdf } from '@noble/hashes/hkdf.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { utf8ToBytes } from '@noble/hashes/utils.js';

import { signableEnvelopeFields } from './canonical.js';
import {
  base64ToBytes,
  bytesToBase64,
  concatBytes,
  randomId,
  utf8ToBytes as localUtf8,
} from './encoding.js';
import type {
  AgentMessagePayload,
  CreateEnvelopeInput,
  OpenEnvelopeResult,
  SignedAgentEnvelope,
  VerifyEnvelopeInput,
} from './types.js';
import {
  MUTABLE_INTENTS,
  ProtocolError,
} from './types.js';

const DEFAULT_TTL_MS = 5 * 60 * 1000;
const HKDF_INFO = localUtf8('armada-iap-v1');
const XNONCE_LENGTH = 24;

function deriveEncryptionKey(
  sharedSecret: Uint8Array,
  senderDid: string,
  recipientDid: string,
): Uint8Array {
  const salt = sha256(concatBytes(localUtf8(senderDid), localUtf8(recipientDid)));
  return hkdf(sha256, sharedSecret, salt, HKDF_INFO, 32);
}

function applyPadding(payload: Uint8Array, paddingBytes: number): Uint8Array {
  if (paddingBytes <= 0) return payload;
  return concatBytes(payload, randomBytes(paddingBytes));
}

function encryptPayload(
  payload: AgentMessagePayload,
  ephemeralSecretKey: Uint8Array,
  recipientPublicKey: Uint8Array,
  senderDid: string,
  recipientDid: string,
  paddingBytes: number,
): string {
  const shared = x25519.getSharedSecret(ephemeralSecretKey, recipientPublicKey);
  const key = deriveEncryptionKey(shared, senderDid, recipientDid);
  const xnonce = randomBytes(XNONCE_LENGTH);
  const plaintext = applyPadding(
    localUtf8(JSON.stringify(payload)),
    paddingBytes,
  );
  const cipher = xchacha20poly1305(key, xnonce);
  const encrypted = cipher.encrypt(plaintext);
  return bytesToBase64(concatBytes(xnonce, encrypted));
}

function decryptPayload(
  ciphertextB64: string,
  ephemeralPublicKeyB64: string,
  recipientSecretKey: Uint8Array,
  senderDid: string,
  recipientDid: string,
): AgentMessagePayload {
  const packed = base64ToBytes(ciphertextB64);
  if (packed.length < XNONCE_LENGTH + 16) {
    throw new ProtocolError('DECRYPT_FAILED', 'Ciphertext demasiado corto');
  }

  const ephemeralPublicKey = base64ToBytes(ephemeralPublicKeyB64);
  const xnonce = packed.slice(0, XNONCE_LENGTH);
  const encrypted = packed.slice(XNONCE_LENGTH);

  const shared = x25519.getSharedSecret(recipientSecretKey, ephemeralPublicKey);
  const key = deriveEncryptionKey(shared, senderDid, recipientDid);
  const cipher = xchacha20poly1305(key, xnonce);

  let plaintext: Uint8Array;
  try {
    plaintext = cipher.decrypt(encrypted);
  } catch {
    throw new ProtocolError('DECRYPT_FAILED', 'No se pudo descifrar el payload');
  }

  const json = new TextDecoder().decode(plaintext).replace(/\0+$/, '').trimEnd();
  const payload = JSON.parse(json) as AgentMessagePayload;

  if (payload.v !== 1) {
    throw new ProtocolError('INVALID_VERSION', 'Versión de payload no soportada');
  }

  return payload;
}

export function createSignedEnvelope(input: CreateEnvelopeInput): SignedAgentEnvelope {
  const {
    payload,
    sender,
    recipient,
    ttlMs = DEFAULT_TTL_MS,
    paddingBytes = 0,
  } = input;

  if (payload.evidenceBundle.processId !== payload.processId) {
    throw new ProtocolError(
      'STATUS_MISMATCH',
      'processId del payload y evidenceBundle deben coincidir',
    );
  }

  const issuedAt = input.issuedAt ?? Date.now();
  const ephemeral = x25519.keygen();
  const envelopeWithoutSig: Omit<SignedAgentEnvelope, 'signature'> = {
    v: 1,
    messageId: input.messageId ?? randomId(),
    processId: payload.processId,
    nonce: input.nonce ?? randomId(),
    senderDid: sender.did,
    recipientDid: recipient.did,
    agent: payload.agent,
    intent: payload.intent,
    issuedAt,
    expiresAt: issuedAt + ttlMs,
    ephemeralPublicKey: bytesToBase64(ephemeral.publicKey),
    ciphertext: encryptPayload(
      payload,
      ephemeral.secretKey,
      recipient.x25519PublicKey,
      sender.did,
      recipient.did,
      paddingBytes,
    ),
  };

  const signBytes = utf8ToBytes(signableEnvelopeFields(envelopeWithoutSig));
  const signature = ed25519.sign(signBytes, sender.ed25519SecretKey);

  return { ...envelopeWithoutSig, signature: bytesToBase64(signature) };
}

export function verifyAndOpenEnvelope(
  input: VerifyEnvelopeInput,
): OpenEnvelopeResult {
  const { envelope, recipient, resolveSenderPublicKey, replayGuard } = input;
  const now = input.now ?? Date.now();

  if (envelope.v !== 1) {
    throw new ProtocolError('INVALID_VERSION', 'Versión de envelope no soportada');
  }

  if (envelope.recipientDid !== recipient.did) {
    throw new ProtocolError('DECRYPT_FAILED', 'Envelope no dirigido a este receptor');
  }

  if (now < envelope.issuedAt) {
    throw new ProtocolError('NOT_YET_VALID', 'Envelope aún no válido');
  }

  if (now > envelope.expiresAt) {
    throw new ProtocolError('EXPIRED', 'Envelope expirado');
  }

  if (!replayGuard.check(envelope, now)) {
    throw new ProtocolError('REPLAY', 'Nonce o messageId ya utilizado');
  }

  if (
    input.panicMode &&
    MUTABLE_INTENTS.includes(envelope.intent)
  ) {
    throw new ProtocolError(
      'PANIC_BLOCKED',
      `Intent ${envelope.intent} bloqueado en PANIC_MODE`,
    );
  }

  const senderPublicKey = resolveSenderPublicKey(envelope.senderDid);
  if (!senderPublicKey) {
    throw new ProtocolError('UNKNOWN_SENDER', 'DID emisor desconocido');
  }

  const { signature, ...unsigned } = envelope;
  const signBytes = utf8ToBytes(signableEnvelopeFields(unsigned));
  const sigBytes = base64ToBytes(signature);

  if (!ed25519.verify(sigBytes, signBytes, senderPublicKey)) {
    throw new ProtocolError('INVALID_SIGNATURE', 'Firma Ed25519 inválida');
  }

  const payload = decryptPayload(
    envelope.ciphertext,
    envelope.ephemeralPublicKey,
    recipient.x25519SecretKey,
    envelope.senderDid,
    envelope.recipientDid,
  );

  if (payload.processId !== envelope.processId) {
    throw new ProtocolError('STATUS_MISMATCH', 'processId externo e interno no coinciden');
  }

  if (
    payload.agent !== envelope.agent ||
    payload.intent !== envelope.intent
  ) {
    throw new ProtocolError('STATUS_MISMATCH', 'agent/intent externo e interno no coinciden');
  }

  if (payload.evidenceBundle.processId !== payload.processId) {
    throw new ProtocolError(
      'STATUS_MISMATCH',
      'processId del evidenceBundle no coincide',
    );
  }

  replayGuard.record(envelope, now);

  return { payload, envelope };
}

export function generateAgentKeys(did: string): {
  signing: import('./types.js').AgentSigningKeys;
  encryption: import('./types.js').AgentEncryptionKeys;
} {
  const ed = ed25519.keygen();
  const x = x25519.keygen();
  return {
    signing: {
      did,
      ed25519SecretKey: ed.secretKey,
      ed25519PublicKey: ed.publicKey,
    },
    encryption: {
      did,
      x25519SecretKey: x.secretKey,
      x25519PublicKey: x.publicKey,
    },
  };
}
