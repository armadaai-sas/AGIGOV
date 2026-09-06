# OS + EGS — Desglose de la interfaz de usuario (end-user A→Z, versionado)

> **Objetivo.** Narrar el recorrido real del usuario final del OS soberano y de su modelo insignia **EGS**, paso a paso (A→Z), separando lo que el cliente quiere **ver / compartir / descargar** en cada paso. El desglose sirve para (1) detectar pasos, lógica, tecnología, procesos o UI/UX que faltan o están mal, y (2) dejar un plan **fácil de construir** por versiones.
>
> **Método.** Todo lo de "Estado actual" está anclado al código en `main` (rutas de archivo citadas). Lo de "Objetivo" es especificación. Cada brecha lleva la versión (`v1`…`v3`) en la que se corrige (§6).
>
> **Marca / tokens.** Se respeta `docs/design/OS-MINIMAL-TOKENS.md`: blanco, tinta zinc, borde `#e4e4e7`, azul `#0052ff` solo en marca, Lucide 16px stroke 1.5. Sin acentos cromáticos decorativos.

---

## 0. TL;DR — los tres arreglos que ordenan todo

1. **Barra de menú minimalista (estilo workspace de un IDE / bandeja tipo Gmail).** Hoy conviven **tres sistemas de navegación** que se solapan y se desincronizan (rail por persona, paleta ⌘K, nav/footer de landing). Unificar a: **un rail primario corto (persona-aware) + paleta ⌘K como "todo lo demás" + top bar delgado con contexto/búsqueda/cuenta**. → **v1** (§2).
2. **Una sola taxonomía de persona.** Hoy hay **dos** que no coinciden: landing/desk (`state · citizen · enterprise · integrator`) vs. modal de onboarding (`citizen · explorer · government · business`), y la elección del modal se descarta. Unificar a 4 personas y persistirlas. → **v1** (§3.2).
3. **EGS con recorrido visible A→Z.** El backend EGS tiene un pipeline de **8 etapas** real, pero la consola lo esconde en un `<details>`, y el tracker/wizard de etapas existen pero **están huérfanos** (sin montar). Además hay salidas calculadas que **no se muestran** y "compartir" no está cableado. → **v1.1 / v2** (§4–§5).

---

## 1. Estado actual (as-is)

### 1.1 Shell y frame

Todo excepto `/` monta `AppShellLayout` (`src/citizen/components/AppShellLayout.tsx`) = **sidebar** (`AppSidebar.tsx`) + **top bar delgado** + canvas. La regla es binaria: `usesAppShell(pathname) === pathname !== '/'` (`src/citizen/platform/navConfig.ts`). El top bar hoy solo lleva: hamburguesa+título (móvil), botón de búsqueda (⌘K) centrado y un `trail` **vacío**. No hay breadcrumbs, ni cuenta, ni contexto en el header. Landing (`/`) usa su propio `LandingNav` + `SiteFooter`.

### 1.2 Los tres sistemas de navegación (problema raíz)

| Sistema | Fuente | Cobertura | Problema |
|---|---|---|---|
| Rail por persona | `src/citizen/platform/deskNav.ts` (`getDeskNavSections`) | 3–5 ítems por persona | Muchas rutas del shell **no** están aquí |
| Paleta ⌘K | `src/citizen/platform/paletteItems.ts` (46 ítems) | Amplia, filtrada por persona | Rutas críticas ciudadanas (`/proyectos`, `/suministros`, `/cne`) **solo** aquí |
| Landing nav/footer | `LandingMinimal.tsx`, `SiteFooter` | Entradas por persona + modelos + legal | Cuarto set de enlaces, deriva respecto a los otros |

Consecuencias: destinos duplicados en `deskNav.ts` + `deskHome.ts` + `paletteItems.ts` (riesgo de drift; p. ej. el rail de `state` enlaza EGS **espacio** mientras desk-home rotula "Consola EGS"), y el hint del rail dice literalmente "⌘K — todo lo demás" (`AppSidebar.tsx`).

