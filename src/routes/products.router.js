import { Router } from 'express';
import { productManager } from '../controllers/productManager.js';

const router = Router();
const productManager = new ProductManager('./src/models/products.json');

const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

productsRouter.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productManager.getById(pid);
        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

productsRouter.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;
        const newProduct = await productManager.addProduct({ title, description, price, thumbnail, code, stock, status, category });
        res.json(newProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

productsRouter.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;
        const updatedProduct = await productManager.updateProduct(pid, { title, description, price, thumbnail, code, stock, status, category });
        res.json(updatedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const deleteResponse = await productManager.deleteProduct(pid);
        res.json(deleteResponse);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

productsRouter.get('/category/:category', async (req, res) => {
    const { category } = req.params;
    try {
        const products = await productManager.getProductsByCategory(category);
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

productsRouter.get('/code/:code', async (req, res) => {
    const { code } = req.params;
    try {
        const products = await productManager.getProductsByCode(code);
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

productsRouter.get('/price/:price', async (req, res) => {
    const { price } = req.params;
    try {
        const products = await productManager.getProductsByPrice(price);
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

export { productsRouter };
