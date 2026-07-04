# AGIGOV — FAQ consolidado multi-audiencia

Objeciones transversales y respuestas honestas para **B2G**, **B2B** y **B2C**.  
Complementa los FAQ por modelo en `faq/b2g-*.md`, `faq/b2b-*.md`, `faq/b2c-*.md`.

---

## ¿Qué es AGIGOV?

Protocolo modular de gobernanza verificable: ledger inmutable, agentes institucionales (centinela, soberano, comunicador…) y dashboards ciudadanos **sin datos personales** en la capa pública.

**No es:** banco custodio, CNE nacional en producción, ni promesa de cambio político automático.

---

## Por audiencia — valor en una frase

| Audiencia | Modelo entrada | Gana porque… |
|-----------|----------------|--------------|
| **B2G** (Estado) | EGS · Gestión verificable | Paga eficiencia real (Δ), telemetría auditable, menos opacidad selectiva |
| **B2B** (Empresa) | Escrow · Evidencia API | Cobro al hito verificable; misma evidencia que ministerio y contraloría |
| **B2C** (Ciudadano) | Participación · Consulta (beta) | Voz con recibo; ve resolución publicada — no buzón negro |

---

## Seguridad e integridad

**¿Quién audita al auditor?**  
Ledger inmutable + hashes publicados. Contraloría y veedores reproducen recuento sin confiar ciegamente en el operador.

**¿Qué pasa ante fraude o irregularidad?**  
Centinela ejecuta **FREEZE** → alerta validadores → **human-in-the-loop** antes de des-congelar. Escrituras irreversibles solo con firmas verificadas.

**¿Publican mis datos personales?**  
**No** en la API pública estándar. Participación y consulta usan metadatos mínimos; el ledger publica actos agregados, no expedientes completos.

---

## Demo vs producción

**¿Está en producción nacional?**  
**No.** Hoy hay demo verificable local (`npm run api:public`, seed, consolas). Escala nacional requiere actas multi-sig, tesorería conectada y marco promulgado por **soberano**.

**¿Por qué veo «Sin datos» o «Conectar» en la PWA?**  
El nodo de demostración no está activo o aún no publicó datos en ese entorno. Use **Conectar** en la consola o active `api:public` + seed según el módulo.

**¿Qué modelos puedo prometer en ventas?**  
Solo `approved: true` (audit 3/3). Beta (`consulta-ciudadana`, IaaU…) **siempre** con disclaimer explícito.

---

## Pricing y contratos

**¿El pricing del one-pager es vinculante?**  
**No** — orientativo. Validar con **cso-monetizacion** + **soberano** antes de firma.

**¿El ciudadano paga?**  
Participación y gestión pública: **$0** en despliegue institucional estándar. Costo lo absorbe la jurisdicción (licencia M4).

**¿Success fee EGS come el ahorro?**  
Fee es % del **Δ neto certificado**, no del presupuesto total. Reparto ciudadano configurable (ej. 70% reinversión en demo).

---

## Objeciones cruzadas (top 10)

| # | Objeción | Respuesta |
|---|----------|-----------|
| 1 | «Otro sistema más» | Piloto acotado a **un rubro / un ministerio**; consola demo operativa en días con seed |
| 2 | «No tenemos presupuesto IT» | Sandbox M1 desde USD 0–2.500/trim; Always Free + nodos edge documentados |
| 3 | «¿Y si inflan baseline?» | Baseline fijada por **acta multi-sig** antes del periodo; centinela congela discrepancia |
| 4 | «Empresa: meses sin cobrar» | Escrow libera al hito **VALIDATED** — evidencia compartida, menos disputas opacas |
| 5 | «Ciudadano: no cambian nada» | Modelo garantiza **cierre visible** (dictamen + published), no aprobar todo |
| 6 | «¿Venden mis datos?» | No en capa pública; Data Trust = roadmap con metering explícito |
| 7 | «Consulta = elección nacional» | **No** — Consulta es beta / SET lite; CNE formal es roadmap aparte |
| 8 | «Escrow = banco» | **No** — cadena lógica programática; custodia bancaria regulada = roadmap |
| 9 | «¿Offline?» | Nodos territoriales offline-first; sync al reconectar (Fase 5) |
| 10 | «¿Quién firma legalmente?» | Multi-sig institucional + dictamen soberano; demo no sustituye acta promulgada |

---

## Próximo paso por perfil

| Perfil | Acción 15 min |
|--------|----------------|
| **Ministro / tesorería** | Demo EGS consola + one-pager B2G |
| **Contratista / integrador** | Demo `/contratos` + FAQ Escrow B2B |
| **Líder comunitario** | Demo `/participar` → `/propuestas` + deck B2C 5 min |
| **Contraloría** | Demo `/gestion` + hashes reproducibles |

---

## Enlaces por modelo

| Modelo | B2G | B2B | B2C |
|--------|-----|-----|-----|
| EGS | [b2g-egs.md](./b2g-egs.md) | — | (beneficio ciudadano vía reparto Δ) |
| Escrow | (complemento fiscal) | [b2b-escrow.md](./b2b-escrow.md) | — |
| Participación | (canal institucional) | — | [b2c-participacion.md](./b2c-participacion.md) |
| Gestión verificable | [b2g-gestion.md](./b2g-gestion.md) | — | (telemetría pública) |

---

*comercial-agigov · consolidado 2026-07-04 · validación catálogo: modelo-guardian*
