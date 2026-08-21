# Escrutinio ventanas — Sprint ciudadano / apps (live)

**Fecha:** 2026-08-21 · **Host:** `http://137.184.66.163`  
**Método:** checklist PLAN-PULIDO (entrada, copy 5s, nav, botones, forms, empty, auth)

## Veredictos

| ID | Ventana | URL | Veredicto | Hallazgos | Fix |
|----|---------|-----|-----------|-----------|-----|
| G1 | Sidebar Sistema | `/escritorio` | **GO** | Auth fuera del dock | Hecho (live) |
| G3 | Escritorio | `/escritorio` | **GO-CONDICIONADO** | 4 acciones claras | OK |
| G7 | Gestión | `/gestion` | **GO-CONDICIONADO** | Form Centinela arriba; badge “Demo”; hint npm en empty | Stats primero; reportar abajo; copy limpio |
| G8 | Participar | `/participar` | **GO-CONDICIONADO** → fix | Tarjetas de canales + jerga; “catálogo” en pie | Form-first; sin tarjetas |
| G9 | Propuestas | `/propuestas` | **GO-CONDICIONADO** → fix | Sin CTA enviar si hay lista | CTA Enviar propuesta |
| G10 | Modelos | `/modelos` | **GO-CONDICIONADO** | Filtros OK; sync strip denso | Pendiente poda strip |
| G11 | Consola EGS | `/modelos/egs/consola` | **PENDING** | — | Próximo pase |
| G12 | Contratos | `/contratos` | **GO-CONDICIONADO** | Ministry hardcoded MPPI | Documentar; OK piloto |
| G5/G6 | Registro/Login | `/institucional/*` | **GO-CONDICIONADO** | Flujo → escritorio | E2E Operador B |
| G20 | Gate prod | — | **NO-GO** | Sin Operador B PASS | Agendar |

## Sidebar live (evidencia)

En `/gestion` el dock **Sistema** muestra solo: Escritorio · Ayuda.  
Auth (Iniciar sesión / Registro) en topbar. **G1 GO.**

## Próximo escrutinio

1. Consola EGS (toolbar, KPIs, feeShare)  
2. Registro E2E  
3. Empty states mobile (G18/G19)
