# CSO — Evaluación Enfoque Doble Hélice

**Fecha:** 2026-07-03  
**Modelo:** Efficiency Gain Share · Piloto Infraestructura Vial VE

---

## Veredicto CSO

El enfoque **Doble Hélice** es el movimiento correcto. EGS falla sin **ambas** cadenas:

| Hélice | Riesgo si falta |
|--------|-----------------|
| **Legal (AEI)** | Ministro no firma; piloto informal; fee 70/20/10 discutible |
| **Técnica (QuarterClose)** | Δ manual = auditoría pasiva de nuevo; no hay Sistema Nervioso |

**Sincronización obligatoria:** mismos términos en Cláusula 4–5 AEI y campos `QuarterClose` — ya alineados en v0.1.

---

## Re-evaluación EGS vs. Sistema Nervioso

| Dimensión | Sin Doble Hélice | Con Doble Hélice |
|-----------|------------------|------------------|
| Reflejo operativo | Pagos discrecionales | Smart Escrow + releases en schema |
| Memoria institucional | Actas en PDF | BaselineAct + QuarterClose en ledger |
| Inteligencia | Excel trimestral | `calculo_ahorro_final` automático + panel |

---

## Auditoría CSO (piloto materializado)

| Lente | Score | Nota post-specs |
|-------|-------|-----------------|
| Adopción | **5** | AEI 2 páginas = documento de venta; escudo anti-corrupción explícito |
| Escala | **4** | Schema parametrizado; tesorería vía `treasuryRef` |
| Anti-corrupción | **5** | Δ calculado por máquina; FREEZE en schema; 70% blindado |

---

## Riesgos residuales

| Riesgo | Mitigación |
|--------|------------|
| AEI firmado pero schema no migrado | Gate: piloto `active` solo si migración OK |
| Tesorería no integra webhook | Fase manual con export JSON — máximo 1 trimestre |
| Baseline disputado | conciliador + acta addendum |

---

## Próximos pasos (orden)

1. **soberano** — Dictamen AEI v0.1  
2. **logistico** — `db:migrate` + seed piloto demo  
3. **centinela** — Job reconciliación releases  
4. **comunicador** — Versión ciudadana AEI (1 página)  
5. **Ministro** — Firma tras dictamen CONFORME  

---

## Publicación enjambre

| Entregable | Ruta |
|------------|------|
| AEI borrador | `AEI-ANEXO-I-PILOTO-VIAL-v0.1.md` |
| Schema spec | `QUARTER-CLOSE-SCHEMA-v0.1.md` |
| Prisma + calc | `prisma/schema.prisma`, `src/db/egs/quarter-close.ts` |