### 1.3 Dos taxonomías de persona que no alinean

- Landing + Desk: `state · citizen · enterprise · integrator` (`deskNav.ts`, `landingMinimalCopy.ts`).
- Modal onboarding: `citizen · explorer · government · business` (`OnboardingModal.tsx`); solo persiste un booleano `agigov-onboarding-v1`, **la persona elegida se descarta** (`PlatformContext.tsx`).
- Cambiar de persona en el rail siempre hace `navigate('/escritorio')` (`DeskPersonaSwitch.tsx`) → **resetea el contexto** (anti-patrón vs. Cursor/Gmail, que preservan el espacio).

### 1.4 EGS: backend rico, UI que lo esconde

Pipeline canónico de 8 etapas en `src/egs/pipeline.ts`: `provision → baseline → ingest → reconcile → delta → sovereign → publish → serve`. Pero:

- La consola `EgsVialConsolePage` obtiene el pipeline y solo lo pasa al `<details>` técnico (`MinistryEgsConsole.tsx`) — **no hay barra de progreso en la consola principal**.
- Componentes completos pero **huérfanos** (0 imports): `EgsAgentProcessTracker` y `EgsAgentSwarmBar` (`EgsAgentPipeline.tsx`), `EgsConnectWizard`, `EgsConsoleToolbar`, `EgsDeltaSimulator`.
- **DATA Trust sí monta** el patrón correcto (`ConnectWizard` + `ModelProcessTracker` en vivo) — es la referencia a replicar (`docs/design/DATA-TRUST-PIPELINE.md`).
- Salidas **calculadas pero no mostradas**: `treasuryPayload`, `feeShare` (parcial), `secondaryActions` de `getEgsMinistryStatus`, `executionPct`/`escrowExecutionPct` (solo en `<details>`). "Compartir enlace público" está tipado pero **nunca se renderiza**.
- Etapa `sovereign` **siempre `blocked`** (webhook de tesorería no implementado). IAP no cablea ingest/Q-close (`swarm.iapWired: false`).

### 1.5 Inconsistencias transversales

- `breadcrumbsForPath` es **código muerto** (0 usos); el shell desactiva breadcrumbs.
- Dos patrones de página mezclados: "desk-page" vs "os-workspace" (headers/espaciados/CTA distintos).
- Registro trial salta el wizard de piloto (aterriza en consola) mientras el copy empuja `/institucional/piloto` → **dos onboardings institucionales paralelos**.
- Solo EGS exporta (PDF); DATA Trust, SET, Evidencia, gestión, suministros son solo-lectura.
- i18n parcial: cambiar a inglés deja la mayoría del desk en español.
- Búsqueda oculta en móvil (`< md`); onboarding modal **interrumpe** el primer render de rutas no-home.

---

## 2. Objetivo — el OS como *workspace* minimalista (menú estilo IDE / Gmail)

**Principio.** Tres superficies de navegación, cada una con un rol único y sin solaparse:

1. **Rail primario (izquierda), corto y persona-aware.** Marca → Hub arriba; conmutador de persona; **≤5 destinos primarios** con label; secundarios icono+tooltip; pie con colapsar / preferencias / cuenta / ayuda. Colapsable a riel de iconos (como la barra de actividad de un IDE).
2. **Paleta ⌘K = "todo lo demás".** Único índice completo de rutas y acciones, filtrado por persona. Un ítem **"Más…"** al final del rail abre la paleta con scope de persona (patrón "More" de Gmail).
3. **Top bar delgado (40px).** `AGIGOV / <contexto>` a la izquierda (breadcrumb ligero), **búsqueda siempre visible** al centro (incl. móvil), **cuenta/preferencias** a la derecha. Hoy `trail` está vacío: ahí va la cuenta.

**Reglas de comportamiento (lo que hoy falla):**

