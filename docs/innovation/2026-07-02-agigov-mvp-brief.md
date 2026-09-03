# Innovation Brief — AGIGOV MVP integral

**Fecha:** 2026-07-02  
**Alcance:** Carta AGIGOV-VEN + Proyectos DAO + onboarding gobiernos + participación económica  
**Skill:** `state-innovation` — revisión profunda

---

## Resumen

AGIGOV-VEN tiene infraestructura técnica avanzada (Fases AGIGOV 0–6 ~75–100%) pero **brecha de producto institucional**: el ciudadano y el gobierno no disponen aún de un **MVP cerrado** que una carta ratificable, proyectos DAO visibles, registro de Estados y aportes económicos trazables. Este brief define el **MVP P0–P4 acelerado** y **10 aportes de innovación** para robustecer el objetivo: *nuevo modelo de Estado–Política–Economía replicable globalmente, con foco Venezuela*.

---

## Pilar objetivo (diagnóstico)

**Pilar más débil hoy: participación + legitimidad** (empate crítico)

| Pilar | Estado | Evidencia |
|-------|--------|-----------|
| participación | 🔴 Débil | `/participar` placeholder; sin aportes económicos UI |
| transparencia | 🟢 Fuerte | Dashboard + ledger operativo |
| resiliencia | 🟡 Medio | Edge código listo; soak 72h pendiente |
| equidad territorial | 🟡 Medio | Nodos demo; sin UI territorial |
| legitimidad | 🔴 Débil | Carta borrador; sin multi-sig ratificada |

**Diagnóstico:** La tecnología comunica «plataforma», no «nuevo contrato social». Sin Carta ratificada y Proyectos DAO, AGIGOV parece dashboard técnico — no transformación política 2.0.

---

## MVP definido (90 días)

### MVP AGIGOV-VEN — «Legitimidad + Prosperidad visible»

| # | Componente | Entregable | Fase |
|---|------------|------------|------|
| M1 | **Carta AGIGOV-VEN** | Documento normativo + acta multi-sig | P1 |
| M2 | **`/proyectos` DAO** | Proyectos + escrow + aportes agregados | P4 adelantado |
| M3 | **Registro gobiernos** | `ONBOARDING-GOBIERNOS.md` + health interop | P5 prep |
| M4 | **Aporte económico UI** | Botón «Contribuir» → escrow (simulado → piloto) | P4 |
| M5 | **Participar v1** | Propuesta + respaldo DID (form → ledger) | P2 |
| M6 | **CNE piloto spec** | CNE-0 threat model + UI `/votar` mock | P3 prep |

**Criterio MVP cerrado:**
- Carta ratificada (≥3 firmas)
- ≥3 proyectos visibles con escrow trazable
- ≥1 gobierno sandbox registrado (puede ser mirror VE)
- ≥100 aportes simulados o reales en piloto
- 0 discrepancias centinela ledger ↔ UI

---

## Tres ideas evaluadas (impacto × esfuerzo × riesgo legal)

| # | Idea | Impacto | Esfuerzo | Legal | Veredicto |
|---|------|---------|----------|-------|-----------|
| I1 | **Proyectos DAO + aportes ciudadanos** | Alto | Medio | Revisar (tokens) | ✅ **Elegida MVP** |
| I2 | **CNE tokenizado nacional inmediato** | Muy alto | Muy alto | Alto | ⏸ Piloto territorial primero |
| I3 | **Red multi-gobierno sin Carta VE** | Medio | Alto | Medio | ❌ Sin legitimidad local |

**Propuesta elegida: I1 — Proyectos DAO como cara económica de AGIGOV 2.0**

---

## Propuesta piloto (I1)

**Hipótesis:** Mostrar proyectos nacionales con escrow programático y aportes ciudadanos trazables incrementa confianza (+25% retención PWA) y atrae contribuciones económicas sin captura plutocrática.

**KPIs:**
- 3 proyectos publicados en `/proyectos`
- 100% proyectos con hash escrow en ledger
- ≥50 aportes registrados (piloto MAR_NORTH_01)
- Tiempo publicación hito → UI < 5 min
- NPS ciudadano piloto ≥ 40

**Rollback si:**
- Discrepancia escrow UI vs ledger > 0
- Aporte sin trazabilidad detectado por centinela
- Queja legal soberano RECHAZAR

**Time-box:** 4 semanas

