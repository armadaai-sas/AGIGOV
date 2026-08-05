# Carta AGIGOV — Base (protocolo genérico)

**Governanza de Inteligencia General Autónoma — núcleo compartido**

Versión: **0.1**  
Alcance: principios **AGIGOV** heredables por cualquier jurisdicción `AGIGOV-[ISO]`.  
Anexos nacionales: `CARTA-AGIGOV-VEN.md`, `CARTA-AGIGOV-SBX.md`, `ANEXO-AGIGOV-COL.md`, plantilla `ANEXO-LOCAL-TEMPLATE.md`.

---

## Preámbulo

**AGIGOV** es un protocolo de gobernanza verificable: evidencia antes que opinión, human-in-the-loop en efectos irreversibles, transparencia selectiva (ciudadano ve gestión; adversarios no ven superficie de ataque).

Cada Estado implementa **AGIGOV-[ISO3166-1 alpha-3]** adaptando moneda, territorio y anexos locales **sin ceder soberanía normativa**.

---

## Título I — Principios fundamentales (obligatorios)

### Artículo 1. Soberanía verificable
El poder se ejerce con procesos trazables en ledger e identidad **DID**. Las APIs públicas no exponen PII.

### Artículo 2. Transparencia radical
Gestión oficial publicada solo tras validación **centinela** y commit en ledger. Lo no publicado no es gestión verificable.

### Artículo 3. Legitimidad cívica
Actas e efectos irreversibles requieren alineación con la Carta local y **multi-sig** institucional (≥3 firmantes recomendado).

### Artículo 4. Equidad territorial
Nodos periféricos no son segunda clase. Operación **offline-first** con sync diferido.

### Artículo 5. Humanismo digital
La tecnología sirve a la dignidad humana. Telemetría → lenguaje ciudadano.

### Artículo 6. Seguridad adversarial
Fraude o anomalía → **FREEZE** → alerta → human-in-the-loop → recuperación. PQC progresivo en nodos críticos.

### Artículo 7. Innovación institucional
Experimentos acotados con KPIs, rollback y dictamen soberano. Piloto ≠ producción nacional sin acta.

### Artículo 8. Puente internacional
Compatibilidad con la red AGIGOV global sin ceder soberanía local. Handshake peer + federation inbox (hashes) antes de sync ledger completo.

---

## Cómo anexar un Estado

1. Copiar `ANEXO-LOCAL-TEMPLATE.md` → `ANEXO-AGIGOV-[ISO].md`  
2. Fijar moneda, timezone, territorio piloto, firmantes  
3. Referenciar esta base en el preámbulo del anexo  
4. Ejecutar adhesión / piloto (`docs/AGIGOV/ONBOARDING-GOBIERNOS.md`)  
5. Publicar en `GET /api/public/gov` con `status: pilot|active|sandbox`

---

## No incluye (anexo local)

Constitución nacional, códigos penales, política monetaria, elecciones CNE, tokenomics mainnet.
