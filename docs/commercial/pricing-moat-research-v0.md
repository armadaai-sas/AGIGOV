# Investigación de precios — Moat AGIGOV (v0)

**Fecha:** 2026-07-25  
**Agentes:** cso-monetizacion · comercial-agigov · innovador  
**Skills:** agigov-strategic-analysis · sovereign-economics-monetization · agigov-cso-deliverable  
**Canvas:** `pricing-moat-agigov` (IDE)  
**Base:** [INVESTIGACION-NEGOCIO-GANAR-GANAR.md](../AGIGOV/INVESTIGACION-NEGOCIO-GANAR-GANAR.md) §8–9 · [cuadro monetización](../innovation/2026-07-03-cuadro-modelos-monetizacion-agigov.md)

**Estado:** investigación estratégica — **no cotizar** sin ratificación soberano + humano.

---

## Tesis

Ofrecer **valor humano y gubernamental muy alto** (presupuesto trazable, menos pago fantasma, legitimidad ciudadana) a un **costo asimétrico**: entrada gratis, SaaS lejos bajo consultoría/ERP, uso con tope en carta, success fee solo si hay Δ, add-ons (IA, legaltech, EGS, API B2B) de margen alto.

> Moat ≠ precio depredador. Moat = mismo (o mejor) resultado fiscal/legitimidad a fracción del costo de alternativas, con **prueba en ledger**.

---

## 1. Valor defendible (piso)

| Dimensión | Valor al Estado / ciudadano | Cómo lo prueba AGIGOV |
|-----------|----------------------------|------------------------|
| Fiscal | Δ = baseline − gasto verificado | Q-close + ledger |
| Integridad | Menos pagos no demostrables | Escrow + FREEZE + multi-sig |
| Legitimidad | Ciudadano ve gestión T0 | PWA publicada |
| Continuidad | Opera con conectividad precaria | Edge / offline-first |
| Interop | Multi-jurisdicción sandbox | SBX peering |
| Endurecimiento | Roadmap PQC | Add-on honesto (no claim falso hoy) |

El precio AGIGOV debe ser **siempre una fracción** del beneficio neto verificable (cláusula ganar-ganar).

---

## 2. Benchmark de alternativas (posición)

| Alternativa | Orden de magnitud año 1 | Qué falta vs AGIGOV |
|-------------|-------------------------|---------------------|
| Big4 / PMO gov | **NO VERIFICADO** — ver [evidence-outsourcing-spend.md](./evidence-outsourcing-spend.md) | Ledger vivo, FREEZE, Δ certificado |
| ERP / SaaS legacy | **NO VERIFICADO** hasta RFQ | Evidencia multi-sig, escrow programático |
| ONG transparencia | Grant / producto débil (cualitativo) | Ops 24/7, escrow, SLA |
| Crypto-gov | Token / opaco (cualitativo) | Carta soberana, HITL, anti-hype |
| **AGIGOV entrada** | Free → rangos M1/M4 (propuesta interna) | Protocolo modular + prueba |

**Hechos externos corroborados:** outsourcing OCDE ~**9.3–9.4% PIB**; procurement ~**12.8–12.9% PIB**; consultores gobierno central UK ~**£1.36bn** (2022–23, HMT/NAO). Fuentes: [evidence-outsourcing-spend.md](./evidence-outsourcing-spend.md).

---

## 3. Arquitectura de cobro (acordada)

```
Free (Trust Pilot) → SaaS base → Uso (IaaU) → Add-ons (EGS, IA, Legaltech, API, PQC…)
```

