# Operador B — listo para corrida (2026-08-21)

**Env:** `do-prod-light` · **SHA live:** `50cc8f7`  
**UI:** http://137.184.66.163/  
**Checklist detallada:** [01-operador-b-checklist.md](./01-operador-b-checklist.md)

## Empieza YA (2–3 h, ventana privada)

1. Abre http://137.184.66.163/institucional/registro  
2. Crea cuenta → captura `artifacts/01-registro.png`  
3. Logout → http://137.184.66.163/institucional/acceso → `02-acceso.png`  
4. http://137.184.66.163/institucional/piloto → Provisionar → captura slug → `03-piloto-slug.png`  
5. Wizard: EGS → `04` · Onboard+ratificar → `05`  
6. Ingest: **Enviar 3 hitos demo** *o* CSV http://137.184.66.163/docs/sample-ingest-3-hitos.csv → `06`  
7. Centinela → `07` · Publicar Q-close → `08` · Consola EGS → `09`  
8. Rellena [05-informe.md](./05-informe.md) · avísame

## Prep A (hecho)

| Check | Resultado |
|-------|-----------|
| Health | `ok:true` · `postgres:true` · `panicMode:false` |
| Deploy | success · CSV `/docs/sample-ingest-3-hitos.csv` = 200 |
| Form registro | Visible live |
| Pack verify | **0/9** PNG → G20 **NO-GO** hasta PASS |

## Veredicto pack

| PASS | FAIL / BLOCKED |
|------|----------------|
| Pasos 1–9 + 9 screenshots + informe | Sin PNG · A guió >2 pasos · solo CLI |

**No es PASS G20** hasta que completes lo de arriba.
