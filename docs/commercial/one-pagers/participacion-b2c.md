# Participación y Dictamen — One-pager B2C (Ciudadano)

**Propuestas trazables · AGIGOV · Audiencia: ciudadanía, organizaciones comunitarias y veedores**

---

## Problema

La participación termina en buzones sin respuesta: envías una queja o propuesta y no sabes si alguien la leyó, quién decidió ni cuándo hubo resolución. Eso alimenta desconfianza y deserción cívica — la democracia deliberativa se siente como teatro.

## Solución AGIGOV (3 bullets)

- **Propuesta con recibo:** envías hechos verificables en `/participar` — recibes trazabilidad en ledger (sin publicar datos personales innecesarios).
- **Pipeline visible:** cada propuesta avanza **received → validated → decided → published** — puedes ver el estado, no solo un comunicado final.
- **Dictamen ciudadano:** el agente Soberano resume en lenguaje claro; badge CONFORME / REVISAR publicado en `/propuestas`.

## Qué existe hoy vs roadmap

| Hoy (demo verificable) | Roadmap |
|------------------------|---------|
| Ficha `/modelos/participacion` · envío `/participar` | Vinculación normativa automática por jurisdicción |
| Listado `/propuestas` con dictamen y estado | Notificaciones push ciudadanas |
| API `GET/POST /api/public/proposals` | Integración CNE / consultas electorales formales |
| Pipeline soberano en demo (`npm run agents:flow`) | Escala nacional multi-territorio sin acta |

**Estado catálogo:** `disponible` — aprobado en 3 etapas (`npm run models:audit`).

**No confundir con:** **Consulta ciudadana** (`beta`) — recuento tipo SET lite; no elección nacional.

## Modelo ganar-ganar

| Parte | Gana porque… |
|-------|----------------|
| **Ciudadano** | Voz con recibo; ve resolución publicada — no buzón negro. |
| **Estado / municipio** | Legitimidad y canal ordenado; menos ruido anónimo sin trazabilidad. |
| **Veedores / ONG** | Histórico público de dictámenes — auditoría sin acceso privilegiado opaco. |

**El ciudadano no paga** por enviar propuestas en el modelo institucional — costo lo absorbe la licencia AGIGOV de la jurisdicción (M4).

## Pricing orientativo (no vinculante)

| Quién paga | Mecanismo |
|------------|-----------|
| **Ciudadano** | $0 en despliegue institucional estándar |
| **Jurisdicción** | Incluido en licencia M4; premium por volumen alto de propuestas |
| **Métrica CSO** | Tiempo medio hasta resolución **published** |

> Demo técnica — no sustituye proceso legal formal sin marco promulgado por **soberano**.

## Prueba / demo

- Ficha: `/modelos/participacion`
- Enviar propuesta: `/participar`
- Ver propuestas publicadas: `/propuestas`
- Comandos dev: `npm run api:public` · `npm run db:seed` · `npm run agents:flow`

## Objeciones (top 5)

| Objeción | Respuesta honesta |
|----------|-------------------|
| «¿Para qué si no cambian la ley?» | El modelo garantiza **cierre visible** (dictamen + estado), no promete aprobar todo — reduce teatro, no es magia política. |
| «¿Venden mis datos?» | **No** — API pública sin PII; ledger publica actos, no expediente personal completo. |
| «Es muy técnico.» | Formulario corto en `/participar`; recibo legible — no hace falta wallet cripto para el piloto demo. |
| «¿Quién filtra las propuestas?» | Pipeline institucional + centinela anti-spam; irregularidades → FREEZE human-in-the-loop. |
| «¿Está en todo el país?» | **No** — piloto por jurisdicción; escala requiere acta multi-sig y despliegue soberano. |

## Próximo paso (champion comunitario 5 min)

1. Demo envío en `/participar` + ver dictamen en `/propuestas` (10 min).
2. Acordar **canal piloto** con municipio aliado (barrio, consejo comunal, veeduría).
3. Soberano valida marco de respuesta antes de prometer plazos legales.

---

*Generado por **comercial-agigov** · Validación técnica: **modelo-guardian** · 2026-07-04*
