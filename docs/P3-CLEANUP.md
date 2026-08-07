# P3 — Limpieza técnica

**Fecha:** 2026-08-05 · Tras P0–P2. Post-auditoría: probar / corregir gaps residuales.

## Checklist

| # | Ítem | Acción | Estado |
|---|------|--------|--------|
| 1 | Paquete `react-example` | Renombrar a `agigov-armada` | hecho |
| 2 | `src/landing/LandingPage.tsx` huérfano | Eliminar (home = `HomePage` + landing sections) | hecho |
| 3 | Webhook VES | HMAC-SHA256 (`X-Agigov-Signature`) + rechazo prod sin secret | hecho |
| 4 | Dify YAML | `workflows/README.md` — TS es verdad; YAML stub | hecho |
| 5 | Auth localStorage | Sesión = cache de token server; quitar hash local de password | hecho |
| 6 | Docs Developers | Copy webhook HMAC | hecho |

## Auth — modelo post-fix cookie

```
Browser: perfil en localStorage (cache UX, sin token)
    → Cookie httpOnly `agigov_institution_session` en /api/ops/*
    → Bearer residual solo migración / clientes API
Server: InstitutionSession en DB (fuente de verdad)
```

- Login/register/magic-link **siempre** server-side + `Set-Cookie`.
- Blob `agigov-institution-registration-v1` solo espejo de perfil (sin password real).
- `passwordHash: 'server-managed'` en cliente.

## Webhook — prod

```bash
export AGIGOV_PAYMENT_WEBHOOK_SECRET='…'   # obligatorio si NODE_ENV=production
# Firma: HMAC-SHA256(rawBody) → header X-Agigov-Signature: sha256=<hex>
```

Sin secret en non-prod: acepta con `signatureMode: unsigned-dev` (solo demos).

## Queda fuera de P3 (cola post-auditoría)

- Proveedor de pagos real (contrato + URL + rotación de secret)
- Import Dify vivo / borrado físico de YAML tras decisión soberano
- sessionStorage / httpOnly cookie (requiere same-site proxy)
- Renombrar paths `react-example` en lock internos residuales tras `npm install`
