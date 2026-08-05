# P9 — Release GO pack (cierre roadmap código)

**Objetivo:** Empaquetar el veredicto **GO-CONDICIONADO** tras P0–P8: preflight Operador B (rutas + scripts + Trust Pack carpeta) y dictamen reproducible.

## Criterio de cierre (código)

| Check | Comando | Estado |
|-------|---------|--------|
| Preflight + dictamen | `npm run p9:go` | **obligatorio** |
| P8 vivo | `npm run p8:verify` | **obligatorio** antes de declarar release |
| P7 suite | `npm run audit:run` + `doctor` | **obligatorio** |

## Qué cubre el CLI (no sustituye humano)

- Scripts de desbloqueo A (`pilot:onboard` … `q-close`)
- Rutas `/institucional/registro|acceso|piloto` en app
- Carpeta Trust Pack `docs/commercial/case-studies/prueba-real-1/`
- Escritura de `00-GO-DICTAMEN.md`

## Qué sigue siendo humano

1. Corrida Operador B según `docs/PILOTO-PRUEBA-REAL.md`
2. Screenshots Trust Pack + informe PASS/FAIL
3. Health de deploy staging/prod-light

## Comandos

```bash
npm run doctor
npm run audit:run
npm run p8:verify
npm run p9:go
```

## Residuales post-GO

Congelados en el dictamen: PQC híbrido, hardware P2, fiat real, Trust Pack B firmado, CI+Postgres estricto.
