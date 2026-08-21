# BLOCKED — G20 Operador B (2026-08-21T15:00Z)

## Estado del goal «pulido G1–G20 / listo producción»

| Parte | Estado | Evidencia |
|-------|--------|-----------|
| G1–G19 UX/nav/smoke | **GO** (código + live) | HEAD 200, health ok, SHA `5674774` |
| G20 Trust Pack | **NO-GO / BLOCKED** | `present: 0` PNG en `artifacts/` |

## Por qué no avanza

La ley de evidencia exige **Operador B humano** (pasos 1–9 + screenshots + informe).  
Prep A, hints UI, CSV, verificador y droplet están listos. **No hay capturas.**

## Qué desbloquea G20

1. Ventana privada → http://137.184.66.163/institucional/registro  
2. Completar checklist `01-operador-b-checklist.md`  
3. Dejar `01-registro.png` … `09-tenant.png` en `artifacts/`  
4. Rellenar `05-informe.md` → `npm run verify:operador-b` exit 0  

Hasta entonces el goal permanece activo y **no** se marca complete.
