# G6 — Multi-sig en cloud (do-prod-light)

**Estado:** BLOCKED — necesita 3 firmantes humanos / claves reales en Droplet.  
Base: `docs/PILOTO-MULTISIG-CHECKLIST.md`

## Preflight cloud (automatizable)

```bash
curl -sf http://137.184.66.163/api/ops/health   # ok, panicMode:false
# En Droplet (Actions SSH / console):
# npm run pilot:verify
```

## Ceremonia (humano)

| # | Rol DID | Acción |
|---|---------|--------|
| 1 | soberano | firma acta |
| 2 | centinela | firma acta |
| 3 | comunicador | firma acta |

```bash
npm run pilot:init
npm run pilot:ratify
npm run pilot:verify   # multisigVerified
```

## Evidencia requerida para PASS

- Output `pilot:verify` pegado en `docs/commercial/case-studies/prueba-real-2/06-multisig-verify.txt`
- Confirmación de que claves **no** están en git
- `panicMode:false` post-ceremonia

Hasta entonces: **BLOCKED**.
