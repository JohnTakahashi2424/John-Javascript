const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

// Configuración de Socket.IO con CORS para permitir conexiones desde cualquier origen
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Ruta básica para servir el index.html si se accede directamente
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado', socket.id);

    // Escuchar el evento 'mensajeRecibido' desde el cliente
    socket.on('mensajeRecibido', (data) => {
        console.log('Mensaje recibido:', data);
        
        // Reenviar el mensaje a todos los clientes conectados usando 'mensajeEnviar'
        io.emit('mensajeEnviar', data);
    });

    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado', socket.id);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor de Socket.IO corriendo en http://localhost:${PORT}`);
});