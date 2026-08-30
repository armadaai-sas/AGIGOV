# Sovereign System Map — sketch (Fase 1A)

**Gate:** Fase 0 culminada (pipelines DATA Trust + EGS en producción).  
**Alcance v0:** read-only — el Estado **ve** interconexiones; no edita flujos.

---

## 1. Propósito

Una pantalla donde el operador institucional responde:

> “¿Qué modelos, agentes y fuentes están conectados en mi sistema, y en qué estado están?”

Distinto de n8n:

| n8n | Sovereign System Map |
|-----|----------------------|
| Automatización genérica | **Observabilidad soberana** |
| Nodos = integraciones HTTP | Nodos = **modelos + agentes + checkpoints** |
| Usuario construye flujos | v0: **solo lectura**; compositor en Fase 4 |
| Sin ledger | Cada arista puede enlazar `evidenceBundle` / hash |

---

## 2. API sketch

### `GET /api/public/system/graph`

Agrega pipelines existentes — **no inventa aristas**.

```json
{
  "updatedAt": "2026-08-30T…",
  "nodes": [
    { "id": "model:data-trust", "kind": "model", "label": "DATA Trust", "status": "active" },
    { "id": "model:egs", "kind": "model", "label": "EGS", "status": "complete" },
    { "id": "agent:centinela", "kind": "agent", "label": "Centinela", "status": "complete" },
    { "id": "agent:comunicador", "kind": "agent", "label": "Comunicador", "status": "active" },
    { "id": "source:pilot-read-mppi", "kind": "source", "label": "Piloto MPPI", "status": "connected" },
    { "id": "checkpoint:proc-qclose-…", "kind": "checkpoint", "label": "Q-close Q2", "status": "published" }
  ],
  "edges": [
    { "from": "source:pilot-read-mppi", "to": "model:egs", "kind": "connect" },
    { "from": "model:egs", "to": "agent:centinela", "kind": "handoff", "stage": "reconcile" },
    { "from": "agent:centinela", "to": "agent:comunicador", "kind": "handoff", "stage": "publish" },
    { "from": "agent:comunicador", "to": "checkpoint:proc-qclose-…", "kind": "evidence" }
  ],
  "disclaimer": "Aristas derivadas de pipeline API; IAP bus no enrutado en v0."
}
```

**Fuentes de verdad:**

- `GET /api/public/models/data-trust/pipeline`
- `GET /api/public/models/egs/pipeline`
- `processCheckpoint` (Postgres) para nodos checkpoint
- `DidRegistry` / agent roles en `AGENTS.md`

---

## 3. UI (Fase 1A)

- Ruta propuesta: `/escritorio/mapa` o pestaña en hub Estado
- Librería: React Flow o Cytoscape (read-only, pan/zoom)
- Color nodo: `complete` verde · `active` azul · `blocked` gris · `freeze` rojo
- Click nodo → panel lateral: último `liveLabel`, link a consola del modelo
- Sin drag para conectar en v0

---

## 4. Fases posteriores

| Fase | Capacidad |
|------|-----------|
| **1A** (post Fase 0) | Grafo read-only |
| **2** | + nodos Evidencia / IaaU al tener pipeline |
| **3** | + IAP wired → aristas MQTT en tiempo real |
| **4** | Compositor: diseñar flujos; multi-sig antes de activar |

---

## 5. Evidencia PASS

```bash
curl -s http://137.184.66.163/api/public/system/graph | jq '.nodes | length'
# ≥ 6 nodos con DATA Trust + EGS seed
```

Screenshot Operador B: grafo MPPI → EGS → Centinela → Comunicador → consola ciudadana.

---

## 6. Referencias

- [PLAN-MAESTRO-SISTEMA.md](../PLAN-MAESTRO-SISTEMA.md) — Fase 1A
- [EGS-PIPELINE.md](./EGS-PIPELINE.md)
- [DATA-TRUST-PIPELINE.md](./DATA-TRUST-PIPELINE.md)
- `AGENTS.md` — roles enjambre