| Capa | Rol | Indicativo |
|------|-----|------------|
| **Free** | Destruir fricción; ritual del Δ visible | $0 · 30–90 días · 1 tenant · 1 módulo |
| **SaaS M4-S** | Ancla recurrente municipal | ~$18 000 / año |
| **SaaS M4-R/N** | Estado / región | $60 000 – $800 000 / año |
| **M1 Sandbox pago** | Si quieren concierge humano | $25 000 – $75 000 / 90 días |
| **IaaU** | Escala con actividad | $0.002–$0.05 / micro-unidad; hito $0.50–$5 |
| **EGS** | Add-on alineado | **10% Δ**; **$0 si Δ ≤ 0** |
| **IA Aider** | Add-on seats/tokens | Solo anclado a ledger |
| **Legaltech** | Add-on dictamen / año | Vs Carta + whitepaper |
| **Evidencia API** | B2B (paga contratista) | $0.10–$1 / evidencia |
| **Cert integrador** | Red partners | $2 500 – $8 000 / año |

Detalle de libro: INVESTIGACION §8.

---

## 4. Por qué “nadie puede contra nosotros”

### Asimetría de valor
- Evidencia > opinión (centinela + ledger + multi-sig).
- FREEZE human-in-the-loop (no “IA decide el gasto”).
- Ciudadano T0 vs opacidad ERP.
- Offline / Always-Free capable (mercados que SAP abandona).

### Asimetría de costo
- Freemium → CAC de venta ministerial más bajo.
- Infra demo ~USD 6–50/mes vs $250k+ consultora.
- Un protocolo, N módulos (3 líneas de cotización + add-ons).
- Segundo pagador: **empresas** (API/cert) si el funcionario no quiere ahorrar.
- EGS: competidor sin Δ certificado no puede copiar el pitch de contraloría.

### Lo que NO hacemos
- Carrera a $0 eterna (quema el protocolo).
- Vender “seguridad cuántica ya” sin piloto PQC.
- IA que inventa normas o decisiones opacas.
- Fee oculto sin tope en carta.

---

## 5. Reglas de anclaje (obligatorias)

1. `Fee_AGIGOV ≤ Beneficio_neto_verificable` (Δ u KPI carta).  
2. EGS: `max(0, Δ × tasa)`; default tasa **10%**.  
3. IaaU: techo anual en carta (`% TI` o USD fijo, el menor).  
4. Cuentas frías: **Free antes** de M1/M4.  
5. Add-ons IA/Legal: rechazo comercial si no hay ancla ledger / dictamen.

---

## 6. Mix de ingreso

| Fase | Fijo | IaaU | EGS | B2B/add-ons |
|------|------|------|-----|-------------|
| Año 0–1 | ~70% | ~20% | ~0% | ~10% |
| Año 2+ | ~20% | ~25% | ~45% | ~10% |

Primero legitimidad y recurrencia; después EGS domina cuando el ritual del Δ es cultura institucional.

---

## 7. Cotización v0 (3 líneas)

| | Free | Pro municipal | Sovereign |
|--|------|---------------|-----------|
| Plataforma | $0 / 90d | ~$18k/año | $60k–$800k/año |
| Módulo sector | demo | +$24–45k | según tier |
| IaaU | cap demo | metering + tope | volumen |
| EGS | off | opcional 10% Δ | opcional |
| IA + Legaltech | limitado | add-on | add-on + seats |

---

## 8. Handoff

| Destino | Acción |
|---------|--------|
| **soberano** | Cláusulas techo fee + EGS fee 0 si Δ≤0 |
| **comercial-agigov** | One-pager Free→Pro→Sovereign + 4 add-ons |
| **centinela** | Metering ↔ ledger = 0 antes de facturar IaaU |
| **comunicador** | Copy ciudadano: “cobramos del ahorro / del uso, no de la opacidad” |

---

## 9. Kill criteria

- Cotizar EGS sin baseline multi-sig → **no**.  
- Facturar IaaU con discrepancia metering/ledger → **FREEZE factura**.  
- Prometer PQC productivo sin piloto → **no**.  
- Free eterno sin conversión path → quemar margen; Free tiene fecha.

---

*Precios en USD equivalente; facturación local según carta. Ajuste IPC / FX soberano anual.*
