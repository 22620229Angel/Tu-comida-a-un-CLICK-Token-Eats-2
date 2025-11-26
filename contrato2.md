# 🤝 CONTRATO DEL EQUIPO – Proyecto **TokenEats – Tu comida a un clic**

---

## 1. Alcance del Proyecto

El equipo se compromete a desarrollar **TokenEats – Tu comida a un clic**, un **MVP de pedidos y pagos para restaurantes** sobre **Stellar Testnet**, cuyo flujo principal incluye:

- Pedido del cliente desde una web/app.
- Pago con **USDC en Stellar** mediante **wallet Freighter**.
- Uso de un **contrato Soroban de escrow** para retener y liberar fondos.
- Panel básico para el comercio con visualización de órdenes y estados.
- Base técnica para un sistema de recompensas tokenizadas en fases posteriores.

El objetivo principal es **entregar un prototipo funcional, usable y demostrable**, alineado con el *Plan de Calidad — SCF (Stellar Only)* y los documentos de viabilidad, riesgos y presupuesto del proyecto.

---

## 2. Entregables Finales del Equipo

Los productos mínimos acordados por el equipo para esta fase (MVP académico) son:

1. `ACTA.md` – Acta de constitución y alcance del proyecto TokenEats.  
2. `MANIFIESTO_VIABILIDAD.md` – Análisis de viabilidad técnica, operativa y económica.  
3. `PLAN_CALIDAD_SCFTOKENEATS.md` – Plan de Calidad alineado con criterios SCF (Stellar Only).  
4. `CHECKLIST_AUDITORIA.md` – Lista de verificación de auditoría (PMI + Stellar/Soroban).  
5. `MATRIZ_RIESGOS.md` – Matriz de riesgos del proyecto y planes de mitigación.  
6. `BUDGET.md` – Presupuesto financiero del MVP (50 h, $1,525 USD).  
7. **Contrato Soroban de Escrow** (`/contracts/escrow`) con pruebas básicas.  
8. **Frontend Web** (`/webapp`) con:
   - Flujo de pedido.
   - Conexión a Freighter.
   - Ejecución de pago en Testnet.
   - Pantalla de estado/recibo on-chain.
9. **API/Backend ligero** (`/api` o similar) para:
   - Gestión de órdenes.
   - Integración con la red Stellar/Horizon.
   - Notificaciones básicas.
10. **Guía de demo y documentación de usuario**:
    - Cómo cargar saldo de prueba.
    - Cómo realizar un pago.
    - Cómo ver la transacción on-chain.
11. **Presentación final** del proyecto (diapositivas + demo).

---

## 3. Responsabilidades por Integrante

| Miembro                              | Rol Principal                         | Responsabilidades Clave |
|--------------------------------------|---------------------------------------|-------------------------|
| **Oliverio Rojas Sánchez**           | Líder del Proyecto y Backend/Soroban | - Coordinar el proyecto y reuniones.<br>- Definir arquitectura general y estándares técnicos.<br>- Desarrollar el **contrato Soroban de escrow** y su integración.<br>- Implementar el **API gateway/backend** y la conexión con Stellar/Horizon.<br>- Configurar el flujo mínimo de **CI (lint/tests/build)**.<br>- Co-redactar documentos técnicos clave (Plan de Calidad, Viabilidad, Riesgos, Budget). |
| **Josue Ángel García Aparicio**      | Frontend y UX/UI                     | - Diseñar la experiencia de usuario (wireframes, mockups y flujo de compra).<br>- Implementar el **frontend web** (React u otra tecnología acordada).<br>- Integrar la conexión con **wallet Freighter** y flujos de firma.<br>- Colaborar en la documentación orientada a usuario (guía de demo, pantallas). |
| **Héctor Eduardo Santiago Bautista** | Analista y QA                        | - Apoyar en el análisis de requerimientos y casos de uso.<br>- Diseñar y ejecutar **pruebas funcionales y de regresión**.<br>- Participar en la redacción de la **Matriz de Riesgos** y la **Checklist de Auditoría**.<br>- Documentar hallazgos, evidencias de pruebas y recomendaciones de mejora. |

> Todos los integrantes se comprometen a:
> - Participar en revisiones de código (code review) según su área.
> - Mantener actualizado el estado de sus tareas en el tablero de trabajo del proyecto (GitHub Projects o similar).
> - Respetar los lineamientos del Plan de Calidad del proyecto.

---

## 4. Compromiso con Plazos y Calidad

El equipo declara formalmente que:

- Se compromete a respetar el **cronograma base** acordado (hitos de septiembre–octubre 2025) y las fechas de entrega definidas por el profesor.
- Cualquier **bloqueo, retraso o riesgo** relevante será comunicado al resto del equipo de forma oportuna (canales acordados: WhatsApp, GitHub Issues, reuniones presenciales/virtuales).
- Se respetará la **Definition of Done (DoD)** del proyecto, que incluye:
  - Código revisado y probado.
  - Documentación mínima actualizada.
  - Flujo funcional validado en **Stellar Testnet**.
- Se buscará cumplir las **métricas de calidad** definidas (por ejemplo: p95 de confirmación, éxito de transacciones, accesibilidad básica y cobertura de pruebas razonable para un MVP académico).

---

## 5. Declaración de Consenso del Equipo

El contenido de este contrato fue discutido y acordado durante la(s) sesión(es) de trabajo del equipo **TokenEats**.

- Cada integrante entiende su rol, sus tareas principales y sus responsabilidades frente al proyecto.
- Cualquier cambio significativo en roles, alcances o fechas deberá quedar registrado en el repositorio (Issue/PR o actualización de este documento) y ser aceptado por los tres integrantes.

Este contrato tiene como propósito **organizar el trabajo, evitar malentendidos y mejorar la calidad del resultado final**, basado en la **colaboración**, la **comunicación clara** y el **aprendizaje conjunto**.

---

## 6. Firma Digital del Contrato

Este contrato será firmado digitalmente mediante una **Pull Request (PR)** en el **repositorio oficial de TokenEats**.

La aprobación de la PR donde se incluya este archivo (por ejemplo, `CONTRATO_EQUIPO.md`) será considerada como **firma oficial** de los siguientes integrantes:

- **Oliverio Rojas Sánchez** – Líder del Proyecto y Backend/Soroban  
- **Josue Ángel García Aparicio** – Frontend y UX/UI  
- **Héctor Eduardo Santiago Bautista** – Analista y QA  

**Regla de firma:**  
La PR que contenga este contrato deberá ser aprobada al menos por **dos miembros del equipo**, y el tercero deberá dejar un comentario de conformidad (👍, “Acepto”, o similar) para considerarse completamente firmado.
