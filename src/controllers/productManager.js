import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export class ProductManager {
    constructor() {
        this.path = './src/models/products.json';
        this.products = [];
    }

    // Obtiene los productos, devuelve un array vacío en caso de error
    async getProducts() {
        try {
            const response = await fs.readFile(this.path, 'utf-8');
            console.log("File content:", response); // Additional logging
            return JSON.parse(response);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            return [];
        }
    }
    // Añade un producto
    addProduct = async (productData) => {
        try {
            // Validar campos requeridos (excepto fotos y status)
            if (!productData.title || !productData.description || !productData.price) {
                throw new Error('Faltan campos requeridos');
            }
    
            // Establecer status por defecto a true si no se proporciona
            const status = productData.status !== undefined ? productData.status : true;
    
            // Obtener productos existentes
            this.products = await this.getProducts();
    
            // Crear nuevo producto con id único y status definido
            const newProduct = {
                id: uuidv4(),
                ...productData,
                status
            };
    
            // Agregar el nuevo producto a la lista
            this.products.push(newProduct);
    
            // Escribir en el archivo
            await fs.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
    
            return newProduct;
        } catch (error) {
            console.error('Error al añadir producto:', error);
            throw error;
        }
    };

    // Obtiene un producto por ID
    async getById(id) {
        try {
            const products = await this.getProducts();
            return products.find(product => product.id === id) || null;
        } catch (error) {
            console.error('Error al obtener el producto por ID:', error);
            return null;
        }
    }
    // Actualiza un producto
    updateProduct = async (id, { title, description, price, thumbnail, code, stock, status, category }) => {
        try {
            this.products = await this.getProducts();
            const productIndex = this.products.findIndex(product => product.id === id);
            if (productIndex === -1) {
                console.error('Producto no encontrado para actualizar');
                return null;
            }
            this.products[productIndex] = { id, title, description, price, thumbnail, code, stock, status, category };
            await fs.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
            return this.products[productIndex];
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    }

    // Elimina un producto
    deleteProduct = async (id) => {
        try {
            this.products = await this.getProducts();
            const productIndex = this.products.findIndex(product => product.id === id);
            if (productIndex === -1) {
                console.error('Producto no encontrado para eliminar');
                return null;
            }
            const product = this.products[productIndex];
            this.products.splice(productIndex, 1);
            await fs.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
            return product;
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    }

    // Las funciones de filtro siguen la misma estructura, solo cambiando la condición de filtro
    getProductsByCategory = async (category) => {
        try {
            const products = await this.getProducts();
            return products.filter(product => product.category === category);
        } catch (error) {
            console.error('Error al obtener productos por categoría:', error);
            return [];
        }
    }
}

module.exports = ProductManager;




