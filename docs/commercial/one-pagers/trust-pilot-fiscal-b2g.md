# Trust Pilot Fiscal — One-pager B2G

**AGIGOV · Audiencia: ministerio, tesorería, contraloría aliada · SKU piloto 90 días**

---

## En una frase

Cerramos **un rubro presupuestario en 90 días** con **una sola prueba** compartida (gasto vs baseline, hitos de contrato, cierre publicable). Si los números no cuadran, el sistema **se detiene (FREEZE)** — no empeora en silencio. **Success fee solo sobre ahorro Δ real.**

---

## Problema (lo que ya hacen — y duele)

| Tradicional | Dolor |
|-------------|-------|
| ERP + Excel + planillas por área | Cada oficina tiene **su versión** de la verdad |
| Informes a contraloría | **Meses después**, difíciles de reproducir |
| Pagos a contratistas | Por confianza, actas, presión — **no por hito verificable** |
| Portal de transparencia | PDFs estáticos — **no prueba en vivo** |
| Consultoría externa | Cobran **fijo** aunque no haya ahorro |

**No reemplazamos su sistema fiscal.** Ponemos encima una **capa de cierre verificable en plazo fijo**.

---

## Qué aportamos adicionalmente

| Eliminamos / reducimos | Agilizamos | Entregamos al día 90 |
|------------------------|------------|----------------------|
| Disputas opacas entre áreas | Cierre trimestral objetivo **≤90 días** | Informe **Δ** (baseline vs gasto) |
| Pagos sin entrega verificada | Liberación al **hito validado** | Cadena de hitos (Escrow) |
| Informes irreproducibles | Una reunión/mes + kickoff | Tablero publicable sin PII |
| Fee sin resultado | Misma evidencia para todos | **Trust Pack** (acta + hashes) |

---

## Qué incluye el piloto (alcance fijo)

| Incluye | No incluye |
|---------|------------|
| 1 rubro presupuestario (ej. vial, insumos) | Integración total tesorería nacional |
| Operador AGIGOV + guía paso a paso (concierge) | Elecciones / CNE / Data Trust |
| Consola EGS + Escrow + gestión publicada | Millones de usuarios / despliegue nacional |
| Nodo piloto en **su infra o acordada** | Obligatorio hospedar en Oracle |

**Esfuerzo del cliente:** enviar archivos que ya usan (Excel/PDF), confirmar cifras, firmar actas — **sin DevOps ni tecnicismo**.

---

## Diferenciación vs mercado

| Mercado | Límite | AGIGOV |
|---------|--------|--------|
| ERP / GRP (SAP, etc.) | Registra y paga | No certifica **Δ** ni escrow con evidencia compartida |
| Portales transparencia | Publican | No **validan** ni **congelan** discrepancias |
| Auditoría Big Four | Opinión ex post | Lento, no operación diaria |
| Govtech genérica | Formularios | Sin ledger + multi-sig + fee alineado al ahorro |
| «Blockchain gobierno» | Hype | Pocas entregas operativas |

**Cuatro pilares:** (1) verificación operativa FREEZE · (2) success fee solo sobre Δ · (3) escrow por hito con misma evidencia · (4) cierre publicable sin PII.

---

## Hosting y privacidad (respuesta corta)

- **Datos sensibles:** pueden quedarse en **perímetro del cliente** (on-prem o su nube).
- **SBX AGIGOV:** solo para demos y nuestras 3 corridas internas — no obligatorio para el ministerio.
- **Publicación:** solo agregados aprobados — **sin PII** en `/gestion` ni `/contratos`.
- **Acta antes de publicar** — nada va a ciudadano sin validación + firma piloto.

> *«Ustedes controlan dónde viven los archivos; nosotros certificamos coherencia y publicamos lo que ustedes aprueben.»*

---

## Si nos equivocamos

| Situación | Respuesta del sistema |
|-----------|------------------------|
| Número no cuadra | **FREEZE** — no se publica como oficial |
| Error en carga | Corrección **antes** de publicar |
| Disputa ministerio vs contratista | Evidencia compartida + human-in-the-loop |
| Error grave publicado | **Rectificación publicada** — historial visible, no borrado silencioso |
| Fallo operativo AGIGOV | Piloto **no vinculante**; sin success fee si no hay Δ certificado |

---

## Pricing orientativo (no vinculante)

| Tier | Rango | Notas |
|------|-------|-------|
| Trust Pilot Sandbox | USD 0 – 2.500 / trimestre | Veeduría, académico, demo |
| Trust Pilot Regional | USD 15.000 – 40.000 / trimestre | 1 rubro, operado |
| Success fee EGS | 5–15% del **Δ neto certificado** | **Solo después** de Q-Close y acta |

Validar con **cso-monetizacion** + **soberano** antes de firma.

---

## Prueba / demo (15 min)

1. Consola EGS: `/modelos/egs/consola`
2. Contratos / hitos: `/contratos`
3. Gestión publicada: `/gestion`
4. API salud: `GET /api/public/egs/ministry-health`

Comandos dev: `npm run db:seed:egs-pilot` · `npm run api:public` · `npm run dev`

---

## Objeciones (top 5)

| Objeción | Respuesta honesta |
|----------|-------------------|
| «Ya tenemos ERP.» | Correcto — **no lo reemplazamos**; cerramos un rubro con prueba compartida encima. |
| «No tenemos equipo IT.» | **Concierge:** ustedes mandan archivos; nosotros operamos el nodo piloto. |
| «¿Dónde quedan nuestros datos?» | En **su infra o acordada**; publicamos solo lo aprobado sin PII. |
| «¿Y si AGIGOV falla?» | FREEZE + piloto no vinculante + sin fee sin Δ real. |
| «¿Está en producción nacional?» | **No** — piloto acotado 90 días; nacional requiere actas institucionales posteriores. |

---

## Próximo paso

1. Demo 15 min (script champion).
2. Definir **un rubro** + baseline multi-sig acotada.
3. Firmar acta piloto (no vinculante) → día 0 → Trust Pack día 90.

Ver también: [checklist 3 corridas SBX](../trust-pilot-sbx-checklist.md) · [FAQ ministerio](../faq/ministerio-hosting-privacidad.md)

---

*Generado por **comercial-agigov** · Alineado a CSO Trust Pilot · 2026-07-05*
