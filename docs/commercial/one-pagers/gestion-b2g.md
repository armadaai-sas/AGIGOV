# Gestión Pública Verificable — One-pager B2G (Gobierno)

**Ledger · AGIGOV · Audiencia: ministerios, contraloría, transparencia y veeduría institucional**

---

## Problema

Ciudadanos y contralorías no distinguen gestión real de relato institucional: reportes tardíos, agregados no reproducibles y opacidad selectiva. Sin telemetría verificable no hay confianza fiscal ni base para EGS o escrow avanzado.

## Solución AGIGOV (3 bullets)

- **Dashboard público sin PII:** telemetría agregada de actos institucionales — propuestas, commits, reportes — solo estado **published**.
- **Pipeline auditable:** cada acto pasa **received → validated → decided → published** con evidenceBundle y firma centinela.
- **FREEZE ante irregularidad:** centinela congela mutaciones; human-in-the-loop antes de des-congelar — rendición de cuentas continua, no informe anual tardío.

## Qué existe hoy vs roadmap

| Hoy (demo verificable) | Roadmap |
|------------------------|---------|
| Consola `/gestion` + API `/api/public/dashboard` | Multi-jurisdicción con actas soberanas |
| Pipeline agentes (`npm run agents:flow`) | Integración contraloría batch certificada |
| Reportes publicados sin PII | Alertas ciudadanas push por hito de gestión |
| Base para EGS y Escrow | SLA de publicación por ministerio |

**Estado catálogo:** `disponible` — aprobado en 3 etapas (`npm run models:audit`).

## Modelo ganar-ganar

| Parte | Gana porque… |
|-------|----------------|
| **Estado / ministerio** | Demuestra gestión con hechos en ledger — menos dependencia del relato comunicacional. |
| **Contraloría / veeduría** | Misma telemetría que el ciudadano; recuento reproducible sin acceso privilegiado opaco. |
| **Ciudadano** | Ve gestión agregada sin exponer datos personales — transparencia selectiva. |

## Pricing orientativo (no vinculante)

- **Suscripción auditoría continua:** referencia **$18.000–36.000/año** por jurisdicción (M4) — validar con **cso-monetizacion**.
- **Despliegue nodo territorial:** según sizing edge (Fase 5) — documentado en `docs/SERVER-SIZING.md`.
- **Métrica CSO:** cero discrepancias materiales centinela en periodo.

> Demo con seed — no sustituye informe legal de contraloría ni acta promulgada.

## Prueba / demo

- Ficha: `/modelos/gestion-verificable`
- Consola: `/gestion`
- API: `GET /api/public/dashboard`
- Comandos: `npm run api:public` · `npm run db:seed` · `npm run agents:flow`

## Objeciones (top 5)

| Objeción | Respuesta honesta |
|----------|-------------------|
| «¿Más carga burocrática?» | Publicación automática al **published** — menos informes manuales duplicados. |
| «¿Filtran datos sensibles?» | Capa pública **sin PII**; expedientes completos fuera del ledger ciudadano. |
| «¿Y si centinela se equivoca?» | FREEZE + human-in-the-loop; hashes y evidenceBundle para revisión. |
| «Ya tenemos portal de transparencia.» | AGIGOV añade **pipeline verificable** y base para EGS/escrow — no solo PDF estático. |
| «¿Escala nacional?» | **No hoy** — piloto por jurisdicción; escala requiere multi-sig y nodos territoriales. |

## Próximo paso (champion 5 min)

1. Demo `/gestion` con seed + un reporte publicado (10 min).
2. Acordar **qué actos** entran al piloto (propuestas, suministros, cierres).
3. Soberano valida marco de publicación antes de prometer plazos legales.

---

*Generado por **comercial-agigov** · Validación técnica: **modelo-guardian** · 2026-07-04*
