# Plan maestro del sistema AGIGOV (2026)

Actualización integral: producto · diseño · ingeniería · customer-centric.  
Superficie viva: `http://137.184.66.163/` · Evidencia: [00-EVIDENCE-LAW.md](./process/00-EVIDENCE-LAW.md)

---

## 1. Diagnóstico (core problems)

| # | Síntoma | Causa raíz | Impacto |
|---|---------|------------|---------|
| P0 | Consola DATA Trust “no se entiende nada” | Mezcla `os-workspace` + `desk-page`; métricas técnicas sin “para qué” | Usuario pierde confianza |
| P0 | Texto pegado al sidebar, descuadrado | Canvas sin centrado simétrico; max-width inconsistente | Sensación de caos, no de paz |
| P0 | Centro sin lógica de proceso | Lista + tabla sueltos; tracker desconectado del resultado | No hay historia usuario |
| P1 | Sidebar iconos sin nombre (rail) | Panel colapsado por defecto en muchos usuarios | Descubrimiento pobre |
| P1 | Cada modelo con UI distinta | Sin plantilla de consola ni reglas de métricas | Deuda visual infinita |
| P2 | Pipeline “simulado” en UI | Derivar estado del fetch en vez de API por modelo | Barra no creíble |

---

## 2. Cuatro pilares (objetivo final)

### A — Producto base (customer-centric)

**Regla:** cada pantalla responde en orden:

1. **¿Dónde estoy?** (modelo + persona)
2. **¿Qué está pasando ahora?** (estado en vivo, 1 frase)
3. **¿Qué logré?** (resultado verificable)
4. **¿Qué puedo hacer?** (1 CTA primario)
5. **¿Detalle técnico?** (colapsado / Operador B)

**Métricas — qué mostrar**

| Nivel | Audiencia | Ejemplo DATA Trust | Ocultar |
|-------|-----------|-------------------|---------|
| Outcome | Empresa | “3 sectores publicados, sin PII” | `sourceHash` en vista principal |
| Trust | Compliance | k≥5, sectores excluidos | IDs internos `dsc-*` |
| Ops | Integrador | Hash, celdas crudas | En `<details>` o API |
| Dev | Desarrollador | OpenAPI, endpoints | `/desarrolladores` |

### B — Diseño sólido (Design System v2)

| Token | Valor | Uso |
|-------|-------|-----|
| `--desk-read` | 34rem | Páginas narrativas (Transparencia, Participar) |
| `--desk-console-read` | 42rem | Consolas de modelo (centradas) |
| `--desk-space-section` | 2rem | Entre zonas |
| `--desk-space-block` | 1rem | Dentro de zona |
| Iconos | sm/md/lg | [ICON-SYSTEM.md](./design/ICON-SYSTEM.md) |

**Layout obligatorio consola:**

```
[ sidebar ] | [ topbar ⌘K ]
            |     ┌── canvas centrado (max 42rem) ──┐
            |     │ 1. Estado (tracker)            │
            |     │ 2. Resultado (1 línea)         │
            |     │ 3. Métricas outcome (≤3)       │
            |     │ 4. Explorar (lista)            │
            |     │ 5. Detalle bajo demanda        │
            |     └────────────────────────────────┘
```

**Ambiente “paz”:** fondo blanco, bordes suaves, mucho aire vertical, nunca más de 1 CTA negro por vista.

### C — Ingeniería (estructura aplicación)

| Capa | Patrón | Estado |
|------|--------|--------|
| Pipeline API | `GET /api/public/models/:id/pipeline` | DATA Trust ✅ · EGS ✅ |
| Connect wizard | Por modelo, modos honestos | DATA Trust ✅ · EGS ✅ |
| Console template | `ModelConsoleLayout` + zonas | Fase 0 🔄 |
| Model process map | `src/<model>/pipeline.ts` | DATA Trust ✅ · EGS ✅ |
| Evidencia | PASS solo con curl/UI | Ley activa |

### D — Customer-centric por persona

| Persona | Pregunta hub | Consola tipo |
|---------|--------------|--------------|
| Ciudadano | ¿Qué puedo ver/enviar? | Gestión, Participar |
| Empresa | ¿Qué compro y qué obtengo? | DATA Trust, Evidencia |
| Estado | ¿Qué opero y publico? | EGS, Piloto |
| Integrador | ¿Cómo conecto API? | Developers, modelos |

