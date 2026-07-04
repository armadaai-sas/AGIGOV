# Cuadro de Modelos de Monetización AGIGOV

**Fecha:** 2026-07-03  
**CSO / Agente:** `cso-monetizacion`  
**Skills:** agigov-strategic-analysis · sovereign-economics-monetization · agigov-cso-deliverable  
**Estado:** Recomendación estratégica — ratificación humana + soberano antes de comercializar

---

## Matriz comparativa (vista ejecutiva)

| Modelo | Pilar CSO | Pagador principal | Adopción | Escala | Anti-corrupción | Prioridad |
|--------|-----------|-------------------|----------|--------|-----------------|-----------|
| **Infrastructure-as-a-Utility** | Micro-transaccionalidad | Estado + integradores | 3 | 5 | 4 | **P1** |
| **Efficiency Gain Share** | Success Fee | Estado (tesorería) | 4 | 4 | 5 | **P0** |
| **Data Trust Partnership** | Ecosistema privado (B) | Empresas privadas | 2 | 3 | 3 | **P2** |

*Scores 1–5: mayor = mejor. Prioridad P0 = pilotear primero tras MVP legitimidad.*

---

## Modelo 1 — Infrastructure-as-a-Utility

*Micro-cobro por ejecución del protocolo*

### 1. Brief del Modelo

AGIGOV cobra **micro-fees** por unidades verificables: firma IAP, commit ledger, validación hito escrow, sync nodo territorial, consulta API certificada. Similar a utilities cloud (pago por uso), anclado al **costo marginal de confianza**. El Estado y los integradores pagan volumen; ciudadanos no ven fee directo en v1.

**Flujo:** Ejecución → metering → factura mensual jurisdicción / integrador → ledger registra agregado (sin PII).

### 2. Análisis de Incentivos

| Actor | ¿Por qué participa? | ¿Qué gana? |
|-------|---------------------|------------|
| **Estado / funcionario** | Costo predecible vs licencia monolítica; paga solo lo que usa | Escala sin CAPEX inicial; presupuesto lineal a actividad real |
| **Empresa privada** | API certificada acelera pagos escrow | Menos fricción administrativa al demostrar hitos |
| **Ciudadano** | No paga micro-tx en v1 | Servicios públicos trazables sin barrera económica |
| **AGIGOV** | Ingreso recurrente alineado a uso real | Sostenibilidad sin depender de token |

### 3. Métrica de Verdad

| Métrica | Fuente | Umbral piloto |
|---------|--------|---------------|
| Tx/día firmadas en ledger | Postgres + centinela | Baseline 30d pre-fee |
| Costo infra / 1M tx | Ops interno | Fee ≥ costo + 20% margen |
| Discrepancia metering vs ledger | centinela audit | **0** tolerancia |
| Tiempo medio validación hito | logistico + API | ↓ 20% vs manual |

**Hecho verificado hoy:** IAP y ledger operativos en repo; **metering comercial no implementado** (hipótesis producto).

### 4. Auditoría CSO

| Lente | Score | Notas |
|-------|-------|-------|
| **Facilidad adopción** | 3 | Funcionarios desconfían de «cobro por click»; requiere tope carta y dashboard costo claro |
| **Escalabilidad** | 5 | Misma unidad lógica en VE (edge) u OCDE (cloud); precio por tier |
| **Resistencia corrupción** | 4 | Metering auditable vs ledger; riesgo: sub-reporte volumen → centinela cross-check |

### 5. Handoff

| Destino | Acción |
|---------|--------|
| **logistico** | Definir unidades facturables (hito, escrow, sync) |
| **centinela** | Auditoría metering ↔ ledger |
| **soberano** | Cláusula tope fee en Carta AGIGOV-XXX |
| **comunicador** | Copy «costo de confianza» para funcionarios |

---

## Modelo 2 — Efficiency Gain Share

*% sobre ahorro fiscal detectado por el sistema*

### 1. Brief del Modelo

AGIGOV participa del **ahorro neto verificable**: baseline presupuestario acordado (multi-sig) menos ejecución trazada en ledger. Fee típico **5–15% del ahorro**, pagadero solo si centinela certifica delta. Alinea incentivos: AGIGOV gana cuando el Estado gasta mejor, no cuando gasta más.

**Flujo:** Baseline firmada → ejecución trazada → delta auditado → factura success fee → publicación ciudadana del ahorro.

### 2. Análisis de Incentivos

| Actor | ¿Por qué participa? | ¿Qué gana? |
|-------|---------------------|------------|
| **Estado / funcionario** | No-brainer si fee < ahorro neto; argumento político anti-desperdicio | Presupuesto liberado para inversión social; carrera meritocrática visible |
| **Empresa privada** | Pagos al hito reducen capital inmovilizado | Flujo de caja predecible |
| **Ciudadano** | Ve ahorro publicado en PWA | Confianza institucional |
| **AGIGOV** | Upside ligado a impacto real | Ingreso alto en reformas profundas |

### 3. Métrica de Verdad

| Métrica | Fuente | Umbral piloto |
|---------|--------|---------------|
| % ejecución presupuesto trazable | ledger + ministerio piloto | ≥ 80% líneas piloto |
| Ahorro neto vs baseline | Acta multi-sig + delta hash | ≥ fee AGIGOV en 12 meses |
| Pagos fantasma eliminados | centinela FREEZE logs | ↓ incidentes trimestre |
| Tiempo liberación escrow | logistico | ↓ 30% vs control |

