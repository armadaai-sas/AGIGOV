# CSO Audit — Efficiency Gain Share · Piloto AGIGOV-VEN

**Fecha:** 2026-07-03  
**Agente:** cso-monetizacion  
**Skills:** agigov-strategic-analysis · agigov-cso-deliverable · sovereign-economics-monetization (handoff)  
**Alcance:** Piloto ministerial Venezuela — **Sistema Nervioso del Estado**  
**Estado:** Diseño piloto — requiere ratificación soberano + multi-sig baseline

---

## Contexto estratégico: De auditoría pasiva a Sistema Nervioso

| Modo | Comportamiento | Percepción funcionario |
|------|----------------|----------------------|
| **Auditoría pasiva** | AGIGOV publica lo que ya ocurrió | «Otro portal de transparencia» |
| **Sistema nervioso** | AGIGOV **ejecuta** liberaciones, memoria y alertas | «Operar sin AGIGOV = a ciegas» |

AGIGOV como commodity de gobernanza exige **utilidad diaria**. Efficiency Gain Share (EGS) es el modelo comercial que financia esa utilidad: el Estado paga AGIGOV **solo del ahorro neto verificado**, mientras el ministerio retiene la mayor parte para reinversión e incentivos.

### Tres dimensiones del Sistema Nervioso (piloto)

| Dimensión | Implementación piloto | Pilar CSO |
|-----------|----------------------|-----------|
| **Reflejo operativo** | Escrow libera pago vial **solo** con hito IoT + auditoría ciudadana | Micro-tx + Aider |
| **Memoria institucional** | Proyectos, baselines y actas en ledger — transición = rotación de claves | Aider del Estado |
| **Inteligencia de datos** | Panel «Salud del Ministerio» (ejecución, desviación, ahorro acumulado) | Success Fee + comunicador |

---

## Ministerio piloto recomendado

| Opción | Pros | Contras | Veredicto CSO |
|--------|------|---------|---------------|
| **Salud** | Alto impacto social; narrativa «Salud Pública» literal | Data sensible; resistencia sindical; baseline complejo | Fase 2 |
| **Infraestructura / Obras (mantenimiento vial)** | Hitos físicos verificables (IoT, fotos geo); contratistas B2G claros | Corrupción histórica en obras — requiere centinela fuerte | **Fase 1 ✅** |

**Piloto P0:** Subprograma **«Mantenimiento vial verificable»** — 1 estado (ej. Miranda o Zulia) o 3 municipios capitalinos, presupuesto acotado **≤ USD 2–5 M equivalente anual** en líneas piloto.

---

## Modelo: Efficiency Gain Share — Piloto Infraestructura Vial

### 1. Brief del Modelo

El Ministerio (vía tesorería sectorial) firma con AGIGOV-VEN un **Acuerdo de Ejecución Inteligente (AEI)**:

1. **Baseline multi-sig:** gasto histórico normalizado 24 meses en las mismas líneas presupuestarias (firmado: Ministro + Contraloría piloto + tesorería).
2. **Ejecución AGIGOV:** 100% contratos piloto en escrow programático; pagos solo por hitos (IoT sensores obra + ≥2 evidencias ciudadanas DID + validación centinela).
3. **Cierre trimestral:** `Δ = Baseline_trimestral − Gasto_efectivo_verificado`. Si Δ > 0 → **ahorro neto** distribuido según regla fija (abajo).
4. **Fee AGIGOV:** solo sobre Δ positivo; si Δ ≤ 0 → fee cero ese trimestre.

**Flujo de valor:**

```
Presupuesto asignado → Escrow LOCKED
  → Avance verificado (IoT + ciudadano + centinela)
  → RELEASE parcial al contratista
  → Trimestre: calcular Δ vs baseline
  → Split ahorro (reinversión | incentivos | AGIGOV)
  → Publicación PWA + panel Salud Ministerio
```

**Por qué es Sistema Nervioso:** el funcionario **no puede** liberar pago sin hito; el ministro **ve** desviación en tiempo real; el sucesor **hereda** ledger, no carpetas.

---

### 2. Análisis de Incentivos

| Actor | ¿Por qué participa? | ¿Qué gana? |
|-------|---------------------|------------|
| **Ministro** | Protección reputacional anti-corrupción; cumplir meta presupuestaria sin desgaste burocrático; visibilidad pública resultados antes de elecciones | Liquidez política: «entregamos más obra con mismo presupuesto» |
| **Director / funcionario** | Menos trámites manuales; panel Aider muestra qué falta | Bono eficiencia (tope carta) + carrera visible |
| **Contratista** | Pago más rápido al cumplir hito vs años de factura | Flujo de caja; ventaja en licitaciones AGIGOV |
| **Ciudadano** | Auditoría colaborativa remunerada (micro-bounty) | Calles reparadas trazables; confianza |
| **Contraloría** | Baseline y Δ en ledger auditable | Menos auditoría forense ex post |
| **AGIGOV** | 10% del ahorro neto (fee) | Ingreso alineado; case study exportable |

