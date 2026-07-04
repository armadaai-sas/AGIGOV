# Brief de Presentación — Panel «Salud del Ministerio»

**Agente:** comunicador · **Audiencia:** Ministro MPPI · **Duración demo:** ~3 minutos  
**Ruta PWA:** `/proyectos` → tab **Salud del Ministerio** · **Datos:** seed piloto Q2 2026

---

## Apertura (30 s)

> «Ministro, este panel no es un reporte PDF: es la **verdad operativa** del cierre trimestral. Cada bolívar liberado pasó por centinela, IoT y auditores ciudadanos antes de salir del escrow.»

Mostrar banner amarillo si aplica: *Piloto técnico — pendiente promulgación pública*.

---

## KPIs ejecutivos (30 s)

Señalar los tres indicadores superiores:

| KPI | Valor demo | Mensaje |
|-----|------------|---------|
| **Ahorro Δ trimestral** | 180.000 VES | Mismo presupuesto, más obra verificable |
| **Ejecución en escrow** | 100% · 50 hitos | Dinero liberado solo con evidencia |
| **Estado presupuesto** | Conforme | Cierre reconciliado por centinela |

---

## Baseline vs. gasto (45 s)

1. Barra **Baseline trimestral:** 1.000.000 VES  
2. Barra **Gasto verificado:** 820.000 VES (82%)  
3. Destacar **Δ = 180.000 VES** en verde  

> «No pedimos más presupuesto. Pedimos **usar mejor** el que ya tiene.»

---

## Reparto 70 / 20 / 10 (30 s)

| Bucket | Monto demo | Narrativa |
|--------|------------|-----------|
| 70% re-inversión | 126.000 VES | Vuelve a obra pública |
| 20% incentivos | 36.000 VES | Mérito verificable |
| 10% fee AGIGOV | 18.000 VES | Solo si hay ahorro real |

> «AGIGOV cobra **solo sobre el ahorro**, nunca sobre el gasto total.»

---

## Mapa de contratos (45 s)

1. Mostrar grid de **10 contratos viales** (todos verdes en happy path).  
2. Clic en **Contrato vial C01** → drill-down.  
3. Recorrer **5 hitos** con cadena de custodia:
   - Hash de evidencia (copiable)
   - Sensor IoT LoRaWAN
   - 2 DIDs auditores ciudadanos
   - Validación centinela
   - Estado **RELEASED**

> «El miedo a la corrupción desaparece porque la prueba está a un clic.»

---

## Stress test opcional (60 s)

En terminal (preparado antes de la reunión):

```bash
npm run egs:stress
```

Volver al panel → banner rojo **Cierre bloqueado**. Explicar que tesorería no recibe pago hasta resolución.

Restaurar:

```bash
# el script egs:stress restaura automáticamente al final
```

> «El sistema **reacciona** y protege el presupuesto en tiempo real.»

---

## Cierre estratégico

**Pregunta directa:**

> «Acaba de ver 180.000 VES de ahorro verificable y cómo el sistema bloquea pagos ante irregularidad. ¿Autoriza usted el piloto de 90 días en la partida **4.01.02.01.00** firmando el AEI v0.1 esta semana?»

**Pregunta suave (si hay resistencia legal):**

> «¿Qué condición adicional necesita su equipo para que este panel sea la única fuente de verdad del cierre trimestral?»

---

## Checklist pre-demo

- [ ] `npm run infra:up:dev`
- [ ] `npm run db:seed:egs-pilot`
- [ ] `npm run api:public` (terminal 1)
- [ ] `npm run dev` (terminal 2)
- [ ] Abrir http://localhost:3000/proyectos
- [ ] Dictamen + Contrato Eficiencia Pública impresos

## API (desarrolladores)

| Método | Ruta |
|--------|------|
| GET | `/api/public/egs/ministry-health?ministry=MPPI` |
| GET | `/api/public/egs/contracts/:escrowProcessId` |

---

*Generado tras validación del panel PWA — comunicador · piloto vial EGS v0.1*
