# Escrow B2B — FAQ objeciones

Material complementario a [escrow-b2b.md](../one-pagers/escrow-b2b.md).

## Para el director comercial / legal empresa

**¿Es un banco?** No. Es **escrow programático** sobre ledger AGIGOV — custodia bancaria regulada es roadmap, no promesa de hoy.

**¿Necesitamos criptomonedas?** No. Identidad wallet-less o DID institucional; la empresa envía evidencia firmada (IAP), no tokens especulativos.

**¿Qué pasa si centinela rechaza un hito?** El pago permanece LOCKED; conciliador + human-in-the-loop antes de des-congelar. La empresa ve el motivo en cadena de custodia publicada.

## Para el integrador técnico

**¿Hay API?** Sí — evidencia vía **Evidencia API** + lectura de estado contrato en API pública demo (`/api/public/egs/*`, proyectos/contrato).

**¿Offline?** Nodos territoriales pueden encolar evidencia; sync al reconectar — ver skill resilient-data-architecture en piloto edge.

## Para el champion en el ministerio (aliado B2G)

**¿Riesgo de corrupción nueva?** Menos superficie: liberación exige evidencia triple (centinela, sensores, auditores) y multi-sig — no un funcionario solo.

**¿Compatible con EGS?** Sí — escrow alimenta gasto verificado que alimenta Q-Close; modelos complementarios, no excluyentes.

## Para contraloría (cuando pregunten)

**¿Puedo auditar sin AGIGOV?** Exportar hashes de hitos y actas — recuento reproducible desde evidencia publicada, igual que EGS.

---

*comercial-agigov · 2026-07-04*
