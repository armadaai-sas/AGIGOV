# Proceso 06 — Release UI/UX

Checklist para publicar cambios de interfaz (landing + shell + páginas) sin romper taxonomía ni evidencia.

## Alcance

- Landing `/` ([HomePage.tsx](../../src/citizen/pages/HomePage.tsx))
- Shell `.app-shell` (todas las rutas ≠ `/`)
- i18n ES/EN
- Tokens CSS

## Pre-merge (desarrollador)

- [ ] [01-DESIGN-PROCESS.md](./01-DESIGN-PROCESS.md) D0–D3 completos
- [ ] `npm run lint && npm run build`
- [ ] Sin errores JS en consola en: `/`, `/escritorio`, `/modelos`, `/institucional`
- [ ] Nav sidebar dice **Modelos**, no Apps
- [ ] Header landing: **Iniciar sesión** + **Comenzar gratis** (sin “Hablar” como peer CTA)
- [ ] Ancla utilidad: `#utilidad` (no `#resultados` como sección producto)

## Checklist visual

| Área | Criterio PASS |
|------|----------------|
| Colores | Neutros zinc; azul solo logo |
| Sombras | Soft zinc; sin glow cyan |
| CTAs | Un primario negro por zona |
| Escritorio | Lista workspaces; sin CTA duplicado consola |
| Catálogo | Filas `ModelCatalogRow`; filtros audiencia |
| Concierge | Solo `/ayuda`, `/institucional`, `/desarrolladores` |
| Mobile | Nav drawer usable; CTAs no cortados |

## i18n

- [ ] Keys nuevas en `en.ts` y `es.ts`
- [ ] MessageKey tipado desde `en.ts`
- [ ] EN: “Models”, “Utility” — no “Apps”, “Results” como nav

## Post-merge / pre-prod

- [ ] Deploy [05-SERVER-DEPLOY-OPS.md](./05-SERVER-DEPLOY-OPS.md)
- [ ] `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/`
- [ ] Screenshot opcional en `docs/design/` o case study
- [ ] Hard refresh CDN/cache si aplica

## Regresiones conocidas (vigilar)

| Síntoma | Causa probable |
|---------|----------------|
| Pantalla blanca landing | Import faltante (ej. AgigovLogo) |
| ERR_CONNECTION_RESET local | Vite caído — reiniciar `:3010` |
| Shell oscuro | Tokens viejos en `base.css` / no trust-light |
| landing.css cyan | No reimportar `landing.css` global ([index.css](../../src/index.css)) |

## Herramientas

```bash
npx vite --port=3010 --host=0.0.0.0
npm run build
# Lighthouse (opcional, case studies):
# docs/commercial/case-studies/prueba-real-1/
```

## Agente responsable

**artesano-ui** · evidencia vía [00-EVIDENCE-LAW.md](./00-EVIDENCE-LAW.md)
