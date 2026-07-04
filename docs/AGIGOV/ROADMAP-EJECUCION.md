# AGIGOV-VEN — Roadmap de ejecución paso a paso

Guía operativa derivada del skill **`state-innovation`** (`docs/innovation/2026-07-02-agigov-mvp-brief.md`).  
Ejecutar **en orden**; no saltar fases sin criterio de cierre.

---

## Leyenda

| Símbolo | Significado |
|---------|-------------|
| ✅ | Completado en entorno local |
| 🔄 | En curso |
| ⏳ | Pendiente |
| 👤 | Requiere acción humana |

---

## BLOQUE A — Fundamentos (Semana 1)

### Paso 1 ✅ — API pública + `/proyectos`

**Qué:** Backend en `:3001` y PWA mostrando proyectos DAO.

**Comandos:**
```bash
npm run db:seed
npm run api:public    # terminal 1
npm run dev           # terminal 2
```

**Verificar:** http://localhost:3000/proyectos → 3 proyectos visibles.

**Criterio cierre:** `curl -s http://127.0.0.1:3001/api/public/projects | jq .summary`

---

### Paso 2 ✅ — Ratificación Carta multi-sig (demo)

**Qué:** Acta `acta-carta-agigov-ven-v01` committed + checkpoint published.

**Comandos:**
```bash
npm run carta:init
npm run carta:ratify
npm run carta:verify
```

**Verificar:**
```bash
curl -s http://127.0.0.1:3001/api/public/carta | jq .
curl -s http://127.0.0.1:3001/api/public/dashboard | jq '.reports[0].summary'
```

**Criterio cierre:** `carta:verify` → `"ok": true` y `"ratified": true` en `/api/public/carta`.

**👤 Producción:** Reemplazar firmas demo por Ed25519 reales (`docs/PILOTO-MULTISIG-CHECKLIST.md` Fase C).

---

### Paso 3 ✅ — Aportes económicos piloto MAR_NORTH_01

**Qué:** POST `/api/public/contributions` → recibo en ledger + actualización proyecto.

**Comandos (prueba):**
```bash
curl -s -X POST http://127.0.0.1:3001/api/public/contributions \
  -H 'Content-Type: application/json' \
  -d '{"projectId":"proj-dao-agua-zulia","amount":250,"territoryCode":"MAR_NORTH_01"}'
```

**UI:** En `/proyectos` → formulario «Aportar» por proyecto (máx. 10.000 VES piloto).

**Criterio cierre:** Recibo `receiptId` + barra de progreso actualizada tras reload.

---

## BLOQUE B — Participación (Semana 2)

### Paso 4 ✅ — `/participar` v1: propuestas ciudadanas

**Qué:** Formulario → proceso ledger `received` → dictamen soberano.

**Tareas:**
1. API `POST /api/public/proposals` (metadatos sin PII)
2. UI formulario en `/participar`
3. Agente soberano: `citizenSummary` automático

**Comandos dev:**
```bash
npm run agents:flow
```

**Criterio cierre:** 1 propuesta ciudadana visible en `/propuestas`.

---

### Paso 5 ✅ — Registro gobierno sandbox AGIGOV-SBX

**Qué:** Segundo nodo jurisdiccional de prueba conectado a la red.

**Documento:** `docs/AGIGOV/ONBOARDING-GOBIERNOS.md`

**Tareas:**
1. Clonar carta → `CARTA-AGIGOV-SBX.md`
2. `GET /api/public/health` handshake entre nodos
3. Acta adhesión multi-sig sandbox

**Comandos:**
```bash
npm run api:public      # terminal A — VEN :3001
npm run api:sandbox     # terminal B — SBX :3002
npm run sbx:init
npm run sbx:ratify
npm run sbx:verify
npm run sbx:handshake
```

**Verificar:**
```bash
curl -s http://127.0.0.1:3001/api/public/gov | jq '.jurisdictions[].iso'
curl -s http://127.0.0.1:3001/api/public/health | jq '.crossHealthOk'
```

**Criterio cierre:** Dos códigos ISO visibles en docs + health cruzado OK.

---

### Paso 6 ✅ — Portal `/desarrolladores`

**Qué:** Página con API docs, IAP, cómo contribuir código.

**Tareas:**
1. ✅ Ruta `/desarrolladores` en PWA
2. ✅ Enlace a `AGENTS.md` y OpenAPI stub (`/api/public/openapi.json`)
3. ✅ Health check público documentado

**Verificar:** http://localhost:3000/desarrolladores

**Criterio cierre:** Dev externo puede integrar `/api/public/*` sin leer todo el repo.

---

## BLOQUE C — Economía DAO (Semana 3)

