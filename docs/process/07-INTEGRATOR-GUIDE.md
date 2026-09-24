# Proceso 07 — Guía para integradores y terceros

Documento orientado a **desarrolladores externos**, consultoras, ministerios TI y builders de modelos que integran con AGIGOV sin acceso al repo interno.

## Qué es AGIGOV (una frase)

Sistema operativo multi-agente para gobernanza verificable: kernel (Centinela, ledger, multifirma) + **modelos operativos** desplegables — no un chatbot.

Taxonomía completa: [TAXONOMY.md](../design/TAXONOMY.md)

## Superficies públicas

| Recurso | URL |
|---------|-----|
| PWA | https://127.0.0.1/ (o http en demo) |
| Health | `/api/public/health` |
| Dashboard demo | `/api/public/dashboard` |
| Docs API en producto | `/desarrolladores` |
| Registro sandbox | `/institucional/registro` |
| Hablar con equipo | `/institucional` · `#contacto` |

## Onboarding rápido (30 min)

### Paso 1 — Probar vivo

```bash
curl -s https://127.0.0.1/api/public/health
```

Esperado: JSON con `ok` y campos advisory (postgres puede ser soft offline).

### Paso 2 — Explorar UI

1. Landing `/` — entender OS vs LLM
2. `/modelos` — catálogo
3. `/modelos/egs/consola` — consola demo EGS
4. `/escritorio` — hub de trabajo (requiere navegación app)

### Paso 3 — Sandbox autoservicio

1. `/institucional/registro` — crear cuenta demo
2. `/escritorio` — workspaces
3. No confundir con “Hablar con el equipo” (camino humano separado)

### Paso 4 — Integración API

- Leer respuestas de `/api/public/*`
- No almacenar PII devuelta por error
- Implementar timeout y retry; respetar mantenimiento

## Publicar un modelo (builder)

Seguir [03-MODEL-LIFECYCLE.md](./03-MODEL-LIFECYCLE.md) + [MODEL-MANIFEST-v1.md](../AGIGOV/MODEL-MANIFEST-v1.md):

1. Definir audiencia y KPI verificable
2. Entregar `model.manifest.json`
3. PR al repo o fork AGIGOV-[ISO]
4. Pasar `models:audit`
5. Review legal si datos de Estado

## Contribuir código

[02-DEVELOPER-PROCESS.md](./02-DEVELOPER-PROCESS.md) · [CONTRIBUCION.md](../AGIGOV/CONTRIBUCION.md)

## Piloto institucional (gobierno)

1. Leer [ONBOARDING-GOBIERNOS.md](../AGIGOV/ONBOARDING-GOBIERNOS.md)
2. Piloto fiscal: `/institucional/piloto`
3. Trust Pack / Operador B: [PILOTO-PRUEBA-REAL.md](../PILOTO-PRUEBA-REAL.md)
4. Multi-sig: [PILOTO-MULTISIG-CHECKLIST.md](../PILOTO-MULTISIG-CHECKLIST.md)

## Diseño de integraciones UI

Si embebes AGIGOV o replicas patrones:

- [ICON-SYSTEM.md](../design/ICON-SYSTEM.md) — **iconos, hit targets, nav primary/secondary**
- [OS-MINIMAL-TOKENS.md](../design/OS-MINIMAL-TOKENS.md)
- [LANDING-IA-INTL.md](../design/LANDING-IA-INTL.md)

## Evidencia y SLA honesto

AGIGOV no promete PASS sin:

- Health en vivo
- Corrida documentada (Operador B o integrador)
- Artefactos en `docs/commercial/case-studies/` cuando aplique

Ver [00-EVIDENCE-LAW.md](./00-EVIDENCE-LAW.md)

## Contacto

| Necesidad | Canal |
|-----------|-------|
| Sandbox / registro | `/institucional/registro` |
| Piloto / enterprise | `/institucional` · mailto en página |
| Seguridad | `security@agigov.org` (configurar en prod) |
| Bug API | Issue GitHub + health snapshot |

## Mapa de procesos internos (referencia)

Índice completo: [README.md](./README.md)
