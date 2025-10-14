# 🛡️ Matriz de Riesgos — **TokenEats** (Proyecto sobre Stellar/Soroban)

---

## 🎯 Propósito Educativo Aplicado
Actuar como “cazadores de riesgos”: pensar **proactivamente** para proteger TokenEats de amenazas técnicas, operativas y externas. Este documento prioriza riesgos, define **estrategias** (Evitar, Mitigar, Transferir, Aceptar) y deja un **plan accionable**.

---

## 🧪 Criterios de Clasificación

**Probabilidad (P):**  
- **Alta** (>70%), **Media** (30–70%), **Baja** (<30%)

**Impacto (I):**  
- **Alto** (seguridad/funcionalidad core), **Medio** (UX/feature secundario), **Bajo** (afecta mínimamente)

**Nivel:** guía semáforo  
- 🔴 **Crítico** (acción inmediata), 🟠 **Alto** (mitigar y monitorear), 🟡 **Medio** (plan + seguimiento), 🟢 **Bajo** (aceptar/transferir)

---

## 🗡️ Fase 1: La Caza de los “Villanos” — Riesgos Identificados

| ID | Riesgo (“Villano”) | Categoría | Descripción Detallada | Prob. | Impacto | Nivel | Estrategia | Plan de Acción Concreto |
|---|---|---|---|---|---|---|---|---|
| **R01** | Bug crítico en contrato `TokenEAT` | Técnico | Error en lógica/permiso (mint, auth) que permita cupones infinitos o cobros incorrectos. | Media | Alto | 🟠 Alto | **Mitigar** | • TDD con cobertura ≥80% módulos críticos <br> • Revisiones por pares <br> • Simulations con Soroban CLI <br> • **Feature flag** para desactivar cupones |
| **R02** | Falta de tiempo para hitos del MVP | Operativo | Subestimación + carga académica → no se completa checkout Web3. | Alta | Alto | 🔴 Crítico | **Evitar/Mitigar** | • Priorizar “must” (MoSCoW) <br> • Sprints semanales + daily 10’ <br> • Timeboxing y WIP limitado <br> • Alcance de fase 2 documentado |
| **R03** | Cambios breaking en SDK/Soroban | Externo | Nueva versión rompe compatibilidad de contratos o client SDK. | Media | Alto | 🟠 Alto | **Mitigar/Transferir** | • Version pin + matriz de compatibilidad <br> • Wrappers/Adapters <br> • Suscripción a canales oficiales de Soroban <br> • Plan de migración en `docs/` |
| **R04** | Fricción en **wallet connect** | UX/Operativo | Usuarios no completan firma/checkout (móvil). | Media | Medio | 🟡 Medio | **Mitigar** | • Onboarding guiado + retries <br> • Telemetría de abandono <br> • Fallback (QR/deeplink) <br> • Pruebas con 15+ usuarios |
| **R05** | Secretos expuestos (keys, .env) | Seguridad | Fuga de llaves en repo/CI o logs. | Baja | Alto | 🟠 Alto | **Evitar/Mitigar** | • GitHub Secrets + rotación mensual <br> • Pre-commit secret scan <br> • `.env.example` y política de acceso |
| **R06** | Issues de integración FE–BE | Técnico | Contratos de API inconsistentes, errores en serialización. | Media | Medio | 🟡 Medio | **Mitigar** | • **Contract-first** (OpenAPI) <br> • Tests E2E (checkout) <br> • Mock server + examples en repo |
| **R07** | Brecha de conocimiento Rust/Soroban | Operativo | Curva de aprendizaje enlentece entregas. | Media | Medio | 🟡 Medio | **Mitigar** | • Pair programming <br> • Kata semanal Soroban <br> • Mentoring puntual |
| **R08** | Rendimiento/estado de red Stellar | Externo | Latencia alta o intermitencia en testnet/mainnet. | Baja | Medio | 🟡 Medio | **Aceptar/Transferir** | • Health checks y reintentos exponenciales <br> • **Circuit breaker** de pagos <br> • Mensajes de estado al usuario |
| **R09** | Dependencias no mantenidas | Externo | Librerías community abandonadas. | Media | Bajo | 🟢 Bajo | **Transferir** | • Preferir libs oficiales <br> • Lock de versiones <br> • Fork sólo si es crítico |
| **R10** | Fuga de datos (PII) | Seguridad | Logs/respuestas exponen email/dirección. | Baja | Alto | 🟠 Alto | **Evitar/Mitigar** | • Min. PII + anonimización de logs <br> • Error boundaries sin PII <br> • Revisión de headers/caché |
| **R11** | Baja adopción en piloto | Producto | Conversión <20% en pruebas con restaurante. | Media | Medio | 🟡 Medio | **Mitigar** | • Incentivo de 1ª compra <br> • Flujo “compra rápida” <br> • Iteración de UX por hallazgos |
| **R12** | Cambios de requisitos del cliente | Operativo | Nuevas reglas (menú, cupones) afectan timeline. | Media | Medio | 🟡 Medio | **Mitigar** | • Sprint review semanal <br> • Backlog grooming <br> • **Scope freeze** por sprint |