#### ¿Por qué el Ministro acepta? (argumento venta CSO)

1. **Escudo anti-corrupción:** irregularidades → centinela FREEZE; el ministro no firma solo.
2. **Liquidez por eficiencia:** ahorro reinvertido **en su cartera** (70%), no recortado por central.
3. **Visibilidad:** dashboard «Salud del Ministerio» — KPIs antes que oposición los use en contra.
4. **Costo cero si falla:** fee AGIGOV = 0 si no hay ahorro.

---

### 3. Reparto del ahorro detectado (Δ positivo)

Regla fija en AEI — **no negociable por funcionario individual**:

| Bucket | % del Δ | Destino | Rationale |
|--------|---------|---------|-----------|
| **a) Re-inversión ministerio** | **70%** | Misma partida presupuestaria (más km vial, más mantenimiento) | El ministro «gana» capacidad operativa — principal incentivo político |
| **b) Incentivos funcionarios** | **20%** | Fondo meritocrático multi-sig (tope individual en carta) | Equipo operativo defiende el sistema |
| **c) Fee AGIGOV** | **10%** | Tesorería protocolo AGIGOV-VEN | Por debajo del rango 5–15% CSO; conservador para primer piloto |

**Salvaguardas:**

- Tope **b):** ≤ 2 salarios mensuales equivalente / funcionario / año piloto.
- **a)** no puede reasignarse a partidas discrecionales sin voto DAO sectorial + soberano.
- Si centinela detecta fraude en hitos → **Δ = 0** ese trimestre + congelamiento bucket b).

**Ejemplo numérico (ilustrativo):**

- Baseline trimestre líneas piloto: **USD 1.000.000**
- Gasto efectivo verificado AGIGOV: **USD 820.000**
- Δ = **USD 180.000**
  - a) Reinversión: **USD 126.000**
  - b) Incentivos: **USD 36.000**
  - c) AGIGOV: **USD 18.000**

---

### 4. Métrica de Verdad (baseline y ahorro)

#### Definición baseline

| Componente | Método | Responsable |
|------------|--------|-------------|
| **Líneas incluidas** | Catálogo partidas ONAPRE/código presupuestario piloto | macro-intelligence + ministerio |
| **Histórico** | Promedio gasto ejecutado **24 meses** mismas líneas (ajuste inflación VES) | Tesorería + acta firmada |
| **Baseline trimestral** | `(Histórico_anual / 4) × factor_estacional` | Multi-sig: Ministro, Contraloría, AGIGOV centinela |
| **Acta baseline** | Hash en ledger; inmutable salvo addendum multi-sig | soberano |

**Fórmula ahorro trimestral:**

```
Gasto_efectivo = Σ pagos escrow RELEASED verificados (trimestre)
Δ = Baseline_trimestral − Gasto_efectivo − Ajustes_aprobados

Ajustes_aprobados = eventos de fuerza mayor firmados (multi-sig), max 5% baseline
```

#### Métricas operativas (Sistema Nervioso)

| Métrica | Fuente | Umbral piloto 12 meses |
|---------|--------|------------------------|
| % gasto piloto en escrow AGIGOV | Ledger | ≥ 95% |
| Tiempo medio pago post-hito | logistico | ↓ 40% vs control histórico |
| Hitos con evidencia dual (IoT + ciudadano) | centinela | ≥ 90% |
| Δ acumulado positivo | Acta trimestral | ≥ 2 de 4 trimestres |
| Uso panel Aider (DAU funcionarios clave) | Telemetría UI | ≥ 80% directores activos |
| Discrepancia UI ↔ ledger | centinela | **0** |

**Hecho verificado hoy:** Escrow demo en Prisma; ingest LoRaWAN stub; **baseline ministerial real no conectada** — piloto requiere integración tesorería.

**Comparación histórico vs AGIGOV:** grupo control = líneas **no** piloto mismo ministerio (difference-in-differences) para aislar efecto AGIGOV.

---

### 5. Auditoría CSO

| Lente | Score | Notas piloto VE infraestructura |
|-------|-------|--------------------------------|
| **Facilidad adopción** | **4** | «Más obra, mismo presupuesto» vende al ministro; requiere champions en tesorería |
| **Escalabilidad** | **4** | Vial escala a otros ministerios; salud requiere capa clínica adicional |
| **Resistencia corrupción** | **5** | Gaming baseline = riesgo #1; mitigación multi-sig + publicación + FREEZE |

