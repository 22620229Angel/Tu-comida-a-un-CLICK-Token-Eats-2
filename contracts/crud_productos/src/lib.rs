#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, String, Symbol, Map, Vec, Val, IntoVal, symbol_short};




// Claves de almacenamiento
const PRODUCTS_KEY: Symbol = symbol_short!("PRODUCTS");
const ADMIN_KEY: Symbol = symbol_short!("ADMIN");
// Claves de almacenamiento para pedidos
const ORDER_ID_COUNTER: &str = "order_id_counter";
const ORDERS_KEY: &str = "orders";
const ORDER_STATUSES: &str = "order_statuses";

// Estados de pedido
const CREATED: &str = "creado";
const PREPARING: &str = "preparando";
const READY: &str = "listo";
const DELIVERED: &str = "entregado";
const CANCELLED: &str = "cancelado";

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    /// Inicializa el contrato con administrador y estados de pedido
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().persistent().has(&ADMIN_KEY) {
            panic!("Contract already initialized");
        }
        env.storage().persistent().set(&ADMIN_KEY, &admin);
        
        // Inicializar contador de pedidos
        env.storage().persistent().set(&ORDER_ID_COUNTER, &0u32);
        
        // Inicializar estados de pedido válidos
        let mut statuses = Vec::new(&env);
        statuses.push_back(String::from_str(&env, CREATED));
        statuses.push_back(String::from_str(&env, PREPARING));
        statuses.push_back(String::from_str(&env, READY));
        statuses.push_back(String::from_str(&env, DELIVERED));
        statuses.push_back(String::from_str(&env, CANCELLED));
        env.storage().persistent().set(&ORDER_STATUSES, &statuses);
    }

    // --- ADMINISTRACIÓN ---
    fn check_admin(env: &Env) {
        let admin: Address = env.storage()
            .persistent()
            .get(&ADMIN_KEY)
            .expect("Contract not initialized");
        admin.require_auth();
    }

    pub fn transfer_admin(env: Env, new_admin: Address) {
        Self::check_admin(&env);
        env.storage().persistent().set(&ADMIN_KEY, &new_admin);
    }

    // --- GESTIÓN DE PRODUCTOS ---
    pub fn add_product(env: Env, name: String, quantity: i32, price: i32) {
        Self::check_admin(&env);

        let mut products = Self::get_products(&env);

        if products.contains_key(name.clone()) {
            panic!("Product already exists");
        }

        let mut data = Vec::new(&env);
        data.push_back(quantity.into_val(&env));  // ✅ Correcto
        data.push_back(price.into_val(&env));     // ✅ Correcto

        products.set(name.clone(), data);
        env.storage().persistent().set(&PRODUCTS_KEY, &products);
    }

    pub fn get_product(env: Env, name: String) -> Vec<Val> {
        let products = Self::get_products(&env);
        match products.get(name) {
            Some(data) => {
                let mut result = Vec::new(&env);
                for i in 0..data.len() {
                    let val: i32 = data.get(i).unwrap().try_into().unwrap();
                    result.push_back(val.into_val(&env));
                }
                result
            },
            None => Vec::new(&env),
        }
    }

    fn get_products(env: &Env) -> Map<String, Vec<Val>> {
        env.storage()
            .persistent()
            .get(&PRODUCTS_KEY)
            .unwrap_or_else(|| Map::new(env))
    }
    pub fn list_products(env: Env) -> Vec<String> {
        let products = Self::get_products(&env);
        let mut product_list = Vec::new(&env);
        for name in products.keys() {
            product_list.push_back(name.into_val(&env));
        }
        product_list
    }

    pub fn update_product(env: Env, name: String, quantity: i32, price: i32) {
        Self::check_admin(&env);

        let mut products = Self::get_products(&env);

        if !products.contains_key(name.clone()) {
            panic!("Product not found");
        }

        let mut data = Vec::new(&env);
        data.push_back(quantity.into_val(&env));  // 👈
        data.push_back(price.into_val(&env));     // 👈

        products.set(name.clone(), data);
        env.storage().persistent().set(&PRODUCTS_KEY, &products);
    }

    pub fn remove_product(env: Env, name: String) {
        Self::check_admin(&env);

        let products = Self::get_products(&env);
        let data = products.get(name.clone()).expect("Product not found");

        if data.len() < 2 {
            panic!("Invalid product data");
        }

        let stock: i32 = data.get(0).unwrap().try_into().unwrap();
        if stock != 0 {
            panic!("Cannot remove product with non-zero stock");
        }

        let mut products = products;
        products.remove(name.clone());
        env.storage().persistent().set(&PRODUCTS_KEY, &products);
    }
    // --- OPERACIONES DE STOCK (internas) ---
    fn internal_increase_stock(env: &Env, name: String, amount: i32) {
        let mut products = Self::get_products(env);
        let mut data = products.get(name.clone()).expect("Product not found");

        if data.len() < 2 {
            panic!("Invalid product data");
        }

        let current_quantity: i32 = data.get(0).unwrap().try_into().unwrap();  // 👈
        let new_quantity = current_quantity + amount;
        data.set(0, new_quantity.into_val(env));  // 👈

        products.set(name.clone(), data);
        env.storage().persistent().set(&PRODUCTS_KEY, &products);
    }

    fn internal_decrease_stock(env: &Env, name: String, amount: i32) {
        let mut products = Self::get_products(env);
        let mut data = products.get(name.clone()).expect("Product not found");

        if data.len() < 2 {
            panic!("Invalid product data");
        }

        let current_quantity: i32 = data.get(0).unwrap().try_into().unwrap();  // 👈
        if current_quantity < amount {
            panic!("Insufficient stock");
        }

        let new_quantity = current_quantity - amount;
        data.set(0, new_quantity.into_val(env));  // 👈

        products.set(name.clone(), data);
        env.storage().persistent().set(&PRODUCTS_KEY, &products);
    }

    // --- OPERACIONES DE STOCK (públicas) ---
    pub fn increase_stock(env: Env, name: String, amount: i32) {
        Self::check_admin(&env);
        Self::internal_increase_stock(&env, name, amount);
    }
    pub fn decrease_stock(env: Env, name: String, amount: i32) {
        Self::check_admin(&env);
        Self::internal_decrease_stock(&env, name, amount);
    }
    // --- GESTIÓN DE PEDIDOS ---
    pub fn create_order(env: Env, products: Vec<String>) -> u32 {
        let mut order_id_counter: u32 = env.storage()
            .persistent()
            .get(&ORDER_ID_COUNTER)
            .unwrap_or(0u32);
        
        order_id_counter += 1;
        env.storage().persistent().set(&ORDER_ID_COUNTER, &order_id_counter);

        let mut order_data = Vec::new(&env);
        for product in products {
            order_data.push_back(product.into_val(&env));
        }

        // Usamos u32 como clave directamente
        let mut orders: Map<u32, Vec<Val>> = env.storage()
            .persistent()
            .get(&ORDERS_KEY)
            .unwrap_or_else(|| Map::new(&env));
        
        orders.set(order_id_counter, order_data);

        env.storage().persistent().set(&ORDERS_KEY, &orders);

        order_id_counter
    }


    pub fn get_order(env: Env, order_id: u32) -> Vec<Val> {
        let orders: Map<u32, Vec<Val>> = env.storage()
            .persistent()
            .get(&ORDERS_KEY)
            .unwrap_or_else(|| Map::new(&env));
        
        match orders.get(order_id) {
            Some(data) => data,
            None => Vec::new(&env),
        }
    }

    pub fn update_order_status(env: Env, order_id: u32, status: String) {
        Self::check_admin(&env);

        let valid_statuses: Vec<String> = env.storage()
            .persistent()
            .get(&ORDER_STATUSES)
            .expect("Order statuses not initialized");

        if !valid_statuses.contains(&status) {
            panic!("Invalid order status");
        }

        let mut orders: Map<u32, Vec<Val>> = env.storage()
            .persistent()
            .get(&ORDERS_KEY)
            .unwrap_or_else(|| Map::new(&env));

        if !orders.contains_key(order_id) {
            panic!("Order not found");
        }

        let mut order_data = orders.get(order_id).unwrap().clone();
        order_data.push_back(status.into_val(&env)); // Agregar el estado al final del pedido
        orders.set(order_id, order_data);
        
        env.storage().persistent().set(&ORDERS_KEY, &orders);
    }


    pub fn list_orders(env: Env) -> Vec<u32> {
        let orders: Map<u32, Vec<Val>> = env.storage()
            .persistent()
            .get(&ORDERS_KEY)
            .unwrap_or_else(|| Map::new(&env));

        let mut order_list = Vec::new(&env);
        for key in orders.keys() {
            order_list.push_back(key);
        }
        order_list
    }

    pub fn get_admin(env: &Env) -> Address {
        env.storage().persistent().get(&ADMIN_KEY).expect("Contract not initialized")
    }
}