# AGIGOV — Plan de ejecución

Plan breve para convertir la visión AGIGOV en producto institucional funcional, comenzando por **AGIGOV-VEN**.

## Horizonte

| Fase | Nombre | Duración | Entregable clave |
|------|--------|----------|------------------|
| **P0** | Identidad y narrativa | 2 sem | Marca AGIGOV, docs, UI institucional |
| **P1** | Gobernanza mínima viable | 4 sem | Carta AGIGOV-VEN + actas en ledger |
| **P2** | Participación ciudadana | 6 sem | Propuestas, campañas, identidad DID |
| **P3** | CNE tokenizado (piloto) | 8 sem | Voto seguro en territorio acotado |
| **P4** | Economía DAO | 8 sem | Token gobernanza + escrow proyectos |
| **P5** | Red multi-gobierno | 12 sem | AGIGOV genérico + onboarding Estados |
| **P6** | Legitimidad nacional | continuo | Acta multi-sig, auditoría centinela |

> Las fases técnicas Armada (0–6 en `PLAN-EJECUCION-FASES.md`) corren **en paralelo** como infraestructura; este plan es la **capa producto e institucional AGIGOV**.

---

## P0 — Identidad institucional (ahora)

**Objetivo:** Toda superficie pública se lee como gobierno digital 2.0, no demo técnica.

- [x] Documentación AGIGOV (`docs/AGIGOV/`)
- [x] PWA: marca AGIGOV-VEN, nav participativo, tono institucional
- [x] `/institucional` + `/participar` + `/proyectos`
- [x] Skill `sovereign-product-studio` alineado a AGIGOV
- [ ] Home ciudadana dedicada `/` (hero AGIGOV)

**Criterio de cierre:** Un ciudadano entiende AGIGOV en < 60 s sin leer código.

---

## P1 — Gobernanza mínima viable

**Objetivo:** Decisiones públicas con trazabilidad legal.

- [x] `CARTA-AGIGOV-VEN.md` borrador v0.1
- [ ] Carta ratificada (multi-sig)
- [ ] Agente **soberano** valida propuestas vs carta
- [ ] Propuestas visibles con `citizenSummary` automático
- [ ] Multi-sig piloto (`docs/PILOTO-MULTISIG-CHECKLIST.md`)

**Criterio:** 1 dictamen publicado en ledger + visible en PWA.

---

## P2 — Participación ciudadana

**Objetivo:** Personas proponen, debaten y respaldan sin fricción opaca.

- [ ] Ruta `/participar` — propuestas ciudadanas, respaldo DID
- [ ] Campañas registradas (metadatos públicos, financiamiento trazable)
- [ ] Nodos comunitarios `/territorio` — sync edge
- [ ] Puentes contribución (`CONTRIBUCION.md`)

**Criterio:** 100 propuestas ciudadanas en piloto sin PII expuesta.

---

## P3 — CNE tokenizado (piloto)

**Objetivo:** Voto verificable, auditable, resistente a fraude.

- [ ] Especificación `CNE-TOKENIZADO.md` → implementación piloto
- [ ] Boletas hash-linked; recuento público en ledger
- [ ] Centinela: FREEZE ante anomalías de voto
- [ ] Auditoría independiente (logs + API pública)

**Criterio:** Elección piloto en 1 territorio; recuento reproducible por terceros.

---

## P4 — Economía DAO

**Objetivo:** Prosperidad compartida con reglas transparentes.

- [x] UI `/proyectos` + API `/api/public/projects`
- [x] Seed 3 proyectos demo con escrow e hitos
- [x] Aporte E2E → ledger + escrow LOCKED/RELEASED (`npm run p4:finance-e2e`)
- [x] Webhook VES con HMAC (piloto; proveedor real pendiente)
- [ ] Token gobernanza AGIGOV-VEN (mainnet) — dictamen soberano + legal
- [ ] Pasarela aportes VES con proveedor fiat contratado

**Criterio:** 1 proyecto financiado end-to-end con trazabilidad pública — **cumplido en piloto/ledger** (no mainnet token).

Runbook: [`docs/P4-ECONOMIA-DAO.md`](../P4-ECONOMIA-DAO.md)

---

## P5 — Red AGIGOV global

**Objetivo:** Cualquier gobierno se conecta y adapta.

- [x] Protocolo onboarding `AGIGOV-[ISO]` (carta base + anexos + catálogo)
- [x] Interoperabilidad thin: federation outbox/inbox de hashes published
- [x] Carta base + anexos locales (VEN/SBX/COL + plantilla)
- [x] Documentación para ministros de innovación / TI
- [ ] Sync ledger completo entre Postgres estatales (post-P5)
- [ ] Adhesión multi-sig COL/USA (hoy: perfil piloto)

**Criterio:** Segundo Estado en sandbox conectado a la red — **cumplido** (`AGIGOV-SBX` + handshake + federation pull).

Runbook: [`docs/P5-RED-AGIGOV-GLOBAL.md`](../P5-RED-AGIGOV-GLOBAL.md)

---

## P6 — Legitimidad y seguridad continua

**Objetivo:** Confianza sostenida.

- [x] PQC inventario + guardian readiness (`docs/PQC-GUARDIAN-CUANTICO.md`, `npm run pqc:inventory`)
- [x] Drills pánico trimestrales (`npm run panic:quarterly` + log)
- [x] Informes comunicador → dashboard / institucional (`/api/public/comunicador/report`)
- [x] Comparativa pública Política 2.0 vs tradicional (métricas vivas)
- [ ] IAP v2 híbrido ML-DSA/ML-KEM en nodo piloto (Fase B PQC)

**Criterio P6 código:** `npm run p6:verify` OK · sin claim PQC productivo falso.

Runbook: [`docs/P6-LEGITIMIDAD-SEGURIDAD.md`](../P6-LEGITIMIDAD-SEGURIDAD.md)

## Métricas norte (KPIs AGIGOV)

| KPI | Meta piloto |
|-----|-------------|
| Transparencia | 0 discrepancias ledger ↔ dashboard |
| Participación | +15% usuarios recurrentes PWA / mes |
| Confianza | ≥3 firmantes multi-sig en actas |
| Seguridad | 100% drills FREEZE exitosos |
| Economía | 100% proyectos con escrow trazable |

---

## Próximos 30 días (acción inmediata)

1. UI institucional AGIGOV-VEN en PWA
2. Ratificar borrador carta AGIGOV-VEN
3. Abrir `/participar` como MVP
4. Publicar `POLITICA-2.0.md` en `/institucional`
5. Piloto multi-sig MAR_NORTH_01 (ver innovation brief)