**Riesgos top 3:**

| Riesgo | Mitigación |
|--------|------------|
| Baseline inflado artificialmente | Contraloría + AGIGOV firman; histórico 24m auditable |
| Hitos falsos | IoT + 2 ciudadanos DID + centinela; muestra física aleatoria |
| Captura incentivos b) | Tope carta + publicación nombres agregados, no individual hasta norma |

---

### 6. Roadmap piloto (12 meses)

| Mes | Hito |
|-----|------|
| 0–1 | Dictamen soberano AEI + selección líneas presupuestarias |
| 1–2 | Acta baseline multi-sig en ledger |
| 2–4 | 3 contratos vial en escrow + IoT piloto + bounties ciudadanos |
| 4 | Primer cierre trimestral Δ + publicación PWA |
| 6 | Panel «Salud del Ministerio» v1 |
| 12 | Informe case study + decisión escala nacional |

**Pre-requisito:** Carta AGIGOV-VEN ratificada + ≥3 proyectos visibles en `/proyectos` (MVP legitimidad).

---

### 7. Handoff

| Destino | Skill / agente | Acción |
|---------|----------------|--------|
| **Smart contract escrow + split Δ** | **sovereign-economics-monetization** | Modelo `EscrowReleaseV1` + regla reparto 70/20/10 — ver anexo abajo |
| **Dictamen legal AEI** | **soberano** + state-legal-political | CONFORME / REVISAR fee e incentivos |
| **Validación Δ trimestral** | **centinela** | Pipeline baseline ↔ releases |
| **Disputas baseline** | **conciliador** | Ministerio vs contraloría |
| **UX panel Aider** | **comunicador** + sovereign-product-studio | «Salud del Ministerio» |
| **Integración tesorería** | **logistico** | Import partidas + webhooks pago |

---

## Anexo — Handoff: Smart Contract de liberación (sovereign-economics-monetization)

> Especificación lógica — **no despliegue** sin multi-sig soberano. En v1 piloto VE: escrow **programático off-chain** (Prisma + multi-sig) con hash en ledger; on-chain opcional fase 2.

### Estados `EscrowReleaseV1`

```
DRAFT → LOCKED → MILESTONE_PENDING → MILESTONE_VERIFIED → PARTIAL_RELEASE
  → QUARTER_CLOSE → DELTA_CALCULATED → SPLIT_EXECUTED → CLOSED
```

### Reglas de liberación (Reflejo operativo)

```yaml
milestone:
  required_evidence:
    - type: iot_uplink
      min_count: 1
      source: lorawan | edge
    - type: citizen_audit
      min_count: 2
      did_verified: true
  validator: centinela
  on_fail: FREEZE + alert

release:
  amount: milestone.contract_share  # ej. 25% por hito
  approvers: [logistico, ministerio_sig, centinela]
  ledger_commit: required
```

### Reglas split Δ (Success Fee)

```yaml
quarter_close:
  inputs:
    - baseline_hash  # acta trimestral firmada
    - sum_released   # ledger
  compute: delta = baseline - sum_released - force_majeure_adjust
  if delta <= 0:
    agigov_fee: 0
  else:
    split:
      reinvestment: 0.70
      merit_pool: 0.20
      agigov_fee: 0.10
  approvers: [ministerio, contraloria, agigov_treasury, centinela]
  publish: comunicador  # PWA /proyectos + panel ministerio
```

### Token / fiat

- Piloto: **VES / stable reference off-chain** en cuentas escrow reguladas.
- Sin token gobernanza en piloto v1.
- Micro-bounties ciudadanos: utilidad off-chain o pago fiat vía tesorería piloto.

Documento técnico extendido: skill `sovereign-economics-monetization/egs-escrow-spec.md` (config local)

---

## Recomendación CSO final

**Profundizar Efficiency Gain Share en Infraestructura Vial (VE)** como puerta de entrada al **Sistema Nervioso**. Es el modelo más vendible al funcionario porque **reduce desgaste burocrático y aumenta capacidad de entrega**, no porque «innova».

**No escalar a Salud** hasta 2 trimestres positivos en infraestructura y 0 discrepancias centinela.

---

## Referencias

- `docs/innovation/2026-07-03-cuadro-modelos-monetizacion-agigov.md`
- `docs/AGIGOV/ECONOMIA-DAO.md`, `CARTA-AGIGOV-VEN.md`
- skill `agigov-strategic-analysis` (config local)
