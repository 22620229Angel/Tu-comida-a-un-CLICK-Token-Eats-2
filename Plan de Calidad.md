# Plan de Calidad — SCF (Stellar Only)
*Proyecto:* Token Eats – Tu comida a un clic  
*Versión:* v0.2 — 2025-09-24  
*Stack Stellar:* Soroban (contratos), USDC en Stellar, SEP-10 (Web Auth), SEP-24 (on/off-ramp con anchor), Freighter (wallet), Horizon/RPC

---

## 1) Propósito y Alcance
Garantizar que pedidos, pagos y notificaciones funcionen íntegramente sobre Stellar:
- Pago con *USDC en Stellar* del cliente al comercio.
- *Escrow on-chain* con contrato Soroban para retener y liberar fondos.
- *Recompensas* (token Soroban) como puntos canjeables en fases siguientes.
- *On/Off-ramp* vía *SEP-24* con *SEP-10* para autenticación.
- Notificaciones al confirmar transacciones (Horizon → backend → front).

*Quedan fuera de fase 1:* delivery propio y programa de fidelización avanzado (solo base técnica).

---

## 2) Organización, Roles y Responsabilidades (RACI de Calidad)

| Actividad / Entregable                                 | Líder Proy. | Backend | Front/App | Análisis/QA | Comunidad/SCF |
|---|:--:|:--:|:--:|:--:|:--:|
| Criterios de aceptación & requisitos                    | A | C | C | R | I |
| Revisión de diseño (arquitectura, contrato, UI)         | A | R | R | C | I |
| Code Review (toda PR a develop)                       | C | R | R | R | I |
| Pruebas (unit, int, e2e)                                | C | R | R | A | I |
| Seguridad (lint, SAST, claves/firmas)                   | A | R | C | C | I |
| Plan de liberación / control de cambios                 | A | R | R | C | I |
| UAT (piloto con usuarios)                               | A | C | C | R | I |
| Comunicación / demo pública SCF                         | A | C | C | C | R |

A=Accountable, R=Responsible, C=Consulted, I=Informed

---

## 3) Objetivos y Métricas de Calidad

| Métrica | Objetivo | Medición |
|---|---|---|
| Cobertura unitaria (contrato + backend + front) | ≥ 80% líneas | soroban-cli test, Jest/Vitest, reportes CI |
| Tiempo de confirmación p95 | ≤ 10 s (submit → tx_successful) | Observación de ledger/Horizon |
| Éxito de transacciones | ≥ 98% (excl. saldo insuficiente) | Ratio successful/total |
| Fees promedio | Estables; alerta si >×3 vs. media 14 días | Fee stats de red |
| Uptime backend | ≥ 99.5% | Monitoreo |
| Accesibilidad web | ≥ 90 (Lighthouse/axe) | Auditoría por release |
| Satisfacción UAT | ≥ 4.2/5 | Encuesta corta |

---

## 4) Procedimientos de Revisión

### 4.1 Requisitos
- Historias con criterios *on-chain* (p. ej., timeout de entrega → refund).
- Formato: Como [rol], quiero [acción] para [beneficio] + criterios verificables.

### 4.2 Diseño
- *ADR* para: escrow vs. claimable balances, SEP-24/anchor elegido, manejo de reintentos/fee bump, esquema de recompensas, eventos del contrato para auditoría.
- Diagramas: arquitectura lógica, flujos de pago, estados del contrato.

### 4.3 Code Review
- Cambios en contrato Soroban requieren *2 aprobaciones* y pruebas de migración.
- Bloqueadores: deuda crítica, falta de tests, hallazgos SAST, uso indebido de claves.

*Definition of Done (DoD)*
- Lint/tests/cobertura OK; simulación en Testnet; criterios de aceptación verificados; documentación/ADR actualizados; artefactos listos para despliegue.

---

## 5) Políticas de Pruebas

*Pirámide*
- *Unitarias*: lógica del contrato (Rust), utils backend/front.
- *Integración*: cliente → backend → Soroban → Horizon/RPC.
- *E2E*: flujo “crear pedido → pagar USDC → release/refund escrow”.

*Casos críticos*
- Pago con y sin trustline/cupo; saldo insuficiente; reintentos por fee.
- Timeout de entrega y path de refund.
- On/Off-ramp: SEP-10 + SEP-24 (redirect/webview).
- Rendimiento: picos 12:00–15:00 (100–300 tx/h por comercio).

*Seguridad*
- Nunca almacenar llaves privadas; firma solo en Freighter.
- Validación de dominios y stellar.toml del anchor.
- Límites por pedido y lista de activos permitidos.

---

## 6) Gestión de Configuración y Liberación

*Ramas y versiones*
- GitFlow ligero: main(prod), develop(staging), feature/*, release/*, hotfix/*.
- *SemVer* para dApp y para el *contrato* (migraciones versionadas).

*CI/CD*
- Lint + Test + Coverage + SAST → Deploy a *staging (Testnet)* → smoke/E2E → gate manual → Deploy *prod (Mainnet)*.
- Medición posterior (success rate, latencia, fees) y plan de rollback.

*Entornos*
- *Futurenet/Testnet* para dev y QA; *Mainnet* producción.

---

## 7) Gestión de Riesgos

| Riesgo | Mitigación |
|---|---|
| Congestión/red fees | Reintentos con fee bump; colas y backoff |
| Anchor SEP-24 inestable | Fallback a otro anchor; modo on-chain puro temporal |
| Manejo de claves | Solo Freighter; prohibido exponer secretos |
| Cambios de protocolo | Pin de versiones; pruebas en testnet antes de prod |
| Diseño de escrow defectuoso | Auditoría interna; pause y ruta de upgrade controlada |

---

## 8) Criterios de Aceptación (épicas núcleo)

*Pago USDC / Escrow*
- Firma con Freighter; tx_successful; fondos bloqueados.
- Confirmación de entrega → release al comercio.
- Expiración T minutos → refund habilitado para cliente.
- Eventos emitidos: EscrowCreated, Released, Refunded.

*On/Off-ramp*
- SEP-10 antes de SEP-24; manejo de KYC (si aplica anchor).
- Estados visibles al usuario durante el flujo de depósito/retiro.

*Recompensas*
- Token Soroban para puntos; emisión/registro on-chain; canjeables en fase 2.

*Notificaciones*
- Backend emite evento a cliente/panel en cuanto Horizon marca tx_successful.

---

## 9) Incidencias y SLA

| Sev | Ejemplo | SLA atención | SLA resolución |
|---|---|---|---|
| S1 | Pagos indisponibles / caída total | 30 min | 4 h |
| S2 | Fallo en confirmación/escrow | 4 h | 1 día |
| S3 | Bug menor con workaround | 1 día | Próxima release |
| S4 | Mejora | 3 días | Planificación |

---

## 10) Documentación y Evidencias
- ADRs (decisiones clave).
- Manuales (cliente y operador).
- Diagrama de arquitectura/despliegue.
- Plan y reporte de pruebas por release.
- CHANGELOG y RELEASE NOTES.

---