---

## 3. Fases de ejecución

### Fase 0 — Fundación ✅ **CULMINADA** (2026-08-30)

- [x] Pipeline API DATA Trust
- [x] Wizard Conectar DATA Trust
- [x] Pipeline API EGS + enjambre multiagente (`src/egs/pipeline.ts`)
- [x] Wizard Conectar EGS + consola `ModelConsoleLayout`
- [x] `ModelConsoleLayout` centrado simétrico (referencia DATA Trust + EGS)
- [x] DATA Trust consola referencia (zonas 1–5)
- [x] Reglas métricas en doc ([DATA-TRUST-PIPELINE](./design/DATA-TRUST-PIPELINE.md), [EGS-PIPELINE](./design/EGS-PIPELINE.md))
- [~] Sidebar expandido por defecto — diferido polish (G6)

#### Evidencia gate (137.184.66.163)

| # | Criterio | Prod | Notas |
|---|----------|------|-------|
| 1 | DATA Trust pipeline | **PASS** 200 | `currentStage: select` sin connect previo |
| 2 | EGS pipeline | **PENDING deploy** | 404 hasta push EGS + redeploy |
| 3 | Consolas centradas | **PASS** local · pending screenshot prod | Operador B |
| 4 | Build green | **PASS** local | CI al push |
| 5 | G1–G3 | **PASS** código | G4 deploy EGS en cola |

**Cierre:** fundación de producto + ingeniería honesta lista en repo. Deploy EGS es **carry-over** inmediato, no bloquea Fase 1A.

---

### Fase 1 — Plantilla consola + mapa del sistema (semana 2–4) ← **AHORA**

Dos frentes en paralelo; el mapa **solo read-only** en v0.

#### 1A — Sovereign System Map (read-only) ← **primer update post Fase 0**

Vista institucional del **estado interconectado** (inspiración n8n, pero soberana: agentes + evidencia, no HTTP genérico).

| Entregable | Alcance v0 | No incluye v0 |
|------------|------------|---------------|
| `GET /api/public/system/graph` | Nodos: modelos, agentes, fuentes connect, checkpoints | Editar / drag-and-drop |
| UI `/escritorio/mapa` o zona hub Estado | Grafo read-only; color por `complete` / `active` / `blocked` / `freeze` | Compositor estilo n8n |
| Aristas honestas | Derivadas de `…/pipeline` + `processCheckpoint` | Aristas inferidas desde UI |
| Persona Estado | “¿Qué está interconectado en mi piloto?” en una pantalla | Multi-sig desde canvas |

**Prerrequisitos (ya cubiertos al cerrar Fase 0):** al menos DATA Trust + EGS con pipeline API honesto.

**Evidencia Fase 1A:** curl graph 200 + screenshot grafo con MPPI → EGS → Centinela → Ledger.

#### 1B — Migrar consolas restantes

- [x] IaaU → `ModelConsoleLayout` + métricas humanizadas
- [x] Evidencia → `ModelConsoleLayout` + fix bug carga
- [ ] Unificar cabecera: eliminar `ModelConsoleHeader` legacy (queda SET)
- [ ] Hub Empresa / Escritorio alineados a mismas zonas

**Doc:** [SOVEREIGN-SYSTEM-MAP.md](./design/SOVEREIGN-SYSTEM-MAP.md) (sketch API + nodos)

**EGS territorial (procesos, sin UI):** [EGS-ESTADO-TERRITORIAL.md](./design/EGS-ESTADO-TERRITORIAL.md) — validar antes de rediseñar consola.

### Fase 2 — Pipeline por modelo (semana 5–7)

| Modelo | Connect | Pipeline real |
|--------|---------|---------------|
| DATA Trust | Demo/API/Institucional | ETL k-anonymity ✅ |
| EGS | Piloto + baseline | Ingest → reconcile → quarter-close ✅ (UI) · IAP 🔄 |
| Evidencia | API hito + upload | Certify → chain |
| IaaU | API key metering | Sync → invoice |

Doc por modelo: `docs/design/<MODEL>-PIPELINE.md`

