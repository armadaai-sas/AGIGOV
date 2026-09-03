# Términos de uso — AGIGOV

Este documento es la referencia técnica/institucional. El texto legal vigente para usuarios finales vive en la app y es la única fuente de verdad para ciudadanos e instituciones:

- **Privacidad:** `/legal/privacidad` en la PWA (contenido fuente: `src/i18n/locales/es.ts`, claves `legal.privacy.*`).
- **Términos del piloto institucional:** `/legal/piloto` en la PWA (claves `legal.pilot.*`).

No dupliques ese texto aquí — si cambia, se edita solo en `src/i18n/locales/es.ts` y ambos lados (GitHub y app) quedan consistentes porque enlazan a la misma fuente.

## Términos adicionales para uso del repositorio y la API pública (este documento sí es la fuente)

### 1. Estado del proyecto

AGIGOV está en fase **PRE-LAUNCH PILOT**. El repositorio es privado; el acceso a colaboradores es por invitación. Ninguna funcionalidad marcada como `roadmap` o `beta` en el catálogo (`/modelos`) debe considerarse lista para producción real hasta que su estado sea `disponible`.

### 2. Uso de la API pública (`/api/public/*`)

- Uso permitido: integrar dashboards, herramientas de auditoría ciudadana, e investigación con atribución.
- No permitido: scraping masivo no autenticado que degrade el servicio, reventa de datos como si fueran propios, o uso para generar desinformación sobre instituciones reales.
- La API no expone PII (información personal identificable) por diseño — si encuentras un caso que sí lo haga, repórtalo como vulnerabilidad ([SECURITY.md](SECURITY.md)), no como bug funcional.

### 3. Uso del catálogo de Aplicaciones de Estado (antes "modelos")

Publicar una aplicación en `/modelos` implica aceptar el contrato de [Model Manifest v1](docs/AGIGOV/MODEL-MANIFEST-v1.md): reglas de billing, evidencia requerida, y que el reparto (rev-share) solo se calcula sobre resultado certificado en el ledger, nunca sobre proyecciones.

### 4. Licencia del código

El núcleo de la plataforma se distribuye bajo [Apache License 2.0](LICENSE). Cada Aplicación de Estado puede declarar su propia licencia (ej. `AGIGOV-Model-1.0`) en su manifest, independiente de esta.

### 5. Contacto

Para dudas sobre estos términos, usa los mismos canales de [SECURITY.md](SECURITY.md) o la sección `/institucional` de la app.
