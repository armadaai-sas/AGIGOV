# Auditoría de beta — 24 de septiembre de 2026

Veredicto para salir al mercado como **beta**: **49%**.

Esto no es “cuánto código hay”. Es cuánto del sistema operativo está listo para que una persona que entra por primera vez entienda AGIGOV, use un flujo real y no reciba una promesa que el software no cumple.

El sitio público respondió el 24 de septiembre de 2026, 17:01 UTC. `GET /api/public/health` devolvió `postgres: true`, `panicMode: false`. El nodo par (`:3002`) no respondió.

## Cómo se calculó el 49%

Ocho frentes. Cada uno se puntúa de 0 a 100. El porcentaje es la suma ponderada. 100% sería una beta en la que un desconocido entiende el producto en el primer minuto, completa un camino con datos verdaderos y el texto no promete lo que el sistema no hace.

| Frente | Peso | Nota | Aporte |
| --- | ---: | ---: | ---: |
| Primera visita (UX) | 20 | 38 | 7.6 |
| Texto y mercadeo | 12 | 40 | 4.8 |
| Diseño de interfaz | 10 | 58 | 5.8 |
| Flujos por rol | 12 | 48 | 5.8 |
| Frontend | 10 | 68 | 6.8 |
| Backend de producto | 18 | 55 | 9.9 |
| Ingeniería operacional | 12 | 52 | 6.2 |
| Verdad de los datos | 6 | 35 | 2.1 |
| **Total** | **100** | | **49.0** |

## Qué está hecho

- La API pública está viva y Postgres responde.
- Gestión, propuestas, proyectos y suministros devuelven datos. En vivo: 5 asientos de registro, 1 dictamen, 3 proyectos, inventario en tres estados.
- Registro y sesión institucional persisten en Postgres. La contraseña no vive en el navegador como secreto del servidor.
- Hay menú por rol (ciudadano, empresa, estado, integrador) y un escritorio de una frase más un botón.
- CI en GitHub corre tipo, build, humo, facturación, webhook, pánico y una prueba de aporte contra Postgres sembrado.
- Participar está escrito en lenguaje claro: título, sector y dos hechos.

## Qué impide la beta

### Un desconocido no entiende el producto en el primer minuto — 38/100

El titular de la portada es «Gobernanza» más una palabra que rota. La frase de apoyo es «Modelos operativos con evidencia publicada — no un chatbot.» AGIGOV se nombra más abajo, como «multi-agente de modelos verificables». La persona por defecto del selector es Estado, no quien llega a curiosear.

En la misma pantalla aparece «Centinela pausa si algo no cuadra» sin decir qué es Centinela. Ayuda y el mapa del sistema no están en el menú. El escritorio no muestra los pasos que ya están escritos en código: solo el rol, una frase y un botón.

### El texto promete más de lo que el sistema hace — 40/100

La portada dice que el código está en GitHub y que cualquiera puede auditarlo. El repositorio sigue privado. El corte público está definido y todavía pide una autorización explícita.

«Agentes 24/7» y el enjambre por MQTT no forman parte del camino de quien entra al sitio. La consola de ahorro deja `iapWired` en falso. El voto de consulta se guarda en un archivo local, no en la tabla `Vote` de Postgres.

Nombres que un recién llegado no puede leer sin glosario y que siguen en menú o ficha: EGS, SET, IaaU, DAO, DATA Trust, Centinela, escrow, baseline, IAP.

### La interfaz todavía tiene dos productos — 58/100

Siete páginas usan el patrón de Gestión. Quince siguen en el patrón anterior (`os-workspace`). Los botones de 36px y el diálogo de preferencias están en una rama aparte; el sitio en vivo no los tiene todavía.

### Los flujos no cierran igual para cada rol — 48/100

Ciudadano es el camino más claro: Participar, Propuestas, Gestión pública. Empresa abre con «DATA Trust». Estado abre con «Consola EGS» y «Piloto». El catálogo tiene diez modelos con ficha. Cinco tienen consola propia. El resto redirige a otra página. Ninguno está en hoja de ruta; varios están marcados beta y su copia admite que no son una elección nacional ni un cierre publicado.

