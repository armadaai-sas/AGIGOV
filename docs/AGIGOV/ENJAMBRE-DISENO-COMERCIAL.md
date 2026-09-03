# Enjambre diseño + comercial AGIGOV

Coordinación entre **artesano-ui**, **comercial-agigov**, **modelo-guardian** y **cso-monetizacion**.

## Roles

| Agente | Horario sugerido | Entrega |
|--------|------------------|---------|
| **artesano-ui** | 6 h/día laboral (loop `/loop 6h`) | Código UI Fase I + brief |
| **comercial-agigov** | 4–6 h/día (loop `/loop 6h`) | Assets `docs/commercial/` |
| **modelo-guardian** | Nocturno (`/loop 24h`) | `model-validation-report.json` |
| **cso-monetizacion** | Semanal (`/loop 7d`) | Cuadro modelos, fees |

## Orden de precedencia (claims y UI)

```
centinela → soberano → cso-monetizacion → modelo-guardian → artesano-ui | comercial-agigov → comunicador
```

- **comercial-agigov** no promete más de lo que **modelo-guardian** aprueba.
- **artesano-ui** no estiliza `roadmap` como `disponible`.
- Pricing final: **cso** + **soberano**, no comercial solo.

## Loops de automatización (copiar)

### UI — 6 horas al día

```text
/loop 6h Actúa como artesano-ui (config local de agentes: artesano-ui).
Lee ui-product-craft. Primer ítem Fase I pendiente en docs/DESIGN-ROADMAP-FASES.md.
Implementa hasta ✅. npm run lint && npm run build.
docs/innovation/artesano-ui-latest.md. No commit.
```

### Comercial — 6 horas al día

```text
/loop 6h Actúa como comercial-agigov (config local de agentes: comercial-agigov).
Lee agigov-gtm. npm run models:audit. One-pager + FAQ objeciones para 1 modelo aprobado.
docs/commercial/one-pagers/. Brief docs/innovation/comercial-latest.md. No commit.
```

### Guardian — mientras duermes

```text
/loop 24h Actúa como modelo-guardian. npm run models:audit. Actualiza agigovModels solo si approved. docs/innovation/modelo-guardian-latest.md. No commit.
```

## Handoff semanal

| Día | artesano-ui | comercial-agigov |
|-----|-------------|------------------|
| Lun | I1–I2 catálogo/ficha | EGS B2G one-pager |
| Mar | I3–I4 validación/pricing UI | Escrow B2B |
| Mié | I5–I6 EGS simulador/consola | Participación B2C |
| Jue | I7–I8 filtros/comparador | FAQ consolidado |
| Vie | I9–I12 polish + mobile | Deck champion + CTAs para artesano-ui |

## Carpetas

- `docs/commercial/one-pagers/` — venta por modelo
- `docs/commercial/decks/` — presentaciones 5 min
- `docs/commercial/faq/` — objeciones por audiencia
- `docs/innovation/*-latest.md` — resumen agente del día