- **Fuente única de navegación.** Un solo módulo declara ítems (rail + paleta derivan de él). Elimina drift entre `deskNav.ts` / `deskHome.ts` / `paletteItems.ts`.
- **Cambiar de persona preserva contexto** cuando la ruta actual existe para la nueva persona; solo cae a Hub si no aplica.
- **Estado activo accesible:** `aria-current="page"` + coincidencia exacta primero (evitar que Hub siga "activo" en subrutas por `startsWith`).
- **Búsqueda siempre presente** (móvil incluido).
- **Onboarding no interrumpe:** reemplazar el modal bloqueante por selección de rol **inline** en Hub/landing; persistir la persona.
- **Limpiar deuda:** borrar CSS muerto de secciones colapsables y `NAV_SECTION_*` `@deprecated` en `navConfig.ts`; `funnel` es siempre-on (simplificar).

### 2.1 Especificación de la barra de menú (v1)

```
┌───────────────────────────────────────────────────────────────────────┐
│ TOP BAR (40px)                                                          │
│  AGIGOV / <Hub · Modelo · Consola>   [🔍 Buscar en el OS   ⌘K]   [◐ ▾] │
├──────────────┬────────────────────────────────────────────────────────┤
│ RAIL (220px) │ CANVAS (max 3–4xl)                                       │
│  ◼ AGIGOV    │                                                          │
│  ⌂ Hub       │                                                          │
│  ── persona  │                                                          │
│  [E][C][B][I]│                                                          │
│  ── primarios│                                                          │
│  ▸ Item 1    │                                                          │
│  ▸ Item 2    │                                                          │
│  ▸ Item 3    │                                                          │
│  ── secund.  │                                                          │
│  ○ ○ (icon)  │                                                          │
│  ⋯ Más…      │  → abre ⌘K con scope persona                            │
│  ── pie      │                                                          │
│  ⟨ colapsar  ⚙ prefs  ◐ cuenta  ? ayuda                                │
└──────────────┴────────────────────────────────────────────────────────┘
```

- **Colapsado** → riel de iconos (`--desk-rail`), labels a tooltip, conmutador de persona = botón cíclico (ya existe).
- **Móvil** → rail en drawer; top bar mantiene título + **búsqueda visible** + cuenta.
- Tokens: rail 220px, top bar 40px, sin footer de marketing en shell (`OS-MINIMAL-TOKENS.md`).

Archivos que toca v1: `AppSidebar.tsx`, `AppShellLayout.tsx`, `deskNav.ts` (fuente única), `paletteItems.ts` (derivar), `DeskPersonaSwitch.tsx` (preservar contexto), `navConfig.ts` (limpiar), `app.css`/`desk.css` (activo + top bar), `OnboardingModal.tsx` (→ inline).

---

## 3. Recorrido del OS A→Z (por fases y persona)

Fases universales: **Descubrir → Elegir rol → Orientar (Hub) → Actuar (modelo) → Resultado (ver/compartir/descargar) → Verificar → Aprender.**

### 3.1 Mapa por persona

| Fase | Ciudadano | Estado / Institución | Empresa | Integrador |
|---|---|---|---|---|
| Descubrir | `/` → `/gestion` | `/` → `/institucional` | `/` → `/empresas` | `/` → `/desarrolladores` |
| Elegir rol | selector inline (no modal) | ídem | ídem | ídem |
| Orientar | `/escritorio` (Hub) guía 3 pasos | Hub estado | Hub empresa 01–06 | Hub API + glosario |
| Actuar | `/participar` | Registro → **EGS** (trial) **o** piloto 0–5 | DATA Trust / Evidencia | Integrar API |
| Resultado | `/propuestas`, `/gestion` | Publicar Q-close → `/gestion` + PDF | `/contratos` | Custodia test |
| Verificar | recibo con hash (copiable) | ledger / contrato detalle | evidencia certificada | verificación firma |
| Aprender | `/ayuda`, `/transparencia` | piloto step 6 | consola IaaU | `/modelos` |

### 3.2 Definición de resultado por fase (ver / compartir / descargar)

