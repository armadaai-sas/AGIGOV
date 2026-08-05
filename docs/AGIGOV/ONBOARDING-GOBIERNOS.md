# Onboarding de gobiernos — Red AGIGOV

Herramientas para que **Estados miembros** se conecten, registren y adapten AGIGOV.

## Código de jurisdicción

| País | Código | ISO | Carta |
|------|--------|-----|-------|
| Venezuela | `AGIGOV-VEN` | `VEN` | `CARTA-AGIGOV-VEN.md` (anexo a base) |
| Sandbox interop | `AGIGOV-SBX` | `SBX` | `CARTA-AGIGOV-SBX.md` |
| Colombia (piloto) | `AGIGOV-COL` | `COL` | `ANEXO-AGIGOV-COL.md` |
| (nuevo) | `AGIGOV-[ISO3166-1 alpha-3]` | ISO real | `ANEXO-LOCAL-TEMPLATE.md` + `CARTA-AGIGOV-BASE.md` |

Carta núcleo: [`CARTA-AGIGOV-BASE.md`](./CARTA-AGIGOV-BASE.md) · Guía ministro/TI: [`GUIA-MINISTRO-INNOVACION-TI.md`](./GUIA-MINISTRO-INNOVACION-TI.md)

## Proceso de registro (MVP)

```
1. Solicitud → nodo embajador AGIGOV contacta
2. Carta local → adaptación principios Título I AGIGOV base
3. DID institucional → claves Ed25519 + registro en did-registry
4. Nodo core → Postgres + bus MQTT (WireGuard)
5. Multi-sig → ≥3 firmantes nacionales
6. Piloto 30d → territorio acotado
7. Publicación → dashboard AGIGOV-[ISO] en red
```

## Endpoints de integración (MVP)

| Endpoint | Función |
|----------|---------|
| `GET /api/public/health` | Salud del nodo + handshake peer |
| `GET /api/public/gov` | Jurisdicciones registradas (VEN + SBX + perfiles) |
| `GET /api/public/federation/outbox` | Hashes published (interop thin) |
| `POST /api/public/federation/pull` | SBX: espeja outbox del embajador |
| `GET /api/public/dashboard` | Telemetría gestión |
| `GET /api/public/projects` | Proyectos DAO |
| `GET /api/ops/health` | Ops centinela (sin PII) |
| _futuro_ `POST /api/gov/register` | Registro gobierno (multi-sig) |

## Requisitos técnicos mínimos

- Node.js ≥ 22
- Postgres 16
- Mosquitto (dev) / WireGuard (prod)
- `npm run setup:local:native` o Docker según sizing

## Requisitos de legitimidad

- Acta de adhesión firmada
- Dictamen soberano local CONFORME
- Auditoría centinela inicial
- Human-in-the-loop identificado

## Interoperabilidad

- Ledger: sync de checkpoints publicados entre nodos
- IAP: envelopes firmados cross-border
- Sin fusión de cartas: cada Estado conserva soberanía normativa

## Contacto institucional (configurar)

- `states@agigov.org` — registro gobiernos
- `interop@agigov.org` — integración técnica
