const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/productManager.js");

const viewsRouter = router;
const productManager = new ProductManager();

viewsRouter.get("/", async (req, res) => {
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
});

module.exports = viewsRouter;


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