**Fase 2 desbloquea Fase 3 compositor:** editar flujos (estilo n8n) solo cuando IAP enrute handoffs reales (`swarm.iapWired: true`).

### Fase 3 — Shell global (semana 7–8)

- Rail sidebar: primary icono+nombre; secondary tooltip
- Topbar simétrico; contenido nunca `margin-left: 0` pegado
- PWA empty states por persona
- Slow 4G pass (Lighthouse desk)

### Fase 4 — Compositor + GTM (semana 10–12)

- **Sovereign Flow Composer** (v1): conectar modelos/agentes con multi-sig antes de activar
- `models:audit` verde catálogo
- Trust Pack Operador B corrida end-to-end (DATA Trust + EGS)
- Onboarding institucional → consola sin coaching
- Precio/uso honesto en hub empresa

---

## 4. DATA Trust — rediseño consola (especificación)

### Zonas

| Zona | Contenido | No mostrar aquí |
|------|-----------|-----------------|
| **Estado** | Tracker + “Trabajando en tu informe…” | Botones Espacio/Ficha arriba |
| **Resultado** | “N sectores listos para consulta enterprise — sin datos personales” | Conteo crudo “Datasets” |
| **Confianza** | k≥5 · sectores excluidos (micro) | Hash completo |
| **Explorar** | Lista sectores con fecha | Tabla métricas mezclada |
| **Detalle** | Tabla al elegir sector; nombres humanos | avg_payment_days crudo |

### Acciones

- **Primaria:** Regenerar pipeline (solo si conectado)
- **Secundarias:** Ficha · API → footer o ⌘K

---

## 5. Gap Board (máx 12)

| ID | Sev | Item | Next action | Evidencia |
|----|-----|------|-------------|-----------|
| G1 | P0 | Consola DATA Trust ilegible | ModelConsoleLayout + zonas | UI screenshot |
| G2 | P0 | Canvas pegado al sidebar | Centrar shell content | CSS deploy |
| G3 | P0 | Métricas sin contexto | Outcome metrics + i18n | Review empresa |
| G4 | P1 | EGS deploy prod | push + redeploy droplet | curl 200 prod |
| G5 | P1 | ModelConsoleHeader legacy | Deprecar → DeskPageHeader | PR |
| G6 | P1 | Sidebar rail sin nombres | Expand default + tooltips | UI |
| G7 | P2 | Dictamen audit blocked | Roadmap label only | OK |
| G8 | P2 | OpenAPI pipeline routes | developers page | doc |
| G9 | P1 | Trust Pack DATA Trust | Operador B run | case-study folder |
| G10 | P2 | ⌘K hint footer sidebar | Remove/replace | polish |
| G11 | P1 | Sovereign System Map | Fase 1A `GET /system/graph` | **AHORA** |

---

## 6. Definition of Done (consola modelo)

- [ ] Canvas centrado, padding ≥ 2rem del borde útil
- [ ] Usuario entiende estado en ≤5 s (tracker + 1 frase)
- [ ] ≤3 métricas outcome visibles
- [ ] Detalle técnico bajo `<details>` o segundo nivel
- [ ] Pipeline API 200 en producción
- [ ] Build + lint green
- [ ] Operador B puede completar flujo sin ayuda

---

## 7. Referencias

- [ICON-SYSTEM.md](./design/ICON-SYSTEM.md)
- [DATA-TRUST-PIPELINE.md](./design/DATA-TRUST-PIPELINE.md)
- [EGS-PIPELINE.md](./design/EGS-PIPELINE.md)
- [EGS-ESTADO-TERRITORIAL.md](./design/EGS-ESTADO-TERRITORIAL.md)
- [SOVEREIGN-SYSTEM-MAP.md](./design/SOVEREIGN-SYSTEM-MAP.md)
- [CURSOR-DESIGN-SYSTEM.md](./design/CURSOR-DESIGN-SYSTEM.md)
- [process/README.md](./process/README.md)
- [PLAN-EJECUCION-FASES.md](./PLAN-EJECUCION-FASES.md)

**Próximo movimiento:** Fase 1A — `GET /api/public/system/graph` + UI mapa read-only. Carry-over: commit/push EGS → curl 200 prod.
