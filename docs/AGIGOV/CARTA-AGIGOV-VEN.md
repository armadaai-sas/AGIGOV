# Carta AGIGOV-VEN

**Governanza de Inteligencia General Autónoma — República Bolivariana de Venezuela**

Versión: **0.1 borrador institucional**  
Estado: Pendiente ratificación multi-sig  
Índice normativo del agente **Soberano**

---

## Preámbulo

El pueblo venezolano, mediante el protocolo **AGIGOV** (*Governanza de Inteligencia General Autónoma*), establece un **nuevo contrato social verificable**: un modelo unificado de Estado, política y economía, descentralizado, transparente, seguro y humanista.

Esta Carta define los principios de **AGIGOV-VEN**, implementación nacional del protocolo genérico **AGIGOV**, replicable por cualquier gobierno del mundo bajo el código **AGIGOV-[ISO]**.

La política tradicional opera en opacidad. **AGIGOV 2.0** opera en evidencia publicada, participación verificable y prosperidad compartida con reglas programáticas.

---

## Título I — Principios fundamentales

### Artículo 1. Soberanía verificable
El poder emana del pueblo y se ejerce mediante procesos trazables en ledger, con identidad **DID** y sin exposición de datos personales en APIs públicas.

### Artículo 2. Transparencia radical
Toda gestión oficial publicada pasa por validación **centinela** y commit en ledger antes del dashboard ciudadano. Lo no publicado no constituye gestión verificable ante la ciudadanía.

### Artículo 3. Legitimidad cívica
Actas, dictámenes y efectos irreversibles requieren alineación con esta Carta y **multi-sig** institucional. Los pilotos nacionales se ratifican por acta firmada con intervención humana.

### Artículo 4. Equidad territorial
Ningún nodo periférico es segunda clase. Los territorios (`MAR_NORTH_01`, municipios, estados) operan **offline-first** con sync diferido sin pérdida de actas ni votos.

### Artículo 5. Humanismo digital
La tecnología sirve a la dignidad humana. El agente **comunicador** traduce telemetría a lenguaje ciudadano comprensible.

### Artículo 6. Seguridad adversarial
Ante fraude, compromiso de claves o anomalías: **FREEZE** → alerta → rotación DID → recuperación con human-in-the-loop. Nodos críticos adoptan **PQC** progresivamente.

### Artículo 7. Innovación institucional
Experimentos acotados con KPIs, rollback y dictamen **soberano**. Piloto ≠ producción nacional sin acta.

### Artículo 8. Puente internacional
AGIGOV-VEN es compatible con la red **AGIGOV** global sin ceder soberanía normativa local.

---

## Título II — Derechos y deberes ciudadanos

### Artículo 9. Derecho a la verdad administrativa
Acceder a telemetría pública agregada: gestión, propuestas, proyectos, suministros.

### Artículo 10. Derecho a participar
Proponer, respaldar campañas, contribuir económicamente a proyectos DAO aprobados, operar nodos comunitarios y verificar recibos de voto (cuando CNE-AGIGOV esté activo).

### Artículo 11. Derecho a la privacidad
Las APIs públicas no exponen PII. La identidad operativa usa DID; datos sensibles permanecen off-chain según marco legal.

### Artículo 12. Deber de evidencia
Las contribuciones y propuestas deben ser verificables. La desinformación deliberada puede ser objeto de mediación **conciliador** y congelamiento de procesos.

---

## Título III — Arquitectura institucional

### Artículo 13. Enjambre de agentes

| Agente | Función institucional |
|--------|----------------------|
| **centinela** | Auditoría, integridad ledger, FREEZE |
| **soberano** | Carta, dictámenes, lenguaje ciudadano |
| **logistico** | Recursos, escrow, suministros |
| **conciliador** | Disputas, grafo de confianza |
| **comunicador** | Transparencia, dashboards |

### Artículo 14. Pipeline de decisión

```
received → validated → decided → committed → published
```

Escrituras irreversibles al ledger solo en estado **committed** con firmas verificadas. UI pública solo en **published**.

### Artículo 15. Centinela y FREEZE
Ninguna mutación al ledger durante FREEZE salvo des-congelamiento autorizado human-in-the-loop.

---

## Título IV — Economía DAO y prosperidad compartida

