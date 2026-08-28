# Proceso 03 — Ciclo de vida de modelos (catálogo)

Cómo publicar, auditar y mantener un **modelo operativo** en AGIGOV (no un “producto” suelto).

## Definiciones

- **Modelo** = app del OS con manifest, ruta `/modelos/:id`, opcional consola
- **Catálogo** = `agigovModels.ts` + UI `/modelos`
- **Gate** = `npm run models:audit` (3 etapas, agente **modelo-guardian**)

Schema: [MODEL-MANIFEST-v1.md](../AGIGOV/MODEL-MANIFEST-v1.md) · Código: `src/citizen/platform/modelManifest.ts`

## Etapas del modelo

| Etapa | `status` | Visible en catálogo | Billing |
|-------|----------|---------------------|---------|
| Idea | `roadmap` | Sí, etiqueta roadmap | No |
| Piloto | `beta` | Sí | Solo demo / sandbox |
| Producción | `disponible` | Sí | Tras gate + evidencia |

## Flujo builder (pasos concretos)

### M1 — Diseño del modelo

- [ ] Audiencia primaria: `gubernamental` \| `empresarial` \| `ciudadano`
- [ ] Problema, propósito, métrica de éxito (KPI verificable)
- [ ] Rutas: `productPath`, `consolePath` (si aplica)
- [ ] Mecanismo billing en catálogo P0 (ver manifest §3)

### M2 — Manifest

- [ ] Crear/actualizar entrada en `agigovModels.ts`
- [ ] Opcional: `model.manifest.json` en repo del builder
- [ ] Shares de fee suman 1.0 (±0.001)
- [ ] `evidence.required` definido antes de cobrar

### M3 — UI mínima

- [ ] Ficha: `ModelDetailPage` vía catálogo
- [ ] Consola (si aplica): ruta bajo `/modelos/.../consola`
- [ ] Copy alineado a [TAXONOMY.md](../design/TAXONOMY.md)

### M4 — Auditoría automática

```bash
npm run models:audit
```

Verifica consistencia catálogo ↔ manifest ↔ rutas ↔ i18n.

- [ ] Sin drift status catálogo vs auditoría
- [ ] Rutas resolvibles en `CitizenApp.tsx`

### M5 — Review humano

- [ ] Legal/político si toca carta o datos sensibles (**state-legal-political**)
- [ ] Centinela: no bypass FREEZE en hooks del modelo
- [ ] Comercial: one-pager honesto (**comercial-agigov**)

### M6 — Publicación

- [ ] Merge PR
- [ ] Deploy [05-SERVER-DEPLOY-OPS.md](./05-SERVER-DEPLOY-OPS.md)
- [ ] Evidencia: screenshot ficha + consola en droplet
- [ ] Actualizar status `beta` → `disponible` solo con Operador B / Trust Pack si aplica

## Filtros del catálogo (UI)

Implementación: `ModelsCatalogPage` + `ModelCatalogFilters` + query `?audiencia=`

| Filtro | Query |
|--------|-------|
| Gobierno | `?audiencia=gubernamental` |
| Negocios | `?audiencia=empresarial` |
| Ciudadano | `?audiencia=ciudadano` |

No añadir filtros “marketing” sin destino real (ej. “Resultados” como producto).

## Mantenimiento del catálogo

| Evento | Acción |
|--------|--------|
| Cambio de copy/ruta | PR + `models:audit` |
| Deprecar modelo | `status: roadmap` + redirect en `legacyRedirects.ts` |
| Drift status | Badge ↻ en UI; corregir catálogo o auditoría |
| Nuevo modelo EGS-like | Duplicar patrón EGS en `agigovModels.ts` |

## Evidencia mínima al publicar

```bash
curl -s -o /dev/null -w "%{http_code}" http://137.184.66.163/modelos
curl -s -o /dev/null -w "%{http_code}" http://137.184.66.163/modelos/<id>
npm run models:audit
```

## Agente responsable

**modelo-guardian** · skill **model-validation**
