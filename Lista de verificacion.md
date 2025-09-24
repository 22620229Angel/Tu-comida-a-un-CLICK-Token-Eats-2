# Lista de Verificación de Auditoría — Proyecto "TokenEats"

## Propósito
Guía educativa para auditar el desarrollo de *TokenEats* y asegurar cumplimiento con estándares de calidad de la *Stellar Community Fund (SCF)*. Fomenta la mejora continua, el pensamiento crítico de ingeniería de calidad y la formalización de procesos de validación.

## Estado de la Auditoría
- [ ] En Progreso
- [ ] Completado  
*Aprobado por el Revisor:* ______________________

---

## Sección 1: Fase de Investigación (Día 1–3)

| ID     | Criterio de Verificación                             | Descripción                                                                 | Estado       |
|--------|-------------------------------------------------------|-----------------------------------------------------------------------------|--------------|
| I-1.1  | Revisión del sitio oficial del SCF                   | ¿Se revisó el sitio y lineamientos vigentes del SCF?                       | [ ] Pendiente |
| I-1.2  | Revisión de la propuesta interna de TokenEats        | ¿Existe acta de constitución/alcance y criterios de éxito?                 | [ ] Pendiente |
| I-1.3  | Búsqueda en fuentes externas                         | ¿Se buscaron referencias útiles (blogs, GitHub, discusiones SCF)?         | [ ] Pendiente |
| I-1.4  | Identificación de objetivos e hitos                  | ¿Se documentaron objetivos, hitos y evolución previstos?                   | [ ] Pendiente |
| I-1.5  | Estado actual del proyecto                           | ¿Se dejó claro el estado (idea, prototipo, beta, release)?                 | [ ] Pendiente |
| I-1.6  | Clasificación PMI                                    | ¿Se mapearon Inicio, Planificación, Ejecución, Seguimiento y Cierre?       | [ ] Pendiente |

---

## Sección 2: Fase de Análisis (Día 4–6)

| ID     | Criterio de Verificación                             | Descripción                                                                 | Estado       |
|--------|-------------------------------------------------------|-----------------------------------------------------------------------------|--------------|
| A-2.1  | Documento principal de análisis                      | ¿Se inició el documento con alcance, supuestos y restricciones?            | [ ] Pendiente |
| A-2.2  | Explicación de fases PMI con ejemplos                | ¿Se ilustraron las fases PMI con ejemplos reales de TokenEats?             | [ ] Pendiente |
| A-2.3  | Términos clave de gestión                            | ¿Se usan recursos, cronograma, hitos, riesgos, control de calidad?         | [ ] Pendiente |
| A-2.4  | Aplicación al proyecto                               | ¿Se explica cómo se aplican esos términos en TokenEats?                    | [ ] Pendiente |
| A-2.5  | Lecciones aprendidas (iterativas)                    | ¿Se agregaron aprendizajes de ciclos previos (si existen)?                 | [ ] Pendiente |
| A-2.6  | Identificación de fortalezas                         | ¿Se enumeran puntos fuertes de producto/equipo/proceso?                    | [ ] Pendiente |
| A-2.7  | Análisis de áreas de mejora                          | ¿Se identifican oportunidades y acciones de mejora?                        | [ ] Pendiente |
| A-2.8  | Conclusiones fundamentadas                           | ¿Las conclusiones están bien argumentadas y justificadas?                  | [ ] Pendiente |

---

## Sección 3: Fase Técnica Stellar (Día 4–7)

| ID     | Criterio de Verificación                                   | Descripción                                                                                               | Estado       |
|--------|-------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|--------------|
| S-3.1  | Autenticación SEP-10                                        | ¿Se definió/implementó el flujo de WebAuth con firma de wallet (Freighter)?                              | [ ] Pendiente |
| S-3.2  | On/Off-ramp SEP-24 (si aplica)                              | ¿Se seleccionó anchor y se probó depósito/retiro en entorno de prueba?                                   | [ ] Pendiente |
| S-3.3  | Contrato Soroban — Escrow                                   | ¿Se diseñó/implementó el contrato de escrow con create/release/refund y eventos?                       | [ ] Pendiente |
| S-3.4  | Pruebas de contrato                                         | ¿Existen pruebas unitarias/integración (≥80% cobertura) y casos de timeout, saldo insuficiente, fee bump?| [ ] Pendiente |
| S-3.5  | Seguridad de claves                                         | ¿No se almacenan llaves privadas; firma solo en Freighter; manejo de secretos en CI?                     | [ ] Pendiente |
| S-3.6  | Observabilidad de transacciones                             | ¿Monitoreo de tx_successful, tiempo p95 de confirmación y tasa de éxito?                               | [ ] Pendiente |
| S-3.7  | Estrategia de migración/upgrade del contrato                | ¿Hay plan de storage versioning y pause/rollback documentado?                                          | [ ] Pendiente |
| S-3.8  | Accesibilidad y UX de wallet                                | ¿Mensajes claros de errores de firma/trustline/fees y guías para el usuario?                             | [ ] Pendiente |

