# 🛡️ Matriz de Riesgos — **TokenEats** 

---

## 🎯 Propósito
Identificar, evaluar y tratar los riesgos clave del proyecto **TokenEats**, manteniendo la **viabilidad técnica y operativa** del MVP sobre **Stellar/Soroban**.

---

## 🧪 Metodología y Escalas

**Escala de Impacto (I) y Probabilidad (P)**: 1 (bajo) … 5 (muy alto)  
**Puntaje** = *I × P*

| Puntaje | Nivel | Semáforo |
|---:|---|---|
| 15–25 | Crítico | 🔴 |
| 8–14 | Alto | 🟠 |
| 4–7 | Medio | 🟡 |
| 1–3 | Bajo | 🟢 |

**Estrategias**: *Evitar, Mitigar, Transferir, Aceptar.*

---

## 🧾 Lista de Riesgos Identificados (resumen)

| ID | Riesgo | Tipo | Descripción breve |
|---|---|---|---|
| R1 | Bug en contrato Soroban | Técnico | Falla lógica/seguridad en `TokenEAT` (mint, permisos). |
| R2 | Filtración de llaves/secretos | Seguridad | Exposición de secret keys o credenciales CI. |
| R3 | Fricción en wallet connect | UX/Operativo | Usuarios no completan pago por mala UX o firmas. |
| R4 | Cambios en red (Testnet/Mainnet) | Externo | Actualizaciones o incidentes de red. |
| R5 | Ruptura por cambios de SDK/Soroban | Técnico | Breaking changes de versión. |
| R6 | Falta de tiempo (cronograma académico) | Operativo | Retrasos por carga escolar/coord. |
| R7 | Baja adopción en piloto | Producto | Poco interés de usuarios/restaurantes. |
| R8 | Dudas de cumplimiento normativo | Externo | Reglas locales/legales para pagos/promos. |
| R9 | Fuga de datos de usuario (PII) | Seguridad | Pedido/dirección/correo expuesto. |
| R10 | Rotación/baja de miembros | Operativo | Pérdida de know-how en momentos críticos. |

---

## 📊 Clasificación (Impacto vs Probabilidad)

| Riesgo | I | P | Puntaje | Nivel | Estrategia | Owner |
|---|---:|---:|---:|---|---|---|
| **R1** Bug contrato Soroban | 5 | 3 | **15** | 🔴 Crítico | Mitigar | Backend |
| **R2** Secretos expuestos | 5 | 2 | **10** | 🟠 Alto | Evitar/Mitigar | Tech Lead |
| **R3** Wallet connect fricciona | 4 | 3 | **12** | 🟠 Alto | Mitigar | Frontend |
| **R4** Cambios en red | 4 | 2 | **8** | 🟠 Alto | Transferir/Aceptar | Tech Lead |
| **R5** Cambios SDK/Soroban | 4 | 3 | **12** | 🟠 Alto | Mitigar/Transferir | Backend |
| **R6** Falta de tiempo | 4 | 4 | **16** | 🔴 Crítico | Evitar/Mitigar | PM |
| **R7** Baja adopción | 3 | 3 | **9** | 🟠 Alto | Mitigar | UX |
| **R8** Cumplimiento normativo | 4 | 1 | **4** | 🟡 Medio | Aceptar/Mitigar | PM |
| **R9** Fuga de datos (PII) | 5 | 2 | **10** | 🟠 Alto | Evitar/Mitigar | Tech Lead |
| **R10** Rotación de equipo | 3 | 2 | **6** | 🟡 Medio | Mitigar | PM |

> **Semáforo global**: R1 y R6 son **críticos** y requieren seguimiento semanal con evidencia.

---

## 🗺️ Matriz Impacto × Probabilidad (5×5)

|     | **P=5** | **P=4** | **P=3** | **P=2** | **P=1** |
|-----|---------|---------|---------|---------|---------|
| **I=5** | — | **R6** | **R1** | **R2, R9** | — |
| **I=4** | — | — | **R3, R5** | **R4** | **R8** |
| **I=3** | — | — | **R7** | **R10** | — |
| **I=2** | — | — | — | — | — |
| **I=1** | — | — | — | — | — |

---

## 🛠️ Planes de Respuesta (playbooks)

### R1 — Bug en contrato Soroban (🔴 Mitigar)
- **Acciones**: pruebas unitarias/integración (felices/borde), revisión por pares, *Simulations* con Soroban CLI, checks de permisos (auth).
- **Contingencia**: *feature flag* para desactivar cupones/mint; rollback a build estable.
- **Disparadores**: test fallido en CI, auditoría interna con hallazgos Alta/Crítica.
- **Evidencia de cierre**: cobertura ≥80% módulos críticos, reporte de revisión aprobado.

