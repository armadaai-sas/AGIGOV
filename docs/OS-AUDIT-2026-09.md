# Auditoría del OS — issues categorizados y priorizados (2026‑09)

Objetivo: llevar el OS a calidad de **lanzamiento público en GitHub** (próximo mes) y cerrar los problemas de diseño, layout, páginas, responsividad y controles que quedan.

Severidad:
- **P0** — bloquea el lanzamiento o rompe una experiencia central.
- **P1** — alta: calidad/uso visible que debe cerrarse antes del público.
- **P2** — media: consistencia y pulido.
- **P3** — baja: deseable.

Método: análisis estático del repo (rutas, componentes, CSS) + revisiones previas en vivo. Los ítems marcados con 🔎 requieren confirmación en vivo (la verificación con navegador quedó bloqueada por límite de uso en esta sesión).

---

## A. Proceso, CI y flujo a producción (bloqueadores de avance)

- [ ] **A1 · P0 · Nada llega a `main` → el droplet no avanza.** 10 PRs abiertos, todos apilados en borrador; `main` y `http://137.184.66.163/` siguen en un build de septiembre. Es la causa raíz de "no veo los cambios". → Consolidar y mergear un incremento a `main` (recomendado: la rama tip que agrupa todo el UI) y luego cerrar los borradores superados.
- [x] **A2 · P0 · CI en rojo (10 errores de `tsc`).** Resuelto: `tsc --noEmit` → 0 errores, `npm run build` OK. Falta que el gate de CI corra en verde sobre `main`.
- [ ] **A3 · P1 · CI como gate obligatorio.** Asegurar que `ci.yml` (lint/build) sea *required check* en `main` antes de abrir el repo, para no re‑romper el árbol.
- [ ] **A4 · P2 · Higiene del stack de ramas.** Hay muchas ramas `cursor/*` apiladas; tras consolidar, borrar las obsoletas y documentar la estrategia de branching en `CONTRIBUTING.md`.

## B. Layout y sistema de diseño (consistencia)

- [x] **B1 · P1 · Páginas `os-workspace` alineadas al patrón de Gestión.** Mismo ancho `--os-read`, título 1.5rem y padding de `desk-page`. Las clases internas siguen para no reescribir las quince páginas de un golpe.
- [x] **B2 · P1 · Un solo tamaño de botón en el OS.** `app-btn` y el primario quedan en 36px y radio 8px. Las clases (`app-btn`, `ds-btn`, `desk-page-primary-btn`) se conservan como primario, secundario y fantasma.
- [ ] **B3 · P2 · Encabezados de página inconsistentes.** Páginas migradas usan `DeskPageHeader` (título + resultado + dato); las de `os-workspace` usan `os-workspace-title/sub`. → Estandarizar en un solo componente de encabezado.
- [ ] **B4 · P2 · Tokens duplicados.** `OS-MINIMAL-TOKENS.md`, `CONSOLE-DESIGN-SYSTEM.md` y `DESIGN-SYSTEM.md` coexisten. Ya se apunta a `DESIGN-SYSTEM.md` como fuente única; falta consolidar/deprecar los otros para evitar deriva.

## C. Responsividad / móvil 🔎

- [x] **C1 · P1 · Consolas a 390px.** Métricas, pipeline y tablas pasan a una columna bajo 420px. Botones de acción de página ocupan el ancho. Verificado en IaaU, EGS y proyectos.
- [x] **C2 · P1 · Pipeline y tablas en móvil.** `.egs-run-steps` ya es columna; métricas `.egs-run-metrics` y `.desk-page-metrics` colapsan a 390px.
- [ ] **C3 · P2 · Objetivos táctiles.** Verificar que botones/iconos cumplan ~44px de área táctil en móvil (el rail y algunos iconos usan 32–36px). 🔎
- [ ] **C4 · P2 · Cajón móvil (drawer) vs sidebar.** El `☰` es `lg:hidden` (correcto), pero falta validar foco/scroll‑lock/cierre del drawer en móvil. 🔎

## D. Claridad de contenido / jerga para el usuario final

- [x] **D1 · P1 · Consolas de modelo no “de‑jergadas”.** Lenguaje claro en IaaU, Data-Trust, Evidencia y SET (rama de launch hardening).
- [x] **D2 · P1 · Flujo institucional piloto con mucha jerga.** Lenguaje claro en firma múltiple, verificación y acceso de carga.
- [ ] **D3 · P2 · Mapa del sistema / Transparencia.** `SystemMapPage` (~6) y páginas de transparencia mezclan lenguaje interno. → Revisar qué necesita ver el ciudadano.
- [ ] **D4 · P2 · Glosario/Ayuda.** Verificar que expliquen los términos que sí se muestran, y enlazarlos desde donde aparecen.

