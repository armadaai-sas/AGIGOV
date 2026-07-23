# Informe — Corrida 3 SBX (Adversarial FREEZE + recuperación)

**Fecha:** 2026-07-06  
**Escenario:** discrepancia forzada en escrow C10 vs releases contabilizados  
**Comandos:** `npm run egs:stress` · `npm run panic:drill`

---

## Resumen ejecutivo

| Fase | Resultado |
|------|-----------|
| Inyección discrepancia | PASS — escrow C10 → LOCKED |
| Centinela detecta | PASS — 5 discrepancias reportadas |
| QuarterClose congela | PASS — status **FROZEN** |
| Publicación bloqueada | PASS — reconcile `ok: false` |
| Human-in-the-loop | PASS — restauración manual documentada |
| Recuperación Δ | PASS — Δ **180.000 VES** restaurado |
| Panic drill | PASS — **7/7** checks |

**Veredicto corrida 3:** **PASS**

---

## Incidente documentado

**Trigger:** `egs:stress` fuerza `escrow-vial-pilot-c10` a `LOCKED` mientras existen 5 releases contabilizados.

**Respuesta centinela:**
```
QuarterClose.status: FROZEN
OK: false
Discrepancias: 5 (C10 LOCKED vs RELEASED expected)
```

**Recuperación:**
1. Restaurar escrow → `RELEASED`
2. QuarterClose → `COLLECTING`
3. Re-ejecutar reconcile → `ok: true`, Δ = 180.000 VES

**Lección comercial:** *«Si los números no cuadran, el sistema se detiene antes de publicar como oficial.»*

---

## Panic drill (capa protocolo)

| Check | Estado |
|-------|--------|
| FREEZE — ledger read-only | OK |
| IAP bloquea intents mutables | OK |
| ROTATE — revocar DID | OK |
| RECOVER — des-freeze checklist | OK |
| Whitepaper soberano indexado | OK |

Resultado: **7 OK, 0 FAIL**

---

## Trust Pack — artefactos

| # | Archivo |
|---|---------|
| 1 | `01-incidente-freeze.json` |
| 2 | `02-post-recovery-egs-ministry.json` |
| 3 | `03-panic-drill-log.txt` (referencia consola) |
| 4 | `04-centinela-ops-health.json` |
| 5 | `05-informe-corrida-3.md` |

---

## Estado post-recuperación

API `ministry-health` MPPI: `DELTA_CALCULATED`, `reconcileOk: true`, discrepancias: `[]`.

Demo lista para continuar ventas — no quedó FREEZE colgado.

---

## Serie 3/3 — cierre

| Corrida | Tipo | Veredicto |
|---------|------|-----------|
| 1 | Happy path | PASS |
| 2 | Reproducibilidad | PASS |
| 3 | Adversarial | PASS |

**Podéis decir comercialmente:**

> *«Ejecutamos el Trust Pilot Fiscal tres veces de punta a punta en entorno controlado, incluyendo FREEZE y recuperación; el cuarto lo vendemos.»*

---

*SBX interno — incidente simulado con recuperación documentada.*
