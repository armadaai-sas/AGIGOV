# Configuración soberana — país, moneda, idioma

AGIGOV separa **tres capas** de configuración regional. No mezclarlas evita que un visitante en Bogotá reescriba el ledger de Caracas.

## Capas (precedencia)

| Prioridad | Fuente | Uso | Autoritativa para ledger |
|-----------|--------|-----|--------------------------|
| 1 | **Nodo** (`.env`) | Despliegue institucional | Sí |
| 2 | **Usuario** (PWA / localStorage) | Display, onboarding | No |
| 3 | **Geo-hint** (timezone + `navigator.language`) | Primera visita | No |

```
Usuario explícito  >  Nodo (.env)  >  Geo-hint  >  Genérico
```

## Detección por país (UX)

| Señal | Jurisdicción | Moneda | Idioma sugerido |
|-------|--------------|--------|-----------------|
| `America/Bogota`, `es-CO` | AGIGOV-COL | COP | `es-CO` |
| `America/Caracas` | AGIGOV-VEN | VES | `es-VE` |
| Zonas US, `en-US` | AGIGOV-USA | USD | `en-US` |
| Hispanohablante (sin país) | GEN | USD | `es` |
| Resto | GEN | USD | `en` (default) |

En el **nodo real** de Colombia:

```bash
AGIGOV_ISO=COL
AGIGOV_JURISDICTION=AGIGOV-COL
AGIGOV_CURRENCY=COP
AGIGOV_LOCALE=es-CO
AGIGOV_TIMEZONE=America/Bogota
TERRITORY_CODE=COL_PILOT_01
```

## API

`GET /api/public/config` — configuración del nodo + catálogo de jurisdicciones.

## PWA

- Panel **Región** en sidebar (país, moneda, idioma)
- Selector de implementación incluye Venezuela, Colombia y USA
- `useSovereignConfig()` + `formatMoney()` + `t()` en hero y consolas
- **i18n**: inglés por defecto; español en países hispanohablantes; locale por país (`es-VE`, `es-CO`, `en-US`)

## Código

| Módulo | Rol |
|--------|-----|
| `src/config/sovereign/jurisdictions.ts` | Catálogo VEN / COL / USA / SBX / GEN |
| `src/config/sovereign/resolve-locale.ts` | Política idioma (en → es → por país) |
| `src/i18n/` | Catálogos `en` y `es` |
| `src/config/sovereign/detect-region.ts` | Geo-hint |
| `src/config/sovereign/resolve-config.ts` | Resolución + formato moneda |
| `src/config/sovereign/node-config.ts` | Lectura `.env` servidor |

## Producción Colombia

Antes de ledger en COP:

1. Onboarding `AGIGOV-COL` según `docs/AGIGOV/ONBOARDING-GOBIERNOS.md`
2. Acta baseline multi-sig nacional
3. Tenant piloto ministerial (Fase A–C) con moneda COP en seed
4. Nodo con variables de entorno anteriores

La geo del navegador **no sustituye** estos pasos institucionales.

## Idiomas soportados (v1)

- `en` — **default** internacional
- `es` — hispanohablante (geo sin país específico)
- `es-VE` — Venezuela
- `es-CO` — Colombia
- `en-US` — Estados Unidos

## Monedas soportadas (v1)

`VES` · `COP` · `USD`