**Hecho verificado hoy:** Escrow e hitos en backend; **baseline ministerial real no conectada** — piloto requerido.

### 4. Auditoría CSO

| Lente | Score | Notas |
|-------|-------|-------|
| **Facilidad adopción** | 4 | «Pagamos solo si ahorramos» es argumento fuerte para tesorería |
| **Escalabilidad** | 4 | Requiere baseline confiable; países con contabilidad débil necesitan fase Aider primero |
| **Resistencia corrupción** | 5 | Gaming baseline es el riesgo; mitigación: multi-sig + conciliador + publicación |

### 5. Handoff

| Destino | Acción |
|---------|--------|
| **soberano** | Contrato tipo success fee + dictamen CONFORME |
| **centinela** | Validación delta ahorro antes de factura |
| **conciliador** | Disputas baseline entre ministerio y contraloría |
| **macro-intelligence-governance** | Selección ministerio piloto + data fiscal |
| **comunicador** | Dashboard ahorro ciudadano |

**Recomendación CSO:** **P0** — pilotear tras 3 proyectos DAO visibles (MVP legitimidad).

---

## Modelo 3 — Data Trust Partnership

*Monetización de data agregada anonimizada para empresas privadas*

### 1. Brief del Modelo

Empresas acceden a **agregados verificables** derivados del ledger (tiempos de pago sectoriales, ejecución presupuestaria por rubro, índices de integridad nodo) bajo licencia. **Sin PII**, k-anonymity, uso restringido por carta. Precio: suscripción analytics + API premium.

**Flujo:** Pipeline ETL agregación → auditoría centinela + dictamen soberano → API tier enterprise → revenue share opcional con DAO sectorial.

### 2. Análisis de Incentivos

| Actor | ¿Por qué participa? | ¿Qué gana? |
|-------|---------------------|------------|
| **Estado / funcionario** | Ingreso no fiscal directo al tesoro o DAO | Financia infra sin subir impuestos |
| **Empresa privada** | Data confiable para riesgo país / supply chain | Ventaja competitiva en licitaciones trazables |
| **Ciudadano** | Transparencia + posible retorno vía DAO | Riesgo percepción «vendieron mis datos» |
| **AGIGOV** | Margen alto software | Diversificación ingreso |

### 3. Métrica de Verdad

| Métrica | Fuente | Umbral piloto |
|---------|--------|---------------|
| Registros con k ≥ 50 | Pipeline privacidad | 100% datasets |
| Intentos re-identificación | Red team centinela | 0 exitosos |
| Revenue / costo pipeline | Finanzas | Positivo mes 6 |
| Quejas ciudadanas | comunicador | 0 material pre-escala |

**Hecho verificado hoy:** Telemetría pública agregada (`/api/public/health`); **marketplace data no existe** — alto riesgo reputacional y legal.

### 4. Auditoría CSO

| Lente | Score | Notas |
|-------|-------|-------|
| **Facilidad adopción** | 2 | Funcionarios sensibles a «vender data del Estado»; requiere narrativa soberanía |
| **Escalabilidad** | 3 | GDPR-like / leyes locales variables; VE necesita marco explícito |
| **Resistencia corrupción** | 3 | Riesgo captura: funcionario vende acceso «premium» off-ledger → FREEZE + publicación |

### 5. Handoff

| Destino | Acción |
|---------|--------|
| **soberano** | Política data + dictamen REVISAR obligatorio |
| **centinela** | Threat model re-identificación + honeypot acceso |
| **state-legal-political** | VE / intl compliance |
| **comunicador** | Consulta ciudadana antes de escala |

**Recomendación CSO:** **P2** — solo tras MVP + success fee probado; nunca antes de Carta ratificada.

---

## Orden de ejecución recomendado (CSO)

```
Fase 0 (ahora)     → Legitimidad: Carta + /proyectos + escrow UI
Fase 1 (mes 2–4)   → Efficiency Gain Share (1 ministerio piloto)
Fase 2 (mes 4–8)   → Infrastructure-as-a-Utility (metering API/nodo)
Fase 3 (mes 9+)    → Data Trust Partnership (sandbox legal + 1 sector)
Paralelo           → Participación ciudadana incentivada (sovereign-economics §C)
Paralelo           → B2G API contratistas (sovereign-economics §A)
```

---

## Enjambre configurado

| Rol | Archivo |
|-----|---------|
| **CSO** | `.cursor/agents/cso-monetizacion.md` |
| **Innovador 24/7** | `.cursor/agents/innovador.md` |
| **Marco Estado** | `.cursor/skills/agigov-strategic-analysis/SKILL.md` |
| **Marco privado/ciudadano** | `.cursor/skills/sovereign-economics-monetization/SKILL.md` |
| **Formato entrega** | `.cursor/skills/agigov-cso-deliverable/SKILL.md` |

### Invocación en Cursor

```text
Actúa como CSO (.cursor/agents/cso-monetizacion.md).
Usa agigov-strategic-analysis + agigov-cso-deliverable.
Audita el modelo [nombre] con las 3 lentes.
```

---

## Referencias

- `docs/innovation/2026-07-03-estrategia-monetizacion-investigacion.md`
- `docs/AGIGOV/ECONOMIA-DAO.md`
- `docs/innovation/2026-07-02-agigov-mvp-brief.md`
