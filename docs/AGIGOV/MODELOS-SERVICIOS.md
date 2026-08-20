# Modelos y servicios AGIGOV

Catálogo canónico de los **10 modelos operativos** del protocolo AGIGOV, agrupados en tres audiencias. Cada modelo es un producto replicable: define el problema que resuelve, cómo funciona, por qué es vital, y su modelo de negocio y operación validados.

**Fuente de verdad en código:** `src/citizen/platform/agigovModels.ts`  
**Contrato comunitario (builders):** [MODEL-MANIFEST-v1.md](./MODEL-MANIFEST-v1.md) · `src/citizen/platform/modelManifest.ts`  
**UI pública:** `/modelos` · `/modelos/:id`

---

## Audiencias

| Audiencia | Enfoque | Modelos |
|-----------|---------|---------|
| **Gubernamental** | Eficiencia fiscal, confianza institucional, pagos verificables | EGS, SET, Escrow, Gestión verificable |
| **Empresarial** | Integración B2G, datos agregados, evidencia certificada | IaaU, Data Trust, Evidencia API |
| **Ciudadano** | Participación, co-financiación, consultas auditables | DAO, Participación, Consulta verificable |

---

## Gubernamental

### 1. Efficiency Gain Share (EGS)

| Campo | Contenido |
|-------|-----------|
| **Problema** | Presupuesto público con opacidad: pagos sin hito, sobrecostos no detectados, cierres trimestrales manuales propensos a discrepancia. |
| **Para qué sirve** | Reconciliar baseline vs gasto trazado en ledger, calcular ahorro Δ y repartirlo bajo reglas publicadas. |
| **Por qué es vital** | Cada unidad ahorrada es auditable ante contraloría y ciudadanía; el operador cobra solo si hay Δ real. |
| **Negocio** | Pagador: tesorería / ministerio. Mecanismo: success fee 5–15% sobre Δ certificado. Métrica: ahorro neto vs baseline firmada. |
| **Operación** | Centinela · Logístico · Soberano · Comunicador. Baseline → ejecución → reconciliación → Q-Close → reparto. |
| **Ruta demo** | `/modelos/egs` · consola `/modelos/egs/consola` |

### 2. Sistema Electoral Tokenizado (SET)

| Campo | Contenido |
|-------|-----------|
| **Problema** | Elecciones con actas opacas, recuentos no reproducibles, vulnerabilidad a fraude. |
| **Para qué sirve** | Emitir votos cifrados, registrar commits sin PII pública, recuento reproducible y receipt verificable. |
| **Por qué es vital** | Legitimidad del Estado = elecciones auditables; secreto del voto + integridad verificable. |
| **Negocio** | Pagador: autoridad electoral. Licencia por proceso + módulo auditoría continua. |
| **Operación** | Centinela · Soberano · Comunicador. Emisión → commit → recuento → publicación. |
| **Ruta** | `/modelos/set` |

### 3. Escrow Institucional

| Campo | Contenido |
|-------|-----------|
| **Problema** | Contratos públicos pagan por adelantado sin trazabilidad de entrega. |
| **Para qué sirve** | Smart escrow: fondos bloqueados hasta evidencia de hito validada por centinela. |
| **Por qué es vital** | El proveedor cobra al cumplir; contraloría y ministerio ven el mismo ledger. |
| **Negocio** | Fee por contrato activo o % sobre monto liberado verificado. |
| **Operación** | Logístico · Centinela · Conciliador. Contrato → escrow → hitos → pago. |
| **Ruta demo** | `/modelos/escrow-institucional` · consola `/contratos` |

### 4. Gestión Pública Verificable

| Campo | Contenido |
|-------|-----------|
| **Problema** | Reportes tardíos, agregados no reproducibles, opacidad selectiva. |
| **Para qué sirve** | Publicar telemetría institucional desde ledger con pipeline received → published. |
| **Por qué es vital** | Capa mínima de rendición de cuentas antes de EGS o escrow avanzado. |
| **Negocio** | Suscripción anual auditoría continua + despliegue nodo. |
| **Operación** | Comunicador · Centinela · Soberano. |
| **Ruta demo** | `/modelos/gestion-verificable` · consola `/gestion` |

---

## Empresarial

### 5. Infraestructura como Utilidad (IaaU)

| Campo | Contenido |
|-------|-----------|
| **Problema** | Suites monolíticas caras con baja utilización; costo marginal desalineado al uso. |
| **Para qué sirve** | Facturar micro-unidades: firma IAP, commit ledger, validación hito, sync nodo. |
| **Por qué es vital** | Escala adopción sin CAPEX; estados pequeños e integradores pagan lo que consumen. |
| **Negocio** | Micro-fee por unidad verificada. Métrica: tx/día vs costo infra. |
| **Estado** | Roadmap · `/modelos/iaau` |

