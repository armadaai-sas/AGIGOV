# EGS — Estudio de acciones, utilidad y botones (Estado territorial)

**Propósito:** definir con precisión qué debe **hacer** cada usuario, qué **botones** necesita y qué **ingeniería** lo respalda — antes de más UI.  
**Audiencia ancla:** ministerio (MPPI) · extensible a gobernación / alcaldía.  
**Estado:** especificación producto + ingeniería · **no implementar** hasta validación.  
**Referencias:** [EGS-ESTADO-TERRITORIAL.md](./EGS-ESTADO-TERRITORIAL.md) · [EGS-PIPELINE.md](./EGS-PIPELINE.md)

---

## 1. Resumen ejecutivo

EGS no vende “verificación”. Vende **operar el ciclo fiscal verificable**:

```
Baseline → Ejecutar (hitos) → Reconciliar → Calcular Δ → Publicar → Reinvertir
```

La consola ministerio debe ser un **panel de mando fiscal**, no un diagrama técnico:

| Capa | Qué muestra | Máximo en pantalla |
|------|-------------|-------------------|
| **Resultado** | Ahorro · reinversión 70% · semáforo | 1 bloque |
| **Acción** | 1 CTA según estado | 1 botón primario |
| **Operación** | Contratos · hitos · alertas | lista corta |
| **Utilidad** | Export · compartir · ayuda | 2–3 secundarios |
| **Técnico** | Agentes · ledger · pipeline | colapsado |

---

## 2. Jobs-to-be-done (por actor)

### 2.1 Ministerio (MPPI) — **prioridad demo mundial**

| Job | Motivación | Éxito medible |
|-----|------------|---------------|
| **Saber si el trimestre cierra bien** | Contraloría / ministro | Semáforo conforme + Δ publicado |
| **Publicar ahorro y reparto** | Transparencia + reinversión | `published: true` + ciudadano ve mismo número |
| **Detectar bloqueos antes del escándalo** | Riesgo político | Alerta discrepancia + contrato identificado |
| **Ratificar techo presupuestario** | Legalidad del piloto | Baseline multi-sig `ingest_ready` |
| **Comparar programas** (futuro) | Priorización | Rollup por `budgetCode` |

### 2.2 Alcaldía (fase 2 UI)

| Job | Acción core |
|-----|-------------|
| Liberar obra con evidencia | Ingestar hito |
| Ver cuánto falta para cierre | Hitos pendientes vs Q-close |
| Responder freeze | Subir evidencia / corregir monto |

### 2.3 Gobernación (fase 3)

| Job | Acción core |
|-----|-------------|
| Supervisar municipios | Rollup + alertas territoriales |
| Escalar freeze | Link a contrato + acta |

### 2.4 Ciudadano (lectura)

| Job | Acción core |
|-----|-------------|
| Confianza | Ver ahorro reinvertido |
| Participación | Reportar irregularidad |

---

## 3. Máquina de estados — consola ministerio

Estados derivados de **datos reales** (`ministry-health` + `PilotTenant`):

```
                    ┌─────────────────┐
                    │  SIN_TENANT     │  No seed / no provision
                    └────────┬────────┘
                             │ provision + seed
                             ▼
                    ┌─────────────────┐
                    │ BASELINE_PEND   │  onboarding: baseline_pending
                    └────────┬────────┘
                             │ ratify multi-sig
                             ▼
                    ┌─────────────────┐
                    │ INGEST_READY    │  Sin hitos o < umbral cierre
                    └────────┬────────┘
                             │ ingest hitos
                             ▼
                    ┌─────────────────┐
         freeze ◄──│ EN_EJECUCION    │  reconcileOk, no Q-close
                    └────────┬────────┘
                             │ q-close reconcile
                             ▼
                    ┌─────────────────┐
                    │ LISTO_CIERRE    │  PENDING_VALIDATION / DELTA
                    └────────┬────────┘
                             │ q-close publish
                             ▼
                    ┌─────────────────┐
                    │ PUBLICADO       │  PUBLISHED + ministry-health
                    └─────────────────┘

         DISCREPANCIA (transversal): reconcileOk = false → FREEZE
```

---

## 4. Catálogo de acciones — ministerio

### 4.1 Acciones de **resultado** (solo lectura)

| ID | Acción | API / fuente | UI |
|----|--------|--------------|-----|
| R1 | Ver ahorro verificado Δ | `GET ministry-health` → `calculoAhorroFinal` | Métrica 1 |
| R2 | Ver reinversión 70% | `split.reinversion` | Métrica 2 |
| R3 | Ver reparto 70/20/10 | `split.*` | Zona Reparto |
| R4 | Ver ejecución vs baseline | `executionPct`, barras | Detalle colapsado |
| R5 | Ver contratos en custodia | `contracts[]` | Lista |
| R6 | Ver telemetría ciudadana | `/gestion` | CTA secundario post-publish |

