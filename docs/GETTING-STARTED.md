# Getting started — clon limpio

AGIGOV se puede abrir en tres niveles. El primero no pide Docker, Postgres ni claves.

Requisito: **Node.js ≥ 22**.

## 1. Solo la interfaz (sin backend)

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

La PWA arranca sola. Las pantallas que leen el ledger quedan vacías o en error de sincronización hasta que exista una API: es el comportamiento esperado, no un fallo del clon.

La consola EGS sí se puede recorrer completa sin base de datos:

http://localhost:3000/modelos/egs/consola?demo=1

`?demo=1` carga un cierre trimestral de demostración (ministerio MPPI, vialidad) y reproduce la ejecución del análisis paso a paso. El dato está etiquetado como demostración; no es telemetría publicada.

Comprueba el árbol antes de un PR:

```bash
npm run lint    # tsc --noEmit
npm run build
```

## 2. API local (Postgres)

Hace falta Docker (o Postgres nativo en `:5432`).

```bash
cp .env.example .env
npm run infra:up:dev
npm run db:generate && npm run db:migrate && npm run db:seed
npm run api:public    # http://localhost:3001
npm run dev           # proxy /api → 127.0.0.1:3001
```

`VITE_API_PROXY` en `.env` apunta el proxy de Vite a esa API. Si no existe `.env`, el valor por defecto del código es `http://127.0.0.1:3001`. No hay fallback a un servidor de producción.

Guía con Docker y la variante sin Docker: [SETUP-GUIA-MAC.md](SETUP-GUIA-MAC.md) · [infra/README.md](../infra/README.md).

## 3. Enjambre, bus y nodos

| Qué | Qué pide | Comando |
|-----|----------|---------|
| Pipeline de agentes en local | Postgres sembrado | `npm run agents:flow` |
| Bus MQTT | `npm run bus:seed` y broker | `npm run bus:worker` |
| Nodo edge / LoRaWAN | Compose aparte | `npm run infra:up:edge`, `npm run infra:up:lorawan` |

Esas piezas no hacen falta para ver la demo de la consola.

## Qué no hace falta para el nivel 1

- Postgres, Docker, Mosquitto, WireGuard
- `GEMINI_API_KEY` ni claves Ed25519
- Acceso al host de producción
