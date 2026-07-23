# Informe — Corrida 1 SBX (Happy path)

**Fecha:** 2026-07-06  
**Operador:** A (equipo interno)  
**Escenario:** MPPI · mantenimiento vial · seed `egs-pilot`  
**Entorno:** Mac local · Postgres nativo · sin Mosquitto · `localhost:3000`

---

## Resumen ejecutivo

| Criterio | Resultado |
|----------|-----------|
| Infra mínima | PASS — Postgres + API + PWA |
| Contratos visibles | PASS — 10 contratos en `/contratos` |
| Hito RELEASED | PASS — C01: 5/5 hitos RELEASED |
| Q-Close Δ | PASS — Δ = **180.000 VES** (baseline 1M → gasto 820K) |
| Gestión publicada | PASS — 7 reportes en dashboard |
| Centinela | PASS — `panicMode: false`, discrepancias: `[]` |
| FREEZE no resuelto | N/A (happy path) |

**Veredicto corrida 1:** **PASS**

---

## Tiempos (simulado día 0 → 90)

| Fase | Tiempo real |
|------|-------------|
| Kickoff (infra + seed) | ~25 min (Postgres previo; seed < 1 min) |
| Operación (verificación UI) | ~10 min |
| Reconciliación (`egs:quarter-close`) | < 1 min |
| Trust Pack | ~5 min |

**Total sesión:** ~40 min (no 90 días calendario — corrida acelerada SBX).

---

## URLs verificadas (snapshot)

| Módulo | URL |
|--------|-----|
| Home | http://localhost:3000/ |
| Contratos | http://localhost:3000/contratos |
| Consola EGS | http://localhost:3000/modelos/egs/consola |
| Gestión | http://localhost:3000/gestion |
| API health | http://127.0.0.1:3001/api/ops/health |

---

## Trust Pack — artefactos

| # | Archivo | Contenido |
|---|---------|-----------|
| 1 | `01-acta-qclose.json` | Acta Q-Close Δ + multi-sig demo |
| 2 | `02-escrow-export-c01.json` | Cadena hitos C01 (RELEASED) |
| 3 | `03-snapshot-egs-ministry.json` | Salud ministerio MPPI |
| 3b | `03-snapshot-gestion.json` | Dashboard publicado |
| 4 | `04-centinela-ops-health.json` | Ops health + ledger |
| 5 | `05-informe-corrida-1.md` | Este informe |

---

## Qué aprendimos

1. **Mosquitto no bloquea** demo fiscal + escrow + gestión en local.
2. **Δ reproducible** con seed: 180K VES fee AGIGOV demo 18K (10%).
3. Panel «Verificar servicio» debe mostrar verde con API + Postgres activos.
4. Listo para **demo champion 15 min** y envío one-pager Trust Pilot.

---

## Siguiente paso

- **Corrida 2:** otro operador (B), mismo checklist, comparar tiempos.
- **Corrida 3:** adversarial FREEZE (`npm run egs:stress` o `panic:drill`).

---

*SBX interno — no referencia ministerial.*
