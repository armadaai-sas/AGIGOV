# AGIGOV-SBX — Jurisdicción sandbox interop

Segundo nodo de prueba de la red **AGIGOV**, conectado a **AGIGOV-VEN** para validar onboarding de gobiernos.

## Identidad

| Campo | Valor |
|-------|-------|
| Código | `AGIGOV-SBX` |
| ISO sandbox | `SBX` |
| Peer | `AGIGOV-VEN` (ISO `VEN`) |
| Nodo | `node-sbx-west-01` |
| Territorio piloto | `SBX_WEST_01` |
| API sandbox | `:3002` (`npm run api:sandbox`) |

## Propósito

1. Probar **handshake** `GET /api/public/health` entre nodos
2. Ratificar **acta de adhesión** multi-sig demo
3. Validar flujo `ONBOARDING-GOBIERNOS.md` antes de un tercer Estado real
4. No sustituye carta ni instituciones venezolanas

## Comandos (Paso 5)

```bash
# Terminal A — nodo VEN (ledger)
npm run api:public

# Terminal B — nodo SBX (espejo health)
npm run api:sandbox

# Terminal C — adhesión + verificación
npm run sbx:init
npm run sbx:ratify
npm run sbx:verify
npm run sbx:handshake
```

## Verificación

```bash
curl -s http://127.0.0.1:3001/api/public/gov | jq .
curl -s http://127.0.0.1:3001/api/public/health | jq '.crossHealthOk, .peer'
curl -s http://127.0.0.1:3002/api/public/health | jq '.node.iso, .peer.iso'
```

**Criterio cierre:** ISO `VEN` + `SBX` visibles en `/api/public/gov` y `crossHealthOk: true` en ambos nodos.

## Red piloto actual

| ISO | Jurisdicción | Rol |
|-----|--------------|-----|
| **VEN** | AGIGOV-VEN | Implementación nacional (ledger principal) |
| **SBX** | AGIGOV-SBX | Sandbox interop / registro gobierno demo |
