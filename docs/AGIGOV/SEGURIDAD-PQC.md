# AGIGOV — Seguridad y PQC

La seguridad es **condición de éxito**, no un anexo. AGIGOV opera bajo adversarios estatales, criminales y cuánticos futuros.

## Modelo de amenazas

| Amenaza | Respuesta AGIGOV |
|---------|------------------|
| Fraude electoral | CNE tokenizado + centinela |
| Corrupción interna | Multi-sig + ledger inmutable |
| Ataque cibernético | FREEZE, honeypots, panic drill |
| Censura / apagón | Nodos edge offline 72h+ |
| Compromiso de claves | Rotación DID + human-in-the-loop |
| Computación cuántica | PQC en nodos críticos |
| Desinformación | Comunicador + datos publicados verificables |

## Capas de defensa

```
1. Perimetral     — WireGuard, MQTT solo VPN, honeypots
2. Protocolo      — IAP: Ed25519 + X25519 + anti-replay
3. Aplicación     — PANIC_MODE, validación centinela
4. Datos          — Postgres core + SQLite edge, sync conflict rules
5. Post-cuántico  — ML-KEM / ML-DSA en guardian (roadmap)
6. Operacional    — Runbooks, drills, auditoría continua
```

## PQC (Post-Quantum Cryptography)

Ver `docs/PQC-GUARDIAN-CUANTICO.md` para implementación.

| Nodo | Algoritmo objetivo | Estado |
|------|-------------------|--------|
| Core ledger | ML-DSA firmas | Piloto |
| CNE | ML-KEM + ML-DSA | Roadmap P3 |
| Edge | Híbrido clásico+PQC | Fase 5 |
| Bus IAP | Agility: negociación suite | Diseño |

## Reglas operativas

1. **Nunca** claves privadas en repositorio
2. **Siempre** verificar firmas antes de commit ledger
3. **FREEZE** ante anomalía; des-congelar solo human-in-the-loop
4. **Drill trimestral** — `npm run panic:drill`
5. **API pública** — sin PII, rate limit, logs centinela

## Seguridad del token y DAO

- Multi-sig tesorería (≥3 firmantes)
- Timelock en retiros grandes
- Pausa de emergencia (centinela)
- Auditoría smart contracts antes de mainnet
- Bug bounty program (CONTRIBUCION.md)

## Certificación y confianza ciudadana

- Informes de auditoría publicados en `/institucional/seguridad`
- Hash de código desplegado en ledger
- Transparencia de incidentes (sin ocultar FREEZE)

## Éxito medible

| Métrica | Meta |
|---------|------|
| Drills panic | 100% exitosos |
| Tiempo respuesta FREEZE | < 60 s |
| Incidentes no detectados | 0 en piloto |
| Cobertura PQC nodos críticos | 100% en P6 |
