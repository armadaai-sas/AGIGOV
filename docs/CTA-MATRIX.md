# CTA matrix (marketing) — fuente de verdad

| Intención | Label canónico | Destino | Dónde puede aparecer |
|-----------|----------------|---------|----------------------|
| Convertir | Abrir entorno de prueba | `/institucional/registro` | Hero primary, Continuum, Deploy, Contact, Nav Comenzar, Footer |
| Explicar API | Conectar a la API / Desarrolladores | `/desarrolladores` | Hero secondary, Nav Empresa, Footer |
| Ver resultados | Resultados | `/#resultados` | Nav Productos, Footer, Continuum |
| Por qué OS | Por qué OS | `/#autoridad` | Footer, Continuum |
| Modelos | Modelos | `/modelos` | Nav, Footer, Continuum |
| Hablar | Contacto / mailto | `/#contacto` o `TEAM_CONTACT_MAILTO` | Contact path 2, Nav |
| Demo / beta | Abrir demo | ruta `consolePath` (p.ej. `/cne`) | Ficha modelo status=beta |
| Beta sin consola | Probar en el entorno de prueba | `/institucional/registro` | Ficha modelo sin consolePath |

Reglas: no mezclar sandbox con API; no vender demo como producción; hashes deben existir en `HomePage`.
