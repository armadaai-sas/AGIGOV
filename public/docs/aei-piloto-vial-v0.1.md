# Anexo I — Acuerdo de Ejecución Inteligente (AEI)

**Piloto EGS · Mantenimiento Vial Verificable · AGIGOV-VEN**

Versión: **0.1 borrador**  
Estado: Pendiente dictamen soberano y firma multi-sig  
Adjunto a: **Carta AGIGOV-VEN**, Título IV (Economía programática)

---

## Preámbulo

El presente Acuerdo de Ejecución Inteligente (en adelante, **AEI**) materializa el piloto nacional de **Efficiency Gain Share** entre el Ministerio signatario de infraestructura vial y el protocolo **AGIGOV-VEN**, en los términos de los artículos 16, 17 y 20 de la Carta AGIGOV-VEN.

El AEI convierte a AGIGOV en **infraestructura operativa de utilidad diaria** del Ministerio: la no utilización del **Smart Escrow** y del cierre trimestral automatizado equivale, para efectos de este piloto, a operar sin trazabilidad verificable de fondos.

---

## Cláusula 1. Objeto y alcance

**1.1.** El Ministerio incorpora al piloto las partidas presupuestarias identificadas en el **Anexo Técnico A** (códigos ONAPRE / catálogo interno), por un monto agregado no superior al límite fijado en acta ministerial.

**1.2.** Duración inicial: **doce (12) meses**, prorrogable por acta addendum con las mismas firmas de la Cláusula 8.

**1.3.** Territorio piloto: estados y municipios listados en Anexo Técnico B.

---

## Cláusula 2. Baseline presupuestario

**2.1.** **Baseline anual** = promedio del gasto ejecutado en las partidas del Anexo Técnico A durante los **veinticuatro (24) meses** anteriores a la firma, ajustado por factor de inflación oficial aplicable, consignado en **Acta Baseline** con hash en ledger AGIGOV-VEN.

**2.2.** **Baseline trimestral** = `(Baseline anual / 4) × factor estacional`, donde el factor estacional es el acordado en acta y no podrá modificarse unilateralmente.

**2.3.** La Acta Baseline requiere firma electrónica calificada o multi-sig institucional de: (i) Ministro o Viceministro competente, (ii) representante de Contraloría General de la República o su delegado piloto, (iii) observador AGIGOV-VEN (**centinela**).

---

## Cláusula 3. Smart Escrow — mecanismo de liberación

**3.1.** **Smart Escrow** designa el conjunto de reglas programáticas AGIGOV-VEN mediante el cual los fondos del piloto permanecen **LOCKED** hasta la verificación de hitos, sin intervención discrecional individual.

**3.2.** Ningún pago al contratista se libera sin:

- (a) al menos **una (1)** evidencia de avance físico por sensor IoT o uplink territorial verificado;
- (b) al menos **dos (2)** reportes de auditoría ciudadana con identidad **DID** y georreferencia;
- (c) validación del agente **centinela** y firmas multi-sig del Ministerio y **logistico**.

**3.3.** Ante irregularidad detectada, aplica **FREEZE** conforme Artículo 15 de la Carta. Los fondos congelados no computan como gasto efectivo hasta resolución del **conciliador** o dictamen **soberano**.

**3.4.** El Smart Escrow no constituye instrumento financiero especulativo; es mecanismo de custodia y liberación condicionada en moneda de curso legal o stable reference aprobada por tesorería.

---

## Cláusula 4. Cálculo del ahorro (Efficiency Gain Share)

**4.1.** Al cierre de cada trimestre fiscal:

```
Ahorro trimestral (Δ) = Baseline trimestral − Gasto efectivo verificado − Ajustes de fuerza mayor
```

**4.2.** **Gasto efectivo verificado** = suma de liberaciones Smart Escrow con estado **RELEASED** y validación centinela, registradas en ledger en el trimestre.

**4.3.** **Ajustes de fuerza mayor** = montos documentados por acta multi-sig, con tope máximo del **cinco por ciento (5%)** del baseline trimestral.

**4.4.** Si Δ ≤ 0, no procede fee AGIGOV-VEN ni distribución de incentivos del presente AEI para ese trimestre.

---

## Cláusula 5. Reparto del ahorro — blindaje 70 / 20 / 10

Cuando Δ > 0, la distribución es **automática e inalterable** por funcionario individual:

| Destino | Porcentaje | Uso |
|---------|------------|-----|
| **Re-inversión ministerial** | **70%** | Exclusivamente partidas del Anexo Técnico A |
| **Fondo de eficiencia institucional** | **20%** | Incentivos a funcionarios del piloto; tope individual en Anexo Técnico C |
| **Fee protocolo AGIGOV-VEN** | **10%** | Sostenibilidad técnica del piloto |

**5.1.** Ningún funcionario podrá reasignar el bucket del 70% a partidas distintas del Anexo Técnico A sin voto DAO sectorial y dictamen **soberano**.

**5.2.** El bucket del 20% se administra por comité paritario Ministerio–Contraloría con publicación agregada trimestral (sin nombres individuales hasta normativa laboral aplicable).

**5.3.** El 10% se abona a tesorería protocolo AGIGOV-VEN solo tras certificación centinela del cálculo Δ.

---

## Cláusula 6. Protección del Ministro y memoria institucional

**6.1.** El Ministro signatario declara que la adhesión al AEI constituye **escudo de debida diligencia**: las liberaciones ejecutadas vía Smart Escrow quedan registradas inmutablemente en ledger AGIGOV-VEN.

**6.2.** La transición gubernamental implica **rotación de claves y firmantes**, no supresión de actas, baselines ni históricos de cierre trimestral.

**6.3.** El panel «Salud del Ministerio» es instrumento de gestión pública; su publicación agregada no expone datos personales (Artículo 11, Carta).

---

## Cláusula 7. Obligaciones AGIGOV-VEN

- Operar Smart Escrow, cierre trimestral (**QuarterClose**) y publicación en PWA `/proyectos`.
- Mantener integridad ledger; discrepancia UI ↔ ledger = **0** tolerancia en piloto.
- Abstenerse de cobro del 10% si Δ ≤ 0.
- Someter innovaciones del piloto a dictamen **soberano** previo.

---

## Cláusula 8. Firma y entrada en vigor

Entrada en vigor tras:

1. Ratificación de Carta AGIGOV-VEN (≥3 firmas institucionales);  
2. Firma del presente AEI por Ministro, Contraloría piloto y tesorería ministerial;  
3. Publicación de hash de Acta Baseline en ledger.

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| Ministro | | | |
| Contraloría | | | |
| Tesorería ministerial | | | |
| Observador AGIGOV-VEN | | | |

---

## Anexos técnicos (fuera de este documento)

- **Anexo Técnico A** — Partidas presupuestarias piloto  
- **Anexo Técnico B** — Territorio  
- **Anexo Técnico C** — Topes incentivos funcionarios  
- **Schema QuarterClose v0.1** — `QUARTER-CLOSE-SCHEMA-v0.1.md`

---

*Documento borrador — requiere dictamen **soberano**: CONFORME | REVISAR | RECHAZAR antes de firma.*