Para **cada** superficie de resultado, el estándar (Definition of Done) es que el usuario pueda:

- **Ver:** KPI/estado + evidencia (hash, DID, ancla ledger) + siguiente paso claro.
- **Compartir:** enlace público estable (Web Share API / copiar URL) — hoy solo tipado, no cableado.
- **Descargar:** informe (PDF) **y** datos (CSV/JSON) **y**, cuando aplique, pack de evidencia (ZIP). Hoy solo EGS→PDF.

---

## 4. EGS — el recorrido insignia A→Z (build-ready)

**EGS = Efficiency Gain Sharing:** baseline presupuestario → ingest de hitos en escrow → reconciliación (Centinela) → cálculo Δ con reparto 70/20/10 → dictamen → publicación al ledger → telemetría ciudadana. Verdad en Postgres (`PilotTenant`, `QuarterClose`, `Escrow`, `processCheckpoint`), leída por la PWA vía `/api/public/egs/*`.

### 4.1 Las 8 etapas → paso de usuario, pantalla, entrada, salida, estado

| # | Etapa (`pipeline.ts`) | Agente | Qué hace el usuario | Pantalla / componente | Entrada | Ver / Compartir / Descargar | Estado UI | Arreglo |
|---|---|---|---|---|---|---|---|---|
| 1 | `provision` | ops | Provisiona tenant + token de ingest | `InstitutionProfileStep` (piloto step 0) | ISO, ministerio, año/trim, baseline anual | Ver: slug + token | Parcial (solo wizard/ops) | Self-serve claro (v2.1) |
| 2 | `baseline` | institución | Ratifica acta baseline (multi-sig) | `InstitutionBaselineStep` (step 2) | Onboard + Ratify | Ver: `ingest_ready` | OK (trial auto-ratifica: atajo demo) | UX multi-firma real (v3) |
| 3 | `ingest` | humano | Sube hitos (CSV/PDF) o manual | `InstitutionIngestStep` + `InstitutionFileIngestPanel` | CSV `.csv`, PDF opcional, o 3-hitos demo | Descargar: CSV muestra | OK | Validación cliente (v2) |
| 4 | `reconcile` | centinela | (auto) escrow vs releases | `InstitutionReconcileStep` | — (auto al entrar) | Ver: estado + discrepancias; FREEZE si mismatch | OK | — |
| 5 | `delta` | logístico | (auto) Δ 70/20/10 | `quarter-close.ts` | — | Ver: Δ y split | OK (cálculo); split poco visible | Mostrar split/feeShare (v1.1) |
| 6 | `sovereign` | soberano | Dictamen de reparto | — | — | — | **Falta (siempre `blocked`)** | Webhook tesorería (v3) |
| 7 | `publish` | comunicador | Publica cierre al ledger | `EgsPublishModal` (requiere sesión) | Confirmar | Ver: `processId`; ancla ledger | OK | — |
| 8 | `serve` | comunicador | Consola ciudadana en vivo | `MinistryEgsConsole`, `/gestion` | — | Ver: KPIs; **Descargar: PDF**; Compartir: (falta) | Parcial | Compartir + CSV/JSON (v2) |

### 4.2 Dos entradas EGS que hay que reconciliar

- **Trial (rápida):** `/institucional/registro` → `bootstrap-trial` auto (provision+onboard+ratify) → **consola**. Riesgo: la consola puede quedar sin hitos ingestados hasta que el usuario descubra el wizard.
- **Piloto (completa):** `/institucional/piloto`, wizard de 7 pasos (`profile → model → baseline → ingest → reconcile → close → dashboard`), requiere auth.

**Arreglo (v2.1):** una sola narrativa. Tras el trial, handoff explícito al wizard para ingest real ("Tu consola está lista — ahora carga tus hitos"), o mensaje claro de "modo demo". Un solo stepper canónico reutilizado en ambos.

### 4.3 Consola EGS objetivo (v1.1)

