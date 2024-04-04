const express = require("express");
const PUERTO = 8080;
const exphbs = require("express-handlebars");
const socket = require('socket.io-client'); 
const app = express(); 



import { productsRouter } from './routes/products.router.js';
import { cartsRouter } from './routes/carts.router.js';
import { viewsRouter } from './routes/views.router.js';



const ProductManager = require("./controllers/productManager.js");
const productManager = new ProductManager("./src/models/products.json");


// Configuración del middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));

// Configuración de Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Configuración de rutas
app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use(viewsRouter);

// Inicialización del servidor  de HTTP
const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

// Configuración de Socket.io
const io = require('socket.io')(httpServer); 

io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado. Linea 43");
    socket.emit("products", await productManager.readFile());
    socket.on("delete", async (id) => {
        await productManager.deleteProduct(id);
        io.sockets.emit("products", await productManager.getProducts());
    });
    socket.on("add", async (data) => {
        await productManager.addProduct(data);
        io.sockets.emit("products", await productManager.getProducts());
    });

    socket.on("update", async (data) => {
        await productManager.updateProduct(data);
        io.sockets.emit("products", await productManager.getProducts());
    }
    );

    socket.on("disconnect", () => { console.log("Usuario desconectado"); }
    );
}
);




/* 
import express from 'express';
import { productsRouter } from './routes/products.router.js';
import { cartsRouter } from './routes/carts.router.js';
import { viewsRouter } from './routes/views.router.js';
import exphbs from 'express-handlebars';


const socket = require("socket.io");
const PUERTO = 8080;


//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas: 
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);


const server = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});


//Socket.io
const ProductManager = require("./controllers/productManager.js");
const productManager = new ProductManager("./src/models/products.json");


const io = socket(server);

io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");

    //Enviamos el array de productos al cliente que se conectó:
    socket.emit("productos", await productManager.getProducts());    
    
    //Recibimos el evento "eliminarProducto" desde el cliente:
    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);

        //Enviamos el array de productos actualizado a todos los productos:
        io.sockets.emit("productos", await productManager.getProducts());
    });

    //Recibimos el evento para agregar productos desde el cliente:
    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto);

        //Enviamos el array de productos actualizado a todos los productos:
        io.socket.emit("productos", await productManager.getProducts());
    });
});


 */