### 6. Data Trust Partnership

| Campo | Contenido |
|-------|-----------|
| **Problema** | Datos sectoriales poco confiables; el Estado no puede compartir sin riesgo re-ID. |
| **Para qué sirve** | Agregados k-anonymizados bajo licencia y dictamen soberano. |
| **Por qué es vital** | Monetiza transparencia sin vender ciudadanos; financia infra pública. |
| **Negocio** | Suscripción API premium B2B. |
| **Estado** | Roadmap · `/modelos/data-trust` |

### 7. API de Evidencia Certificada

| Campo | Contenido |
|-------|-----------|
| **Problema** | Proveedores pierden meses cobrando; evidencia en silos sin formato común. |
| **Para qué sirve** | Envelopes IAP firmados consumibles por escrow y centinela. |
| **Por qué es vital** | Conecta capacidad privada con controles públicos; acelera liberación de pagos. |
| **Negocio** | Certificación anual + fee por evidencia aceptada. |
| **Ruta demo** | `/modelos/evidencia-certificada` · `/desarrolladores` |

---

## Ciudadano

### 8. Prosperidad Compartida (DAO)

| Campo | Contenido |
|-------|-----------|
| **Problema** | Aportes comunitarios sin visibilidad del destino del dinero. |
| **Para qué sirve** | Escrow programático por hitos publicados; co-financiación trazable. |
| **Por qué es vital** | Confianza horizontal cuando el vertical institucional falla. |
| **Negocio** | Fee simbólico sobre aporte o patrocinio institucional del pool. |
| **Ruta demo** | `/modelos/dao-ciudadano` · `/proyectos?tab=dao` |

### 9. Participación y Dictamen Ciudadano

| Campo | Contenido |
|-------|-----------|
| **Problema** | Propuestas en buzones sin respuesta ni estado visible. |
| **Para qué sirve** | Pipeline institucional con dictamen y publicación de resolución. |
| **Por qué es vital** | Sin cierre visible, la democracia deliberativa es teatro. |
| **Negocio** | Incluido en despliegue institucional; premium por volumen. |
| **Ruta demo** | `/modelos/participacion` · `/propuestas` |

### 10. Consulta Ciudadana Verificable

| Campo | Contenido |
|-------|-----------|
| **Problema** | Consultas ad hoc sin estándar técnico ni recuento auditable. |
| **Para qué sirve** | Emisión verificable + agregación publicada; capa SET simplificada. |
| **Por qué es vital** | Decisiones legítimas en barrio/municipio sin costo de elección plena. |
| **Negocio** | Fee por consulta + módulo SET lite. |
| **Ruta demo** | `/modelos/consulta-ciudadana` · `/cne` |

---

## Relación modelo → servicio

- **Modelo:** producto conceptual replicable (este documento).
- **Servicio:** instancia desplegada en una jurisdicción con carta AGIGOV-[ISO], nodo y datos reales.
- **Demo:** entorno local con seed (`npm run api:public`, `npm run db:seed`) — no implica jurisdicción activa.

## Rutas legacy

| Antigua | Nueva |
|---------|-------|
| `/ven/servicios` | `/modelos` |
| `/ven/servicios/egs-vial` | `/modelos/egs` |
| `/ven/servicios/egs-vial/consola` | `/modelos/egs/consola` |

---

*Última revisión: alineada con catálogo TS v1 — enfoque protocolo AGIGOV, sin implementación nacional en UI pública.*

---

## Investigación ampliada — aparato estatal completo

Para **14+ modelos sectoriales adicionales** (Tesoro, Justicia, Defensa, Salud, Logística, Banca pública, Recursos naturales, Reformas constitucionales, Datos sensibles, etc.) ver:

**[INVESTIGACION-MODELOS-ESTADO.md](./INVESTIGACION-MODELOS-ESTADO.md)**

Incluye tiers de confidencialidad (T0–T4), matriz de interdependencias, arquitectura de tres anillos y priorización por olas de implementación.

**Pricing, validación y ganar-ganar:** [INVESTIGACION-NEGOCIO-GANAR-GANAR.md](./INVESTIGACION-NEGOCIO-GANAR-GANAR.md)

**Auditoría producto (fallos, ejecución, enjambre):** [AUDITORIA-PRODUCTO-MODELOS.md](./AUDITORIA-PRODUCTO-MODELOS.md)