Replicar el patrón DATA Trust en la consola principal:

- **`StageTracker` en vivo arriba** (reutilizar `EgsAgentProcessTracker`, hoy huérfano), alimentado por `fetchEgsPipeline` — no en `<details>`.
- Renderizar `status.secondaryActions` (hoy nunca se muestran): "Compartir enlace público", "Ver telemetría ciudadana", "Revisar contratos".
- Superficie de números que ya existen: `executionPct`, `escrowExecutionPct`, `feeShare` (builder/protocol), y `treasuryPayload` (cuando `publish`).
- Montar `EgsConnectWizard` cuando no hay conexión (paridad con DATA Trust).

---

## 5. Registro de brechas (priorizado)

| # | Brecha | Evidencia (archivo) | Severidad | Versión |
|---|---|---|---|---|
| G1 | Tres sistemas de navegación desincronizados | `deskNav.ts` / `paletteItems.ts` / `LandingMinimal.tsx` | Alta | v1 |
| G2 | Dos taxonomías de persona; elección del modal se descarta | `OnboardingModal.tsx`, `PlatformContext.tsx` | Alta | v1 |
| G3 | Cambio de persona resetea a `/escritorio` | `DeskPersonaSwitch.tsx` | Media | v1 |
| G4 | Sin `aria-current`; activo por `startsWith` confunde | `AppSidebar.tsx`, `navConfig.ts` | Media | v1 |
| G5 | Búsqueda oculta en móvil; top bar `trail` vacío | `CommandPalette.tsx`, `AppShellLayout.tsx` | Media | v1 |
| G6 | Onboarding modal interrumpe primer render | `OnboardingModal.tsx` | Media | v1 |
| G7 | CSS muerto + `NAV_SECTION_*` `@deprecated` | `app.css`, `navConfig.ts` | Baja | v1 |
| G8 | EGS sin tracker de etapas en consola principal | `MinistryEgsConsole.tsx` | Alta | v1.1 |
| G9 | Componentes EGS huérfanos (tracker, wizard, toolbar, simulador) | `EgsAgentPipeline.tsx`, `EgsConnectWizard.tsx` | Alta | v1.1 |
| G10 | Salidas calculadas no mostradas (`treasuryPayload`, `feeShare`, `secondaryActions`, `executionPct`) | `egs-public.ts`, `ministry-status.ts` | Alta | v1.1 |
| G11 | "Compartir enlace público" no cableado | `ministry-status.ts` (tipado, no render) | Alta | v2 |
| G12 | Sin paridad de exportación (solo EGS→PDF; falta CSV/JSON/ZIP evidencia) | consolas varias | Alta | v2 |
| G13 | Propuestas solo-lista (sin detalle/verificar/compartir) | `ProposalsPage.tsx` | Media | v2 |
| G14 | Recibos con hash truncado, sin copiar/verificar | `CnePage.tsx`, `ParticiparPage.tsx` | Media | v2 |
| G15 | Trial vs Piloto: dos onboardings paralelos | `InstitutionRegistrationForm.tsx`, `InstitutionPilotPage.tsx` | Alta | v2.1 |
| G16 | Etapa `sovereign` siempre bloqueada; sin webhook tesorería | `pipeline.ts` | Media | v3 |
| G17 | IAP no cablea ingest/Q-close (`iapWired:false`) | `pipeline.ts`, `tenant-q-close.ts` | Baja | v3 |
| G18 | i18n parcial (inglés deja desk en español) | `src/i18n/*`, desk pages | Media | v3 |
| G19 | Breadcrumbs muertos; patrones de página mixtos | `AppBreadcrumbs.tsx`, `PageShell.tsx` | Baja | v3 |
| G20 | Rutas ciudadanas críticas solo en ⌘K (`/proyectos`, `/suministros`, `/cne`) | `paletteItems.ts` | Media | v1 |

---

## 6. Plan por versiones (fácil de construir, incremental)

Cada versión es un incremento entregable y testeable de forma aislada.

