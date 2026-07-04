# Política de participación AGIGOV-VEN

**Versión:** 0.1 · **Estado:** Borrador institucional  
**Ámbito:** Piloto territorial `MAR_NORTH_01` → escalado nacional con acta  
**Fundamento:** Carta AGIGOV-VEN Arts. 9–12, 21–22 · Revisión `state-legal-political`

---

## 1. Propósito

Establecer reglas **constructivas, participativas y verificables** para que personas, comunidades, desarrolladores y organizaciones contribuyan al modelo AGIGOV-VEN sin caos, captura plutocrática ni opacidad.

La participación en AGIGOV 2.0 **no sustituye** de inmediato las instituciones tradicionales; las **complementa con evidencia pública** en ledger.

---

## 2. Principios

| Principio | Significado |
|-----------|-------------|
| **Evidencia** | Propuestas con hechos verificables (`facts[]`, hashes), no solo opiniones |
| **Constructividad** | Debate sobre datos, hitos y gestión — no ataques personales |
| **Anti-plutocracia** | El monto aportado **no compra** voto político (Art. 19 Carta) |
| **Privacidad** | Sin PII en APIs públicas; identidad operativa vía DID |
| **Transparencia** | Estados del pipeline visibles: `received → validated → decided → committed → published` |
| **Pilotos primero** | Innovación acotada con KPI y rollback antes de escala nacional |

---

## 3. Canales de participación

| Canal | Qué puedes hacer | Aprobación requerida |
|-------|------------------|----------------------|
| **Propuesta ciudadana** | Presentar idea + evidencia | centinela → soberano |
| **Respaldo DID** | Apoyar propuesta (1 persona = 1 voz) | Registro ledger |
| **Aporte económico** | Financiar **proyecto ya aprobado** | Proyecto `daoApproved` + recibo ledger |
| **Campaña registrada** | Organización política 2.0 con techo gasto | soberano + escrow trazable |
| **Nodo comunitario** | Operar territorio edge | Provisión + sync |
| **Contribución técnica** | Código, API, seguridad | PR + centinela CI |
| **Reporte irregularidad** | Señalar discrepancia con evidencia | conciliador |

---

## 4. Propuestas ciudadanas

### 4.1 Contenido mínimo

- Título claro (≤ 120 caracteres)
- Sector: salud | educación | infraestructura | economía | gobernanza | otro
- Territorio (`MAR_NORTH_01` en piloto)
- ≥ 2 hechos verificables (fuente, fecha, hash opcional)
- Sin datos personales de terceros

### 4.2 Pipeline de aprobación

```
Ciudadano envía → received
centinela valida evidencia → validated  (o FREEZE si anomalía)
soberano dictamina vs Carta → decided
  CONFORME → committed (multi-sig si efecto normativo)
  REVISAR → devuelta con observaciones
  RECHAZAR → archivada con motivo público agregado
comunicador publica → published (visible en /propuestas)
```

### 4.3 Niveles de efecto

| Nivel | Alcance | Ratificación |
|-------|---------|--------------|
| **A — Opinión** | Registro público | centinela |
| **B — Piloto** | Experimento 30 días territorial | soberano CONFORME + multi-sig |
| **C — Nacional** | Norma / CNE / token | Acta + ≥3 firmas + asesoría legal humana |

### 4.4 Consulta pública (nivel B+)

Antes de dictamen **CONFORME** en propuestas nivel B: **30 días** de comentarios públicos agregados (sin PII).

---

## 5. Aportes económicos

- Solo a proyectos en `/proyectos` con estado publicado
- Piloto: 1 – 10.000 VES por transacción; territorio `MAR_NORTH_01`
- Recibo verificable en ledger (`receiptId`)
- **1 DID = 1 voto** en gobernanza DAO del proyecto; techo de aporte por DID por ciclo
- KYC off-chain para aportes sobre umbral (definir en anexo fiscal)
- Sin promesa de retorno financiero — **contribución cívica**

---

## 6. Campañas y debate

- Campaña = proceso ledger + metadatos públicos + techo de gasto en escrow
- Financiamiento trazable; informe comunicador periódico
- Disputas entre participantes → **conciliador** (grafo de confianza)
- Prohibido: desinformación deliberada, financiamiento opaco, acoso

---

## 7. Conducta prohibida

- Publicar PII en campos públicos
- Spam (> N propuestas / DID / mes — centinela aplica límites)
- Bypass de FREEZE o multi-sig
- Simular respaldos o aportes (fraude → FREEZE + conciliador)
- Usar AGIGOV para lavado de activos o captura electoral ilegal

---

## 8. Moderación y FREEZE

**centinela** puede congelar procesos ante:

- Anomalías en evidencia o aportes
- Patrones de fraude
- Incumplimiento Carta

Des-congelamiento solo **human-in-the-loop** documentado.

---

## 9. Participación de gobiernos (AGIGOV-[ISO])

Ver `ONBOARDING-GOBIERNOS.md`. Gobiernos se registran con acta propia; no imponen carta sobre otros nodos.

---

## 10. Métricas de éxito (piloto)

- ≥ 20 propuestas recibidas
- ≥ 5 dictámenes soberano publicados
- ≥ 50 aportes trazables
- ≥ 1 propuesta → proyecto DAO
- 0 discrepancias centinela ledger ↔ UI
- Retención PWA `/participar` +15% vs baseline

---

## 11. Enmiendas

Cambios a esta política requieren dictamen **soberano** + publicación en ledger antes de efecto.

---

*Documento alineado con revisión legal-política 2026-07-02. No sustituye asesoría jurídica vinculante.*
