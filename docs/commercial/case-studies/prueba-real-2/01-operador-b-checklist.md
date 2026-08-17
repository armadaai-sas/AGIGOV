# Operador B — corrida cloud (prueba-real-2)

**Env:** `do-prod-light`  
**UI HTTP:** http://137.184.66.163/  
**UI HTTPS (efímero):** https://photos-speaking-editing-dicke.trycloudflare.com/  
**Tiempo:** 2–3 h · **sin fundador en la llamada**

Si el túnel 404 / cambia: usar siempre la IP HTTP o pedir a A la `HTTPS_URL` del último deploy Actions.

## A — Preparación (antes de llamar a B)

- [ ] `GET /api/ops/health` → `ok:true`, `postgres:true`, `panicMode:false`
- [ ] Ventana privada / perfil limpio para B
- [ ] Carpeta lista: `docs/commercial/case-studies/prueba-real-2/artifacts/` (B deja PNGs aquí o se los pasa a A)
- [ ] A **no** abre Zoom/guía durante pasos 1–9

## B — Pasos (PASS solo si B solo)

| # | URL | Acción | Evidencia |
|---|-----|--------|-----------|
| 1 | `/institucional/registro` | Alta institución + password | `artifacts/01-registro.png` |
| 2 | `/institucional/acceso` | Logout → login | `artifacts/02-acceso.png` |
| 3 | `/institucional/piloto` | Provision / slug visible | `artifacts/03-piloto-slug.png` |
| 4 | Wizard | Elige **EGS** | `artifacts/04-modelo-egs.png` |
| 5 | Wizard | Onboard + ratificar baseline | `artifacts/05-baseline.png` |
| 6 | Wizard | ≥3 hitos con evidencia | `artifacts/06-ingest.png` |
| 7 | Reconcile / centinela | OK **o** FREEZE legible | `artifacts/07-centinela.png` |
| 8 | Q-close | Publicar → `published` + Δ | `artifacts/08-qclose.png` |
| 9 | Consola EGS / gestión | Datos del **tenant** (no solo demo) | `artifacts/09-tenant.png` |

## Informe B (obligatorio)

Copiar a `05-informe.md` tras la corrida:

- Fecha UTC inicio/fin  
- ¿B solo? sí/no  
- Paso donde se atascó (si aplica)  
- Veredicto: `PASS` \| `FAIL` \| `BLOCKED`  
- Nota HTTPS usado (URL exacta)

## Veredicto pack

| PASS | FAIL / BLOCKED |
|------|----------------|
| Pasos 1–9 + 9 screenshots + informe | A guió >2 pasos · sin screenshots · solo CLI |
