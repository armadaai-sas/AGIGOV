# Landing IA — estudio internacional (keep / modify / remove)

Referencia: landings B2B / gov-tech (Stripe, Vercel, GitHub, Linear, productos gov.uk-style).
Taxonomía de producto: [TAXONOMY.md](./TAXONOMY.md). Neutros: [OS-MINIMAL-TOKENS.md](./OS-MINIMAL-TOKENS.md).

## Header objetivo

```
[Logo]  Modelos · Gobiernos · Negocios · Ciudadanos     [Iniciar sesión]  [Comenzar gratis ▾]
```

- Un solo CTA primario.
- Login = texto (no solo icono).
- “Hablar con el equipo” = sección `#contacto` + footer (+ ítem dentro del dropdown si hace falta). No peer del CTA.

## Mantener

| Bloque | Por qué |
|--------|---------|
| Hero → Continuum → Outcomes → Authority → Modelos → Deploy → Contacto → Footer | Continuum lean B2B |
| Nav por audiencia + Modelos | Destinos reales (taxonomía) |
| CTA “Comenzar gratis” con dropdown de quién eres | Self-serve + rutas claras |
| Sección contacto dedicada | Sales/concierge sin competir en nav |

## Modificar

| Elemento | Cambio |
|----------|--------|
| Acciones del header | Quitar “Hablar…” de la barra; login con label |
| Announce bar | Badge neutro zinc; sin neón “live” |
| Outcomes / frames / stage | Superficies `#fff`/`#fafafa`/`#f4f4f5`; pills gris |
| Sombras | Soft zinc; sin glow cyan |
| Shell tokens | Light neutro; azul solo logo `#0052ff` |

## Eliminar / degradar

- Link “Hablar con el equipo” como peer de Comenzar gratis
- `--ls-tone-*` coloridos (cyan, amber, teal, blue…)
- Semáforos decorativos macOS en frames
- `color: #fff` sobre fondos claros
- Accent cyan `#0ea5e9` en shell

## No añadir

Stat strips densos, pricing incompleto, chat widget “AI”, badges de confianza inventados, segundo announce bar.
