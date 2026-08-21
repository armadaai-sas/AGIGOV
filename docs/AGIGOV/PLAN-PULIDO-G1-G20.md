# Plan de pulido OSGOV — hitos G1–G20 (Scrum / GO·NO-GO)

**Estado:** activo · **Modo:** finish-product + UX polish  
**Superficie live:** `http://137.184.66.163/`  
**Canvas:** `agigov-polish-g1-g20`  
**Principio:** sin PASS inventado; cada hito cierra con evidencia. **No hace falta llegar a G20** — solo los G necesarios para producción usable.

---

## 1. Objetivo

Pulir, limpiar y simplificar el OS para **producción usable por extraños**: navegación clara, sin ruido, UX por área, soporte/ventas presentes, veredicto **GO | GO-CONDICIONADO | NO-GO** por ventana.

---

## 2. Ritual Scrum por hito

| Paso | Qué | Artefacto |
|------|-----|-----------|
| Scope | Área + rutas | Nota |
| Inventario | Links, botones, forms, vacíos | Checklist |
| Prueba live | Droplet + UTC | Evidencia |
| Hallazgos | P0–P2 | Lista |
| Fix | Cambio mínimo | Commit |
| Re-prueba | Post-deploy | Screenshot |
| Veredicto | GO / GO-CONDICIONADO / NO-GO | Tabla |

### Checklist por ventana
Entrada · título 5s · nav activa · cada botón · cada form · empty/loading/error · mobile · guest vs sesión · ¿sobra algo? · ¿ruta muerta?

---

## 3. Hitos — estado actual

| ID | Área | Estado | Notas |
|----|------|--------|-------|
| **G1** | Sidebar sin Crear cuenta/Acceso | **GO** (código) | Dock Sistema = Escritorio + Ayuda; auth en topbar |
| **G2** | Auth topbar | **GO** (código) | Logout → escritorio; cuenta solo topbar |
| **G3** | Escritorio | **GO-CONDICIONADO** | 4 acciones; piloto = enlace opcional avanzado |
| **G4** | Landing labels | **GO** (código) | “Ver todos los modelos”; rail OS/Escritorio/… |
| **G5** | Registro | **GO-CONDICIONADO** | Ya corto + → escritorio; falta E2E Operador B |
| **G6** | Login | **GO-CONDICIONADO** | → escritorio; falta E2E Operador B |
| **G7** | Gestión | **GO-CONDICIONADO** | Ledger primero; reportar irregularidad abajo | Sprint C |
| **G8** | Participar | **GO** (código) | Form-first sin tarjetas de ruido | |
| **G9** | Propuestas | **GO** (código) | CTA Enviar propuesta | |
| **G10** | Modelos | **GO** (código) | Sync strip solo drift/DEV |
| **G11** | Consola EGS | **GO** (código) | Copy corto + ficha |
| **G12** | Contratos | **GO** (código) | Ministry soberano; sin npm |
| **G13** | Piloto fuera camino feliz | **GO-CONDICIONADO** | Solo pie de escritorio “avanzado” |
| **G14** | Hub institucional | **GO** (código) | Hub corto: concierge + Modelos; ensayos → `/ayuda` |
| **G15** | Rutas sombra | **GO-CONDICIONADO** | Keep/kill abajo |
| **G16** | Ventas+soporte | **GO** (código) | Contacto en dock Sistema |
| **G17** | Copy/labels | **GO-CONDICIONADO** | Catálogo→Modelos en UI pública |
| **G18** | Errores/vacíos | **GO** (código) | Sin `npm run` en empty públicos |
| **G19** | Mobile | **GO** (código) | Dock: Escritorio · Modelos · Gestión |
| **G20** | Gate prod Operador B | **NO-GO** aún | Sin PASS real |

---

## 4. G15 Keep / Kill (rápido)

| Ruta | Decisión |
|------|----------|
| `/escritorio`, `/gestion`, `/participar`, `/propuestas`, `/modelos`, consola EGS, `/contratos`, `/ayuda` | **KEEP** |
| `/institucional/registro`, `/acceso` | **KEEP** (solo topbar/footer, no dock) |
| `/institucional/piloto` | **KEEP** avanzado (no camino feliz) |
| `/suministros`, `/cne`, `/transparencia`, `/proyectos` | **HIDE** del dock (accesibles por URL/palette) |
| `/ven/*` legacy | **REDIRECT** → `/modelos` |

---

## 5. Gap Board activo

| ID | Sev | Gap | Next |
|----|-----|-----|------|
| G20 | P0 | Sin Operador B PASS | Pack READY · falta humano B |
| G5/G6 | P1 | Registro/login E2E | Form live OK · E2E = pasos 1–2 de B |
| CI | P1 | `tsc` sin prisma-edge | Fix workflow: generate edge |
| Dom | P1 | HTTPS fijo / dominio | Túnel efímero o dominio |

---

## 6. Próximo movimiento

**G20:** Operador B solo ejecuta `docs/commercial/case-studies/prueba-real-2/01-operador-b-checklist.md` contra `http://137.184.66.163/` (post-deploy `f3085aa`, health `ok:true` @ 2026-08-21T14:00:48Z).
