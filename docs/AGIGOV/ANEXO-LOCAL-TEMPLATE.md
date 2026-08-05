# Anexo local — plantilla `AGIGOV-[ISO]`

Copiar a `ANEXO-AGIGOV-XXX.md` y completar. Hereda **Título I** de [`CARTA-AGIGOV-BASE.md`](./CARTA-AGIGOV-BASE.md).

---

## Identidad

| Campo | Valor |
|-------|-------|
| Código | `AGIGOV-___` |
| ISO 3166-1 alpha-3 | `___` |
| Moneda | `___` |
| Locale UI | `es-__` / `en-__` |
| Timezone | `America/___` |
| Territorio piloto | `___` |
| Ministerio / entidad ancla | `___` |
| Carta base | `docs/AGIGOV/CARTA-AGIGOV-BASE.md` |

## Firmantes multi-sig (piloto)

| Rol | DID (placeholder) |
|-----|-------------------|
| Soberano | `did:agigov:___:soberano` |
| Centinela | `did:agigov:___:centinela` |
| Logístico | `did:agigov:___:logistico` |
| Umbral | 3 |

## Anexos normativos locales (opcional)

- [ ] Marco legal del piloto (cita ley / decreto)
- [ ] Política de hosting (on-prem / BYO / cloud soberana)
- [ ] Idioma ciudadano / glosario
- [ ] Topes de gasto / escrows del piloto

## Criterio de adhesión a la red

1. Health `ok` + peer handshake con al menos un nodo embajador  
2. Acta de adhesión multi-sig (o perfil sandbox documentado)  
3. Federation inbox: al menos 1 hash de checkpoint published del peer  
4. Sin PII en APIs públicas  

## Estado

`draft` | `pilot` | `sandbox` | `active`
