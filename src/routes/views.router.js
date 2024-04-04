const express = require("express");
const router = express.Router();
import { productManager } from "../controllers/productManager.js";

const viewsRouter = Router();
const productManager = new ProductManager("./src/models/products.json");

router.get("/", async (req, res) => {
    try {
        const productos = await productManager.getProducts();
        res.render("index", {
            products: productos
        });
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})



router.get("/realtimeproducts", async (req, res) => {
    try {
        res.render("realtimeproducts");
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

export { viewsRouter };