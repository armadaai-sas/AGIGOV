# Guía Mac — Bloques A (GitHub) y B (Docker)

Pasos mejorados para cerrar el push pendiente y levantar el entorno local **sin Oracle**.

**Tiempo estimado:** 15–25 min (primera vez)

> **Importante:** Este repo incluye infra completa en `infra/` (Postgres, Mosquitto, edge, prod).  
> Los scripts viven en **`scripts/`**, no en la raíz. Si ves `setup-local-mac.sh` o `block-b-*.sh` en la raíz que buscan `docker-compose.yml`, es un clone viejo o placeholders de Codespaces — elimínalos y haz `git pull`. Ver `scripts/README.md`.

---

## Antes de empezar

```bash
cd /Users/macbook/Downloads/Armada_VZLA-main
npm run setup:check
```

| Bloque | Qué resuelve |
|--------|----------------|
| **A** | Subir commit `8781887` a GitHub |
| **B** | Postgres + Mosquitto + ledger local |

---

# Bloque A — GitHub (Paso 2)

## A.0 — Comprobar estado

```bash
cd /Users/macbook/Downloads/Armada-VZLA-main
git status
git log -1 --oneline
git remote -v
```

Debes ver:
- Rama `main`, working tree clean
- Remote `origin` → `git@github.com:Armada-2026/Armada-VZLA.git`

---

## A.1 — Elegir método (uno solo)

| Método | Cuándo usarlo |
|--------|----------------|
| **SSH** (recomendado) | Trabajo diario, un solo setup |
| **GitHub CLI (`gh`)** | Prefieres login por navegador |

---

## A.2 — Método SSH (recomendado)

### A.2.1 — ¿Tienes clave SSH?

```bash
ls -la ~/.ssh/id_ed25519.pub ~/.ssh/id_rsa.pub 2>/dev/null
```

**Si no existe ninguna**, créala:

```bash
ssh-keygen -t ed25519 -C "tu-email@ejemplo.com" -f ~/.ssh/id_ed25519 -N ""
```

### A.2.2 — Copiar clave al portapapeles (Mac)

```bash
# Preferir ed25519 si existe:
pbcopy < ~/.ssh/id_ed25519.pub 2>/dev/null || pbcopy < ~/.ssh/id_rsa.pub
echo "Clave copiada al portapapeles ✓"
```

### A.2.3 — Registrar en GitHub

1. Abre: https://github.com/settings/ssh/new  
2. **Title:** `MacBook Armada` (cualquier nombre)  
3. **Key type:** Authentication Key  
4. **Key:** `Cmd+V` (pegar)  
5. Clic **Add SSH key**  
6. Confirma con tu contraseña de GitHub si la pide  

### A.2.4 — Verificar conexión

```bash
ssh -T git@github.com
```

**Éxito** (alguna de estas formas):

```
Hi Armada-2026! You've successfully authenticated...
```

**Error común:**

| Mensaje | Solución |
|---------|----------|
| `Permission denied (publickey)` | Clave no añadida o cuenta GitHub incorrecta |
| `Host key verification failed` | Ejecuta `ssh-keyscan github.com >> ~/.ssh/known_hosts` |

### A.2.5 — Subir el repo

```bash
cd /Users/macbook/Downloads/Armada_VZLA-main
npm run github:push
```

**Éxito:** URL https://github.com/Armada-2026/Armada-VZLA con el commit reciente.

---

## A.3 — Método GitHub CLI (alternativa)

### A.3.1 — Instalar `gh` (si falta)

```bash
brew install gh
# o descarga: https://cli.github.com/
```

### A.3.2 — Login interactivo

```bash
gh auth login
```

Responde en orden:

| Pregunta | Respuesta |
|----------|-----------|
| GitHub.com | **Yes** |
| Preferred protocol | **HTTPS** o **SSH** |
| Authenticate | **Login with a web browser** |
| Código | Copia el one-time code que muestra |

### A.3.3 — Verificar y push

```bash
gh auth status
npm run github:push
```

---

## A.4 — Confirmación final Bloque A

```bash
git status
# "Your branch is up to date with 'origin/main'"

# En navegador:
open https://github.com/Armada-2026/Armada-VZLA/commits/main/
```

---

# Bloque B — Docker local (Paso 3)

## B.0 — Requisitos

| Requisito | Versión mínima |
|-----------|----------------|
| macOS | 10.15+ (Big Sur o newer) |
| RAM libre | 4 GB (Docker usa ~2 GB) |
| Disco | 5 GB libres |

---

## B.1 — Instalar Docker Desktop

