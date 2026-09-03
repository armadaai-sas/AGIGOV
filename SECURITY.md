# Política de seguridad — AGIGOV

## Reporte responsable de vulnerabilidades

Si encuentras una vulnerabilidad de seguridad en AGIGOV (protocolo IAP, ledger, autenticación, agentes, infraestructura), **no abras un issue público**. Repórtala de forma privada:

- **Email:** ver `AGIGOV_EMAIL_REPLY_TO` en la configuración institucional publicada, o el correo de contacto en la sección Institucional de la app.
- Incluye: descripción del problema, pasos para reproducir, impacto potencial, y (si aplica) una prueba de concepto no destructiva.

Responderemos con acuse de recibo en un plazo razonable y te mantendremos informado del progreso hasta la resolución.

## Alcance

Cubre:

- Núcleo de la plataforma: `src/protocol/` (IAP, envelopes firmados), `src/bus/` (bus soberano), `src/db/` (ledger), `src/server/` (API pública).
- Infraestructura de referencia en `infra/`.
- Nodos territoriales / edge (`src/edge/`, `src/ingest/`).

Fuera de alcance:

- Servicios de terceros no operados por AGIGOV.
- Hallazgos que requieran acceso físico no autorizado a infraestructura.
- Ataques de denegación de servicio (DoS) ejecutados contra instancias de producción sin autorización previa por escrito.

## Qué NO hacer

- No accedas, modifiques ni elimines datos que no sean tuyos.
- No ejecutes pruebas contra el droplet/instancia de producción sin coordinación previa con el equipo.
- No publiques la vulnerabilidad (ni detalles técnicos) antes de que se confirme una corrección.

## Garantías criptográficas del sistema (contexto para reportes)

- Firma Ed25519 sobre campos externos canónicos del envelope.
- Cifrado X25519 + XChaCha20-Poly1305 entre agentes.
- Anti-replay: `nonce` + `messageId` + ventana temporal.
- Multi-sig y firmas antes de cualquier efecto irreversible sobre el ledger.
- `PANIC_MODE` congela mutaciones al ledger ante incidente confirmado.

Ver también el runbook de incidentes: [docs/PANIC-RUNBOOK.md](docs/PANIC-RUNBOOK.md).

## Versiones soportadas

Este proyecto está en fase **PRE-LAUNCH PILOT**. Solo la rama `main` recibe parches de seguridad; no hay versiones LTS todavía.
