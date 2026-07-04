# Kit de Cierre para el Champion

**Operación:** Venta al Director · **Audiencia:** funcionario de 2.º–3.º nivel (MPPI / infraestructura vial)  
**Objetivo:** convertir activo técnico en **sponsor interno** del piloto — no firma ministerial directa.

---

## Contenido del kit

| # | Documento | Uso en reunión |
|---|-----------|----------------|
| 1 | [GUION-CHAMPION-5MIN.md](./GUION-CHAMPION-5MIN.md) | Discurso + demo en vivo (5 min) |
| 2 | [FICHA-PILOTO-SIN-RIESGO.md](./FICHA-PILOTO-SIN-RIESGO.md) | Leave-behind de 1 página — dejar en la mesa |
| 3 | [../CONTRATO-EFICIENCIA-PUBLICA-CIUDADANO.md](../CONTRATO-EFICIENCIA-PUBLICA-CIUDADANO.md) | Escudo de transparencia — imprimir |
| 4 | [../BRIEF-PRESENTACION-MINISTRO-SALUD-PANEL.md](../BRIEF-PRESENTACION-MINISTRO-SALUD-PANEL.md) | Guía técnica de la demo (panel) |
| 5 | [../AEI-ANEXO-I-PILOTO-VIAL-v0.1.md](../AEI-ANEXO-I-PILOTO-VIAL-v0.1.md) | Anexo legal — referencia, no leer en voz alta |
| 6 | [../DICTAMEN-SOBERANO-AEI-v0.1.md](../DICTAMEN-SOBERANO-AEI-v0.1.md) | Dictamen CONFORME — credibilidad institucional |

---

## Checklist pre-reunión (15 min antes)

- [ ] `npm run infra:up:dev && npm run db:seed:egs-pilot`
- [ ] `npm run api:public` (terminal 1) + `npm run dev` (terminal 2)
- [ ] Abrir http://localhost:3000/proyectos → tab **Salud del Ministerio**
- [ ] (Opcional) Pre-ejecutar `npm run egs:stress` + restore para mostrar banner FROZEN
- [ ] Imprimir **Ficha Piloto Sin Riesgo** + **Contrato de Eficiencia Pública**
- [ ] Tener AEI + Dictamen en carpeta (respaldo legal)

---

## Flujo de la reunión

```
Director (5 min guion + demo)
    → Leave-behind ficha + contrato ciudadano
    → CTA: patrocinio interno del piloto
    → Reunión escalada: Director + Ministro (brief Ministro)
    → Firma multi-sig AEI (gate legal)
```

---

## Métricas demo (Q2 2026 — seed verificado)

| Concepto | VES |
|----------|-----|
| Baseline trimestral | 1.000.000 |
| Gasto verificado | 820.000 |
| **Ahorro Δ** | **180.000** |
| Fee AGIGOV (10% de Δ) | 18.000 |
| Fee si Δ = 0 | **0** |

---

## Gate legal (transparencia ante el Champion)

El piloto técnico está **validado** (migración + seed + panel). La firma ministerial requiere aún:

- Anexos técnicos A (partidas ONAPRE) y C (topes incentivos 20%)
- Ratificación Carta AGIGOV-VEN o acta excepcional
- Revisión LOAF / marco cambiario VES

Mencionar esto con honestidad refuerza credibilidad — no ocultarlo.

---

*CSO + comunicador · piloto vial EGS v0.1 · 2026-07-03*
