# Scripts Armada VZLA

Todos los comandos de setup viven en **`scripts/`**. No uses `.sh` en la raíz del repo.

## Comandos npm → implementación

| Comando | Archivo | Qué hace |
|---------|---------|----------|
| `npm run setup:check` | `check-prerequisites.sh` | Diagnóstico Bloques A + B |
| `npm run setup:local` | `setup-local-mac.sh` | `infra:up:dev` + migrate + seed |
| `npm run block-b:setup` | `block-b-setup.sh` | setup-local + block-b-verify |
| `npm run block-b:verify` | `block-b-verify.sh` | Contenedores, `.env`, DID; `--api` curl |
| `npm run block-b:pilot` | `block-b-pilot.sh` | agents:flow + pilot:init/ratify/verify |
| `npm run github:push` | `github-push.sh` | Push a `origin/main` |
| `npm run api:public` | `tsx src/server/public-api.ts` | API en `:3001` |
| `npm run agents:flow` | `tsx src/agents/run-flow-demo.ts` | Demo flujo agentes |
| `npm run pilot:*` | `tsx scripts/pilot-multisig-run.ts` | Piloto multi-sig |

## Infra Docker (no hay `docker-compose.yml` en raíz)

| Entorno | Archivo |
|---------|---------|
| Dev local (Mac) | `infra/docker-compose.dev.yml` |
| Dev local (Mac viejo, sin Docker) | `npm run setup:local:native` (Homebrew) |
| Producción | `infra/docker-compose.prod.yml` |
| Pre-prod ligero (~1 GB RAM) | `infra/docker-compose.prod.light.yml` |
| Edge | `infra/docker-compose.edge.yml` |
| LoRaWAN | `infra/docker-compose.lorawan.yml` |

## Clone desactualizado o Codespaces

Si ves scripts en la raíz que dicen *"ERROR: No API service"* o buscan `docker-compose.yml` en raíz:

```bash
git fetch origin
git log -1 --oneline   # debe incluir a668b3b o posterior
git pull origin main
rm -f setup-local-mac.sh block-b-*.sh api-public.sh agents-flow.sh pilot-*.sh check-prerequisites.sh
npm run setup:check
```

Guía completa: [docs/SETUP-GUIA-MAC.md](../docs/SETUP-GUIA-MAC.md)
