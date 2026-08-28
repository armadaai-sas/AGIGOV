# Taxonomía AGIGOV (nombres correctos)

## Definición corta

| Término | Qué es | Qué no es |
|---------|--------|-----------|
| **AGIGOV** | El **sistema operativo** (kernel, Centinela, registro, multifirma) | Un chatbot, un LLM, un “producto SaaS genérico” |
| **Modelo** | Un **modelo operativo** que corre *sobre* el OS (EGS, IaaU, custodia…) | Una “app móvil”, un “producto de marketing”, un servicio suelto |
| **Consola** | La UI para **operar** un modelo concreto (ej. Consola EGS) | El catálogo ni el escritorio |
| **Escritorio** | El **espacio de trabajo** tras cuenta — atajos a modelos y operación | Un producto aparte |
| **Gestión pública** | Vista ciudadana del **registro publicado** | Un modelo del catálogo |

## Regla de comunicación

1. En nav y catálogo: di **Modelos** (no Apps, no Productos, no Servicios).
2. “Apps” solo si algún día hay un store tipo aplicación; hoy confundía.
3. Cada ítem del menú debe ser un **destino real** (ruta o acción), nunca una sección de marketing disfrazada de producto (ej. “Resultados”).

## Jerarquía mental

```
AGIGOV (OS)
├── Escritorio          → hub de trabajo
├── Modelos             → catálogo de modelos operativos
│   ├── EGS             → ficha del modelo
│   └── Consola EGS     → operar ese modelo
├── Gestión pública     → registro ciudadano
└── Cuenta              → registro / acceso / piloto
```

Código fuente de verdad: `src/citizen/platform/agigovModels.ts` (`AgigovModel`).