### Paso 7 🔄 — Pasarela VES real (piloto)

**Qué:** Integrar pago fiat off-chain → registro on-ledger.

**Tareas:**
1. 👤 Acuerdo proveedor pago Venezuela
2. ✅ Webhook stub → `POST /api/public/payments/webhook` (demo)
3. 👤 KYC off-chain para aportes > umbral (dictamen soberano)

**Criterio cierre:** 10 aportes reales VES en piloto MAR_NORTH_01.

---

### Paso 8 👤 — Token gobernanza AGIGOV-VEN (testnet)

**Qué:** Token no transferible para votos DAO (no plutocracia).

**Documento:** `docs/AGIGOV/ECONOMIA-DAO.md`

**Estado:** Documentado en portal `/desarrolladores` — sin despliegue testnet en este entorno.

**👤 Requisito:** Acta soberano CONFORME + asesoría legal antes de mainnet.

**Criterio cierre:** 1 votación DAO en testnet vinculada a proyecto.

---

### Paso 9 ✅ — Ruta `/proyectos/:id` detalle + hitos

**Qué:** Página detalle con historial aportes agregados y hitos logístico.

**Verificar:** http://localhost:3000/proyectos/proj-dao-agua-zulia

**Criterio cierre:** Centinela valida escrow ↔ UI sin discrepancias.

---

## BLOQUE D — Legitimidad y CNE (Semana 4)

### Paso 10 ✅ — Piloto nacional multi-sig

**Qué:** Acta `acta-piloto-nacional-2026` ratificada (distinta de Carta).

**Comandos:**
```bash
npm run pilot:init
npm run pilot:ratify
npm run pilot:verify
```

**UI:** Sección piloto en `/institucional#piloto` + `GET /api/public/pilot`

**Checklist:** `docs/PILOTO-MULTISIG-CHECKLIST.md` Fases A–D.

---

### Paso 11 ✅ — Comparador Política 1.0 vs 2.0 (A8)

**Qué:** Widget en `/institucional#comparador` con métricas lado a lado.

**Métricas sugeridas:**
- % presupuesto visible
- Tiempo publicación gestión
- Aportes ciudadanos trazados
- Incidentes centinela

---

### Paso 12 ✅ — CNE-AGIGOV fase CNE-1

**Qué:** Consulta ciudadana no vinculante en territorio piloto.

**Documento:** `docs/AGIGOV/CNE-TOKENIZADO.md`

**Verificar:** http://localhost:3000/cne · `GET /api/public/cne/consultation`

**Criterio cierre:** Recuento reproducible por auditor externo.

---

## BLOQUE E — Innovación continua (A9–A10)

### Paso 13 ✅ — Centinela ciudadano (A9)

**Qué:** Botón «Reportar irregularidad» → conciliador.

**UI:** `/gestion` · `POST /api/public/reports/irregularity`

**Criterio cierre:** Proceso `received` sin PII + evidenceRef.

---

### Paso 14 ✅ — Loop innovación semanal (A10)

**Qué:** Automation Cursor `/loop 7d` + brief en `docs/innovation/`.

**Comando local:**
```bash
npm run innovation:loop
```

**Prompt sugerido:**
```
Read .cursor/skills/state-innovation/SKILL.md and docs/innovation/latest.md.
Produce ONE innovation brief. Do NOT deploy without human ratification.
```

**Próximo brief:** 2026-07-09

---

## Innovaciones A1–A10 (referencia rápida)

| ID | Innovación | Paso |
|----|------------|------|
| A1 | Carta como producto | 2 ✅ |
| A2 | Proyectos DAO escrow | 1 ✅ |
| A3 | Aportes anti-captura | 3 ✅ |
| A4 | Registro gobiernos | 5 |
| A5 | Portal desarrolladores | 6 ✅ |
| A6 | Nodos `/territorio` | post-S4 |
| A7 | Campañas escrow | post-S4 |
| A8 | Comparador Política 2.0 | 11 ✅ |
| A9 | Centinela ciudadano | 13 ✅ |
| A10 | Loop innovación | 14 ✅ |

---

## Comandos diarios (operador)

```bash
# Terminal 1 — API
npm run api:public

# Terminal 2 — PWA
npm run dev

# Verificación rápida
curl -s http://127.0.0.1:3001/api/ops/health | jq .
npm run carta:verify
npm run pilot:verify
```

---

## Rollback global

Si `ledgerAligned: false` o FREEZE activo:

1. `PANIC_MODE=true` en `.env`
2. Detener aportes y votos
3. Centinela + conciliador revisan
4. No ampliar territorios hasta nueva acta

---

*Actualizado: 2026-07-02 — tras ejecución Pasos 1–3*