### 4.2 Acciones **operativas** (mutación)

| ID | Acción | API hoy | UI hoy | UI objetivo |
|----|--------|---------|--------|-------------|
| O1 | Iniciar piloto / provision | `POST /api/ops/tenants/provision` | Piloto wizard | CTA SIN_TENANT |
| O2 | Onboard institucional | `POST .../onboard` | `/institucional/piloto` | Link o embed paso 1 |
| O3 | Ratificar baseline | `POST .../baseline/ratify` | Piloto paso baseline | CTA BASELINE_PEND |
| O4 | Ingestar hitos | `POST /api/ops/ingest/:slug` | Piloto paso ingest | Alcaldía (no ministerio) |
| O5 | Reconciliar Q-close | `POST .../q-close` `{ publish: false }` | CLI `pilot:q-close` | CTA LISTO_CIERRE (confirmación) |
| O6 | Publicar Q-close | `POST .../q-close` `{ publish: true }` | CLI | **CTA primario LISTO_CIERRE** |
| O7 | Resolver discrepancia | Humano + re-ingest | — | CTA DISCREPANCIA → contrato |
| O8 | Dictamen Soberano / tesorería | **ROADMAP** | blocked | Label honesto |

### 4.3 Acciones de **utilidad** (no mutan ledger)

| ID | Botón | Cuándo | Implementación |
|----|-------|--------|----------------|
| U1 | **Actualizar** | Siempre | Refresh health (existe) |
| U2 | **Exportar informe trimestre** | PUBLICADO | PDF/JSON treasury payload — **PENDING** |
| U3 | **Compartir enlace público** | PUBLICADO | Copy URL `/gestion` o deep link Q |
| U4 | **Ver ficha contrato** | Siempre | Link `/proyectos/contrato/:id` (existe) |
| U5 | **Abrir piloto institucional** | Pre-publish | `/institucional/piloto` (existe) |
| U6 | **Documentación / ayuda** | Siempre | `/ayuda` o contrato eficiencia PDF |
| U7 | **Preview fee AGIGOV** | Δ > 0 | `POST billing/egs-preview` — **PENDING UI** |
| U8 | **Ver mapa sistema** | Operador B | `/escritorio/mapa` — secundario oculto |

---

## 5. Botones por estado — ministerio (wireframe lógico)

### SIN_TENANT

| Prioridad | Botón | Destino |
|-----------|-------|---------|
| Primario | Iniciar piloto EGS | `/institucional/piloto` |
| Secundario | Registro institucional | `/institucional/registro` |
| Utilidad | Actualizar | refresh |

### BASELINE_PEND

| Primario | Ratificar acta baseline | Piloto paso baseline (multi-sig) |
| Secundario | Ver borrador acta | collapsible PDF/hash |
| Utilidad | Ayuda: qué es baseline | `/ayuda` |

### INGEST_READY (sin hitos suficientes)

| Primario | Ir a ingesta de hitos | Piloto paso ingest (o alcaldía futura) |
| Resultado | “Faltan N hitos para cierre” | derivado `milestones` |
| Secundario | Ver contratos | lista vacía/parcial |

### EN_EJECUCION

| Primario | Ver avance por contrato | lista contratos |
| Secundario | Preview cierre (solo lectura) | q-close dry-run API — **PENDING** |
| Utilidad | Actualizar |

### DISCREPANCIA (freeze)

| Primario | **Revisar contrato afectado** | primer contrato `status: discrepancy` |
| Alerta | Lista discrepancias centinela | `discrepancies[]` |
| Secundario | Contactar soporte / Operador B | humano |
| **No mostrar** | “Publicar cierre” | deshabilitado con razón |

### LISTO_CIERRE

| Primario | **Publicar cierre trimestral** | `POST q-close publish:true` + confirm modal |
| Secundario | Reconciliar sin publicar | ops only / admin |
| Preview | Δ y reparto antes de confirmar | modal con 70/20/10 |
| Utilidad | Export borrador | PENDING |

### PUBLICADO

| Primario | **Ver telemetría ciudadana** | `/gestion` |
| Secundario | Exportar informe oficial | PENDING |
| Secundario | Compartir | copy link |
| Utilidad | Ver detalle técnico | collapsible agentes |

### Δ = 0 (sin ahorro)

| Mensaje | “Sin ahorro este trimestre — AGIGOV no cobra comisión.” |
| Primario | Ver telemetría / conformidad | igual PUBLICADO o EN_EJECUCION |

---

## 6. Otros modelos — acciones que el ministerio **enlaza** (no duplica)

