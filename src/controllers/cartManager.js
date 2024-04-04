// Importaciones
const express = require('express'); // Importa express
const fs = require('fs').promises; // Importa fs para operaciones de archivos


import { promises as fs } from 'fs'; // Utiliza 'fs' para operaciones de archivos con promesas
import { v4 as uuidv4 } from 'uuid';  // Importa 'uuidv4' para generar IDs únicos

// Clase cartManager para gestionar carritos de compras
class CartManager {
    static idCart = 0;
    constructor(cartsDbPath) {
        this.carts = [];
        this.cartsDbPath = cartsDbPath;
    }

    async readFile() {
        try {
            const data = await fs.readFile(this.cartsDbPath, "utf-8");
            if (data.length > 0) {
                this.carts = JSON.parse(data);
                CartManager.idCart = Math.max(...this.carts.map((cart) => cart.id));
            } else {
                console.log("No hay carritos cargados");
            }
        } catch (error) {
            console.log("Error al leer el archivo de carritos");
            await this.saveCarts ();
        } finally {
            return this.carts;
        }

    }

    async saveCarts() {
        try {
            await fs.writeFile(this.cartsDbPath, JSON.stringify(this.carts, null, "\t"));
        } catch (error) {
            console.log("Error al guardar el archivo de carritos");
        }
    }

    async getProducts(id) {
        await this.readFile();
        const cart = this.carts.find((cart) => cart.id === parseInt(id));
        if (cart) {
            return cart.products;
        } else {
            return { error: "No existe el carrito" };
        }
    }

    async addProduct(id, product) {
        await this.readFile();
        const cart = this.carts.find((cart) => cart.id === parseInt(id));
        if (cart) {
            cart.products.push(product);
            await this.saveCarts();
            return cart;
        } else {
            return { error: "No existe el carrito" };
        }
    }

    async deleteProduct(id, productId) {
        await this.readFile();
        const cart = this.carts.find((cart) => cart.id === parseInt(id));
        if (cart) {
            const index = cart.products.findIndex((product) => product.id === parseInt(productId));
            if (index !== -1) {
                cart.products.splice(index, 1);
                await this.saveCarts();
                return cart;
            } else {
                return { error: "No existe el producto" };
            }
        } else {
            return { error: "No existe el carrito" };
        }

    }

    async deleteCart(id) {
        await this.readFile();
        const index = this.carts.findIndex((cart) => cart.id === parseInt(id));
        if (index !== -1) {
            this.carts.splice(index, 1);
            await this.saveCarts();
            return this.carts;
        } else {
            return { error: "No existe el carrito" };
        }
    }

    async updateProduct(id, productId, product) {
        await this.readFile();
        const cart = this.carts.find((cart) => cart.id === parseInt(id));
        if (cart) { 
            const index = cart.products.findIndex((product) => product.id === parseInt(productId));
            if (index !== -1) {
                cart.products[index] = product;

                await this.saveCarts();
                return cart;
            } else {
                return { error: "No existe el producto" };
            }

        } else {
            return { error: "No existe el carrito" };
        }
    }

    async addCart() {
        await this.readFile();
        const cart = {
            id: ++CartManager.idCart,
            timestamp: Date.now(),
            products: [],
        };
        this.carts.push(cart);
        await this.saveCarts();
        return cart;
    }
}


export default CartManager;







export class cartManager {
    constructor() {
        this.path = './src/models/cart.json'; // Define la ruta al archivo JSON de los carritos
    }

    // Obtiene todos los carritos desde el archivo JSON
    async getCarts() {
        const response = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(response);
    }

    // Obtiene productos de un carrito específico por su ID
    async getCartProducts(id) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === id);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        return cart.products;
    }

    // Crea un nuevo carrito con un ID único y lo añade al archivo JSON
    async newCart() {
        const carts = await this.getCarts();
        const newCart = { id: uuidv4(), timestamp: Date.now(), products: [] };
        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        return newCart;
    }

    // Añade un producto a un carrito. Si ya está presente, aumenta la cantidad
    async addProductToCart(cart_id, product_id) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cart_id);
        if (cartIndex === -1) {
            throw new Error('Carrito no encontrado');
        }

        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex(product => product.id === product_id);
        if (productIndex === -1) {
            cart.products.push({ id: product_id, quantity: 1 });
        } else {
            cart.products[productIndex].quantity++;
        }
        await fs.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        return cart;
    }
}

// Exporta una instancia de cartManager para uso global
export const cartManager = new cartManager();
