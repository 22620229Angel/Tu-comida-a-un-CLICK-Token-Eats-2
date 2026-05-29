# TokenEats DApp

Plataforma descentralizada de pedidos de comida sobre Stellar Soroban con autenticación biométrica (Passkeys).

## Arquitectura

```
┌─────────────────────────────────────────────────┐
│                   Frontend (Vite + React)        │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐ │
│  │  Menú    │  │ Pedidos  │  │ Admin (Passkey) │ │
│  └────┬─────┘  └────┬─────┘  └───────┬────────┘ │
│       │             │                │           │
│       └─────────────┼────────────────┘           │
│                     │  REST /api                  │
└─────────────────────┼───────────────────────────-┘
                      │
┌─────────────────────┼───────────────────────────-┐
│           Backend (Express + TypeScript)          │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐ │
│  │Products  │  │  Orders  │  │ Admin + Auth   │ │
│  └────┬─────┘  └────┬─────┘  └───────┬────────┘ │
│       │             │                │           │
│       └─────────────┼────────────────┘           │
│                     │  Soroban RPC                │
└─────────────────────┼───────────────────────────-┘
                      │
        ┌─────────────┴─────────────┐
        │   Stellar Soroban (Testnet)│
        │   Contract: TokenEats      │
        └───────────────────────────┘
```

## Requisitos

- **Node.js** >= 22
- **npm**
- Navegador compatible con **WebAuthn** (Chrome, Edge, Safari)
- **Freighter wallet** (opcional, para interacción directa)

## Inicio rápido

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # configurar claves si es necesario
npm run dev
```

El backend corre en `http://localhost:3001`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend corre en `http://localhost:5173`.

> El frontend tiene un proxy de Vite que redirige `/api/*` al backend (`localhost:3001`).

### 3. Abrir en el navegador

```
http://localhost:5173
```

## Autenticación con Passkey (Huella)

El panel de Admin está protegido por autenticación biométrica usando WebAuthn.

### Primera vez (registro)

1. Ir a `http://localhost:5173`
2. Click en **Admin**
3. Click en **Registrar con huella**
4. El navegador pedirá usar huella / Face ID / PIN
5. Una vez registrado, se genera un JWT y se accede al panel

### Accesos siguientes

1. Click en **Admin**
2. Click en **Acceder con huella**
3. Autenticación biométrica → acceso directo

### Sesión

- El token JWT dura **24 horas**
- Se almacena en `localStorage`
- Click en **Salir** para cerrar sesión

## Llamadas a la API desde terminal

### Auth

```bash
# Ver estado de registro
curl http://localhost:3001/api/auth/status
```

### Productos (público)

```bash
# Listar productos
curl http://localhost:3001/api/products

# Obtener producto por nombre
curl http://localhost:3001/api/products/Hamburguesa
```

### Órdenes (público)

```bash
# Listar órdenes
curl http://localhost:3001/api/orders

# Obtener orden por ID
curl http://localhost:3001/api/orders/1

# Crear orden
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{"products": ["Hamburguesa", "Papas"]}'
```

### Admin (requiere autenticación biométrica)

Primero obtener token (desde el frontend, o registrar passkey desde el navegador y luego usar el token):

```bash
# Variable con el token JWT
TOKEN="eyJhbGciOiJIUzI1NiIs..."
```