## E. Estados vacíos, de carga y de error

- [x] **E1 · P1 · “No data”/error deben ser útiles, no técnicos.** Si la API no responde, consolas, gestión, propuestas, contratos, suministros y `/proyectos` muestran datos de demostración etiquetados. No aparece “Error al sincronizar” ni `npm run` en producción.
- [ ] **E2 · P2 · Consistencia de estados vacíos.** Unificar el patrón (bloque a la izquierda, lenguaje claro) en todas las páginas; hoy hay una mezcla de `EmptyState` centrado y bloques nuevos.
- [x] **E3 · P2 · Datos reales vs demo.** `?demo=1` fuerza la demostración. Si la carga falla, el mismo fixture aparece solo, con el aviso “Demostración”. Un respuesta real de la API sigue teniendo prioridad.

## F. Botones y controles

- [x] **F1 · P1 · Ver B2.** Botones de página a 36px/8px. En 390px el botón de la cabecera ocupa el ancho; no hay pastillas de 52px en el desk.
- [ ] **F2 · P2 · Inputs y selects.** `agigov-input` normalizado a 40px; verificar el resto de campos (wizards institucionales) para altura/tipografía consistentes.
- [ ] **F3 · P2 · Estados de foco/hover accesibles** en todos los botones/enlaces (WCAG AA). 🔎

## G. Navegación e IA (arquitectura de información)

- [ ] **G1 · P2 · Sidebar del escritorio — cerrado en lo esencial.** Colapsa a rail, tooltips en portal ya funcionan. Pendiente menor: transición de etiquetas (fade) y posición estable del botón contraer/expandir al colapsar.
- [ ] **G2 · P2 · Redirecciones y rutas legacy.** Existen redirects (`/dashboard`, `/proyectos/salud`, `/ven/servicios/*`). Verificar que no queden enlaces internos a rutas muertas.
- [ ] **G3 · P3 · Command palette (⌘K).** Confirmar que cubre las acciones principales y está descubrible.

## H. Preparación del repositorio público (OSS)

- [x] **H1 · P1 · Scaffolding OSS presente.** `LICENSE`, `README`, `CONTRIBUTING`, `CODE_OF_CONDUCT`, `SECURITY`, plantillas de issue/PR ya existen.
- [x] **H2 · P0 · Sin secretos en el repo.** `.env.example` documenta `VITE_API_PROXY`. El proxy de Vite ya no cae al host de producción si falta la variable. Sigue habiendo URLs de producción en docs de proceso y workflows: se listan en [OSS-PUBLIC-SCOPE.md](OSS-PUBLIC-SCOPE.md) para el corte, no se borran del repo privado.
- [x] **H3 · P1 · “Getting started” desde clon limpio.** [GETTING-STARTED.md](GETTING-STARTED.md): nivel 1 = `npm install && npm run dev` + `?demo=1`; nivel 2 = Postgres; nivel 3 = bus/edge.
- [x] **H4 · P1 · README público con demo.** Pitch, diagrama y enlace `?demo=1` en el README. Captura/GIF de la corrida queda pendiente de verificación en navegador (el límite de uso bloqueó B/C/F y esta toma).
- [x] **H5 · P1 · Alcance público vs privado.** Decisión en [OSS-PUBLIC-SCOPE.md](OSS-PUBLIC-SCOPE.md): entra el producto; se queda `docs/commercial/` y los runbooks/workflows del host de producción.
- [ ] **H6 · P2 · Licencia y marca.** Confirmar coherencia de licencia y neutralidad de marca (regla ya aplicada en código nuevo).

---

## Orden sugerido de ejecución

1. **A1** (mergear a `main` + deploy) — para ver avance real ya. *(requiere tu OK de deploy)*
2. **H2 / H3 / H4 / H5** — hechos en la rama de launch (getting started, README con `?demo=1`, alcance público). Falta la captura de la corrida y el corte del espejo (sigue pidiendo OK).
3. **D1 / D2 / E1** — claridad para el usuario en consolas y flujo institucional.
4. **C1 / C2** — responsividad de consolas (con verificación en vivo).
5. **B1 / B2 / F1** — unificación de layout y botones.
6. Pulido: **B3/B4, C3/C4, E2/E3, G1/G2, F2/F3**.

> Nota: la verificación en vivo de móvil/responsividad de esta sesión quedó bloqueada por límite de uso del navegador de pruebas. Los ítems 🔎 se confirmarán con capturas desktop+móvil en cuanto se restablezca.
