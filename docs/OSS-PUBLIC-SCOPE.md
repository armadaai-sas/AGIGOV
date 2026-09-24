# Alcance público vs privado

Decisión tomada el 24 de septiembre de 2026: **opción 1**. Este árbol sigue siendo el repo **privado**. El espejo público, cuando se arme, usa las tres listas de abajo. No se borra nada de aquí.

Un colaborador puede proponer cambios al producto. No puede publicar información privada. No recibe acceso al servidor, ni claves, ni la dirección de la máquina. El espejo todavía no se abre: varios archivos que entrarían en la copia nombran el servidor de producción, y eso hay que quitarlo antes de copiar.

## Entra al repo público

Código y contratos que un clon debe poder leer y ejecutar:

- `src/`, `prisma/`, `prisma-edge/`, `public/`, `index.html`, `vite.config.ts`, `package.json`, `tsconfig*`
- `infra/docker-compose*.yml` y `infra/README.md` (plantillas, sin secretos)
- `docs/` de producto, diseño, fases y setup: `GETTING-STARTED.md`, `SETUP-GUIA-MAC.md`, `PLAN-EJECUCION-FASES.md`, `DESIGN-SYSTEM.md`, `docs/AGIGOV/` (manifiesto y concepto)
- `LICENSE`, `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `.env.example`, plantillas de issue/PR
- `.github/agents/` (equipo de expertos, sin credenciales)

`.env.example` solo lleva placeholders. `.env` ya está en `.gitignore`.

## Se queda solo en el repo privado

No se copia al espejo público:

- **`docs/commercial/`** completo: precios, one-pagers, decks, casos (`prueba-real-*`, `corrida-*-sbx`) y JSON de corridas vivas.
- **Runbooks de producción y workflows que apuntan a un host concreto:** `docs/process/05-SERVER-DEPLOY-OPS.md`, `.github/workflows/operador-b-trust-pack.yml`, `.github/workflows/desktop-release.yml`, y el script `desktop:build:web` mientras embeba una URL de producción.
- **Material de operador:** checklists de prueba ministerial, actas, exports de escrow y health dumps bajo `docs/commercial/case-studies/`.
- **Secretos generados en local** (ya ignorados): `data/did-registry.json`, `data/*.db`, `data/pilot-tenants/*.credentials.json`, `data/pilot-tenants/*-keys.json`, `.env`.

## Hay que reescribir antes del corte

Hoy el host de producción aparece en documentación de proceso, en `public/docs/prueba-egs-ministerio-checklist.json` y en comentarios de deploy. En el espejo público esas URLs pasan a `http://localhost:3000` o se omiten. El proxy de Vite ya no usa ese host como valor por defecto (`VITE_API_PROXY` → `http://127.0.0.1:3001`).

No se publican claves, tokens, ni rutas de máquinas (`/opt/...`). La IP de producción no es documentación de producto.