```bash
# Obtener dirección del admin del contrato
curl http://localhost:3001/api/admin \
  -H "Authorization: Bearer $TOKEN"

# Agregar producto
curl -X POST http://localhost:3001/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Hamburguesa", "quantity": 50, "price": 15}'

# Actualizar producto
curl -X PUT http://localhost:3001/api/admin/products/Hamburguesa \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"quantity": 30, "price": 18}'

# Eliminar producto
curl -X DELETE http://localhost:3001/api/admin/products/Hamburguesa \
  -H "Authorization: Bearer $TOKEN"

# Incrementar stock
curl -X POST http://localhost:3001/api/admin/stock/increase \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Hamburguesa", "amount": 10}'

# Decrementar stock
curl -X POST http://localhost:3001/api/admin/stock/decrease \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Hamburguesa", "amount": 5}'

# Actualizar estado de orden
curl -X PUT http://localhost:3001/api/admin/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "preparando"}'

# Transferir admin del contrato
curl -X POST http://localhost:3001/api/admin/transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"newAdmin": "GCWZ7TBXSX2RRDUJ3KDQ42A5JSUG5LFEGUJ6WHPXN274YDOAL7ZZFSZJ"}'

# Asignar imagen a producto
curl -X PUT http://localhost:3001/api/admin/products/Hamburguesa/image \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"url": "https://ejemplo.com/hamburguesa.jpg"}'
```

## Contrato Inteligente (Stellar Soroban)

Desplegado en **Testnet**.

| Campo | Valor |
|---|---|
| Contract ID | `CC7EVOODA3S5ZNOOQM475RHTETMISZGOJPPGWCIVK2QBGQ4XFH4PNB5U` |
| Network | `Test SDF Network ; September 2015` |
| RPC | `https://soroban-testnet.stellar.org` |
| Admin Address | `GCWZ7TBXSX2RRDUJ3KDQ42A5JSUG5LFEGUJ6WHPXN274YDOAL7ZZFSZJ` |

### Explorar en Stellar Expert

- **Contrato:** https://stellar.expert/explorer/testnet/contract/CC7EVOODA3S5ZNOOQM475RHTETMISZGOJPPGWCIVK2QBGQ4XFH4PNB5U
- **Cuenta admin:** https://stellar.expert/explorer/testnet/account/GCWZ7TBXSX2RRDUJ3KDQ42A5JSUG5LFEGUJ6WHPXN274YDOAL7ZZFSZJ

### Métodos del contrato

| Método | Parámetros | Descripción |
|---|---|---|
| `initialize` | `admin: Address` | Inicializar contrato (una vez) |
| `get_admin` | — | Obtener dirección del admin |
| `transfer_admin` | `new_admin: Address` | Transferir admin |
| `add_product` | `name: String, quantity: i32, price: i32` | Agregar producto |
| `update_product` | `name: String, quantity: i32, price: i32` | Actualizar producto |
| `remove_product` | `name: String` | Eliminar producto |
| `get_product` | `name: String` | Obtener producto |
| `list_products` | — | Listar productos |
| `increase_stock` | `name: String, amount: i32` | Incrementar stock |
| `decrease_stock` | `name: String, amount: i32` | Decrementar stock |
| `create_order` | `products: Vec<String>` | Crear orden |
| `get_order` | `order_id: u32` | Obtener orden |
| `list_orders` | — | Listar órdenes |
| `update_order_status` | `order_id: u32, status: String` | Actualizar estado |

## Variables de entorno (backend `.env`)

| Variable | Descripción | Default |
|---|---|---|
| `PORT` | Puerto del servidor | `3001` |
| `SOROBAN_RPC_URL` | RPC de Stellar | `https://soroban-testnet.stellar.org` |
| `NETWORK_PASSPHRASE` | Passphrase de la red | `Test SDF Network ; September 2015` |
| `CONTRACT_ID` | ID del contrato desplegado | `CC7EVOODA3...` |
| `ADMIN_SECRET_KEY` | Clave secreta del admin | — |
| `OPERATOR_SECRET_KEY` | Clave secreta del operador | — |
| `JWT_SECRET` | Secreto para firmar tokens JWT | — |
| `RP_ID` | Relying Party ID para WebAuthn | `localhost` |
| `RP_NAME` | Nombre del RP para WebAuthn | `TokenEats` |

## Estados de orden

Los estados válidos en el contrato son:

```
creado → preparando → listo → entregado
                                             → cancelado
```
