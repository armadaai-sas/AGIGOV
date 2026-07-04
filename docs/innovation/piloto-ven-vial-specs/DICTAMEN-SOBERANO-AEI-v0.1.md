# Dictamen Soberano — AEI Piloto Vial v0.1

**Fecha:** 2026-07-03  
**Agente:** soberano  
**Documento evaluado:** `AEI-ANEXO-I-PILOTO-VIAL-v0.1.md`  
**Marco:** Carta AGIGOV-VEN · Título IV (Economía programática)

---

## Dictamen

### **CONFORME** — con condiciones previas a firma ministerial

El AEI v0.1 es **jurídicamente coherente** con la Carta AGIGOV-VEN y materializa el piloto Efficiency Gain Share sin contravenir los artículos 15 (FREEZE), 16 (escrow programático) y 20 (topes y rollback).

---

## Fundamentos

| Cláusula AEI | Alineación Carta | Observación |
|--------------|------------------|-------------|
| Smart Escrow (Cl. 3) | Art. 16 | Mecanismo de liberación condicionada — **vinculante** |
| Reparto 70/20/10 (Cl. 5) | Art. 17, 20 | Automático; bucket 70% acotado a Anexo Técnico A |
| Baseline multi-sig (Cl. 2) | Art. 3, 30 | Legitimidad y no alteración unilateral |
| Protección Ministro (Cl. 6) | Art. 9, 11 | Debida diligencia + memoria ledger |
| Fee 10% condicionado a Δ > 0 | Art. 7 | Innovación acotada; rollback si fraude |

---

## Condiciones previas a firma (human-in-the-loop)

1. Completar **Anexo Técnico A** (partidas ONAPRE piloto) con tesorería MPPI.  
2. Completar **Anexo Técnico C** (topes incentivos 20%) — propuesta: ≤ 2 salarios equivalentes / funcionario / año.  
3. Ratificación **Carta AGIGOV-VEN** (≥3 firmas) o acta de piloto excepcional firmada por contraloría.  
4. Dictamen **state-legal-political** sobre compatibilidad LOAF / marco cambiario VES (revisión externa).  
5. Migración **`egs_quarter_close_pilot_v1`** aplicada y seed demo reconciliado por **centinela** sin discrepancias.

---

## Riesgos identificados

| Riesgo | Severidad | Mitigación en AEI |
|--------|-----------|-------------------|
| Baseline inflado | Alta | Multi-sig + histórico 24m |
| Captura bucket 20% | Media | Comité paritario + publicación agregada |
| Percepción «fee oculto» | Media | Versión ciudadana + fee 0 si Δ ≤ 0 |

---

## Versión ciudadana

Publicar junto a firma: [`CONTRATO-EFICIENCIA-PUBLICA-CIUDADANO.md`](./CONTRATO-EFICIENCIA-PUBLICA-CIUDADANO.md)

---

## Handoffs

| Agente | Acción |
|--------|--------|
| **comunicador** | Publicar versión ciudadana en PWA tras firma |
| **centinela** | Validar Smart Escrow operativo pre-firma |
| **logistico** | QuarterClose automático demostrable |
| **cso-monetizacion** | Presentación al Ministro con dictamen + demo |

---

## evidenceBundle (hechos verificables)

```json
{
  "processId": "dictamen-aei-vial-v0.1",
  "facts": [
    "AEI v0.1 revisado contra Carta AGIGOV-VEN arts. 3-7, 15-20",
    "Dictamen CONFORME con 5 condiciones previas",
    "Schema egs_quarter_close_pilot_v1 en repo"
  ],
  "status": "decided"
}
```

---

*Pendiente promulgación — requiere firma multi-sig institucional.*
