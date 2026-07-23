# Trust Pilot — Checklist 3 corridas internas SBX

**Objetivo:** demostrar que el SKU *Trust Pilot Fiscal (90 días)* es **repetible** antes de vender el piloto #4 a un cliente externo.

**Entorno:** sandbox SBX (local Mac nativo o VM demo) — no requiere ministerio.

**Operador:** rotar persona en corrida 2 para probar reproducibilidad.

---

## Entregable común (cada corrida)

Al cerrar cada corrida, generar un **Trust Pack** con:

| # | Artefacto | Pass si… |
|---|-----------|----------|
| 1 | Acta Q-Close (multi-sig demo) | Firmada / registrada en ledger |
| 2 | Export cadena hitos Escrow | ≥1 contrato LOCKED → VALIDATED → RELEASED |
| 3 | Snapshot gestión + contratos | URLs publicadas o export PDF |
| 4 | Log centinela | Incluye al menos estado `validated` o `freeze` documentado |
| 5 | Informe corrida | Qué falló, qué aprendimos, tiempo real vs 90 días simulados |

---

## Corrida 1 — Happy path (SBX vial)

**Escenario:** MPPI / rubro vial · seed estándar · operador A.

### Día 0 — Kickoff simulado

- [ ] `npm run setup:local:native` o infra Docker OK
- [ ] `npm run api:public` + `npm run dev` activos
- [ ] `npm run db:seed` + `npm run db:seed:egs-pilot`
- [ ] Baseline trimestral registrada (acta demo)
- [ ] Checklist kickoff firmado internamente

### Día 1–30 — Operación

- [ ] Consola EGS muestra baseline + gasto trazado
- [ ] ≥3 contratos visibles en `/contratos`
- [ ] Al menos 1 hito en estado VALIDATED
- [ ] Panel «Verificar servicio» en verde (API + Postgres + datos)

### Día 31–60 — Reconciliación

- [ ] `npm run egs:quarter-close` (o flujo equivalente) ejecutado
- [ ] Δ calculado y coherente con seed
- [ ] Gestión publicada en `/gestion` (sin PII)

### Día 61–90 — Cierre

- [ ] Trust Pack completo (5 artefactos)
- [ ] Tiempo total documentado
- [ ] **PASS** si todo verde sin FREEZE no resuelto

---

## Corrida 2 — Reproducibilidad (otro rubro / otro operador)

**Escenario:** segundo ministerio demo o rubro distinto · **operador B** (no el de corrida 1).

### Cambios obligatorios

- [ ] Otro seed o configuración ministerio (ej. salud vs vial)
- [ ] Mismo checklist día 0 → 90
- [ ] Mismos 5 artefactos Trust Pack
- [ ] Comparar tiempos corrida 1 vs 2 (objetivo: ±20%)

### Pass / fail

| PASS | FAIL |
|------|------|
| Trust Pack equivalente sin improvisación | Pasos no documentados / solo «clic demo» |
| Operador B completa sin ayuda del A | Dependencia total del fundador técnico |
| Entregables en ≤90 días simulados | Más de 2 bloqueadores sin runbook |

---

## Corrida 3 — Adversarial (FREEZE + recuperación)

**Escenario:** forzar discrepancia · probar centinela y human-in-the-loop.

### Inyección de fallo (elegir una)

- [ ] `npm run egs:stress` o baseline desalineada vs gasto
- [ ] O: hito liberado sin evidencia → debe bloquearse
- [ ] O: apagar API 5 min durante poll → UI mantiene datos (useCachedFetch)

### Recuperación obligatoria

- [ ] Centinela ejecuta **FREEZE**
- [ ] Alerta visible (ops / consola / log)
- [ ] Human-in-the-loop documenta decisión
- [ ] Des-congelar solo con acta / corrección registrada
- [ ] Cierre Trust Pack incluye sección **«incidente y resolución»**

### Pass / fail

| PASS | FAIL |
|------|------|
| FREEZE antes de publicar dato incorrecto | Discrepancia publicada como oficial |
| Rectificación en historial | Borrado silencioso |
| Trust Pack con incidente documentado | Sin trazabilidad |

---

## Criterio global (3/3)

Podéis decir comercialmente:

> *«Ejecutamos el Trust Pilot Fiscal tres veces de punta a punta en entorno controlado; el cuarto lo vendemos.»*

**Solo si:**

- [ ] 3 Trust Packs archivados en `docs/commercial/case-studies/` (o repo interno)
- [ ] Demo 15 min estable (sin parpadeo en `/contratos`)
- [ ] One-pager + FAQ ministerio revisados por equipo
- [ ] Pricing validado con CSO (aunque orientativo)

---

## Comandos rápidos

```bash
npm run setup:local:native    # infra Mac sin Docker
npm run api:public            # terminal 1
npm run dev                   # terminal 2
npm run db:seed:egs-pilot     # datos EGS + contratos
npm run block-b:pilot         # flujo agentes + piloto multi-sig
npm run block-b:verify -- --native --api
npm run egs:quarter-close     # cierre trimestral demo
npm run panic:drill           # opcional corrida 3
```

---

## Después de 3/3

1. Publicar **SBX Trust Pilot Report** (honesto: sandbox, no referencia ministerial).
2. Abrir ventas **piloto #4** — Lane B (integrador) o Lane C (institucional).
3. CTA producto: **Request Trust Pilot** en landing (fase posterior).

---

*Coordinación: **comercial-agigov** · **modelo-guardian** · **cso-monetizacion** · 2026-07-05*
