# DATA Trust — Pipeline y wizard Conectar

Proceso **honesto** implementado en P2 demo. Cada modelo tendrá su propio mapa de etapas; DATA Trust es la referencia.

## Flujo operativo (código)

```
Conectar fuente → ingest (celdas demo) → k-anonymity → agrupar sector → hash → catálogo JSON → GET API
```

| Etapa API | UI (ModelProcessTracker) | Implementado |
|-----------|--------------------------|--------------|
| `select` | Modelo | Sí |
| `connect` | Conectar | Sí — wizard |
| `ingest` | Recibiendo | Sí — RAW_DEMO_CELLS |
| `k_anonymity` | Analizando | Sí — `enforceKAnonymity(k=5)` |
| `aggregate` | Tipo de data | Sí — `groupBySector` |
| `audit` | Dictamen | **Blocked** — roadmap Centinela |
| `publish` | Informe | Sí — escribe `data/data-trust-catalog.json` |
| `serve` | Publicado | Sí — `/api/public/data-trust/datasets` |

## API

| Método | Ruta | Uso |
|--------|------|-----|
| GET | `/api/public/models/data-trust/pipeline` | Barra en vivo + etapas |
| POST | `/api/public/models/data-trust/connect` | `{ mode, endpoint? }` |
| POST | `/api/public/models/data-trust/run` | ETL tras connect |
| POST | `/api/public/data-trust/refresh` | Regenerar (requiere connect) |

Modos `connect.mode`:

- `demo_telemetry` — telemetría sintética gestión pública
- `api_endpoint` — URL declarada (sin validación red en demo)
- `institutional` — intención ETL piloto (sin run automático)

## UI

- Consola: `/modelos/data-trust/consola`
- Wizard: `DataTrustConnectWizard.tsx` — visible si `connection === null`
- Tracker: `ModelProcessTracker` ← `GET pipeline`

## Archivos

- `src/data-trust/pipeline.ts` — estado + ETL tracked
- `src/data-trust/aggregation.ts` — catálogo publicado
- `src/citizen/platform/dataTrustPipeline.ts` — mapa etapas → UI

## Próximo modelo

Replicar patrón: `src/<modelo>/pipeline.ts` + `GET /api/public/models/<id>/pipeline` + wizard específico del dominio (EGS: hitos/escrow; Evidencia: certificación API).
