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
| Computación cuántica | **Roadmap** PQC (inventario hoy; híbrido no productivo) |
| Desinformación | Comunicador + datos publicados verificables |

## Capas de defensa

```
1. Perimetral     — WireGuard, MQTT solo VPN, honeypots
2. Protocolo      — IAP: Ed25519 + X25519 + anti-replay (clásico)
3. Aplicación     — PANIC_MODE, validación centinela
4. Datos          — Postgres core + SQLite edge, sync conflict rules
5. Post-cuántico  — ML-KEM / ML-DSA en guardian (**roadmap / inventario**; sin claim productivo)
6. Operacional    — Runbooks, drills, auditoría continua
```

## PQC (Post-Quantum Cryptography)

Ver `docs/PQC-GUARDIAN-CUANTICO.md` y `docs/P6-LEGITIMIDAD-SEGURIDAD.md` (honestidad PQC).

**Estado live (prod-light):** inventario clásico; `hybridClaimAllowed=false`.  
**No vender** “seguridad cuántica ya” ni “quantum-safe”.

| Nodo | Algoritmo objetivo | Estado real |
|------|-------------------|-------------|
| Core ledger | ML-DSA firmas | Inventario · clásico Ed25519 en prod |
| CNE | ML-KEM + ML-DSA | Roadmap |
| Edge | Híbrido clásico+PQC | Documentado · no desplegado |
| Bus IAP | Agility: negociación suite | Diseño |

## Reglas operativas

1. **Nunca** claves privadas en repositorio
2. **Siempre** verificar firmas antes de commit ledger
3. **FREEZE** ante anomalía; des-congelar solo human-in-the-loop
4. **Drill trimestral** — `npm run panic:drill`
5. **API pública** — sin PII, rate limit, logs centinela
6. **Claims PQC** — solo si `assessPqcReadiness().hybridClaimAllowed === true`

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

| Métrica | Meta | Estado 2026-08-16 |
|---------|------|-------------------|
| Drills panic | 100% exitosos | Suite local / CI |
| Tiempo respuesta FREEZE | < 60 s | Runbook + drill |
| Incidentes no detectados | 0 en piloto | Medición piloto |
| Cobertura PQC nodos críticos | Inventario 100% · híbrido 0% en prod | **Inventario OK · sin claim híbrido** |