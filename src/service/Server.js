const express = require("express");
const productsRouter = require("../routes/products.router");
const cartRouter = require("../routes/cart.router.js");
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const viewsRouter = require("../routes/views.router.js");
const path = require("path");

class Server {
    // Se crea una instancia de express para crear el servidor.
    constructor() {
        this.app = express();
        this.port = 8080;
    }

    // Se crea un método para levantar el servidor al iniciar la aplicación.
    async start() {
        this.app.use(express.static(path.join(__dirname, "../public")));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());

        // Configuracion de motor de plantilla y handlebars
        this.app.engine("handlebars", exphbs.engine());
        this.app.set("view engine", "handlebars");
        this.app.set("views", path.join(__dirname, "../views"));

        // Routing
        this.app.use("/api/products", productsRouter);
        this.app.use("/api/carts", cartRouter);
        this.app.use("/", viewsRouter);

        const httpServer = this.app.listen(this.port, () => {
            console.log(`Servidor escuchando en el puerto ${this.port}`);
        });

        const io = new socket.Server(httpServer);

        const ProductManager = require("../service/ProductManager");
        const productManager = new ProductManager("./src/models/products.json");

        io.on("connection", async (socket) => {
            console.log("Nuevo cliente conectado");
            console.log("Socket ID:" + socket.id);
           
            // Cargo Productos y los envio al cliente
            socket.emit("products", await productManager.getProducts());

            // Agregar nuevo producto
            socket.on("addProduct", async (product) => {
                await productManager.addProduct(product);
                io.sockets.emit("products", await productManager.getProducts());            
            });

            // Eliminar producto
            socket.on("deleteProduct", async (id) => {
                await productManager.deleteProduct(id);
                io.sockets.emit("products", await productManager.getProducts());            
            });

        });
    }
}

module.exports = Server;