### El frontend existe y se puede recorrer — 68/100

Las rutas del escritorio, modelos, participar, contratos, proyectos, ayuda e institucional están montadas. Si la API falla, varias pantallas pueden mostrar una demostración. Esa demostración tiene que seguir etiquetada. Si no lo está, el usuario cree que vio un cierre real.

### El backend de producto está a medias — 55/100

Lo que sí persiste en Postgres: panel, propuestas, proyectos, suministros, aportes, sesión institucional, piloto y cierre cuando hay semilla.

Lo que el sitio en vivo no cumple hoy:

- `GET /api/public/egs/ministry-health` respondió **404**. La promesa de «ahorro del trimestre» no tiene datos publicados en ese nodo.
- `GET /api/public/pilot` respondió `ok: false`: acta ausente, firma múltiple no verificada (0 de 3).
- Consulta y voto, y DATA Trust, viven en archivos bajo `data/`, no en el registro.
- El correo de registro, en el modo por defecto, se escribe en un archivo de salida. Nadie recibe el enlace si un operador no lo envía.
- `POST /api/ops/auth/verification` no exige sesión de operador.

### Ingeniería operacional — 52/100

Hay health, migración, semilla y un puñado de scripts de verificación. No hay archivos de prueba de componentes ni de API. El build de CI no levanta el sitio y no recorre Participar ni el escritorio. El enjambre, el bus y el nodo territorial no están en el arranque que ve el usuario.

### Los datos que se ven no son un cierre — 35/100

Los tres proyectos y el dictamen del sitio público son semilla (`proj-dao-salud-movil`, `acta-seed-001`, resumen «Gestión transparente publicada»). Sirven para enseñar la forma del producto. No son un acto publicado por una institución. Hoy un recién llegado no tiene cómo distinguirlos de un resultado real, salvo que lea el identificador.

## Orden para subir del 49% a una beta mostrable

1. Portada: una frase que diga qué es AGIGOV, para quién es y qué puede hacer hoy. Sin Centinela, sin «multi-agente» y sin «código abierto» hasta que el repositorio sea público.
2. Menú: nombres en español de lo que la persona va a ver. Ayuda dentro del menú. EGS, SET, IaaU y DATA Trust solo dentro de la ficha, después de la explicación.
3. Un solo camino de beta, de punta a punta, con datos sembrados etiquetados como demostración: ciudadano envía una propuesta y ve el dictamen; o institución entra y ve el ahorro. El 404 de salud ministerial tiene que desaparecer o la pantalla tiene que decir que ese cierre no está publicado.
4. Un solo patrón de página para las quince que siguen en el diseño anterior.
5. Verificación de cuenta con un humano o un correo que sí sale. La ruta de verificación no puede quedar abierta.
6. Una prueba automática que abra la portada, el escritorio y Participar contra la API. Sin eso, el porcentaje de ingeniería no sube.

Hasta cerrar 1, 2 y 3, el producto no está listo para invitar a un desconocido. El resto puede ir en la misma beta, no antes.

## Evidencia

- Salud en vivo: `postgres: true`, par en `:3002` caído, 24 sep 2026 17:01 UTC.
- `GET /api/public/dashboard`, `/proposals`, `/projects`, `/supply`: 200, contenido de semilla.
- `GET /api/public/egs/ministry-health`: 404.
- `GET /api/public/pilot`: `ok: false`, `verifiedSigs: 0`, `threshold: 3`.
- Portada: `src/i18n/locales/es.ts` (`landing.min.hero`, `landing.min.what.lead`, `landing.min.oss`, `landing.min.trust.guard`). Persona inicial Estado: `src/citizen/components/landing/LandingMinimal.tsx`.
- Menú: `src/citizen/platform/deskNav.ts`. Escritorio de una acción: `src/citizen/components/desk/DeskHomeCanvas.tsx`.
- Modelos: `src/citizen/platform/agigovModels.ts`.
- API: `src/server/public-api.ts`. Voto en archivo: `src/pilot/set-vote.ts`. CI: `.github/workflows/ci.yml`.