### Artículo 16. Economía programática
Los fondos públicos y contribuciones ciudadanas hacia proyectos aprobados transitan por **escrow** con liberación por hitos auditables.

### Artículo 17. DAO nacional AGIGOV-VEN
La gobernanza económica del protocolo en Venezuela se ejerce mediante:
- **Token de gobernanza** (parámetros en anexo técnico)
- **Votación DAO** sobre propuestas de gasto
- **Tesorería multi-sig** (≥3 firmantes institucionales)

### Artículo 18. Proyectos visibles
Todo proyecto financiado con fondos AGIGOV-VEN debe publicarse en el dashboard `/proyectos` con: título, sector, monto, hitos, estado escrow y aportes agregados.

### Artículo 19. Contribuciones económicas ciudadanas
Las personas pueden aportar a proyectos aprobados. Los aportes son trazables, agregados públicamente y no otorgan privilegio político proporcional al monto (anti-captura).

### Artículo 20. Topes y rollback
La Carta fija topes por ciclo y sector. Si un proyecto incumple KPIs o fraude verificado, **centinela** congela escrow y **soberano** ordena rollback.

---

## Título V — Participación y política 2.0

### Artículo 21. Propuestas ciudadanas
Registro en ledger con metadatos públicos. Dictamen soberano antes de efectos normativos.

### Artículo 22. Campañas
Campañas registradas con financiamiento trazable y debate mediado por **conciliador** en disputa.

### Artículo 23. CNE-AGIGOV
El Centro Nacional Electoral tokenizado opera bajo especificación `CNE-TOKENIZADO.md`: voto cifrado, recuento reproducible, auditoría continua.

### Artículo 24. Política tradicional vs AGIGOV 2.0
AGIGOV-VEN no impone ruptura violenta. Establece evidencia paralela verificable que exige respuesta con datos de la política tradicional.

---

## Título VI — Seguridad y ciberdefensa

### Artículo 25. Protocolo IAP
Comunicación inter-agente: envelopes cifrados y firmados (Ed25519, X25519, anti-replay).

### Artículo 26. PQC
Nodos core, CNE y tesorería migran a criptografía post-cuántica según `SEGURIDAD-PQC.md`.

### Artículo 27. PANIC_MODE
Modo pánico congela mutaciones. Drills trimestrales obligatorios en pre-producción.

---

## Título VII — Red AGIGOV internacional

### Artículo 28. Modelo genérico
**AGIGOV** es el protocolo base. **AGIGOV-VEN** es la implementación venezolana. Otros Estados se registran como **AGIGOV-[ISO]** conservando carta local.

### Artículo 29. Onboarding de gobiernos
Gobiernos extranjeros pueden conectar nodos, adaptar carta y participar en interoperabilidad ledger según `ONBOARDING-GOBIERNOS.md`.

### Artículo 30. Desarrolladores
Personas y organizaciones contribuyen al protocolo mediante código abierto, API pública e IAP, sin bypass de multi-sig.

---

## Título VIII — Ratificación y enmiendas

### Artículo 31. Ratificación
Esta Carta entra en vigor institucional al cumplir:
- [ ] Acta multi-sig con ≥3 DIDs institucionales
- [ ] Auditoría centinela sin discrepancias ledger ↔ dashboard
- [ ] Informe comunicador publicado en PWA
- [ ] Firmantes humanos identificados (fuera del ledger)

### Artículo 32. Enmiendas
Enmiendas requieren dictamen **soberano CONFORME**, multi-sig y publicación en ledger antes de efecto.

### Artículo 33. Anexos técnicos
Forman parte integrante: `ECONOMIA-DAO.md`, `CNE-TOKENIZADO.md`, `SEGURIDAD-PQC.md`, `CONTRIBUCION.md`, `ONBOARDING-GOBIERNOS.md`.

---

## Firma (placeholder ratificación)

| Rol | DID | Firma | Fecha |
|-----|-----|-------|-------|
| Soberano | did:armada:core:soberano | _pendiente_ | — |
| Centinela | did:armada:core:centinela | _pendiente_ | — |
| Logístico | did:armada:core:logistico | _pendiente_ | — |

---

*Documento preparado para indexación del agente Soberano. Versión ciudadana disponible en PWA `/institucional`.*
