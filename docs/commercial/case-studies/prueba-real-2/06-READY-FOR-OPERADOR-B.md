# Operador B — listo para corrida (2026-08-21)

**Env:** `do-prod-light` · **SHA:** `f3085aa` (+ CI fix pendiente de push)  
**UI canónica:** http://137.184.66.163/  
**Checklist:** [01-operador-b-checklist.md](./01-operador-b-checklist.md)

## Preparación A (agente) — evidencia

| Check | Resultado | UTC |
|-------|-----------|-----|
| Deploy Action | **success** `32489563468` | 2026-08-21T14:00Z |
| `GET /api/ops/health` | `ok:true`, `postgres:true`, `panicMode:false` | 2026-08-21T14:00:48Z |
| Smoke rutas PWA | `/` `/institucional` `/escritorio` `/modelos` `/suministros` → **200** | 2026-08-21T14:00Z |
| Bundle G14/G18/G19 | `Concierge institucional` · dock Escritorio · sin `Modo demo: npm run` | 2026-08-21T14:00Z |
| UI `/institucional/registro` | Formulario visible: entidad, región, correo, CTA «Crear cuenta e ir al escritorio» | 2026-08-21T14:05Z |

**No es PASS G20.** Falta humano B pasos 1–9 + screenshots + `05-informe.md`.

## Instrucciones B (2–3 h, sin fundador)

1. Ventana privada → http://137.184.66.163/institucional/registro  
2. Seguir tabla en `01-operador-b-checklist.md`  
3. Dejar PNGs en `artifacts/` y completar `05-informe.md`  
4. HTTPS túnel: usar IP HTTP si el trycloudflare 404; no bloquear por túnel

## Veredicto pack (hoy)

| Gate | Estado |
|------|--------|
| Prep A (health + UI form) | **READY** |
| Operador B Trust Pack | **PENDING** (humano) |
| G20 producción usable | **NO-GO** hasta PASS B |
