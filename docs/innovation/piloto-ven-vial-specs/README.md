# Piloto EGS — Infraestructura Vial Venezuela

**Enfoque Doble Hélice** — especificaciones para revisión inmediata.

| Cara | Agente | Documento | Función |
|------|--------|-----------|---------|
| **Legal** | soberano | [AEI-ANEXO-I-PILOTO-VIAL-v0.1.md](./AEI-ANEXO-I-PILOTO-VIAL-v0.1.md) | Contrato vinculante |
| **Legal** | soberano | [DICTAMEN-SOBERANO-AEI-v0.1.md](./DICTAMEN-SOBERANO-AEI-v0.1.md) | CONFORME + condiciones |
| **Ciudadano** | comunicador | [CONTRATO-EFICIENCIA-PUBLICA-CIUDADANO.md](./CONTRATO-EFICIENCIA-PUBLICA-CIUDADANO.md) | Transparencia pública |
| **Técnica** | logistico | [QUARTER-CLOSE-SCHEMA-v0.1.md](./QUARTER-CLOSE-SCHEMA-v0.1.md) | Schema + cálculo Δ |
| **Build** | CSO | [CICLO-BUILD-CONFIRMACION.md](./CICLO-BUILD-CONFIRMACION.md) | Comandos + gate firma |
| **PWA** | comunicador | [BRIEF-PRESENTACION-MINISTRO-SALUD-PANEL.md](./BRIEF-PRESENTACION-MINISTRO-SALUD-PANEL.md) | Guion demo panel |
| **Venta** | CSO + comunicador | [kit-cierre-champion/](./kit-cierre-champion/) | Kit Champion (5 min + ficha) |
| **CSO** | cso-monetizacion | [CSO-EVALUACION-DOBLE-HELICE.md](./CSO-EVALUACION-DOBLE-HELICE.md) | Evaluación modelo |

## Contexto

- Modelo: **Efficiency Gain Share (EGS)** — reparto **70 / 20 / 10**
- Piloto: mantenimiento vial verificable (1 cartera ministerial acotada)
- Prerequisito: Carta AGIGOV-VEN ratificada + acta baseline multi-sig

## Handoffs pendientes

| Destino | Acción |
|---------|--------|
| **soberano** | Dictamen CONFORME / REVISAR sobre AEI v0.1 |
| **centinela** | Validar `gastos_verificados` ↔ releases ledger |
| **logistico** | `npm run db:migrate` tras aprobar schema |
| **comunicador** | Versión ciudadana del AEI (1 página) |

## Referencias

- `docs/innovation/2026-07-03-egs-piloto-ven-infraestructura.md`
- skill `sovereign-economics-monetization/egs-escrow-spec.md` (config local)
