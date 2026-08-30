# EGS — Estado territorial (procesos y pantallas en papel)

**Audiencia:** ministerios, gobernaciones, alcaldías, tesorería, contraloría.  
**Propósito:** interconectar presupuesto, ejecución y resultados verificables — no solo “verificar”.  
**Estado:** diseño de producto · **sin UI** hasta validación de este documento.  
**Superficie viva:** http://137.184.66.163 · Piloto referencia: mantenimiento vial MPPI.

---

## 1. Tesis en una frase

> **EGS conecta de ministerio a alcaldía el mismo presupuesto, la misma evidencia y el mismo cierre trimestral — para que el ahorro y la obra se vean de verdad, y el operador solo cobre si hubo eficiencia real.**

---

## 2. Qué NO es EGS

| No es | Es |
|-------|-----|
| Copilot que habla | Trabajo de agentes con evidencia (Centinela, Comunicador…) |
| Dashboard de KPIs sueltos | Cierre fiscal con Δ y reparto publicado |
| Solo auditoría | **Operar:** baseline → hitos → cierre → reinversión |
| App aislada | Capa que **cierra** Custodia + Evidencia + Gestión |

---

## 3. Actores y jerarquía territorial

```
                    ┌─────────────────────┐
                    │  Ministerio (MPPI)   │  Línea base nacional / programática
                    │  Piloto + política   │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
     ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
     │ Gobernación │   │ Gobernación │   │     …       │  Agregación regional
     │  Estado X   │   │  Estado Y   │   │             │
     └──────┬──────┘   └──────┬──────┘   └─────────────┘
            │                 │
     ┌──────┴──────┐   ┌──────┴──────┐
     ▼             ▼   ▼             ▼
 ┌─────────┐  ┌─────────┐       ┌─────────┐
 │ Alcaldía│  │ Alcaldía│  …    │ Alcaldía│  Ejecución + hitos locales
 │   A     │  │   B     │       │   C     │
 └─────────┘  └─────────┘       └─────────┘

Transversal: Tesorería · Contraloría · Operador AGIGOV · Ciudadano (lectura)
```

**Regla:** cada actor ve **solo su scope** + agregados hacia arriba. El **ledger** es uno; los permisos y las vistas cambian.

---

## 4. Matriz — qué hace / qué ve

| Actor | Qué **hace** (acciones) | Qué **ve** (resultado) | Qué **no** ve en pantalla principal |
|-------|-------------------------|------------------------|-------------------------------------|
| **Ministerio** | Ratifica acta baseline · define programa · cierra Q nacional · publica | Δ trimestral programa · reparto 70/20/10 · semáforo conforme | Grafo IAP · hashes completos |
| **Gobernación** | Supervisa municipios · escala alertas · valida agregados regionales | Ejecución % por territorio · ahorro agregado · freeze regional | Pipeline técnico por stage |
| **Alcaldía** | Ingesta hitos · sube evidencia · gestiona contratos locales | Hitos LOCKED→RELEASED · gasto vs techo local · “falta X para cierre” | Enjambre 4 agentes |
| **Tesorería** | Autoriza reparto (roadmap Soberano) · webhook pago | Payload tesorería · billable sí/no | Catálogo IaaU |
| **Contraloría** | Audita · disputa (Conciliador roadmap) | Mismo ledger que ministerio · discrepancias | Wizard connect demo |
| **Operador AGIGOV** | Provision · ops ingest · soporte piloto | Health tenant · checkpoints | UI ciudadana marketing |
| **Ciudadano** | Reporta irregularidad · consulta | Ahorro reinvertido · contratos publicados | Ops API |

---

## 5. Modelos que alimentan EGS (interconexión)

