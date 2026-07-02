# Protocolo de pánico — A.R.M.A.D.A.

Runbook operativo: **FREEZE → ALERT → ROTATE → PRESERVE → COMMUNICATE → RECOVER**

## Disparadores

- Compromiso de clave DID confirmado
- Anomalía masiva en votos o integridad centinela
- Alerta honeypot (`data/honeypot-alerts.jsonl`)
- Intrusión confirmada en perimetro

## 1. FREEZE

```bash
export PANIC_MODE=true
# Reiniciar workers y API con PANIC_MODE activo
```

Efectos:
- IAP bloquea intents mutables (`MUTABLE_INTENTS`)
- Ledger rechaza escrituras (`assertLedgerWritable`)
- Escrituras `status=frozen` siguen permitidas
- Centinela congela procesos bajo `allocate-resources` en pánico

Verificación:

```bash
npm run panic:drill
```

## 2. ALERT

- Revisar `/api/ops/health` — `panicMode: true`
- Logs centinela + audit MQTT `armada/v1/core/audit/*`
- Alertas honeypot en `data/honeypot-alerts.jsonl`

## 3. ROTATE

```bash
# Revocar DID comprometido en registry
# Regenerar: npm run bus:seed (solo entorno controlado)
# Actualizar claves en .env / volúmenes agent-data
```

Código: `DidRegistry.revoke()` en `src/bus/did-registry.ts`

## 4. PRESERVE

Snapshot forense **antes** de recover:

```bash
./infra/backup/backup-edge.sh
docker compose -f infra/docker-compose.prod.yml logs > /tmp/armada-incident-logs.txt
```

## 5. COMMUNICATE

Agente comunicador publica aviso ciudadano genérico (sin detalles operativos).
Dashboard puede mostrar estado degradado vía checkpoint `frozen`.

## 6. RECOVER

Checklist human-in-the-loop:

- [ ] Causa raíz identificada
- [ ] DIDs rotados y verificados
- [ ] Snapshot forense guardado
- [ ] Operador senior aprueba des-freeze

```bash
export PANIC_MODE=false
export FREEZE_APPROVED=true
# Enviar intent unfreeze-request a centinela para procesos congelados
```

Centinela handler: `unfreeze-request` con `FREEZE_APPROVED=true` → `frozen → received`

## Simulación

```bash
npm run panic:drill
```

## Validaciones diferidas (cierre nacional)

- Drill en stack prod real con WireGuard
- Rotación DID sin downtime en multi-nodo
- Comunicador publicando aviso durante incidente simulado
