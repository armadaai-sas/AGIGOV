# Informe — Prueba real (actualización P0 · 2026-07-25)

**Operador:** A (API + CLI)  
**Tenant:** `mppi-trust-pilot`  
**Auth smoke:** register+login API OK (`pending_verification`, catálogo VEN)

## Resultados

| Criterio | Resultado |
|----------|-----------|
| Postgres + API | PASS |
| Register/login API | PASS |
| Login UI (form correo+clave) | PASS código — verificar en browser humano |
| Onboarding | PASS · `ingest_ready` · 3/3 firmas |
| Q-close publish | PASS · `PUBLISHED` · `reconcileOk` |
| Trust Pack JSON | Actualizado en esta carpeta |
| Docker prod-light | BLOCKED — Docker no disponible en host |
| git push | Ver resultado de sesión |

**Veredicto:** PASS CONDICIONADO (CLI/API; screenshots UI Operador B pendientes)
