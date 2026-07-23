# Prueba real — Trust Pilot Fiscal (EGS)

**Paso 1 del mapa a producción.**  
Objetivo: un Operador B completa el flujo sin el fundador. Tiempo: 2–3 h.

## Roles

| Rol | Quién | Qué hace |
|-----|-------|----------|
| **A** | Técnico | Levanta entorno, no guía a B durante la corrida |
| **B** | Operador | Ejecuta UI de punta a punta |

## A — Preparación (~15 min)

```bash
npx prisma migrate deploy
npm run api:public    # :3001
npm run dev           # :3000
curl -s http://127.0.0.1:3001/api/ops/health
# ok:true · postgres:true · panicMode:false
```

Ventana privada para B. Carpeta Trust Pack:

`docs/commercial/case-studies/prueba-real-1/`

## B — Corrida (sin terminal)

| # | URL / pantalla | Acción | PASS |
|---|----------------|--------|------|
| 1 | `/institucional/registro` | Registra institución + password | Entra o va a login |
| 2 | Cerrar sesión → `/institucional/acceso` | Vuelve a entrar | Sesión OK |
| 3 | `/institucional/piloto` | Perfil / provision tenant | Hay `slug` |
| 4 | Wizard | Elige **EGS** | Modelo OK |
| 5 | Wizard | Onboard + ratificar baseline | `ingest_ready` |
| 6 | Wizard | Carga ≥3 hitos con evidencia | `accepted > 0` |
| 7 | Reconcile | Mira centinela | OK **o** FREEZE visible |
| 8 | Q-close | Publicar | `published` + Δ |
| 9 | Consola EGS / gestión | Datos de **ese** tenant | No solo demo genérica |

Si B se atasca: anotar el paso; A solo desbloquea con CLI **después** y se marca FAIL parcial.

## Trust Pack (obligatorio)

1. Screenshot registro/login  
2. Onboarding / slug  
3. Resultado ingest  
4. Health o ministry (Δ / FREEZE)  
5. `05-informe.md` — tiempo, fallos, ¿B solo? PASS/FAIL  

## Veredicto

| PASS | FAIL |
|------|------|
| B hace 1→9 sin A | A hace >2 pasos por B |
| Auth + sesión server | Solo localStorage roto |
| Baseline → ingest → Q-close | Solo scripts CLI |
| Trust Pack completo | “Funcionó” sin evidencia |

## Desbloqueo CLI (solo A, post-corrida)

```bash
npm run pilot:onboard -- <slug>
npm run pilot:baseline-ratify -- <slug>
npm run pilot:ingest-demo -- <slug>
npm run pilot:q-close -- <slug> --publish
```
