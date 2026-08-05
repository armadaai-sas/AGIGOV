# Guía — Ministro de Innovación / TI

**Audiencia:** ministerio de innovación, TIC, transformación digital.  
**Objetivo:** decidir si conectar un nodo `AGIGOV-[ISO]` sin tecnicismo innecesario.

---

## En una página

AGIGOV es un **sistema operativo de evidencia**: ledger + multi-sig + FREEZE + dashboards.  
No reemplaza su ERP; certifica coherencia y publica lo aprobado.

| Pregunta | Respuesta corta |
|----------|-----------------|
| ¿Dónde viven los datos? | En **su** infra (BYO / on-prem) o nodo acordado |
| ¿Qué ve el ciudadano? | Agregados publicados — **sin PII** |
| ¿Qué pasa si no cuadra? | **FREEZE** — no se publica como oficial |
| ¿Cuánto cuesta Free? | ≈ $0 para AGIGOV si BYO (sin Resend/IA nuestra) |

---

## Requisitos técnicos mínimos (TI)

| Pieza | Mínimo |
|-------|--------|
| Runtime | Node.js ≥ 22 |
| DB | Postgres 16 |
| RAM | ~1–2 GB (prod-light) |
| Puertos | API pública `:3001` (ops health interno) |
| Peer sandbox | `:3002` (opcional, dry-run interop) |
| Red | Firewall deny-by-default; túnel HTTPS (Cloudflare) o VPN |

Docs: `docs/SERVER-SIZING.md` · `docs/SOVEREIGN-CONFIG.md` · `docs/PRE-PRODUCTION.md`

---

## Pasos de adhesión (orden)

1. Leer [`CARTA-AGIGOV-BASE.md`](./CARTA-AGIGOV-BASE.md) + anexo local  
2. Seguir [`ONBOARDING-GOBIERNOS.md`](./ONBOARDING-GOBIERNOS.md)  
3. Dry-run sandbox: `npm run api:sandbox` + `npm run sbx:handshake`  
4. Piloto 90 días (1 rubro) — Trust Pilot Fiscal si aplica EGS  
5. Federation: `GET /api/public/federation/outbox` (hashes published)

Comando verificación red: `npm run p5:verify-network`

---

## Endpoints que debe conocer TI

| Endpoint | Uso |
|----------|-----|
| `GET /api/public/health` | Salud + peer |
| `GET /api/public/gov` | Jurisdicciones en red |
| `GET /api/public/federation/outbox` | Hashes published (interop thin) |
| `GET /api/ops/health` | Ops (proteger con auth) |

---

## Lo que **no** pedir en el primer día

- Token gobernanza mainnet  
- WireGuard + LoRaWAN nacionales  
- Integración total tesorería  
- “Blockchain gobierno” genérico  

Primero: **una prueba** (Trust Pack) en un rubro o un handshake VEN↔SBX documentado.