### v1 — Fundación de shell + navegación (bajo riesgo, alto impacto UX)
Arregla G1–G7, G20. Menú minimalista según §2.1:
1. Fuente única de navegación; rail + paleta derivan de ella.
2. Top bar: contexto (breadcrumb ligero) + búsqueda **siempre visible** + cuenta a la derecha.
3. Una taxonomía de persona (4), persistida; onboarding **inline** (no modal bloqueante).
4. Persona preserva contexto; `aria-current`; activo por match exacto.
5. Añadir `/proyectos`, `/suministros`, `/cne` al rail ciudadano (o a "Más").
6. Borrar CSS/config muertos.
_Prueba:_ navegación end-to-end por persona; snapshot desktop + móvil; teclado ⌘K.

### v1.1 — Claridad de la consola EGS
Arregla G8–G10. Montar `StageTracker` en vivo en la consola, renderizar `secondaryActions`, exponer `executionPct`/`feeShare`/`treasuryPayload`, montar `EgsConnectWizard`.
_Prueba:_ `npm run db:seed:egs-pilot` → recorrer consola con datos; verificar etapa activa y números.

### v2 — Resultados: paridad ver/compartir/descargar
Arregla G11–G14. Cablear compartir (URL pública + Web Share), añadir export CSV/JSON y pack de evidencia (ZIP) donde aplique, detalle+verificar+compartir de propuesta, recibos copiables.

### v2.1 — Reconciliar entradas EGS (Trial ↔ Piloto)
Arregla G15. Un stepper canónico; handoff explícito post-registro; mensaje claro de modo demo.

### v3 — Completar el modelo y consistencia
Arregla G16–G19. Etapa `sovereign`/webhook tesorería, IAP en ledger, cobertura i18n, breadcrumbs + unificar patrones de página.

---

## 7. Definition of Done por paso (checklist de cliente)

Un paso está "terminado" cuando el cliente puede, sin fricción:

- [ ] **Ver** el estado + la evidencia (hash/DID/ancla ledger) + el **siguiente paso** explícito.
- [ ] **Compartir** un enlace público estable del resultado.
- [ ] **Descargar** informe (PDF) y datos (CSV/JSON), y pack de evidencia (ZIP) si aplica.
- [ ] Llegar y volver sin callejones sin salida (contexto/breadcrumb consistente).
- [ ] Operar en móvil con búsqueda visible y navegación por teclado (⌘K).
- [ ] Ver la etapa del pipeline en la que está (tracker en vivo, no oculto).

---

## Índice de archivos clave (para construir)

| Área | Archivos |
|---|---|
| Shell / menú | `src/citizen/components/AppShellLayout.tsx`, `AppSidebar.tsx`, `platform/deskNav.ts`, `platform/navConfig.ts`, `platform/paletteItems.ts`, `context/DeskShellContext.tsx`, `components/DeskPersonaSwitch.tsx` |
| Onboarding / persona | `components/OnboardingModal.tsx`, `context/PlatformContext.tsx`, `platform/landingMinimalCopy.ts` |
| EGS pipeline | `src/egs/pipeline.ts`, `src/egs/ministry-status.ts`, `src/pilot/egs-public.ts`, `src/pilot/tenant-q-close.ts` |
| EGS UI | `pages/EgsVialConsolePage.tsx`, `components/egs/MinistryEgsConsole.tsx`, `components/egs/EgsAgentPipeline.tsx`, `components/egs/EgsConnectWizard.tsx`, `platform/exportEgsMinistryPdf.ts` |
| Piloto institucional | `components/institutional/InstitutionPilotSteps.tsx`, `context/InstitutionPilotContext.tsx` |
| Estilos / tokens | `src/styles/app.css`, `desk.css`, `console-design-system.css`; `docs/design/OS-MINIMAL-TOKENS.md` |
| Referencia de patrón | `docs/design/DATA-TRUST-PIPELINE.md`, `pages/DataTrustConsolePage.tsx` |
