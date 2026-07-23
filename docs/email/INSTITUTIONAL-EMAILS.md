# Correos institucionales (3 tipos)

Diseño e implementación del flujo B2G: **ACK → Activación → Baseline lista**.

## Principios

- Nunca enviar password, Bearer ingest ni claves Ed25519.
- Links de un solo uso con TTL (~20 min).
- Entrega actual: **outbox JSONL** (`data/email-outbox.jsonl`), no SMTP real aún.

## Tipos

| Kind | Trigger | Archivo / función |
|------|---------|-------------------|
| `ack` | Registro OK | `renderAckEmail` |
| `activation` | Registro + `magic-link/request` | `renderActivationEmail` |
| `baseline_ready` | Baseline → `ingest_ready` | `renderBaselineReadyEmail` |

## Código

- `src/server/email/templates.ts` — plantillas ES/EN
- `src/server/email/dispatch.ts` — outbox
- `src/server/email/index.ts` — `sendRegistrationEmails`, `sendActivationEmailOnly`, `sendBaselineReadyEmail`
- Triggers: `institution-auth.ts` (registro / magic link), `public-api.ts` (ratify)

## Variables

Ver `.env.example`:

| Variable | Uso |
|----------|-----|
| `AGIGOV_EMAIL_MODE` | `outbox` (default) o `resend` |
| `AGIGOV_RESEND_API_KEY` | Key de Resend (`re_…`) |
| `AGIGOV_EMAIL_FROM` | Ej. `AGIGOV <noreply@bold-street.com>` |
| `AGIGOV_EMAIL_REPLY_TO` | Ej. `info@armadaai.co` |
| `AGIGOV_APP_URL` | Base de links magic |
| `AGIGOV_EMAIL_OUTBOX_PATH` | Auditoría JSONL |
| `AGIGOV_EMAIL_LOG` | `1` = log en consola |

## Probar envío real (Resend)

```bash
# En .env: AGIGOV_EMAIL_MODE=resend + AGIGOV_RESEND_API_KEY + FROM
npx tsx scripts/email-send-test.ts tu@correo.com
```

1. Registrar institución en `/institucional/registro`
2. Revisar bandeja + `data/email-outbox.jsonl` (`channel: "resend"`)
3. Tras ratificar baseline → correo `baseline_ready`

## Pendiente

- Allowlist de dominios `.gob`
- Reintentos / cola con backoff
- SMTP cliente (prod on-prem) por tenant
