# Proceso 00 — Ley de evidencia (transversal)

Aplica a **todos** los procesos AGIGOV: diseño, dev, deploy, modelos, ventas, piloto.

## Regla

**Sin evidencia = PENDING o BLOCKED.** Nunca marcar PASS por opinión del LLM ni por demo local sin desplegar.

## Bundle mínimo por claim

| Campo | Requerido |
|-------|-----------|
| `claim` | Qué se afirma (una frase) |
| `environment` | `local` \| `do-prod-light` \| `staging` + host |
| `commandOrUrl` | Comando exacto o URL probada |
| `timestampUtc` | ISO 8601 UTC |
| `snippetOrPath` | JSON/log/screenshot/ruta bajo `docs/commercial/case-studies/` |
| `verdict` | `PASS` \| `FAIL` \| `BLOCKED` + razón |

## Superficies canónicas

| Superficie | URL |
|------------|-----|
| PWA | `http://127.0.0.1/` |
| Health público | `http://127.0.0.1/api/public/health` |
| Health ops | `http://127.0.0.1/api/ops/health` |
| Dashboard demo | `http://127.0.0.1/api/public/dashboard` |

Local (`localhost:3010`) sirve para **desarrollo UI**, no para declarar “producción mundial”.

## Prohibido

- PASS reutilizado sin re-run tras cambio de código o deploy
- Screenshots inventados o health JSON copiado de otra fecha
- Llamar “prod” a un PC Windows sin stack desplegado

## Comandos de prueba rápida

```bash
curl -s http://127.0.0.1/api/public/health
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/
npm run doctor
```

## Handoff entre equipos / agentes

Usar **SignedAgentEnvelope** v1 + `evidenceBundle` (ver `src/protocol/` y skill `inter-agent-protocol`).
