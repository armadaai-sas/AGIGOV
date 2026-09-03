# Auditoría de producto — ¿Vamos bien? Fallos, mejoras, ejecución y enjambre

**Fecha:** 2026-07-04  
**Estado:** diagnóstico honesto post-investigación modelos + negocio ganar-ganar

---

## 1. ¿Estamos en lo correcto?

**Sí, en dirección estratégica.** La secuencia es sólida:

| Capa | Estado | Veredicto |
|------|--------|-----------|
| **Protocolo** (IAP, ledger, agentes, FREEZE) | Implementado Fases 0–3 | ✅ Diferenciador real |
| **Catálogo de modelos** (10 + investigación 14+) | TS + UI `/modelos` | ✅ Producto vendible |
| **Investigación negocio** (EGS, IaaU, scorecard) | Documentada | ✅ Ganar-ganar claro |
| **Ejecución por modelo** | Solo EGS parcial + demo flow genérico | ⚠️ Brecha crítica |
| **Pricing en producto** | Solo en docs, no en UI/API | ⚠️ Brecha |
| **Hero / landing** | Parcialmente alineado; copy legacy | ⚠️ Desalineado |

**Conclusión:** tenéis **arquitectura correcta** y **narrativa comercial correcta**, pero **producto ejecutable ≠ catálogo documentado**. El riesgo es vender 24 modelos y demostrar 1.5.

---

## 2. Fallos actuales (honestos)

### 2.1 Producto vs promesa

| Fallo | Impacto |
|-------|---------|
| 10 modelos en UI, **1 consola real** (EGS) | Credibilidad |
| Modelos sectoriales (TNR, SJP…) solo en markdown | Expectativa inflada |
| **Metering IaaU** no implementado | No hay facturación utility |
| **Pricing** no en `agigovModels.ts` ni fichas | Comercial no puede cotizar desde la app |
| Backend demo usa entidad genérica; UI mezclaba copy piloto | Confusión |
| `LandingCtaSection` aún apuntaba rutas legacy | Funnel roto |

### 2.2 Ejecución

| Fallo | Impacto |
|-------|---------|
| `npm run agents:flow` es **un solo pipeline** (sensor→escrow→publish) | No demuestra SET, Participación, etc. |
| No hay **ModelRunner** por `modelId` | Cada modelo no tiene workflow Dify/código propio |
| SET/CNE: API demo, sin módulo electoral completo | SET es ficha, no producto |
| DSC (compartimentos T3/T4): no existe en infra | Modelos sensibles imposibles hoy |

### 2.3 Organización (herramientas internas)

| Fallo | Impacto |
|-------|---------|
| Agentes/skills referenciados en AGENTS.md pero **no todos en repo** | Invocación inconsistente |
| No hay **agente por familia de modelo** (fiscal, electoral, sectorial) | Concretar 24 modelos sin dueño |
| Investigación en 3 docs sin **single source of truth** en código | Drift doc ↔ UI |

### 2.4 Narrativa landing (pre-fix)

| Fallo | Copy problemático |
|-------|-------------------|
| `landingCopy.ts` | «Justicia algorítmica» · «Integridad 99.999X%» — **no es lo que vendéis** |
| Hero no mostraba pipeline ni pricing ganar-ganar | Visitante no entiende ejecución ni cobro |
| Sección infra genérica vs catálogo modular | Desconexión hero ↔ `/modelos` |

---

## 3. Qué mejorar (priorizado)

### P0 — Credibilidad (30 días)

1. Hero + landing **100% alineados** a modelos, pipeline, ganar-ganar.
2. Ficha modelo: bloque **Pricing** + **Cómo se ejecuta** + estado implementación.
3. Solo badge «Disponible» si hay consola o API demo funcional.
4. Simulador Δ EGS en ficha `/modelos/egs`.

### P1 — Ejecución (60 días)

5. `ModelExecutionProfile` en TS: agentes, intents, rutas, tier DSC por modelo.
6. Un **flow demo por modelo P0** (EGS, Escrow, Participación, SET-lite).
7. Metering IaaU stub + dashboard costo institucional.
8. TNR como hub — aunque sea stub conciliación.

### P2 — Escala (90+ días)

9. Modelos sectoriales Ola 1 (DSC, LGE, CCR) tras validación sandbox.
10. Agentes de dominio dedicados (ver §5).
11. Data Trust bloqueado hasta EGS probado.

---

## 4. Cómo se ejecutan los modelos (arquitectura)

Todos comparten el **mismo motor**; varían **intents, agentes, tier y consola**:

```
Entrada (sensor, formulario, API, voto)
  → IAP envelope firmado
  → Agente handler (centinela | soberano | logistico | …)
  → evidenceBundle
  → advanceProcess(received → … → published)
  → Escrow / TNR / SET commit (si aplica)
  → comunicador → API pública / PWA
```

### Variación por modelo

| Modelo | Agentes dominantes | Commit especial | Consola |
|--------|-------------------|-----------------|---------|
| **EGS** | centinela, logistico, comunicador | Q-Close + Δ | `/modelos/egs/consola` |
| **Escrow** | logistico, centinela | RELEASE hito | `/contratos` |
| **SET** | centinela, soberano | voto cifrado | `/cne` (demo) |
| **Participación** | soberano, conciliador | dictamen | `/propuestas` |
| **DAO** | soberano, logistico | aporte escrow | `/proyectos?tab=dao` |
| **Gestión** | comunicador | telemetría T0 | `/gestion` |
| **IaaU** | logistico, centinela | metering event | `/desarrolladores` |
| **DSC** | centinela, guardian | compartimento T3 | (roadmap) |

