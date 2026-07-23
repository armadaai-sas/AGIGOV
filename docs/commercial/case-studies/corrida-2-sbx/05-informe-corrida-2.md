# Informe — Corrida 2 SBX (Reproducibilidad)

**Fecha:** 2026-07-06  
**Operador:** B (distinto de corrida 1)  
**Escenario:** MPPI vial · re-seed `egs-pilot` desde cero  
**Variante:** Export escrow **C02** (corrida 1 usó C01); UI secundaria `/proyectos?tab=salud`

---

## Resumen ejecutivo

| Criterio | Resultado |
|----------|-----------|
| Re-seed sin intervención operador A | PASS |
| Δ idéntico a corrida 1 | PASS — **180.000 VES** |
| 10 contratos / 50 hitos | PASS |
| Q-Close reproducible | PASS — `DELTA_CALCULATED` |
| Centinela sin discrepancias post-run | PASS |
| Tiempo vs corrida 1 | PASS — **5,6 s** técnico vs ~40 min sesión 1 (**±86% más rápido**) |

**Veredicto corrida 2:** **PASS**

---

## Comparativa corrida 1 vs 2

| Métrica | Corrida 1 | Corrida 2 |
|---------|-----------|-----------|
| Operador | A | B |
| Contrato export | C01 | C02 |
| Δ VES | 180.000 | 180.000 |
| Discrepancias | 0 | 0 |
| Tiempo técnico | ~40 min (incl. infra) | **5,6 s** (infra previa) |

---

## URLs verificadas (operador B)

| Módulo | URL |
|--------|-----|
| Contratos | http://localhost:3000/contratos |
| Consola EGS | http://localhost:3000/modelos/egs/consola |
| Proyectos salud | http://localhost:3000/proyectos?tab=salud |
| Gestión | http://localhost:3000/gestion |

---

## Trust Pack — artefactos

| # | Archivo |
|---|---------|
| 1 | `01-acta-qclose.json` |
| 2 | `02-escrow-export-c02.json` |
| 3 | `03-snapshot-egs-ministry.json` |
| 4 | `04-centinela-ops-health.json` |
| 5 | `05-informe-corrida-2.md` |

---

## Nota honesta

Solo existe seed **MPPI vial** en código hoy. La variante «salud» se verificó vía módulo **proyectos DAO** (gestión sectorial), no un segundo ministerio EGS. Seed salud dedicado = roadmap corrida comercial externa.

---

## Siguiente paso

Corrida 3 adversarial (FREEZE + recuperación) — **ejecutada a continuación**.

---

*SBX interno — reproducibilidad operativa demostrada.*
