# Investigación — Justificación, validación, unificación, escalabilidad y pricing AGIGOV

**Objetivo:** determinar si cada modelo está **bien justificado**, cómo se **valida**, cómo se **unifica** bajo un protocolo, cómo **escala**, cómo se **utiliza** en la práctica y **cómo cobramos** de forma **ganar-ganar** (Estado · ciudadano · integradores · AGIGOV).

**Estado:** investigación v2 — ratificación comercial requiere dictamen soberano + acta multi-sig.  
**Complementa:** [MODELOS-SERVICIOS.md](./MODELOS-SERVICIOS.md) · [INVESTIGACION-MODELOS-ESTADO.md](./INVESTIGACION-MODELOS-ESTADO.md) · `docs/innovation/2026-07-03-cuadro-modelos-monetizacion-agigov.md`

---

## 1. Principio ganar-ganar (definición operativa)

AGIGOV solo es sostenible si **ningún actor principal pierde de forma estructural** al adoptar el protocolo:

| Actor | Gana si… | Pierde si… |
|-------|----------|------------|
| **Estado / tesorería** | Ahorro neto + legitimidad > costo total AGIGOV | Fee > Δ · opacidad persiste · burocracia extra sin panel |
| **Funcionario** | Menos fricción + carrera meritocrática visible | Más trámites · castigo por transparencia sin incentivo |
| **Ciudadano** | Ve gestión real · participa · no paga barrera en v1 | Percepción «vendieron mis datos» · PWA inútil |
| **Empresa / integrador** | Cobro al hito · registro verificable · API clara | Certificación cara sin volumen · capital inmovilizado |
| **AGIGOV (operador)** | Ingreso alineado a **confianza generada**, no a gasto | Cobrar sin Δ · meter falso · escalar antes de validar |

**Regla de oro comercial:**

> El Estado **nunca** paga más a AGIGOV que el **beneficio neto verificable** que el protocolo demostró en el periodo — salvo componentes fijos explícitos (licencia base, concierge) acotados en carta.

**Fórmula ganar-ganar fiscal (EGS):**

```
Δ = Baseline_firmada − Gasto_verificado
Beneficio_Estado = Δ × (1 − fee_AGIGOV)
Fee_AGIGOV = max(0, Δ × tasa_EGS)     ← si Δ ≤ 0 → fee = 0
```

Ejemplo numérico genérico (un trimestre, partida acotada):

| Concepto | Monto |
|----------|------:|
| Baseline trimestral firmada | 1.000.000 |
| Gasto verificado en ledger | 982.000 |
| **Ahorro Δ** | **18.000** |
| Re-inversión ministerio (70%) | 12.600 |
| Incentivos meritocráticos (20%) | 3.600 |
| Fee AGIGOV (10%) | 1.800 |
| **Beneficio neto Estado** | **16.200** (90% del Δ) |

El ministro puede decir: «Retuvimos el 90% del ahorro; AGIGOV cobró solo sobre lo que demostramos».

---

## 2. Marco de justificación — ¿está bien planteado el modelo?

Cada modelo se audita con **7 lentes** (score 1–5; **≥28/35** = justificado para sandbox; **≥32** = justificado para escala comercial):

| # | Lente | Pregunta |
|---|-------|----------|
| J1 | **Problema real** | ¿Existe dolor medible hoy (dinero, tiempo, legitimidad)? |
| J2 | **Alternativa inferior** | ¿Excel/hoja de cálculo o ERP legacy resuelve peor? |
| J3 | **Encaje protocolo** | ¿Usa ledger + agentes + evidencia sin forzar? |
| J4 | **Incentivos alineados** | ¿Nadie gana sabotear el sistema? |
| J5 | **Legalmente desplegable** | ¿Encaja en marco constitucional genérico con carta local? |
| J6 | **Unidad económica** | ¿Métrica de facturación clara y auditable? |
| J7 | **Escalabilidad** | ¿Misma unidad lógica en municipio y país? |

### 2.1 Scorecard — catálogo v1 (10 modelos)