### R2 — Secretos expuestos (🔶 Evitar/Mitigar)
- **Acciones**: `.env` encriptado, GitHub Secrets, rotación mensual, *pre-commit hooks* para detectar llaves.
- **Contingencia**: revocar llaves, rotar credenciales, invalidar builds.
- **Disparadores**: alerta DLP o commit con patrón de secreto.
- **Evidencia**: registro de rotación + escaneo sin hallazgos.

### R3 — Fricción en wallet connect (🔶 Mitigar)
- **Acciones**: guía de onboarding, fallback de proveedor, *retry* de firma, telemetría de abandono.
- **Contingencia**: activar checkout alterno (QR o deep-link).
- **Disparadores**: tasa de abandono >25% en checkout.
- **Evidencia**: abandono <15% por dos sprints.

### R4 — Cambios en red (🔶 Transferir/Aceptar)
- **Acciones**: *health checks* a testnet, *circuit breaker* de pagos, reintentos exponenciales.
- **Contingencia**: modo “pedido reservado” y confirmación diferida.
- **Disparadores**: latencia/errores > umbral.
- **Evidencia**: runbook ejecutado + métricas normalizadas.

### R5 — Cambios SDK/Soroban (🔶 Mitigar/Transferir)
- **Acciones**: versionado estricto, *compatibility matrix*, canal de avisos, pruebas de regresión.
- **Contingencia**: *pin* de versiones, *adapters* temporales.
- **Disparadores**: release con breaking changes.
- **Evidencia**: CI verde en matriz de versiones.

### R6 — Falta de tiempo (🔴 Evitar/Mitigar)
- **Acciones**: priorizar MVP (historias “must”), *timeboxing*, *daily* de 10 min, tablero Kanban WIP limitado.
- **Contingencia**: recortar alcance (cupones → fase 2), mover “nice-to-have”.
- **Disparadores**: desviación >15% del plan semanal.
- **Evidencia**: burn-down dentro de tolerancia 10%.

### R7 — Baja adopción (🔶 Mitigar)
- **Acciones**: encuesta breve, prototipo navegable, incentivos de primera compra.
- **Contingencia**: pivot UX de checkout, menú simplificado.
- **Disparadores**: <20% conversión en pruebas con 15+ usuarios.
- **Evidencia**: ≥30% conversión en test controlado.

### R8 — Cumplimiento normativo (🟡 Aceptar/Mitigar)
- **Acciones**: declarar supuestos (uso educativo/testnet), separar promo/monetización.
- **Contingencia**: desactivar funciones sensibles por *feature flag*.
- **Disparadores**: requisito externo/cambio de norma.
- **Evidencia**: README con supuestos y *feature flags* documentados.

### R9 — Fuga de datos PII (🔶 Evitar/Mitigar)
- **Acciones**: mínimo PII, cifrado en tránsito, *error boundaries* que no vuelquen PII, logs anonimizados.
- **Contingencia**: plan de notificación y rotación de tokens.
- **Disparadores**: alerta de acceso no autorizado/logs con PII.
- **Evidencia**: pentest interno sin hallazgos críticos.

### R10 — Rotación de equipo (🟡 Mitigar)
- **Acciones**: documentación viva, *pairing*, *bus factor* ≥2 por módulo.
- **Contingencia**: *onboarding* express y checklist por rol.
- **Disparadores**: ausencia prolongada >1 semana.
- **Evidencia**: handover completo y CI verde post-handover.

---

## 📌 Gobernanza y Seguimiento

- **Ritmo**: revisión de riesgos **semanal** (15 min).  
- **GitHub**:
  - Labels: `risk-critico/risk-alto/risk-medio`, `impact-1..5`, `prob-1..5`, `estrategia-{evitar,mitigar,transferir,aceptar}`.
  - Plantilla de Issue `risk.md`: *contexto → impacto → probabilidad → plan A/B → disparadores → evidencia de cierre*.
  - Tablero “Riesgos” con columnas: *Identificado → En Mitigación → Monitoreo → Cerrado*.
- **KPI de riesgo**: % riesgos críticos abiertos, días promedio de mitigación, tasa de abandono en checkout, cobertura de pruebas.

---

## ✅ Conclusión
Los riesgos **R1 (contrato)** y **R6 (tiempo)** son prioritarios. Con pruebas robustas, *feature flags*, gestión de alcance y disciplina en CI/CD, el MVP de **TokenEats** se mantiene **viable** y **resiliente** frente a eventos técnicos, operativos y externos.

---
