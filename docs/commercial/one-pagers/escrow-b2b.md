# Escrow Institucional — One-pager B2B (Empresa)

**Escrow programático · AGIGOV · Audiencia: contratistas, integradores y proveedores del Estado**

---

## Problema

Las empresas que ejecutan contratos públicos pierden meses en cobrar: pagos adelantados sin control, hitos validados a mano, disputas sin formato común de prueba y capital de trabajo inmovilizado. El ministerio y el proveedor no comparten la misma evidencia — fricción, sobrefacturación percibida y riesgo reputacional.

## Solución AGIGOV (3 bullets)

- **Escrow por hito:** fondos en **LOCKED → VALIDATED → RELEASED** — el pago se libera solo cuando centinela valida evidencia (documental, IoT, auditores).
- **Cadena de custodia publicable:** ministerio, contraloría y proveedor ven el mismo estado de contrato — menos disputas opacas.
- **Multi-sig antes de liberar:** ninguna liberación irreversible sin firmas verificadas — human-in-the-loop ante anomalías (FREEZE centinela).

## Qué existe hoy vs roadmap

| Hoy (demo verificable) | Roadmap |
|------------------------|---------|
| Catálogo `/modelos/escrow-institucional` + consola `/contratos` | Custodia bancaria regulada integrada |
| Detalle contrato `/proyectos/contrato/:id` con hitos demo | Escrow multi-moneda + clearing SWIFT |
| API `GET /api/public/egs/ministry-health` (contratos seed) | Conciliador automático en disputas complejas |
| Flujo centinela + logístico documentado en repo | Integración ERP proveedor certificado |

**Estado catálogo:** `disponible` — aprobado en 3 etapas (`npm run models:audit`).

**Complemento B2B:** modelo **Evidencia API** (`/modelos/evidencia-certificada`) para integradores que envían prueba firmada (IAP) consumible por escrow.

## Modelo ganar-ganar

| Parte | Gana porque… |
|-------|----------------|
| **Empresa contratista** | Cobro al cumplir hito verificable; menos meses de flujo retenido; recibo trazable para auditoría propia. |
| **Estado / ministerio** | No paga adelantado sin entrega; mantiene leverage contractual; contraloría ve el mismo ledger. |
| **Ciudadano** | Ve avance de obra/servicio por contrato publicado — sin PII del proveedor expuesto innecesariamente. |

## Pricing orientativo (no vinculante)

- **Licencia módulo Escrow** (referencia CSO): **+$24.000/año** sobre licencia M4 — validar con **cso-monetizacion**.
- **Micro-fee por hito validado:** **$0,50 – $5,00** según tier de monto del contrato (IaaU demo).
- **Concierge despliegue M3:** $80.000 – $250.000 (piloto acotado · migración nodo).

> Demo con seed — no constituye contrato ni custodia bancaria real.

## Prueba / demo

- Ficha producto: `/modelos/escrow-institucional`
- Consola contratos: `/contratos`
- Detalle cadena custodia: `/proyectos/contrato/{escrowProcessId}`
- Comandos dev: `npm run api:public` · `npm run db:seed:egs-pilot`

## Objeciones (top 5)

| Objeción | Respuesta honesta |
|----------|-------------------|
| «¿Quién custodia el dinero?» | **Demo programática** en ledger AGIGOV — no banco custodio regulado aún; piloto acotado con acta multi-sig. |
| «Nuestro ERP ya factura.» | Escrow no reemplaza ERP — **condiciona el pago** a evidencia verificable que el ERP no notariza. |
| «El ministerio no adoptará.» | Piloto **un contrato / un rubro**; empresa entra con evidencia IAP lista — reduce fricción del comprador público. |
| «Centinela nos bloquea sin razón.» | FREEZE es human-in-the-loop; conciliador media por grafo de confianza — no liberación automática opaca. |
| «¿Cuánto tarda integrarse?» | Demo visible en **< 1 día** con seed; integración IAP real 4–12 semanas según madurez del integrador. |

## Próximo paso (champion 5 min)

1. Demo `/contratos` + un contrato con hitos (15 min).
2. Identificar **un contrato piloto** con ministerio aliado y baseline de hitos.
3. CSO + soberano validan fee por hito antes de carta vinculante.

---

*Generado por **comercial-agigov** · Validación técnica: **modelo-guardian** · 2026-07-04*