| Modelo | J1 | J2 | J3 | J4 | J5 | J6 | J7 | **Total** | Veredicto |
|--------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:---------:|-----------|
| **EGS** | 5 | 5 | 5 | 5 | 4 | 5 | 4 | **33** | ✅ P0 comercial |
| **Escrow Institucional** | 5 | 4 | 5 | 5 | 5 | 4 | 5 | **33** | ✅ P0 |
| **Gestión verificable** | 4 | 4 | 5 | 4 | 5 | 3 | 5 | **30** | ✅ Puerta entrada |
| **SET** | 5 | 5 | 5 | 4 | 3 | 4 | 4 | **30** | ✅ Con marco electoral |
| **Participación** | 4 | 4 | 5 | 4 | 4 | 3 | 5 | **29** | ✅ Legitimidad |
| **DAO ciudadano** | 4 | 3 | 4 | 4 | 3 | 3 | 4 | **25** | ⚠️ Tras escrow UI |
| **Consulta ciudadana** | 4 | 4 | 5 | 4 | 4 | 3 | 5 | **29** | ✅ SET lite |
| **Evidencia API** | 4 | 4 | 5 | 5 | 5 | 5 | 5 | **33** | ✅ B2G |
| **IaaU** | 3 | 4 | 5 | 4 | 5 | 5 | 5 | **31** | ✅ Tras metering |
| **Data Trust** | 3 | 3 | 4 | 3 | 2 | 4 | 3 | **22** | ❌ P2 solo |

### 2.2 Scorecard — modelos sectoriales propuestos (investigación)

| Modelo | Total | Veredicto | Bloqueador principal |
|--------|:-----:|-----------|----------------------|
| **TNR** (Tesoro) | 34 | ✅ Hub obligatorio Ola 1 | Integración bancos |
| **DSC** (Datos sensibles) | 33 | ✅ Precondición T3/T4 | Infra compartimentos |
| **LGE** (Logística) | 32 | ✅ Ola 1 | IoT + inventario legacy |
| **CCR** (Cámara comercio) | 31 | ✅ Ola 1 | Registro mercantil legal |
| **AEE** (Emergencias) | 31 | ✅ Ola 2 | Offline edge probado |
| **SPV** (Salud) | 30 | ✅ Ola 2 | PHI + ley salud |
| **FPT** (Función pública) | 29 | ✅ Ola 2 | Sindicatos / nómina |
| **TME** (Transporte) | 29 | ✅ Ola 2 | Concesiones |
| **BPS** (Banca pública) | 28 | ⚠️ Ola 3 | Core banking |
| **RNR** (Recursos naturales) | 28 | ⚠️ Ola 3 | Sensores + regalías |
| **SJP** (Justicia penal) | 27 | ⚠️ Ola 3 | Secreto proceso |
| **RCV** (Reforma constitucional) | 26 | ⚠️ Ola 3 | SET + quórum legal |
| **DSS** (Defensa) | 24 | ⚠️ Ola 4 | T4 air-gapped |

**Modelos a no promover aún:** Data Trust (22) hasta Carta + EGS probado. DAO (25) hasta 3 proyectos escrow visibles en PWA.

---

## 3. Beneficios — matriz por actor y modelo

### 3.1 Beneficios transversales (todos los modelos)

| Beneficio | Estado | Ciudadano | Empresa | AGIGOV |
|-----------|--------|-----------|---------|--------|
| Evidencia antes que opinión | Contraloría audit-able | Confianza | Pago al hito | Producto diferenciado |
| FREEZE centinela | Escudo político | Reporte irregularidad | Menos disputas | Retención |
| Offline-first edge | Servicio en crisis | Acceso rural | Entregas verificadas | Expansión territorial |
| Multi-sig | No firma solo | Legitimidad actas | Contratos claros | Menos riesgo legal |

### 3.2 Beneficios por familia de modelo

