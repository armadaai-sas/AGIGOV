# Prueba EGS — desde cero (tú solo)

Guía para probar el ciclo fiscal EGS en **producción** sin depender del agente.

**Superficie:** http://137.184.66.163  
**Tiempo:** ~45–90 min · **ventana privada** recomendada

---

## Archivos de datos (descarga)

| Archivo | URL live | Uso |
|---------|----------|-----|
| Hitos ministerio (3 filas) | http://137.184.66.163/docs/prueba-egs-ministerio-hitos.csv | Ingesta paso 6 (edita columna `contrato`) |
| Hitos demo corto | http://137.184.66.163/docs/sample-ingest-3-hitos.csv | Alternativa Trust Pack |
| Checklist JSON | http://137.184.66.163/docs/prueba-egs-ministerio-checklist.json | Máquina / referencia API |

En repo: `public/docs/prueba-egs-ministerio-hitos.csv` y `public/docs/prueba-egs-ministerio-checklist.json`.

---

## Antes de empezar

1. Abre **ventana privada** (sin sesiones viejas).
2. Verifica que prod responde:

```bash
curl -s http://137.184.66.163/api/ops/health
```

Debe devolver `"ok":true` y `"postgres":true`.

3. En la app: **Preferencias** → jurisdicción **Colombia** si quieres MINTRANS / COP (default piloto vial).

---

## Flujo UI (10 pasos)

### 1 — Registro

- URL: http://137.184.66.163/institucional/registro  
- Crea institución de prueba (email + password).  
- Captura: `01-registro.png`

### 2 — Acceso

- URL: http://137.184.66.163/institucional/acceso  
- Login con la cuenta del paso 1.  
- Captura: `02-acceso.png`

### 3 — Provisionar piloto

- URL: http://137.184.66.163/institucional/piloto  
- **Provisionar** → anota el **slug** (ej. `probe-g20-…`).  
- Captura: `03-piloto-slug.png`

### 4 — Modelo EGS

- En el wizard: elige **EGS** (Trust Pilot Fiscal).  
- Captura: `04-modelo-egs.png`

### 5 — Baseline

- **Onboard** → **Ratificar acta baseline** (multi-sig demo).  
- Debe quedar listo para ingesta.  
- Captura: `05-baseline.png`

### 6 — Ingesta (hitos)

**Opción A — más simple:** botón **«Enviar 3 hitos demo»**.

**Opción B — CSV:**

1. Descarga `prueba-egs-ministerio-hitos.csv`.
2. En el wizard, copia el valor del campo **Contrato** (referencia escrow).
3. Sustituye `REEMPLAZA-CON-TU-CONTRATO` en el CSV por ese valor.
4. Sube CSV (+ PDF opcional) → **Enviar filas**.
5. Necesitas **≥ 3 hitos aceptados**.

Captura: `06-ingest.png`

### 7 — Centinela (reconcile)

- Paso **Reconciliar** del wizard (auto al entrar).  
- **OK:** `reconcileOk: true` y ahorro Δ calculado.  
- **FREEZE:** lista de discrepancias → revisar contratos.  
- Captura: `07-centinela.png`

### 8 — Publicar trimestre

**En el wizard:** paso Q-close → **Publicar**.

**O en consola ministerio:** http://137.184.66.163/modelos/egs/consola  
→ **Publicar cierre trimestral** → modal con preview 70/20/10 → confirmar  
(requiere **sesión institucional** del paso 2).

Captura: `08-qclose.png`

### 9 — Consola EGS (resultado + PDF)

- URL: http://137.184.66.163/modelos/egs/consola  
- Revisa: Ahorro verificado · Reinversión 70% · Estado.  
- **Exportar informe PDF** → debe bajar `informe-egs-….pdf`.  
- Captura: `09-consola-egs.png`

### 10 — Telemetría ciudadana

- URL: http://137.184.66.163/gestion  
- Compara que el cierre publicado sea coherente con la consola.  
- Captura: `10-gestion.png`

---

## Probes API (evidencia curl)

```bash
# Estado consola + botón permitido
curl -s "http://137.184.66.163/api/public/models/egs/status?ministry=MINTRANS"

# Salud fiscal trimestral
curl -s "http://137.184.66.163/api/public/egs/ministry-health?ministry=MINTRANS"
```

Tras publicar, `estadoConsola` debe ser `PUBLICADO` y `primaryAction.label` ≈ «Ver telemetría ciudadana».

---

## Nota importante (prod compartido)

En el droplet puede existir telemetría previa de **MINTRANS** (Trust Pack). La consola ministerio muestra datos **por código de ministerio**, no solo de tu slug nuevo. Tu prueba válida es:

- Pasos 1–8 del **wizard** (tenant aislado en tu sesión).
- Pasos 9–10 cuando tu publicación haya actualizado el ministerio **o** en entorno local limpio (abajo).

---

## Alternativa: local limpio (PC)

Solo si quieres base de datos vacía controlada:

```bash
npm install
npm run infra:up:dev
npm run db:migrate
npm run db:seed
npm run api:public    # terminal 1 → :3001
npm run dev           # terminal 2 → :3000
```

UI: http://localhost:3000/modelos/egs/consola  
(provisiona piloto desde `/institucional/piloto` igual que en prod).

---

## Veredicto

| Resultado | Criterio |
|-----------|----------|
| **PASS** | 3+ hitos · reconcile OK · publish OK · PDF descarga · `/gestion` coherente |
| **FAIL** | FREEZE sin resolver · publish 401 sin login · PDF no genera |
| **BLOCKED** | Health 502 — deploy pendiente |
