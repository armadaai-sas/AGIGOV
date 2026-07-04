# Investigación diseño de confianza — AGIGOV

Documento de decisión antes del cambio visual (jul 2026).  
Referencias: Coinbase Design, NASA Web Design System, GOV.UK, comunicador + tactical-pwa.

---

## Problema actual

- Mezcla visual **AGIGOV (protocolo global)** con **AGIGOV-VEN (piloto Venezuela)** en la misma capa.
- Acumulación de bloques en landing (telemetría, academia, dock, implementaciones).
- Tema oscuro táctico transmite “ops/militar” más que **institución verificable**.

---

## Referentes analizados

| Referente | Señales de confianza | Aplicación AGIGOV |
|-----------|---------------------|-------------------|
| **Coinbase** | Fondo claro, azul `#0052FF`, tipografía grande, mucho espacio, CTAs únicos | Skin `trust`: blanco + azul institucional, una acción primaria por pantalla |
| **NASA WDS** | Azul `#0B3D91`, grises neutros, jerarquía clara, datos sin ruido | Eyebrows cortos, métricas en cards planas, sin glow excesivo |
| **GOV.UK** | Alto contraste, lenguaje ciudadano, navegación predecible | Sidebar fijo, breadcrumbs, copy sin jerga en capa pública |

---

## Decisión: skin `trust` (default)

- **Fondo:** `#FFFFFF` / `#F8FAFC`
- **Texto:** `#0F172A` (slate-900)
- **Primario:** `#0052FF` (confianza fintech) con hover `#0040CC`
- **Secundario VEN:** barra ámbar fina (3px) solo en bloque AGIGOV-VEN — no en toda la UI
- **Motion:** cinematografía en hero únicamente; app operativa sin animaciones pesadas

---

## Jerarquía de producto

```
AGIGOV                    → protocolo, modelo, institucional global
└── AGIGOV-VEN            → gestión, propuestas, proyectos, CNE, participar (MAR_NORTH_01)
    └── AGIGOV-SBX        → sandbox (selector implementación, no mezclado en nav principal)
```

---

## Rollback

Ver **[DESIGN-ROLLBACK.md](./DESIGN-ROLLBACK.md)** — skin `legacy` restaura tema oscuro anterior.

```js
localStorage.setItem('agigov-skin', 'legacy');
location.reload();
```
