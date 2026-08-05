# Workflows Dify — archivo de referencia (no runtime)

**Estado P3:** los handlers TypeScript en `src/agents/` son la **fuente de verdad**.
Los YAML de esta carpeta son **stubs históricos** de Fase 3 (export conceptual a Dify).
No se cargan en CI ni en `agents:flow`.

| Archivo | Intención original | Runtime real |
|---------|-------------------|--------------|
| `centinela-v1.yml` | Validación + FREEZE HITL | `src/agents/` + panic/ledger |
| `logistico-v1.yml` | Pipeline logística | `src/agents/` + escrow |

## Política

1. **No** conectar Dify cloud a prod sin dictamen soberano + secrets fuera de repo.  
2. Si se reintroduce orquestación visual: generar desde código o importar YAML **versionado** y auditar tools HTTP.  
3. Hasta entonces: tratar YAML como documentación ejecutable-en-papel.

Archivado conceptual: mantener aquí para onboarding; no borrar sin actualizar `AGENTS.md`.
