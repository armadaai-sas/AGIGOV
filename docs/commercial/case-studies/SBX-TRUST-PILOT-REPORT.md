# SBX Trust Pilot — Reporte serie 3/3

**Fecha cierre:** 2026-07-06  
**Entorno:** Mac local · Postgres nativo · `localhost:3000`  
**SKU:** Trust Pilot Fiscal AGIGOV (90 días)

---

## Resultado global: **3/3 PASS**

| Corrida | Tipo | Δ VES | FREEZE | Operador |
|---------|------|-------|--------|----------|
| [1](./corrida-1-sbx/) | Happy path | 180.000 | No | A |
| [2](./corrida-2-sbx/) | Reproducibilidad | 180.000 | No | B |
| [3](./corrida-3-sbx/) | Adversarial | 180.000 (restaurado) | Sí → recuperado | Técnico |

---

## Métricas clave

- **10 contratos** · **50 hitos** · **7 reportes** gestión publicados
- **Reproducibilidad:** corrida 2 en **5,6 s** técnico (infra previa)
- **Resiliencia:** centinela FROZEN con 5 discrepancias; recuperación sin pérdida de Δ
- **Panic drill:** 7/7 OK

---

## Declaración comercial (honesta)

> Hemos ejecutado el Trust Pilot Fiscal **tres veces** de punta a punta en sandbox controlado, incluyendo congelamiento ante discrepancia y recuperación documentada. **No constituye referencia ministerial** — es evidencia técnica y operativa para vender el **piloto #4** a integrador, veeduría o entidad pública acotada.

---

## Próximo paso GTM

1. Publicar este reporte (interno o `/transparencia` con disclaimer SBX)
2. Enviar [trust-pilot-fiscal-b2g.md](../one-pagers/trust-pilot-fiscal-b2g.md) a contacto Lane B
3. CTA: **Request Trust Pilot** — piloto pagado #4

---

*comercial-agigov · modelo-guardian · 2026-07-06*
