import io from 'socket.io-client';

const serverUrl = 'http://localhost:8080';

const socketClient = io(serverUrl);

// Define a function to send data to your Socket.io server
const sendDataToServer = (data) => {
    socketClient.emit("agregarProducto", data);
};

// Example data to send to the server
const productData = {
    title: "Product Title",
    description: "Product Description",
    price: 100.0,
    img: "product.jpg",
    code: "ABC123",
    stock: 10,
    category: "Electronics",
    status: true
};

sendDataToServer(productData);

socketClient.on("products", (products) => {
    console.log("Received updated products from the server:", products);
});