---

## 📊 Fase 2: “Ranking de Villanos” — Matriz Impacto × Probabilidad

|     | **P=Alta** | **P=Media** | **P=Baja** |
|-----|------------|-------------|------------|
| **I=Alto** | **R02** 🔴, — | **R01** 🟠, **R03** 🟠, **R10** 🟠 | — |
| **I=Medio** | — | **R04** 🟡, **R06** 🟡, **R07** 🟡, **R11** 🟡, **R12** 🟡 | **R08** 🟡 |
| **I=Bajo** | — | **R09** 🟢 | — |

> **Prioridad inmediata:** **R02** (tiempo) y **R01/R03/R10** (calidad/seguridad/compatibilidad).

---

## 🛡️ Fase 3: “Escudo de Defensa” — Estrategias Detalladas

### MITIGAR — R01, R03, R04, R06, R07, R10, R11, R12
- **Desarrollo Seguro:** TDD + cobertura ≥80% en contrato y checkout.
- **Contratos Claros:** OpenAPI + ejemplos; CI con validación de esquema.
- **Observabilidad:** métricas de abandono, latencia de firma, éxito de pago.
- **Capacitación:** 2 micro-talleres/semana (Rust/Soroban + FE Web3).
- **Gestión de Alcance:** MoSCoW, timeboxing y grooming semanal.

### EVITAR — R02 (tiempo), R05 (secretos)
- **Plan Realista:** buffer del 20–25% en historias críticas; **scope freeze** por sprint.
- **Seguridad por Diseño:** secretos en GitHub Actions/Environments, políticas de acceso.

### TRANSFERIR — R09 (dependencias), parte de R03
- **Ecosistema Oficial:** Stellar SDKs/librerías oficiales; adapters para cambios.
- **Version Lock:** `package.json`/`Cargo.toml` con versiones fijas.

### ACEPTAR — R08 (red)
- **Resiliencia Operativa:** reintentos, circuit breaker, comunicación en UI; registrar incidentes.

---

## 🔁 Plan de Seguimiento y Actualización

- **Ritmo:** revisión **semanal (lunes)**; tablero “Riesgos” en GitHub Projects.  
- **Responsables:**  
  - **Líder Técnico:** riesgos técnicos/seguridad.  
  - **PM:** operativos/alcance.  
  - **UX Lead:** adopción/experiencia.
- **Métricas clave:** % riesgos críticos abiertos, días de mitigación, tasa de abandono checkout, cobertura de pruebas, tiempo medio de firma.
- **Triggers de re-evaluación:** cambios de scope, nuevos releases Soroban/Stellar, feedback del piloto, rotación de equipo.

---

## ✅ Conclusión
Con enfoque en **tiempo**, **seguridad del contrato** y **compatibilidad**, TokenEats mantiene un perfil de riesgo **controlado** para un MVP académico en **Stellar Testnet**. La matriz define **qué atacar primero**, **cómo** y **qué evidencia** demuestra el cierre efectivo de cada riesgo.

---