---

## Sección 4: Calidad, CI/CD y Métricas (Día 5–7)

| ID     | Criterio de Verificación                     | Descripción                                                                                   | Estado       |
|--------|-----------------------------------------------|-----------------------------------------------------------------------------------------------|--------------|
| Q-4.1  | Pipeline CI                                   | ¿Lint + Tests + Coverage + SAST corren en cada PR/merge?                                     | [ ] Pendiente |
| Q-4.2  | Despliegue Testnet                            | ¿Existe job de deploy a Testnet con gate manual y smoke tests post-deploy?                 | [ ] Pendiente |
| Q-4.3  | Políticas de ramas/versionado                 | ¿GitFlow ligero y SemVer para dApp y contrato?                                               | [ ] Pendiente |
| Q-4.4  | KPIs de calidad                               | ¿Se miden cobertura, p95 confirmación, éxito de tx, fees, uptime, accesibilidad?             | [ ] Pendiente |
| Q-4.5  | Gestión de incidentes                         | ¿SLA S1/S2 definidos, y plantillas de post-mortem?                                           | [ ] Pendiente |
| Q-4.6  | Evidencias por release                        | ¿CHANGELOG, notas de release y reporte de pruebas están completos?                           | [ ] Pendiente |

---

## Sección 5: Fase de Entregable (Día 7)

| ID     | Criterio de Verificación                       | Descripción                                                                                 | Estado       |
|--------|-------------------------------------------------|---------------------------------------------------------------------------------------------|--------------|
| E-5.1  | Introducción del informe                       | ¿Nombre del proyecto y propósito del análisis claros?                                       | [ ] Pendiente |
| E-5.2  | Desarrollo del informe                         | ¿Fases PMI descritas con ejemplos reales de TokenEats?                                      | [ ] Pendiente |
| E-5.3  | Conclusiones + Lecciones                       | ¿Incluye lecciones aprendidas y evaluación del éxito?                                       | [ ] Pendiente |
| E-5.4  | Revisión de gramática/ortografía               | ¿Se corrigieron errores de redacción?                                                       | [ ] Pendiente |
| E-5.5  | Formato y legibilidad                          | ¿Estructura clara, encabezados consistentes, tablas legibles?                               | [ ] Pendiente |
| E-5.6  | Herramienta para mapa conceptual               | ¿Se eligió Lucidchart/Canva/Whimsical para mapa conceptual?                                 | [ ] Pendiente |
| E-5.7  | Centro del mapa: TokenEats                     | ¿El mapa conceptual centra TokenEats como nodo principal?                                   | [x] Completado |
| E-5.8  | Ramas principales (PMI)                        | ¿Incluye Inicio, Planificación, Ejecución, Seguimiento, Cierre?                             | [x] Completado |
| E-5.9  | Sub-ramas clave                                | ¿Objetivos, hitos, equipo, resultados, lecciones y *flujos Stellar* (SEP-10/24, escrow)?  | [ ] Pendiente |
| E-5.10 | Coherencia mapa-informe                        | ¿Mapa conceptual refleja estructura del informe?                                            | [ ] Pendiente |
| E-5.11 | Diseño claro y comprensible                    | ¿Mapa limpio y fácil de entender (contraste, jerarquía, legibilidad)?                       | [ ] Pendiente |

---

## Proceso de Verificación
- Cada ítem debe ser revisado por *al menos un miembro* del equipo.
- La verificación es *exitosa* cuando:
  1) Todos los puntos han sido marcados como *Completados*.  
  2) La *validación final* ha sido realizada por un revisor designado para asegurar objetividad.