1. Descarga: https://www.docker.com/products/docker-desktop/  
2. Arrastra **Docker** a **Applications**  
3. Abre **Docker** desde Applications  
4. Acepta permisos del sistema (contraseña Mac)  
5. Espera el ícono de la ballena en la barra superior → **verde / Running**  

**Primera vez puede tardar 2–5 min.**

### B.1.1 — Verificar instalación

```bash
docker --version
docker compose version
docker info | head -5
```

**Si `docker info` falla:**

| Síntoma | Acción |
|---------|--------|
| `command not found` | Cierra y reabre Terminal; o reinicia Mac |
| `Cannot connect to the Docker daemon` | Abre Docker Desktop y espera "Running" |
| `permission denied` | Docker Desktop → Settings → asegúrate que está iniciado |

---

## B.2 — Setup automático del proyecto

**Un comando (recomendado):**

```bash
cd /Users/macbook/Downloads/Armada_VZLA-main
npm run block-b:setup
```

Equivale a: infra Docker + migrate + seed + verificación.

**Solo infra (sin verify):**

```bash
npm run setup:local
```

**Verificar infra:**

```bash
npm run block-b:verify
npm run block-b:verify -- --api    # incluye API :3001 (Terminal 1 activa)
```

**Qué hace por dentro:**

1. Crea `.env` si no existe (MQTT → localhost)  
2. `docker compose` levanta Postgres `:5432` y Mosquitto `:1883`  
3. Espera a que Postgres responda  
4. Prisma migrate + seed del ledger  
5. SQLite edge + DID registry si faltan  

**Duración:** 2–4 min la primera vez (descarga imágenes Docker).

### B.2.1 — Verificar contenedores

```bash
docker compose -f infra/docker-compose.dev.yml ps
```

Debes ver `armada-postgres-dev` y `armada-mosquitto-dev` **Up**.

### B.2.2 — Verificar base de datos

```bash
docker exec armada-postgres-dev pg_isready -U armada -d armada_core
# /var/run/postgresql:5432 - accepting connections
```

---

## B.3 — Levantar aplicación (3 terminales)

### Terminal 1 — API pública

```bash
cd /Users/macbook/Downloads/Armada_VZLA-main
npm run api:public
```

Espera: `[Public API] http://127.0.0.1:3001`

Prueba en **otra** pestaña:

```bash
curl -s http://127.0.0.1:3001/api/ops/health | head -c 200
curl -s http://127.0.0.1:3001/api/public/dashboard | head -c 200
```

---

### Terminal 2 — PWA ciudadana

```bash
cd /Users/macbook/Downloads/Armada_VZLA-main
npm run dev
```

Abre: http://localhost:3000

| Ruta | Vista |
|------|-------|
| `/` | Dashboard gestión |
| `/propuestas` | Propuestas |
| `/suministros` | Suministros |

---

### Terminal 3 — Flujo agentes + piloto multi-sig

```bash
cd /Users/macbook/Downloads/Armada_VZLA-main
npm run block-b:pilot
```

(O manual: `agents:flow` → `pilot:init` → `pilot:ratify` → `pilot:verify`)

**Éxito:** última línea → `Verificación cierre: OK`

---

## B.4 — Confirmación final Bloque B

```bash
npm run setup:check
```

Todo en verde → entorno local completo.

---

## B.5 — Parar servicios (cuando termines)

```bash
cd /Users/macbook/Downloads/Armada_VZLA-main
npm run infra:down
# Ctrl+C en terminales de api:public y dev
```

---

## Solución de problemas

| Problema | Comando / acción |
|----------|------------------|
| Puerto 5432 ocupado | `lsof -i :5432` → detén otro Postgres |
| Puerto 3000 ocupado | `lsof -i :3000` → mata proceso o cambia puerto Vite |
| `db:seed` falla | `npm run infra:up:dev` y espera 30s, reintenta |
| Piloto verify FAIL | Terminal 1 con `api:public` debe estar activa |
| Reset total Docker | `npm run infra:down` → `docker compose -f infra/docker-compose.dev.yml down -v` → `npm run setup:local` |

---

## Orden recomendado hoy

```
1. Bloque A  →  npm run github:push          ✓
2. Bloque B  →  npm run block-b:setup
3. Terminal 1 → npm run api:public
4. Terminal 2 → npm run dev
5. Terminal 3 → npm run block-b:pilot
6. Verificar  →  npm run block-b:verify -- --api
```

Cuando Oracle Free Tier esté listo, el siguiente paso será `./scripts/prod-up-light.sh` en la VM (guía en `docs/SERVER-SIZING.md`).