| Familia | Beneficio Estado | Beneficio ciudadano | Beneficio AGIGOV |
|---------|------------------|---------------------|------------------|
| **Fiscal (TNR, EGS, Escrow)** | Δ presupuestario · pagos trazados | Más obra/servicio mismo presupuesto | Success fee + utility |
| **Legitimidad (SET, RCV, Participación)** | Elecciones/consultas defendibles | Voto/propuesta con receipt | Licencia proceso |
| **Sectorial (SPV, LGE, AEE…)** | Menos desvío · stock visible | Servicios en crisis trazados | Licencia sector + EGS sectorial |
| **Confianza B2G (CCR, Evidencia API)** | Licitación limpia | Precios/competencia real | Certificación + API |
| **Reservado (DSC, DSS)** | Blind audit sin filtrar ops | Agregados sin PII | Premium T3/T4 |

---

## 4. Validación — cómo sabemos que funciona

Validación en **5 capas** — un modelo no pasa a `disponible` sin las capas 1–3; capas 4–5 para escala nacional.

```
Capa 1 Técnica → Capa 2 Operacional → Capa 3 Económica → Capa 4 Legal → Capa 5 Política
```

### Capa 1 — Técnica

| Criterio | Umbral | Responsable |
|----------|--------|-------------|
| Firmas verificadas antes de commit | 100% | centinela |
| Pipeline received→published | Sin bypass | todos agentes |
| Metering ↔ ledger (si IaaU) | 0 discrepancia | centinela |
| FREEZE funcional en simulacro | PASS | tactical-cybersecurity |
| Sync offline 72h (edge) | Cola drena al reconectar | logistico |

### Capa 2 — Operacional

| Criterio | Umbral | Evidencia |
|----------|--------|-----------|
| Tiempo medio validación hito | ↓ 20% vs manual | Logs logistico |
| Headcount usando consola semanal | ≥ 5 roles distintos | Telemetría PWA |
| Q-Close sin discrepancia material | 2 trimestres seguidos | Acta multi-sig |
| Incidentes centinela resueltos con human-in-the-loop | 100% documentados | evidenceBundle |

### Capa 3 — Económica (ganar-ganar)

| Criterio | Umbral | Fórmula |
|----------|--------|---------|
| Beneficio neto Estado ≥ fee AGIGOV | 12 meses rolling | ver §1 |
| ROI concierge + licencia | ≥ 1.5× en 24 meses | (Δ acumulado − costos fijos) / costos fijos |
| Integrador recupera certificación | ≤ 18 meses | Ahorro fricción / fee cert |
| Churn jurisdicción | 0 por «fee oculto» | NPS funcionarios ≥ 40 |

### Capa 4 — Legal

| Criterio | Responsable |
|----------|-------------|
| Dictamen soberano **CONFORME** o CONFORME con condiciones | soberano |
| Cláusulas fee en carta AGIGOV-[ISO] | soberano |
| Tier DSC asignado y probado | centinela + legal |
| SET: marco electoral local | state-legal-political |

### Capa 5 — Política / percepción

| Criterio | Umbral |
|----------|--------|
| Publicación ciudadana del Δ o telemetría | Sin PII |
| Quejas material «vendieron datos» | 0 pre-escala Data Trust |
| Cobertura prensa / oposición no centra «fee oculto» | Versión ciudadana 1 página publicada |

### Plantilla de validación por piloto (90 días)

```markdown
## Validación [Modelo X] — [Jurisdicción sandbox]

- [ ] C1: 0 bypass ledger en auditoría centinela
- [ ] C2: ≥ N hitos escrow liberados con evidencia triple
- [ ] C3: Δ > 0 OR fee_AGIGOV = 0 demostrado
- [ ] C4: Dictamen soberano firmado
- [ ] C5: Dashboard T0 publicado ≥ 4 semanas
- Rollback si: discrepancia material OR FREEZE > 72h sin resolución
```

---

## 5. Unificación — un protocolo, muchos modelos

Los 24+ modelos **no son productos aislados**. Comparten **6 primitivas**:

| Primitiva | Descripción | Modelos que la usan |
|-----------|-------------|---------------------|
| **P1 — Acta firmada** | Payload canónico + Ed25519 multi-sig | Todos |
| **P2 — evidenceBundle** | Hechos + hashes, no opinión LLM | Todos |
| **P3 — Escrow programático** | LOCKED → VALIDATED → RELEASED | Escrow, EGS, AEE, DAO, BPS… |
| **P4 — Baseline + Δ** | Techo presupuestario + cierre | EGS, TNR, FPT, TME |
| **P5 — Compartimento DSC** | Shard cifrado T2–T4 | SJP, SPV, DSS, SET padrón |
| **P6 — Telemetría T0** | Agregado publicable sin PII | Gestión, Comunicador, todos |

### Stack unificado

```
┌─────────────────────────────────────────────────────────┐
│  Modelos sectoriales (SET, SPV, LGE, SJP, …)            │
├─────────────────────────────────────────────────────────┤
│  Hub fiscal TNR + EGS + Escrow                         │
├─────────────────────────────────────────────────────────┤
│  DSC (tiers T0–T4)                                      │
├─────────────────────────────────────────────────────────┤
│  Agentes: centinela · soberano · logistico · conciliador · comunicador │
├─────────────────────────────────────────────────────────┤
│  IAP v1 · Bus MQTT · Ledger · Prisma                   │
└─────────────────────────────────────────────────────────┘
```

**Regla de unificación comercial:** todo contrato ministerial incluye:

1. **Licencia base** (acceso protocolo + nodo)
2. **Módulo sectorial** (precio según tabla §7)
3. **Metering IaaU** (variable)
4. **EGS opcional** (success fee sobre Δ del módulo)

Evita cotizar 24 silos: cotizas **3 líneas** + EGS.

---

## 6. Escalabilidad

### 6.1 Técnica

| Vector | Mecanismo | Límite conocido |
|--------|-----------|-----------------|
| Horizontal | Nodos edge + sync diferido | Latencia sync territorio remoto |
| Vertical | Postgres core + SQLite edge | >10M tx/día → sharding (roadmap) |
| Confidencialidad | DSC compartimentos independientes | T4 requiere hardware dedicado |
| Multi-jurisdicción | AGIGOV-[ISO] peering SBX | Legal data residency |

### 6.2 Comercial

| Etapa | Alcance | Pricing dominant |
|-------|---------|------------------|
| **S0 Sandbox** | 1 municipio / 1 ministerio | M1 concierge fijo |
| **S1 Regional** | 3–5 entidades | M4 licencia regional + IaaU |
| **S2 Nacional sectorial** | 1 vertical (salud, logística…) | Módulo sector + EGS |
| **S3 Estado completo** | TNR + todos sectores | M4 nacional + EGS global + IaaU volume discount |

### 6.3 Organizacional

| Riesgo escala | Mitigación |
|---------------|------------|
| Funcionarios resisten «cobro por click» | Topes en carta + dashboard costo claro |
| Gaming baseline EGS | Multi-sig contraloría + conciliador |
| Integradores insuficientes | Programa certificación M6 |
| Sobrecarga centinela | Metering automatizado + FREEZE por compartimento |

---

## 7. Utilización — métricas de adopción real

Un modelo **desplegado ≠ utilizado**. KPIs de utilización:

| Métrica | Definición | Meta sandbox | Meta escala |
|---------|------------|--------------|-------------|
| **DAU institucional** | Usuarios rol ministerio / día | ≥ 10 | ≥ 500 |
| **% partida en escrow** | Monto escrow / gasto sector | ≥ 40% | ≥ 80% |
| **Hitos/mes validados** | VALIDATED → RELEASED | ≥ 20 | ≥ 500 |
| **Q-Close a tiempo** | Cierre ≤ T+15 días fin trimestre | 100% | 100% |
| **API calls integradores** | Evidencia API + IAP | ≥ 1k/mes | ≥ 100k/mes |
| **Consultas PWA T0** | Pageviews gestión/modelos | ≥ 1k/mes | ≥ 100k/mes |
| **Propuestas con cierre** | published / received | ≥ 30% | ≥ 60% |

**Utilización mínima para cobrar EGS:** ≥ 80% líneas piloto trazadas en ledger (ver cuadro monetización).

---

## 8. Pricing — libro de precios AGIGOV (propuesta investigación)