---

## Riesgo legal

**Soberano: REVISAR → CONFORME condicionado**

Condiciones:
- Aportes piloto en VES/fiat gateway antes de token mainnet
- Declaración anti-plutocracia (Art. 19 Carta)
- KYC off-chain para aportes > umbral
- Sin promesa de retorno financiero (contribución cívica)

---

## Diez aportes de innovación (robustos)

### A1. Carta como producto, no PDF
Publicar Carta en `/institucional/carta` con artículos anclables y estado de ratificación en vivo (firmas pendientes/completadas).

**Pilares:** legitimidad, transparencia

### A2. Proyectos DAO — escrow visible
Cada proyecto = `processId` + escrow + hitos. UI muestra barra progreso, estado LOCKED/RELEASED, aportes agregados.

**Pilares:** transparencia, participación

### A3. Contribución económica sin captura
Aportes registrados como recibos hash-linked; peso DAO = 1 persona 1 voto en gobernanza; monto no compra votos.

**Pilares:** legitimidad, participación

### A4. Registro gobiernos AGIGOV-[ISO]
Flujo documentado + `GET /api/public/health` como handshake. Sandbox `AGIGOV-SBX` para pruebas.

**Pilares:** legitimidad (global)

### A5. Portal desarrolladores `/desarrolladores`
API keys read-only, OpenAPI, ejemplos IAP. Gobiernos y devs integran sin tocar core.

**Pilares:** participación, resiliencia

### A6. Nodos comunitarios — `/territorio`
Mapa de nodos, estado sync, «Operar nodo» con guía edge.

**Pilares:** equidad territorial, resiliencia

### A7. Campañas con escrow de gasto
Campaña política 2.0 = proceso ledger + techo de gasto + informe comunicador.

**Pilares:** transparencia, participación

### A8. Comparador Política 1.0 vs 2.0
Widget en `/institucional`: métricas lado a lado (tiempo respuesta, % presupuesto visible).

**Pilares:** transparencia, legitimidad

### A9. Centinela ciudadano
Botón «Reportar irregularidad» → proceso conciliador (sin PII, con evidenceRef).

**Pilares:** transparencia, resiliencia

### A10. Innovación en loop
Automation semanal `state-innovation` + brief en `docs/innovation/`; una mejora producto/mes ratificada.

**Pilares:** todos

---

## Fases AGIGOV — estado actualizado

| Fase | Nombre | Estado | % |
|------|--------|--------|---|
| **P0** | Identidad AGIGOV | 🟢 En cierre | 85% |
| **P1** | Carta + gobernanza | 🟡 Carta borrador | 40% |
| **P2** | Participación | 🟡 Placeholder | 25% |
| **P3** | CNE tokenizado | 🔴 Concepto | 10% |
| **P4** | Economía DAO | 🟡 `/proyectos` MVP | 35% |
| **P5** | Red gobiernos | 🟡 Onboarding doc | 15% |
| **P6** | Legitimidad | 🔴 Pendiente multi-sig | 5% |

**Infra AGIGOV (paralelo):** Fases 0–4 completadas; 5–6 en pre-producción (~85%).

---

## Roadmap inmediato (4 semanas)

| Semana | Acción |
|--------|--------|
| S1 | Ratificar Carta (multi-sig piloto) + `/proyectos` live |
| S2 | Aporte económico simulado + seed proyectos reales |
| S3 | `/participar` v1 propuestas + registro gobierno sandbox |
| S4 | Auditoría centinela + brief siguiente ciclo |

---

## Siguiente paso

1. Humanos: firmar acta Carta v0.1 (`docs/PILOTO-MULTISIG-CHECKLIST.md`)
2. Técnico: desplegar `/proyectos` + API (este sprint)
3. Comunicación: publicar comparador Política 2.0 en `/institucional`
4. Legal: dictamen soberano formal sobre aportes piloto

**No desplegar token mainnet sin acta.**

---

## Handoff agentes

| Agente | Acción |
|--------|--------|
| **soberano** | Dictamen CONFORME condicionado aportes |
| **centinela** | Validar escrow ↔ UI |
| **logistico** | Hitos y liberación escrow |
| **comunicador** | Copy proyectos ciudadano |
| **conciliador** | Disputas aportes/campañas |

---

*Próximo brief: 2026-07-09 — revisar KPIs piloto proyectos DAO*
