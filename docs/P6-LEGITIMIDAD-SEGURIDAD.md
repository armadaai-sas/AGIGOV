# P6 — Legitimidad y seguridad continua

**Fecha:** 2026-08-05 · Confianza sostenida (PLAN).

## Hecho

| Ítem | Evidencia |
|------|-----------|
| PQC nodos críticos | Inventario + `assessPqcReadiness` · **sin claim híbrido productivo** |
| Drills pánico trimestrales | `npm run panic:quarterly` → `data/panic-drill-log.jsonl` |
| Informes comunicador | `GET /api/public/comunicador/report` → PWA `/institucional` |
| Comparativa Política 2.0 | `PolicyComparator` + `POLITICA-2.0.md` |

## Comandos

```bash
npm run pqc:inventory
npm run panic:drill
npm run panic:quarterly              # drill + log
npm run panic:quarterly -- --status-only   # exit 2 si >90 días
npm run p6:verify
```

### Cron sugerido (Droplet)

```cron
# 1er día de cada trimestre 04:00 UTC
0 4 1 1,4,7,10 * cd /opt/agigov && npm run panic:quarterly >> /var/log/agigov-panic-quarterly.log 2>&1
```

## Honestidad PQC

| Modo `AGIGOV_PQC_MODE` | Significado |
|------------------------|-------------|
| `off` | Solo clásico |
| `inventory` (default) | Superficie documentada — **default P6** |
| `hybrid-pilot` | Declarativo; readiness `ok=false` hasta IAP v2 real |

No vender “seguridad cuántica ya”. Doc: `docs/PQC-GUARDIAN-CUANTICO.md`.

## Límites post-P6

- ML-DSA/ML-KEM en envelopes = Fase B territorial  
- Drills con WireGuard prod = P2 residual  
- Informes comunicador multi-idioma = i18n continuo  
