# AGIGOV — Economía, tokens y DAO

Conceptos breves para la capa económica del modelo AGIGOV / AGIGOV-VEN.

## Principio

> La prosperidad compartida requiere **reglas visibles** y **liberación de fondos por hitos**, no promesas.

## Componentes económicos

| Componente | Función |
|----------|---------|
| **Token gobernanza** | Voto ponderado en DAO, propuestas de gasto |
| **Token utilidad** | Acceso a servicios, incentivos participación |
| **Escrow programático** | Fondos bloqueados hasta evidencia de hito |
| **DAO nacional** | AGIGOV-VEN: tesorería transparente |
| **DAO sectorial** | Salud, infraestructura, educación… |
| **Stable reference** | VES / stablecoin según marco legal local |

## Flujo de un proyecto

```
Propuesta (ciudadano/sector)
  → Soberano valida vs carta
  → DAO vota (token gobernanza)
  → Escrow LOCKED (logístico)
  → Hitos verificados (centinela + evidencia)
  → Escrow RELEASED
  → Comunicador publica en PWA /proyectos
```

## Descentralización del poder económico

| Mecanismo | Efecto |
|-----------|--------|
| Multi-sig tesorería | Ninguna persona mueve fondos sola |
| Topes en carta | Límites por ciclo y sector |
| Publicación obligatoria | Todo gasto > umbral en dashboard |
| Nodos territoriales | Presupuesto local con sync al core |
| Slashing conceptual | Penalización por fraude probado en ledger |

## Innovaciones sugeridas (evaluar en piloto)

1. **Quadratic funding** para propuestas ciudadanas pequeñas
2. **Impact bonds** — pago al cumplir KPI social verificable
3. **UBI piloto** tokenizado en territorio acotado
4. **Carbon / recursos** — trazabilidad sectorial en ledger
5. **Interoperabilidad** — puentes con redes AGIGOV de otros países

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Especulación token | Separar gobernanza vs utilidad; límites carta |
| Lavado | KYC off-chain para entrada fiat; publicación on-chain |
| Captura DAO | Quórum, tiempo de reflexión, veto centinela |
| Volatilidad | Escrow en stable reference para proyectos críticos |

## Estado en repositorio

- Escrow en Prisma (`Escrow` model) — **implementado** (aporte → LOCKED / meta → RELEASED)
- DAO UI `/proyectos` + aporte ciudadano — **implementado** (piloto VES)
- Webhook pagos — **HMAC listo**; proveedor fiat real pendiente
- Token contracts — **roadmap** (no mainnet sin dictamen soberano + legal)

Detalle P4: [`docs/P4-ECONOMIA-DAO.md`](../P4-ECONOMIA-DAO.md)

## Legal Venezuela

Todo despliegue token requiere dictamen **soberano** + asesoría legal local antes de producción nacional.