| Modelo | Rol en cadena territorial |
|--------|---------------------------|
| **Custodia** | Presupuesto retenido hasta hito verificado |
| **Evidencia** | Prueba documental / IoT / auditor que destraba custodia |
| **EGS** | Cierre trimestral: baseline vs gasto → Δ → reparto |
| **Gestión** | Telemetría pública (actas, propuestas, ledger) |
| **DATA Trust** | Benchmark sectorial agregado (sin PII) entre entidades |
| **IaaU** | Costo marginal del uso (envelope, hito, sync) |

**Flujo mínimo vendible:** Custodia + Evidencia + EGS + panel ciudadano.

---

## 6. Piloto vial MPPI — proceso completo (papel)

### Fase A — Arranque (una vez)

| Paso | Actor | Acción | Evidencia |
|------|-------|--------|-----------|
| A1 | Operador AGIGOV | Provision tenant piloto | `PilotTenant` activo |
| A2 | Ministerio | Multi-sig acta baseline | `onboardingStatus: ingest_ready` |
| A3 | Comunicador | Publica programa en consola | ministry-health disponible |

### Fase B — Ejecución (continuo)

| Paso | Actor | Acción | Evidencia |
|------|-------|--------|-----------|
| B1 | Alcaldía / contratista | Obra avanza · sensores / auditores | Uplink / documento |
| B2 | Operador ministerio | POST ingest hito verificado | `releaseCount++` |
| B3 | Centinela | Valida custodia escrow vs release | `reconcileOk` |
| B4 | Comunicador | Actualiza telemetría contrato | Consola contrato |

### Fase C — Cierre trimestral

| Paso | Actor | Acción | Evidencia |
|------|-------|--------|-----------|
| C1 | Centinela | `reconcileQuarterClose` | FREEZE si discrepancia |
| C2 | Sistema | Calcula Δ y 70/20/10 | `calculoAhorroFinal` |
| C3 | Soberano | Dictamen reparto (roadmap) | SPLIT_APPROVED |
| C4 | Comunicador | Publish checkpoint | `processCheckpoint` published |
| C5 | Todos | Ven mismo número en consola + ciudadano | ministry-health |

### Fase D — Si no hay ahorro

- Δ = 0 → **AGIGOV no cobra** ese trimestre (mensaje explícito en consola).
- Ciudadano ve: “Ejecución conforme al plan; sin ahorro adicional este trimestre.”

---

## 7. Pantallas en papel (wireframes textuales)

### 7.1 Alcaldía — pantalla principal

```
┌──────────────────────────────────────────────────────────┐
│  Alcaldía · [Nombre] · Q2 2026                           │
├──────────────────────────────────────────────────────────┤
│  RESULTADO                                                │
│  3 de 5 hitos liberados · $X de $Y en custodia           │
│  Estado: En ejecución — faltan 2 hitos para cierre       │
├──────────────────────────────────────────────────────────┤
│  ACCIÓN PRIMARIA                                          │
│  [ Ingresar hito verificado ]                             │
├──────────────────────────────────────────────────────────┤
│  Contratos activos                                        │
│  · Vial C1 — 2/5 hitos  →                                │
│  · Vial C2 — 1/5 hitos  →                                │
├──────────────────────────────────────────────────────────┤
│  ▼ Detalle técnico (colapsado)                            │
└──────────────────────────────────────────────────────────┘
```

### 7.2 Gobernación — pantalla principal

```
┌──────────────────────────────────────────────────────────┐
│  Gobernación · [Estado] · Q2 2026                        │
├──────────────────────────────────────────────────────────┤
│  RESULTADO                                                │
│  12 alcaldías · 78% ejecución media · Δ agregado $Z       │
│  1 alerta: discrepancia en municipio M (freeze)           │
├──────────────────────────────────────────────────────────┤
│  ACCIÓN PRIMARIA                                          │
│  [ Ver alerta y contratos afectados ]                     │
├──────────────────────────────────────────────────────────┤
│  Municipios                                               │
│  · M — 🔴 Bloqueado                                       │
│  · A — 🟢 Conforme                                        │
│  · B — 🟡 En cierre                                       │
└──────────────────────────────────────────────────────────┘
```

