# EGS — One-pager B2G (Gobierno)

**Efficiency Gain Share · AGIGOV · Audiencia: entidades públicas (ministerios, tesorería, contraloría)**

---

## Problema

El Estado ejecuta presupuesto con opacidad: pagos sin hito verificable, sobrecostos detectados tarde y cierres trimestrales manuales propensos a discrepancia. El operador externo cobra fijo aunque no haya ahorro real — desalineación total de incentivos.

## Solución AGIGOV (3 bullets)

- **Q-Close trimestral:** reconcilia baseline firmada vs gasto trazado en ledger y calcula el ahorro **Δ** auditable.
- **Success fee solo sobre Δ:** si no hay ahorro verificable, no hay fee del operador — el Estado paga por eficiencia, no por promesas.
- **Reparto publicado:** reglas configurables (referencia demo **70% ciudadano · 20% operador · 10% protocolo**) con congelamiento centinela ante discrepancia.

## Qué existe hoy vs roadmap

| Hoy (demo verificable) | Roadmap |
|------------------------|---------|
| Código Q-Close, reconcile, API `/api/public/egs/*` | Tesorería nacional conectada en producción |
| Consola `/modelos/egs/consola` con seed piloto | Multi-jurisdicción + actas soberanas promulgadas |
| Centinela FREEZE + human-in-the-loop en discrepancia | Integración contraloría batch certificada |

**Estado catálogo:** `disponible` — aprobado en 3 etapas (`npm run models:audit`).

## Modelo ganar-ganar

| Parte | Gana porque… |
|-------|----------------|
| **Estado** | Paga fee solo si Δ es real; defiende ejecución ante contraloría con hashes y actas. |
| **Operador AGIGOV** | Incentivo alineado: más eficiencia medible = ingreso legítimo, no sobregasto. |
| **Ciudadano** | Ve Δ y reparto en dashboard publicado — transparencia selectiva sin PII. |

## Pricing orientativo (no vinculante)

- **Success fee EGS:** típico **5–15% del Δ neto certificado** (default investigación: **10%**).
- **Licencia sandbox M1:** USD 0 – 2.500 / trimestre (piloto acotado).
- **Licencia regional M4+:** según cuadro CSO — validar con **cso-monetizacion** + **soberano**.

> Demo con seed — no constituye contrato ni acta de tesorería.

## Prueba / demo

- Ficha producto: `/modelos/egs`
- Consola operativa: `/modelos/egs/consola`
- API salud: `GET /api/public/egs/ministry-health`
- Comandos: `npm run db:seed:egs-pilot` · `npm run egs:quarter-close`

## Objeciones (top 5)

| Objeción | Respuesta honesta |
|----------|-------------------|
| «¿Y si inflan el baseline para cobrar Δ?» | Baseline fijada por **acta multi-sig** antes del periodo; centinela congela si hay discrepancia material. |
| «No tenemos personal para otro sistema.» | Piloto acotado a **un ministerio / un rubro**; consola demo ya operativa con seed. |
| «¿Quién audita al auditor?» | Ledger inmutable + hashes publicados; contraloría puede reproducir recuento sin confiar en el operador. |
| «El fee come el ahorro.» | Fee es % del Δ, no del presupuesto total; reparto ciudadano configurable (ej. 70% reinversión). |
| «¿Está en producción nacional?» | **No** — demo verificable hoy; despliegue nacional requiere multi-sig institucional y tesorería. |

## Próximo paso (champion 5 min)

1. Agendar demo consola EGS con datos seed (15 min).
2. Definir **un rubro piloto** y baseline multi-sig acotada.
3. Dictamen CSO + soberano sobre fee % antes de firma.

---

*Generado por **comercial-agigov** · Validación técnica: **modelo-guardian** · 2026-07-04*
