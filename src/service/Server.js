const express = require("express");
const productsRouter = require("../routes/products.router");
const cartRouter     = require("../routes/cart.router.js");
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const viewsRouter = require("../routes/views.router.js");

class Server {
    // Se crea una instancia de express para crear el servidor.
    constructor() {
        this.app = express();
        this.port = 8080;
    }

    // Se crea un método para levantar el servidor al iniciar la aplicación.
  async start() {
        this.app.use(express.static("./public"));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());

        this.app.use("/api/products", productsRouter); 
        this.app.use("/api/carts", cartRouter);
        this.app.use("/", viewsRouter);

        // Configuracion de motor de plantilla
        this.app.engine("handlebars", exphbs.engine());
        this.app.set("view engine", "handlebars");
        this.app.set("views", "./src/views");

        const httpServer = this.app.listen(this.port, () => {
            // Se corroborará que el servidor esté corriendo en el puerto 8080.
            console.log(`Servidor escuchando en puerto: ${this.port}`);
        });
        
        const io = new socket.Server(httpServer);
        
        io.on("connection", (socket) => {
            console.log("Nuevo cliente conectado");
            
            socket.on("message", data => {
                console.log(data);
                io.emit("respuesta", "mensaje recibido");
            })
        });
    
    }
}
module.exports = Server;