Precios en **USD equivalente** — facturación local según carta. Ajuste anual IPC / tipo de cambio soberano.

### 8.1 Componentes fijos (M1–M4)

| Código | Producto | Precio indicativo | Incluye |
|--------|----------|-------------------|---------|
| **M1** | Sandbox 90 días | $25.000 – $75.000 | 1 módulo · nodo dev · capacitación · sin EGS nacional |
| **M2** | Auditoría continua anual | $12.000 – $48.000 / año | Centinela dedicado · reportes contraloría |
| **M3** | Concierge despliegue | $80.000 – $250.000 | Prod nodo · migración · 6 meses soporte |
| **M4-S** | Licencia municipal | $18.000 / año | 1 nodo edge · 3 módulos |
| **M4-R** | Licencia regional | $60.000 – $120.000 / año | Multi-nodo · peering SBX |
| **M4-N** | Licencia nacional | $250.000 – $800.000 / año | Core + DSC base · SLA 99.5% |

### 8.2 Success fee — EGS (M5)

| Parámetro | Rango | **Default recomendado** |
|-----------|-------|-------------------------|
| Tasa sobre Δ | 5% – 15% | **10%** |
| Reparto Δ (AEI tipo) | Negociable en carta | **70% re-inversión · 20% mérito · 10% AGIGOV** |
| Si Δ ≤ 0 | — | **Fee = 0** |
| Mínimo facturable | — | **$0** (no hay mínimo si no hay ahorro) |

**Cláusula ganar-ganar obligatoria en contrato:**

> «El fee del operador AGIGOV en el periodo P no excederá el ahorro neto certificado Δ(P) multiplicado por la tasa EGS, y será cero si Δ(P) ≤ 0.»

### 8.3 Infraestructura como utilidad — IaaU (M6 metering)

Micro-fee por unidad verificada — factura mensual:

| Unidad | Precio indicativo | Notas |
|--------|-------------------|-------|
| Firma IAP verificada | $0.002 – $0.01 | Volumen discount >1M/mes |
| Commit ledger | $0.005 | Incluye hash público |
| Validación hito escrow | $0.50 – $5.00 | Según monto contrato tier |
| Sync nodo edge | $0.08 – $0.25 | Por batch reconectado |
| Consulta API certificada | $0.02 | Evidencia API |
| Emisión voto SET | $0.05 – $0.15 | Por acto emisión |
| Compartimento DSC T3 (GB/mes) | $50 – $200 | Almacenamiento cifrado |

**Topes carta (obligatorio):** gasto IaaU anual ≤ X% presupuesto TI jurisdicción OR techo USD fijo — lo que sea menor.

### 8.4 Módulos sectoriales (add-on anual)

| Módulo | Add-on / año | EGS aplicable |
|--------|--------------|---------------|
| Gestión verificable (base) | Incluido en M4 | No |
| Escrow Institucional | +$24.000 | Sí (% liberaciones) |
| EGS / TNR hub | +$36.000 | Sí (core) |
| SET (proceso electoral) | +$80.000 – $400.000 / proceso | No (licencia evento) |
| Consulta ciudadana | +$8.000 / consulta | No |
| LGE Logística | +$30.000 | Sí |
| SPV Salud | +$45.000 | Sí |
| AEE Emergencias | +$20.000 + activación | Sí en crisis |
| CCR / Evidencia API | +$15.000 + cert integrador | Parcial |
| DSC T3 | +$60.000 | No |
| DSS T4 | Cotización soberana | No |

### 8.5 Integradores y empresas (B2G)

| Código | Producto | Precio |
|--------|----------|--------|
| **M7** | Certificación integrador anual | $2.500 – $8.000 / empresa |
| **M8** | Evidencia aceptada (API) | $0.10 – $1.00 / evidencia |
| **M9** | Data Trust (P2) | $5.000 – $50.000 / año / dataset | Solo tras dictamen |

### 8.6 Ciudadano — sin fee directo v1

