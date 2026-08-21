# Escrutinio ventanas — Sprint ciudadano / apps (live)

**Fecha:** 2026-08-21 · **Host:** `http://137.184.66.163` · **SHA:** `50cc8f7`  
**Método:** checklist PLAN-PULIDO + HEAD smoke + health JSON

## Smoke live (2026-08-21T14:41Z)

| Check | Resultado |
|-------|-----------|
| Health | `ok:true` · `postgres:true` · `panicMode:false` |
| Rutas PWA (HEAD) | `/` escritorio institucional registro acceso piloto gestión participar propuestas modelos consola contratos ayuda suministros → **200** |
| CSV Trust Pack | `/docs/sample-ingest-3-hitos.csv` → **200** |
| Operador B pack | **0/9** screenshots · `g20Gate: NO-GO (PENDING evidence)` |

## Veredictos

| ID | Ventana | Veredicto | Notas |
|----|---------|-----------|-------|
| G1–G4, G7–G19 | Nav/UX/apps | **GO** (código + smoke HTTP) | Deployed; E2E humano parcial |
| G5/G6 | Registro/Login | **GO-CONDICIONADO** | Form live; E2E = pasos 1–2 de B |
| G14/G18/G19 | Hub/empty/mobile | **GO** (código + live) | Hub corto; sin npm público; dock OS |
| **G20** | Trust Pack B | **NO-GO** | Falta humano: checklist `prueba-real-2` |

## Gap Board (≤12)

| ID | Sev | Gap | Next |
|----|-----|-----|------|
| **G20** | P0 | Sin PASS Operador B | Usuario completa pasos 1–9 + PNGs |
| G5/G6 | P1 | E2E auth | Cubierto por B pasos 1–2 |
| Dom | P2 | HTTPS fijo | Opcional post-G20 |

## Próximo movimiento

**Solo G20:** ventana privada → http://137.184.66.163/institucional/registro → checklist `01-operador-b-checklist.md` → PNGs en `artifacts/` → `npm run verify:operador-b`.