**Código hoy:** `src/agents/handlers/*`, `src/agents/run-flow-demo.ts`, `src/bus/`, `src/server/public-api.ts`.

---

## 5. Skills y agentes por modelo

### 5.1 Enjambre existente (usar siempre)

| Agente | Cuándo |
|--------|--------|
| **centinela** | Validación, FREEZE, Δ, integridad electoral |
| **soberano** | Dictamen, reformas, marco legal modelo |
| **logistico** | Escrow, LGE, TNR pagos, inventario |
| **conciliador** | SJP disputas, conflictos territorio RNR |
| **comunicador** | PWA, hero, dashboards T0 |
| **cso-monetizacion** | Pricing, scorecard, ganar-ganar |
| **innovador** | Roadmap, experimentos 90d |

### 5.2 Skills por familia de modelo

| Familia | Skills obligatorias | Agente lead |
|---------|---------------------|-------------|
| **Fiscal** (TNR, EGS, Escrow, BPS) | applied-cryptography · resilient-data-architecture · sovereign-economics-monetization | logistico + cso-monetizacion |
| **Electoral** (SET, RCV, Consulta) | applied-cryptography · tactical-cybersecurity · state-legal-political | centinela + soberano |
| **Ciudadano** (DAO, Participación) | tactical-pwa · state-innovation | comunicador + soberano |
| **B2G** (CCR, Evidencia API, IaaU) | inter-agent-protocol · guerrilla-devops | logistico |
| **Sectorial** (SPV, LGE, AEE, TME…) | resilient-data-architecture · guerrilla-devops | logistico |
| **Sensibles** (DSC, SJP, DSS) | tactical-cybersecurity · applied-cryptography · state-legal-political | centinela |
| **Producto / Hero / UX** | sovereign-product-studio · civic-institutional-ux · premium-civic-design | comunicador |

### 5.3 Matriz modelo → dueño ejecución

| Modelo | Agente primario | Skill primaria | Entregable concreto |
|--------|-----------------|----------------|---------------------|
| EGS | logistico | sovereign-economics-monetization | Q-Close + simulador Δ |
| Escrow | logistico | applied-cryptography | Hitos RELEASE demo |
| SET | centinela | state-legal-political | Módulo voto + recuento |
| Gestión | comunicador | tactical-pwa | Dashboard T0 completo |
| Participación | soberano | state-innovation | Pipeline propuesta→dictamen |
| DAO | logistico | sovereign-economics-monetization | Escrow aportes UI |
| IaaU | logistico | guerrilla-devops | Metering + factura |
| Evidencia API | centinela | inter-agent-protocol | OpenAPI + cert integrador |
| TNR | logistico | macro-intelligence-governance | Conciliación stub |
| DSC | centinela | tactical-cybersecurity | Compartimento T3 POC |

---

## 6. Qué necesitamos para ejecutar «a la perfección»

### Infraestructura

- [ ] Postgres + edge SQLite sincronizados
- [ ] Bus MQTT + WireGuard en prod
- [ ] PANIC_MODE probado
- [ ] DSC compartimentos para T3+
- [ ] Metering IaaU en ledger

### Gobernanza

- [ ] Carta AGIGOV-[ISO] con cláusulas fee
- [ ] Dictamen soberano por modelo P0
- [ ] Multi-sig baseline EGS
- [ ] Plantilla AEI / contrato success fee

### Producto

- [ ] `ModelExecutionProfile` + badge implementación real
- [ ] Flow demo por modelo P0
- [ ] Pricing en ficha + PDF cotización
- [ ] Hero = protocolo + modelos + pipeline + ganar-ganar

### Operación

- [ ] Runbook por modelo (desplegar, validar, rollback)
- [ ] KPI utilización §7 INVESTIGACION-NEGOCIO
- [ ] Concierge M1 sandbox documentado

---

## 7. Modelos de ingreso — ¿bien definidos?

**En documentación: sí.** En producto ejecutable: **no aún**.

| Componente | Doc | Código/UI |
|------------|-----|-----------|
| EGS 10% sobre Δ, fee=0 si Δ≤0 | ✅ | ⚠️ Falta simulador y factura |
| Reparto 70/20/10 | ✅ | ✅ Demo seed |
| IaaU micro-fees | ✅ | ❌ Sin metering |
| Licencia M4 | ✅ | ❌ Sin cotizador |
| M7 certificación integrador | ✅ | ❌ |
| Data Trust P2 | ✅ bloqueado | ❌ Correcto |

**Siguiente paso ingresos:** añadir `pricing` a `AgigovModel` en TS y renderizar en `ModelDetailPage`.

---

## 8. Referencias

- [INVESTIGACION-MODELOS-ESTADO.md](./INVESTIGACION-MODELOS-ESTADO.md)
- [INVESTIGACION-NEGOCIO-GANAR-GANAR.md](./INVESTIGACION-NEGOCIO-GANAR-GANAR.md)
- [MODELOS-SERVICIOS.md](./MODELOS-SERVICIOS.md)
- `AGENTS.md` · `src/agents/` · `src/citizen/platform/agigovModels.ts`
