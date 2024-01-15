const socket = io();
console.log("iniciando aplicacion");

socket.emit("message", 'mensaje desde cliente por websocket');

socket.on("respuesta", (data) => {
    console.log("Respuesta del servidor:");
    console.log(data);
});