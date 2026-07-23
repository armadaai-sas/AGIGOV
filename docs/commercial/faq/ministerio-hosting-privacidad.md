# FAQ — Preguntas del ministerio (hosting, privacidad, resultados, errores)

**Audiencia:** champion fiscal, tesorería, contraloría, asesoría jurídica.  
**Formato:** respuestas cortas para reunión o email — sin jerga técnica.

---

## Qué hacen ustedes por nosotros

| Ustedes (mínimo) | AGIGOV (piloto operado) |
|------------------|-------------------------|
| Eligen **un rubro** presupuestario | Instalamos y operamos nodo piloto |
| Envían Excel/PDF que ya usan internamente | Importamos, validamos, cruzamos cifras |
| Confirman: «estos números son correctos» | Reconciliación EGS (baseline vs gasto) |
| Validan hitos con su evidencia (actas, fotos) | Escrow: LOCKED → VALIDATED → RELEASED |
| Firman acta de cierre trimestral | Entregamos Trust Pack (acta + hashes + tablero) |
| Abren enlace de consola o PDF | Infra, API, soporte, concierge paso a paso |

**No necesitan:** programadores, Docker, ledger, ni reemplazar su ERP.

---

## Dónde se hospeda y procesa la data

| Modo | Dónde vive la data | Cuándo |
|------|-------------------|--------|
| **A. SBX AGIGOV** | Sandbox nuestro (demo) | Solo pruebas y demos — no obligatorio para ustedes |
| **B. Nube del cliente** | Su tenant (Oracle, AWS, on-prem) | **Recomendado** si privacidad es crítica |
| **C. Híbrido** | Procesamiento en su red; solo agregados publicados afuera | Ministerios sensibles |

**Oracle no es obligatorio.** Es una opción de bajo costo para demos; el piloto ministerial puede ser 100% en su perímetro.

**Qué procesamos:** agregados fiscales del rubro + metadatos de contratos.  
**Qué NO publicamos:** carnets, nómina nominal, cuentas bancarias ciudadanas, expedientes con PII.

---

## Privacidad

1. **Un solo rubro** — no todo el Estado en el piloto.  
2. **Sin PII en lo ciudadano** — solo gestión agregada publicada.  
3. **Ustedes aprueban** antes de cualquier publicación.  
4. **No vendemos datos** — ingreso por licencia piloto y success fee sobre Δ, no marketplace.  
5. **Piloto no vinculante** — extensión nacional requiere actas institucionales posteriores.

---

## Qué resultados obtienen al día 90

1. **Informe Δ** — cuánto gastaron vs baseline acordada.  
2. **Estado de contratos/hitos** — qué está pagado, bloqueado o liberado y por qué.  
3. **Enlace de transparencia** — tablero publicable (demo o su dominio).  
4. **Acta + hashes** — prueba reproducible para contraloría.

**Beneficio político:** defender ejecución con hechos.  
**Beneficio operativo:** menos disputas con contratistas.  
**Beneficio económico:** nuestro success fee **solo si hay Δ real**.

---

## Si AGIGOV o los datos están equivocados

| Situación | Qué pasa |
|-----------|----------|
| Los números no cuadran | El sistema **se detiene (FREEZE)** — no se publica como oficial |
| Error en archivo cargado | Se corrige **antes** de publicar |
| Disputa con contratista | Misma evidencia para ambas partes; humano decide |
| Algo incorrecto ya publicado | **Rectificación publicada** — el error queda en historial |
| Fallo de AGIGOV en operación | Piloto no vinculante; sin success fee sin Δ certificado |

**Principio:** no hay edición silenciosa del historial; irregularidad → congelar primero, explicar después.

---

## Qué NO prometemos en el piloto

- Integración día 1 con tesorería nacional completa  
- Reemplazar SAP / sistema contable legacy  
- Elecciones o registro electoral nacional  
- Despliegue a millones de ciudadanos  
- Cobro de success fee sin Δ certificado y acta firmada  

---

## Frase para el ministro (30 segundos)

> «Ustedes siguen con sus sistemas. Nosotros, en **su entorno o uno acordado**, comprobamos en **90 días** que gasto, contratos y hitos cuadran. Si no cuadra, **se para**. Si cuadra, **publican ustedes** un resumen sin datos personales y firman un cierre con prueba para contraloría. **Solo cobramos eficiencia si ustedes la demuestran.**»

---

## Documentos relacionados

- [Trust Pilot one-pager](../one-pagers/trust-pilot-fiscal-b2g.md)
- [Checklist 3 corridas SBX](../trust-pilot-sbx-checklist.md)
- [FAQ consolidado](./consolidado-multi-audiencia.md)

---

*comercial-agigov · 2026-07-05*
