# Escrutinio ventanas — Sprint ciudadano / apps (live)

**Fecha:** 2026-08-21 · **Host:** `http://137.184.66.163`  
**Método:** checklist PLAN-PULIDO (entrada, copy 5s, nav, botones, forms, empty, auth)

## Veredictos

| ID | Ventana | URL | Veredicto | Hallazgos | Fix |
|----|---------|-----|-----------|-----------|-----|
| G1 | Sidebar Sistema | `/escritorio` | **GO** | Auth fuera del dock | Hecho (live) |
| G3 | Escritorio | `/escritorio` | **GO-CONDICIONADO** | 4 acciones claras | OK |
| G7 | Gestión | `/gestion` | **GO** (código) | Ledger primero | Deployed `84e9c00` |
| G8 | Participar | `/participar` | **GO** (código) | Form-first | Deployed |
| G9 | Propuestas | `/propuestas` | **GO** (código) | CTA enviar | Deployed |
| G10 | Modelos | `/modelos` | **GO** (código) | Sync strip ruido | Solo si drift / DEV |
| G11 | Consola EGS | `/modelos/egs/consola` | **GO** (código) | Lead largo; pie demo | Copy corto + CTA ficha |
| G12 | Contratos | `/contratos` | **GO** (código) | MPPI hardcode; VES fijo; npm hint | Sovereign ministry + formatMoney |
| G16 | Contacto/soporte | dock Sistema | **GO** (código) | Poco visible | Item Contacto → `/#contacto` |
| G5/G6 | Registro/Login | `/institucional/*` | **GO-CONDICIONADO** | → escritorio | E2E Operador B |
| G20 | Gate prod | — | **NO-GO** | Sin Operador B PASS | Agendar |

## Sidebar

Sistema: **Escritorio · Ayuda · Contacto**. Auth solo topbar.

## Próximo

1. Registro/login E2E (G5/G6 evidencia)  
2. Empty + mobile (G18/G19)  
3. Operador B Trust Pack (G20)