| Modelo | Botón desde consola EGS | Job |
|--------|-------------------------|-----|
| **Custodia** | “Ver contrato C1” | Cadena hitos LOCKED→RELEASED |
| **Evidencia** | “Certificar evidencia” (alcaldía) | Destrabar hito |
| **Gestión** | “Vista ciudadana” | Publicación |
| **DATA Trust** | “Comparar sector vial” (futuro) | Benchmark agregado |
| **IaaU** | “Uso del piloto” (footer) | Facturación unidades |
| **Participar** | — | Ciudadano reporta |

**Regla:** EGS **no reimplementa** ingest ni certificación — **enlaza** con la superficie correcta.

---

## 7. Agentes — cuándo aparecen (sutileza)

| Momento | Copy UI (una línea) | Agente |
|---------|---------------------|--------|
| Todo OK | “Conforme · publicado hace X” | Centinela + Comunicador |
| Reconciliando | “Verificando custodia…” | Centinela |
| Freeze | “Pagos congelados — discrepancia en C2” | Centinela |
| Pre-publish | “Listo para publicar al ledger ciudadano” | Comunicador |
| Blocked | “Dictamen tesorería — próxima versión” | Soberano |

**Nunca:** panel de 4 agentes en pantalla principal. Solo en `<details>` o tooltip en freeze.

---

## 8. Ingeniería — matriz precisión (implementar vs roadmap)

| Prioridad | Entregable | Esfuerzo | Dependencia |
|-----------|------------|----------|-------------|
| **P0** | Derivar `estadoConsola` enum en backend (`GET ministry-health` o `/models/egs/status`) | S | Postgres |
| **P0** | CTA `Publicar cierre` → API `q-close` con auth institucional | M | Session + slug |
| **P0** | Modal confirmación con preview Δ + 70/20/10 antes publish | S | P0 API |
| **P0** | Deshabilitar publish si `!reconcileOk` con copy freeze | S | existe |
| **P1** | Ingest hitos desde alcaldía (UI dedicada) | M | Bearer token |
| **P1** | `GET billing/egs-preview` en UI ministerio | S | billing |
| **P1** | Export PDF treasury payload | M | template |
| **P2** | Rollup gobernación (multi-tenant jerárquico) | L | schema |
| **P2** | Soberano SPLIT_APPROVED + webhook tesorería | L | IAP + legal |
| **P3** | Compositor mapa (Fase 4) | XL | IAP wired |

### Endpoint propuesto (P0)

```
GET /api/public/models/egs/status?ministry=MPPI
```

```json
{
  "estadoConsola": "LISTO_CIERRE",
  "primaryAction": { "id": "publish_q_close", "label": "Publicar cierre trimestral", "enabled": true },
  "secondaryActions": [{ "id": "view_contracts", "href": "/modelos/egs/consola#contratos" }],
  "result": { "delta": "125000.0000", "reinversion70": "87500.0000", "currency": "USD" },
  "semaphore": "green",
  "blockReason": null
}
```

**Principio:** la UI **no infiere** — el backend devuelve CTA permitido (evidence law).

---

## 9. Reglas de diseño (inviolables)

1. **Un botón primario** por estado — nunca dos negros.  
2. **Resultado en ≤5 s** — tres números max above fold.  
3. **Progressive disclosure** — reparto visible; agentes/ledger colapsados.  
4. **Acciones reales solamente** — botón deshabilitado + `blockReason` si API no existe.  
5. **Ministerio no ingesta** en v1 UI — enlace a piloto/alcaldía.  
6. **Mismo número** en consola ministerio y `/gestion` post-publish.  
7. **Sin copilot** en consola EGS — copy estático derivado de estado.

---

## 10. Checklist validación contigo

Antes de implementar P0, confirmar:

- [ ] ¿Ministerio puede **publicar cierre** desde UI con confirm modal (sí/no multi-sig extra)?  
- [ ] ¿Ingesta sigue solo en **piloto institucional** hasta UI alcaldía?  
- [ ] ¿Export PDF trimestre es must-have para demo mundial?  
- [ ] ¿Botón “Preview fee” visible para ministro o solo Operador B?  
- [ ] ¿Gobernación entra en roadmap antes o después de alcaldía UI?

---

## 11. Próximo movimiento (post-validación)

1. Implementar `estadoConsola` + `primaryAction` en API.  
2. Refactor `MinistryEgsConsole` para renderizar botones desde API (no hardcode).  
3. Modal publish + integración `POST q-close` con sesión institucional.  
4. Documentar Trust Pack Operador B con flujo ministerio end-to-end.

---

**Versión:** 2026-08-30 · Autor: estudio producto/ingeniería pre-implementación.
