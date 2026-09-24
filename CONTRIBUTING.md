# Contribuir a AGIGOV

Gracias por tu interés en AGIGOV — el Sistema Operativo del Estado: agentes institucionales 24/7, ledger inmutable y dashboards ciudadanos.

> **Estado del repositorio:** privado, en fase **PRE-LAUNCH PILOT**. Este documento define cómo contribuiremos cuando se abra a la comunidad pública, y ya rige para colaboradores con acceso actual.

## Filosofía

AGIGOV es **código abierto institucional**: el protocolo es genérico, la legitimidad es local (por país/jurisdicción), la contribución es global. Ver [docs/AGIGOV/CONTRIBUCION.md](docs/AGIGOV/CONTRIBUCION.md) para los puentes de contribución por audiencia (ciudadanos, desarrolladores, gobiernos, agentes IA).

## Antes de contribuir

1. Lee [AGENTS.md](AGENTS.md) — convenciones técnicas, arquitectura, boundaries (qué requiere aprobación humana, qué nunca se hace).
2. Lee el [Código de Conducta](CODE_OF_CONDUCT.md).
3. Revisa [SECURITY.md](SECURITY.md) si tu contribución toca criptografía, autenticación o el ledger.

## Cómo levantar el entorno

```bash
npm install
npm run dev          # PWA en http://localhost:3000
npm run lint          # tsc --noEmit — debe pasar antes de un PR
npm run build         # build de producción
```

La interfaz y la demo EGS (`/modelos/egs/consola?demo=1`) no piden base de datos. Postgres, el bus y los nodos son el nivel siguiente: [docs/GETTING-STARTED.md](docs/GETTING-STARTED.md) · [docs/SETUP-GUIA-MAC.md](docs/SETUP-GUIA-MAC.md) · [infra/README.md](infra/README.md).

## Flujo de contribución

1. **Issue primero** para cambios no triviales — describe el problema, no solo la solución.
2. **Rama desde `main`**, un cambio por PR (evita PRs "paraguas").
3. **`npm run lint` y `npm run build` deben pasar** antes de abrir el PR.
4. **PRs pequeños y enfocados** — facilita revisión y reduce riesgo en un sistema con ledger inmutable.
5. Un mantenedor revisa y aprueba antes de merge a `main`.

## Información privada

Un colaborador no publica información privada. Eso incluye precios, casos comerciales, actas de piloto, claves, copias de la base y cualquier dato del servidor (dirección, rutas de la máquina, secretos de despliegue).

Colaborar no da acceso al servidor. El despliegue y la operación quedan en quienes ya administran la máquina.

## Qué requiere aprobación humana explícita (no negociable)

Ver tabla de *Boundaries* en [AGENTS.md](AGENTS.md#boundaries). En resumen: cambios a firmas/multi-sig, rotación de claves, dictámenes normativos publicados, y despliegue de infraestructura de producción **siempre** requieren revisión humana antes de aplicarse — ningún PR automatizado los aprueba solo.

## Reportar vulnerabilidades

**No abras un issue público** para vulnerabilidades de seguridad. Sigue el proceso de divulgación responsable en [SECURITY.md](SECURITY.md).

## Publicar una "Aplicación de Estado" (antes "modelo")

Si quieres publicar una aplicación en el catálogo AGIGOV (ver `/modelos`) y cobrar rev-share, el contrato técnico es el **Model Manifest v1**: [docs/AGIGOV/MODEL-MANIFEST-v1.md](docs/AGIGOV/MODEL-MANIFEST-v1.md).

## Licencia

Al contribuir, aceptas que tu contribución se licencia bajo los términos de [LICENSE](LICENSE) (Apache 2.0) para el núcleo de la plataforma.
