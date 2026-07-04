# Rollback diseño visual

## Restaurar tema oscuro anterior (legacy)

1. Abrir consola del navegador en la PWA, o usar el conmutador en el pie del menú lateral (**Tema legacy**).
2. Ejecutar:

```javascript
localStorage.setItem('agigov-skin', 'legacy');
location.reload();
```

3. Para volver al tema de confianza (claro):

```javascript
localStorage.setItem('agigov-skin', 'trust');
location.reload();
```

## Archivos preservados

| Archivo | Contenido |
|---------|-----------|
| `src/citizen/theme/legacy-dark.css` | Snapshot variables tema oscuro pre-rediseño |
| `src/citizen/theme/trust-light.css` | Tema claro institucional (default) |
| `docs/AGIGOV/DESIGN-TRUST-RESEARCH.md` | Rationale del cambio |

## Git

Para revertir todo el rediseño en el repositorio:

```bash
git checkout HEAD -- src/citizen/components/AppSidebar.tsx src/citizen/components/AppShellLayout.tsx src/citizen/components/HeroCinematic.tsx
# … o revertir el commit del rediseño completo
```
