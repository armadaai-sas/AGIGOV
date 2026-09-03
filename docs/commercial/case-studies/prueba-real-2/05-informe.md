# Informe Operador B — prueba-real-2 (UI)

| field | value |
|-------|-------|
| startedAt | 2026-08-21T16:21Z |
| endedAt | 2026-08-21T16:30Z |
| environment | do-prod-light · http://137.184.66.163 |
| actor | Agente IA automatizado (browser) — no humano |
| B solo | no (agent) |
| verdict | **BLOCKED** |

## Pasos

| # | Resultado |
|---|-----------|
| 1 Registro → escritorio | UI llega a `/escritorio` · captura `artifacts/01-registro.png` |
| 1b Sesión | **FAIL** — topbar sigue «Iniciar sesión»; LS/cookie vacíos tras refresh |
| 2–9 | No ejecutados (bloqueados por sesión) |

## Causa raíz (evidencia)

`NODE_ENV=production` forzaba cookie `Secure` en HTTP IP → browser descarta Set-Cookie → `refreshInstitutionSessionFromServer()` 401 → limpia LS.

## Fix en código (pendiente deploy)

- [`src/server/session-cookie.ts`](../../../src/server/session-cookie.ts): Secure solo con HTTPS / `AGIGOV_COOKIE_SECURE=1`
- [`src/citizen/institutional/institutionAuth.ts`](../../../src/citizen/institutional/institutionAuth.ts): persistir `sessionToken` Bearer fallback

## G20

`g20Gate` permanece **NO-GO** hasta: deploy del fix + corrida UI completa + verdict PASS humano (o re-score post-deploy).
