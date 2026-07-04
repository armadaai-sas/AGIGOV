# Centro Nacional Electoral tokenizado (CNE-AGIGOV)

Concepto para un **Centro Nacional Electoral** digital bajo AGIGOV-VEN: voto seguro, auditable y resistente a fraude cibernético.

## Visión

Reemplazar la opacidad del recuento tradicional con un sistema donde:

- Cada voto es **emitido, cifrado y registrado** sin revelar identidad en público
- El **recuento es reproducible** por auditores independientes
- **Centinela** congela el proceso ante anomalías
- El ciudadano **verifica** que su voto contó (sin prueba vendible)

## Arquitectura conceptual

```
Ciudadano (DID + dispositivo)
  → Emisión voto cifrado (boleta hash-linked)
  → Cola edge (offline OK)
  → Core ledger (commit con multi-sig CNE)
  → Recuento homomórfico / MPC (fase avanzada)
  → Publicación agregados (comunicador → PWA)
  → Auditoría centinela + terceros
```

## Capas de seguridad

| Capa | Medida |
|------|--------|
| Identidad | DID wallet-less; no PII en ledger público |
| Voto | Cifrado end-to-end; boleta anónima |
| Integridad | Hash chain por mesa/territorio |
| Anti-fraude | Replay guard, rate limits, FREEZE |
| Post-cuántico | PQC en nodos CNE (ver SEGURIDAD-PQC.md) |
| Humano | Multi-sig comisión electoral + acta |

## Token de voto (concepto)

| Propiedad | Descripción |
|-----------|-------------|
| No transferible | 1 ciudadano → 1 token de emisión por elección |
| Quemable | Se consume al votar |
| Verificable | Receipt hash sin revelar opción a terceros maliciosos |
| Auditabilidad | Agregados públicos; detalle cifrado hasta cierre |

## Fases de implementación

| Fase | Alcance |
|------|---------|
| **CNE-0** | Especificación + threat model |
| **CNE-1** | Piloto consulta no vinculante (1 municipio) |
| **CNE-2** | Elección interna organización / partido piloto |
| **CNE-3** | Referendo territorial con marco legal |
| **CNE-4** | Integración normativa nacional |

## Comparativa

| | CNE tradicional | CNE-AGIGOV |
|---|---------------|------------|
| Recuento | Manual, opaco | Automático, publicado |
| Auditoría | Lenta, disputada | Continua + reproducible |
| Offline | Problemático | Nodos edge con sync |
| Ciberataque | Vulnerable | FREEZE + honeypots |
| Confianza | Fe en institución | Fe + verificación |

## KPIs piloto

- 100% boletas con receipt verificable
- 0 discrepancias recuento independiente vs ledger
- Tiempo publicación resultados < 1 h post-cierre
- FREEZE funcional en simulacro de ataque

## Estado repositorio

- Voto en schema Prisma — parcial (actas, checkpoints)
- Módulo CNE dedicado — **roadmap P3**
- UI `/votar` — **pendiente**