### 7.3 Ministerio — pantalla principal

```
┌──────────────────────────────────────────────────────────┐
│  MPPI · Programa vial · Q2 2026                          │
├──────────────────────────────────────────────────────────┤
│  RESULTADO                                                │
│  Ahorro verificado: $Δ · Reinversión 70%: $R             │
│  Publicado hace 2 h · Conforme centinela                  │
├──────────────────────────────────────────────────────────┤
│  ACCIÓN PRIMARIA                                          │
│  [ Cerrar / publicar trimestre ]  (si pendiente)         │
│  o [ Ver telemetría ciudadana ]  (si publicado)           │
├──────────────────────────────────────────────────────────┤
│  Reparto                                                  │
│  70% más obras · 20% mérito · 10% protocolo              │
├──────────────────────────────────────────────────────────┤
│  ▼ Quién validó (Centinela · Comunicador) — colapsado     │
└──────────────────────────────────────────────────────────┘
```

### 7.4 Ciudadano — pantalla pública

```
┌──────────────────────────────────────────────────────────┐
│  Mantenimiento vial · MPPI · Q2 2026                     │
├──────────────────────────────────────────────────────────┤
│  Este trimestre el ministerio ahorró $Δ                   │
│  $R van a más obras en tu región                          │
├──────────────────────────────────────────────────────────┤
│  [ Ver contratos ]  [ Reportar irregularidad ]            │
└──────────────────────────────────────────────────────────┘
```

---

## 8. Reglas UX (obligatorias para rediseño consola)

1. **Resultado primero** — número o frase de ahorro/ejecución en ≤5 s.  
2. **Una acción primaria** — ingestar, cerrar, resolver freeze.  
3. **Una línea de proceso** — “Centinela: conforme” / “Faltan 2 hitos”.  
4. **Agentes colapsados** — explican bloqueo, no dominan la vista.  
5. **Sin grafo en entrada** — mapa del sistema = capa Operador B / arquitecto.  
6. **Multi-scope** — selector ministerio / gobernación / alcaldía cuando exista tenant.

---

## 9. Gap honesto (código vs visión)

| Capacidad | Estado hoy | Necesario para visión territorial |
|-----------|------------|----------------------------------|
| Cierre Q + Δ + publish | ✅ código | UI ministerio (pantalla 7.3) |
| Ingest hitos | ✅ API ops | UI alcaldía (pantalla 7.1) |
| Contratos / custodia | ✅ consola contrato | Enlace desde alcaldía |
| Agregación gobernación | 🔄 roadmap | Tenant jerárquico + rollup |
| Dictamen Soberano / tesorería | 🔄 blocked | SPLIT_APPROVED + webhook |
| Persona scope en UI | ❌ | Login institucional + rol territorial |

---

## 10. Próximo paso (después de tu OK)

1. ~~Validar contigo estas pantallas en papel~~ — ministerio elegido ✅  
2. **En curso:** consola ministerio §7.3 — `MinistryEgsConsole` + `EgsVialConsolePage`  
3. Alcaldía §7.1 — ingest hitos en UI (siguiente)  
4. Retirar o relegar mapa Fase 1A a “Arquitecto del sistema”

---

## Referencias

- [EGS-PIPELINE.md](./EGS-PIPELINE.md) — ingeniería pipeline  
- [CONTRATO-EFICIENCIA-PUBLICA-CIUDADANO.md](../innovation/piloto-ven-vial-specs/CONTRATO-EFICIENCIA-PUBLICA-CIUDADANO.md) — 70/20/10 ciudadano  
- [PLAN-MAESTRO-SISTEMA.md](../PLAN-MAESTRO-SISTEMA.md) — fases producto  
- [SOVEREIGN-SYSTEM-MAP.md](./SOVEREIGN-SYSTEM-MAP.md) — capa D (arquitecto)
