# Model Manifest v1 — contrato de modelo AGIGOV

**Estado:** borrador operativo · **Versión:** `1.0.0` · **Fecha:** 2026-08-20  
**Código tipado:** `src/citizen/platform/modelManifest.ts`  
**Catálogo interno hoy:** `src/citizen/platform/agigovModels.ts` · UI `/modelos`

---

## 1. Qué es un modelo

Un **modelo** es una **app del OS** que corre sobre el kernel AGIGOV (ledger, IAP, Centinela, billing).  
No es un plugin suelto ni un scrape de datos del Estado.

| Puede | No puede |
|-------|----------|
| Declarar audiencia, pricing y evidencia | Bypass multi-sig / FREEZE |
| Facturar solo vía rail AGIGOV | Vender PII o “marketplace de datos” |
| Publicar UI bajo `/modelos/:id` | Exigir claves privadas del kernel |
| Recibir rev-share si hay métrica certificada | Cobrar si Δ / hito / uso = 0 |

---

## 2. Manifest mínimo (`model.manifest.json`)

```json
{
  "manifestVersion": "1.0.0",
  "id": "egs",
  "name": "Efficiency Gain Share",
  "shortName": "EGS",
  "publisherId": "did:agigov:publisher:armada",
  "audience": "gubernamental",
  "status": "beta",
  "tagline": "Ahorro con evidencia",
  "problem": "…",
  "purpose": "…",
  "productPath": "/modelos/egs",
  "consolePath": "/modelos/egs/consola",
  "billing": {
    "mechanism": "egs-delta",
    "payer": "tenant",
    "metric": "delta_certified",
    "unit": "currency",
    "protocolShareOfFee": 0.30,
    "builderShareOfFee": 0.65,
    "reserveShareOfFee": 0.05
  },
  "runtime": {
    "requires": ["ledger", "centinela", "multisig-baseline"],
    "agents": ["centinela", "logistico", "soberano", "comunicador"],
    "hooks": ["onBaselineRatified", "onQuarterClosePublished"]
  },
  "evidence": {
    "required": ["baselineHash", "quarterCloseHash"],
    "publicApi": ["/api/public/dashboard"]
  },
  "license": "AGIGOV-Model-1.0",
  "repo": "https://github.com/org/model-egs"
}
```

### Campos obligatorios

| Campo | Tipo | Regla |
|-------|------|--------|
| `manifestVersion` | `"1.0.0"` | Solo v1 aceptada en alpha |
| `id` | slug `^[a-z0-9-]{2,40}$` | Único en el store |
| `publisherId` | DID o `github:org/user` | Quién cobra el rev-share |
| `audience` | `gubernamental` \| `empresarial` \| `ciudadano` | Una primaria |
| `status` | `roadmap` \| `beta` \| `disponible` | `disponible` solo tras gate |
| `billing.mechanism` | ver §3 | Debe mapear a catálogo P0 |
| `billing.*.ShareOfFee` | 0–1 | Suman **1.0** (±0.001) |
| `runtime.requires` | string[] | Subconjunto del kernel |
| `evidence.required` | string[] | Sin esto → no billable |

---

## 3. Mecanismos de cobro (hooks al billing P0)

| `mechanism` | Unidad | Cuándo factura | Código / catálogo |
|-------------|--------|----------------|-------------------|
| `egs-delta` | `delta_certified` | Q-Close **PUBLISHED** y Δ > 0 | `egs-delta` · `EGS_SPLIT` |
| `saas-license` | `license-year` | Activación tenant | `saas-license` |
| `iaau-milestone` | `milestone-validated` | Fin de mes si plan ≠ free | `iaau-milestone` |
| `iaau-api` | `api-call` | Fin de mes | `iaau-api` |
| `b2b-evidence` | `evidence-accepted` | Por evidencia | `b2b-evidence` |
| `none` | — | Nunca (ciudadano / gratis) | — |

**Regla de oro:** si la métrica no está en ledger con hash → **fee = 0**.  
**Prohibido:** `data-sale`, cobro por acceso a registros personales, fee sin acta.

### Reparto del fee (default v1)

Sobre el **fee del protocolo** (ej. 10% del Δ en EGS), no sobre el presupuesto bruto:

| Parte | Default | Rol |
|-------|---------|-----|
| Builder (`publisherId`) | **65%** | Autor del modelo |
| AGIGOV kernel | **30%** | Ledger, Centinela, payout, soporte |
| Reserva dispute | **5%** | Conciliador / FREEZE comercial |

Primera fase **partner alpha**: payout **manual** con acta; store automático = Fase 3.

---

## 4. Kernel vs modelo (límites)

| Capa | Dueño | Abierto a builders |
|------|-------|--------------------|
| Ledger, IAP, FREEZE, multi-sig, claves | AGIGOV | **No** (solo APIs firmadas) |
| Billing rail + freeze factura | AGIGOV | Declarar `mechanism`; no reinventar cobro |
| UI ficha + consola del modelo | Builder | Sí |
| Handlers de dominio del modelo | Builder | Sí, vía envelope IAP verificado |
| Agentes institucionales core | AGIGOV | Invocar roles; no forkear Centinela en prod |

---

## 5. Gate de publicación (alpha → store)

| Gate | Quién | Evidencia |
|------|-------|-----------|
| **G-A** Manifest válido | CI | Schema + shares = 1 |
| **G-B** Sandbox smoke | Builder | Tenant demo, 0 PII en API pública |
| **G-C** Trust review | Centinela + humano | FREEZE drill + hashes |
| **G-D** Partner alpha | Comercial | Acuerdo rev-share firmado |
| **G-E** `disponible` | Producto | Operador B completa flujo sin coach |

Sin **G-D**, el modelo puede vivir en `roadmap`/`beta` interno; **no** entra al store comunitario.

---

## 6. Cómo entrega un builder (checklist)

1. Fork / repo del modelo + `model.manifest.json`  
2. UI: ficha (`productPath`) y, si aplica, consola (`consolePath`)  
3. Emitir evidencia al ledger solo por APIs públicas / IAP firmado  
4. Declarar `billing.mechanism` del catálogo P0  
5. PR o entrega partner → gates G-A…G-D  
6. Payout: `publisherId` en el meter del Q-Close / invoice  

Plantilla de ejemplo: sección §2 (EGS). Catálogo humano: [MODELOS-SERVICIOS.md](./MODELOS-SERVICIOS.md).

---

## 7. Fuera de alcance v1

- Marketplace de datasets / venta de datos ciudadanos  
- Tokens especulativos ligados al voto  
- Modelos que requieran bypass de Centinela  
- Payout automático multi-país (Fase 3+)  

---

## 8. Próximo paso de implementación

1. ~~Validar este manifest contra EGS (migración declarativa).~~ → `EGS_MODEL_MANIFEST` + registry  
2. ~~Añadir `publisherId` al metering / Q-Close (rev-share).~~ → `computeEgsFeeInvoice` + `evidenceBundle.egsFeeShare`  
3. Partner alpha (2–3 builders) antes de store en `/modelos`.  
4. Payout automático multi-país (Fase 3+).  

**Referencias:** [billing-p0-catalog.md](../commercial/billing-p0-catalog.md) · [POLITICA-PARTICIPACION.md](./POLITICA-PARTICIPACION.md) · [CONTRIBUCION.md](./CONTRIBUCION.md)
