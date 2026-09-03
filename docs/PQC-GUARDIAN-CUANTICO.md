# Plan PQC — Guardian Cuántico

Roadmap de migración post-cuántica para A.R.M.A.D.A. Pre-producción v0.1.

## Estado actual (clásico)

| Capa | Algoritmo |
|------|-----------|
| Firmas IAP / ledger | Ed25519 |
| Cifrado envelope | X25519 + XChaCha20-Poly1305 |
| Sensores LoRaWAN | Ed25519 payload |

## Objetivo PQC (Fase piloto)

Migración híbrida **dual-stack** sin romper compatibilidad IAP v1:

| Capa | Clásico | PQC (piloto) |
|------|---------|--------------|
| Firmas | Ed25519 | + ML-DSA-65 (Dilithium) |
| KEM | X25519 | + ML-KEM-768 (Kyber) |
| Envelope | IAP v1 | IAP v2 `pqcHybrid: true` |

## Rol guardian-cuantico (agente)

Responsabilidades post-incidente o en piloto:

1. Acelerar rotación a claves PQC en nodo comprometido
2. Validar que envelopes híbridos verifiquen ambas firmas
3. Auditar downgrade attacks (solo clásico cuando se exige híbrido)

Implementación: **documentada en pre-prod**; agente runtime en piloto Fase 6+.

## Fases de migración

### Fase A — Inventario (P6)

- [x] Documentar superficie criptográfica
- [x] CLI `npm run pqc:inventory` + `assessPqcReadiness` (sin claim híbrido)
- [ ] Dependencia `@noble/post-quantum` evaluada en nodo piloto (Fase B)

### Fase B — Piloto territorial (1 nodo)

- Nodo `MAR_NORTH_01` acepta envelopes IAP v2 híbridos
- Rollback: revertir a v1-only en gateway
- Activar solo con `AGIGOV_PQC_MODE=hybrid-pilot` **después** de impl real

### Fase C — Core nacional

- Todos los agentes emiten híbrido
- Deprecar v1-only tras 90 días

## Validaciones diferidas

- Benchmark latencia en ARM Oracle Free
- Interop con gateways LoRaWAN de bajo ancho de banda
- Auditoría externa de implementación ML-DSA/ML-KEM

## Referencias

- NIST FIPS 204 (ML-DSA), FIPS 203 (ML-KEM)
- Agente **cryptography-expert** (`.github/agents/cryptography-expert.agent.md`)
- Agente **cybersecurity-expert** (`.github/agents/cybersecurity-expert.agent.md`) — guardian-cuántico en incidente
- Runbook P6: `docs/P6-LEGITIMIDAD-SEGURIDAD.md`