| Servicio | Precio ciudadano |
|----------|------------------|
| PWA gestión / modelos | $0 |
| Propuesta / consulta | $0 |
| Aporte DAO demo | Simulado · fiat según marco local |
| Receipt voto SET | $0 |

Ingreso ciudadano indirecto: **confianza → legitimidad → adopción estatal → licencia M4**.

---

## 9. Mix de ingreso recomendado (AGIGOV como empresa)

Objetivo: **no depender de un solo modelo**; alinear con ganar-ganar.

| Fase | Mix ingreso | % objetivo |
|------|-------------|------------|
| **Año 0–1** | M1 sandbox + M3 concierge | 70% fijo · 30% IaaU |
| **Año 1–2** | M4 licencia + M5 EGS + M6 IaaU | 30% fijo · 40% EGS · 30% IaaU |
| **Año 2–3** | EGS + IaaU + M7 integradores | 20% fijo · 45% EGS · 25% IaaU · 10% B2G |
| **Año 3+** | EGS dominante + IaaU + M9 selectivo | 15% fijo · 50% EGS · 25% IaaU · 10% otros |

**Por qué EGS debe dominar:** es el único modelo donde AGIGOV gana **solo si el Estado ahorra** — máxima alineación y defensa comercial («cobramos del delta, no del presupuesto»).

---

## 10. Cuándo NO vender un modelo (kill criteria)

| Señal | Acción |
|-------|--------|
| Score justificación < 25 | No comercializar; mantener investigación |
| Δ negativo 2 trimestres y cliente culpa «fee oculto» | Auditar baseline · comunicador · pausar EGS |
| Metering ≠ ledger | FREEZE facturación IaaU hasta centinela OK |
| Dictamen soberano RECHAZAR | No desplegar módulo |
| Utilización < 20% partida escrow a 6 meses | Re-piloto capacitación · no escalar licencia |
| Data Trust antes de EGS probado | Bloqueo comercial P2 |

---

## 11. Respuestas directas — checklist investigación

| Pregunta | Respuesta |
|----------|-----------|
| **¿Modelos bien justificados?** | EGS, Escrow, TNR, Evidencia API, IaaU: sí (≥31). Data Trust y DAO: aún no. |
| **¿Beneficios claros?** | Sí — matriz §3; ganar-ganar fiscal §1 con ejemplo numérico. |
| **¿Validación?** | 5 capas §4 + plantilla 90 días. |
| **¿Unificación?** | 6 primitivas + stack §5; contrato 3 líneas + EGS. |
| **¿Escalabilidad?** | Técnica, comercial S0→S3, organizacional §6. |
| **¿Utilización?** | KPIs §7 — despliegue ≠ uso. |
| **¿Precios?** | Libro §8 M1–M9 + EGS 10% default + IaaU micro-fees. |
| **¿Ganar-ganar?** | Estado retiene 90% del Δ en reparto 70/20/10; fee cero si no hay ahorro. |

---

## 12. Próximos pasos investigación → producto

| # | Entregable | Dueño |
|---|------------|-------|
| 1 | Hoja precios 1 página (PDF ciudadano + anexo técnico) | comunicador + CSO |
| 2 | Simulador Δ EGS (spreadsheet / UI) | producto |
| 3 | Implementar metering IaaU stub | logistico + centinela |
| 4 | Validar scorecard con 2 jurisdicciones sandbox externas | macro-intelligence |
| 5 | Dictamen plantilla fee en carta genérica AGIGOV-[ISO] | soberano |
| 6 | Extender `agigovModels.ts` solo modelos ≥28 con pricing metadata | producto |

---

## Referencias

- `docs/innovation/2026-07-03-cuadro-modelos-monetizacion-agigov.md`
- `docs/innovation/2026-07-03-estrategia-monetizacion-investigacion.md`
- `docs/innovation/2026-07-03-egs-piloto-ven-infraestructura.md` (reparto 70/20/10)
- [INVESTIGACION-MODELOS-ESTADO.md](./INVESTIGACION-MODELOS-ESTADO.md)

---

*Investigación v2 — Jul 2026. Precios indicativos; no constituyen oferta comercial hasta acta multi-sig y dictamen soberano.*
