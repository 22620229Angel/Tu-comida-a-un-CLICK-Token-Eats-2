# 💰 Presupuesto Financiero — **TokenEats** (MVP con Pagos en Stellar/Soroban)


---

## 🧭 Metodología de Estimación
- **Tarifa por hora (USD)**
  - Líder Técnico: **$25/h**
  - Dev Backend (Rust/Soroban): **$35/h**
  - Dev Frontend (React/Web3): **$28/h**
  - Diseñador UX/UI: **$20/h**
  - QA/Tester: **$18/h**
- **Técnica:** Planning poker + consenso (“tira y afloja” por iteraciones cortas).
- **Herramientas:** GitHub Projects, Figma, Soroban CLI, Stellar Testnet, Vite/React, Postman, Notion.
- **Tipo de costos:** Solo horas-hombre y herramientas **free-tier** (sin infraestructura).

---

## 👥 Asignación de Personal

| Tarea | Responsable | Justificación |
| --- | --- | --- |
| Identidad ligera + UI (login, menú, carrito, checkout) | Diseñador UX/UI | Flujo de compra optimizado en móvil. |
| Contrato inteligente `TokenEAT` (mint, cupones, permisos) | Dev Backend | Experiencia en **Rust/Soroban**. |
| API Gateway (menú/órdenes mock) | Dev Backend | Validaciones y orquestación. |
| Frontend Web (React + wallet connect) | Dev Frontend | Integración Web + componentes UI. |
| Integración Web3 (SDK + firmas) | Dev Backend + Líder Técnico | Backend implementa; líder asegura conexión/red. |
| Repo y CI básico (lint/build/test) | Líder Técnico | Flujo mínimo de calidad y entrega. |
| Pruebas de usabilidad | Diseñador UX/UI | Detectar fricción en checkout. |
| QA funcional/regresión | QA/Tester | Casos felices y de borde. |
| Documentación (README, BUDGET.md, demo guide) | Líder Técnico | Estándar y mantenible. |

---

## 💵 Costo Total del Proyecto (Base)

| Tarea | Responsable | Horas | Costo |
| --- | --- | ---: | ---: |
| UI/UX principal | Diseñador UX/UI | 6 h | **$120** |
| Contrato Soroban | Dev Backend | 10 h | **$350** |
| API Gateway | Dev Backend | 6 h | **$210** |
| Frontend Web | Dev Frontend | 8 h | **$224** |
| Integración Web3 (3h Backend + 3h Líder) | Backend/Líder | 6 h | **$180** |
| Repo + CI básico | Líder Técnico | 3 h | **$75** |
| Usabilidad | Diseñador UX/UI | 4 h | **$80** |
| QA/Smoke tests | QA/Tester | 4 h | **$72** |
| Documentación | Líder Técnico | 3 h | **$75** |
| **Subtotal** | — | **50 h** | **$1,386** |
| **Margen de ajuste (10%)** | — | — | **$139** |
| **Total estimado** | — | **50 h** | **$1,525 USD** |


---

## 📘 Metadatos de Gestión
- **Tiempo total estimado:** **50 horas**
- **Justificación:** EDT (desglose por historias de usuario) + consenso. Se agrega **10%** por ajustes en integración/pruebas.
- **Riesgos:**
  - Curva de aprendizaje con **Soroban** (permisos/autoridades).
  - Fricción en **wallet connect** móvil.
  - Cambios de alcance en cupones/tokens.

---

## ⚙ Fase 2 — Desarrollo y Asignación de Recursos (Presupuesto Stellar)

### 2.1 Subasta de responsabilidades (GitHub — *Assignees*)
- `contracts/tokeneat` → **@BackendDev**
- `webapp/checkout + wallet` → **@FrontendDev**
- `design/flows` → **@UXDesigner**
- `ops/ci` → **@TechLead**

### 2.2 Cálculo y etiquetas de costo (GitHub — *Labels*)
Crear y aplicar labels por Issue:
- `costo-$120`, `costo-$350`, `costo-$210`, `costo-$224`, `costo-$180`, `costo-$75`, `costo-$80`, `costo-$72`, `costo-$75`.

Cada Issue debe incluir:
- **Alcance**, **horas**, **tarifa**, **responsable**, **criterios de aceptación**.

---

## 🧪 Fase 3 — Pruebas, Despliegue e Implementación Final

### 3.1 Seguridad y QA (Issues)
- `3.1 Pruebas de seguridad Soroban` → **@BackendDev**
- `3.2 Usabilidad de checkout (móvil)` → **@UXDesigner**
- `3.3 QA funcional/regresión` → **@QATester**

### 3.2 Despliegue y Cierre (Manifiesto Financiero)
- Crear **`BUDGET.md`** con: costos, metodología, roles, supuestos, y evidencias (hash/tx en Testnet).
- Actualizar **README** con guía de demo:  
  1) cargar saldo de prueba → 2) comprar → 3) ver recibo on-chain.

---

## ✅ Conclusión
El MVP de **TokenEats** es **viable** con un presupuesto de **$1,525 USD** (50 h, margen incluido). Cubre UI, contrato **Soroban**, integración Web3, QA y documentación; es adecuado para un **prototipo académico** en **Stellar Testnet** orientado a una experiencia de compra simple.

**Total Estimado del Proyecto:** **$1,525 USD**
