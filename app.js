const express = require('express');
require('dotenv').config();
const { exec } = require('child_process');
const { poolPromise } = require('./src/config/db');
const {
    crearReserva,
    obtenerReservas,
    actualizarReserva,
    eliminarReserva
} = require('./src/controllers/reservaController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Servir la interfaz web (index.html) directamente desde la raíz del proyecto
app.use(express.static('./'));

//               RUTAS API (CRUD)
app.get('/api/reservas', obtenerReservas);       // CONSULTAR 
app.post('/api/reservas', crearReserva);         // CREAR
app.put('/api/reservas/:id', actualizarReserva);    // ACTUALIZAR 
app.delete('/api/reservas/:id', eliminarReserva);  // ELIMINAR  

// Arrancar el servidor
app.listen(PORT, async () => {
    console.log(`💻 Servidor web escuchando en el puerto ${PORT}`);

    // Abre el navegador automaticamente en la interfaz principal
    exec(`start http://localhost:${PORT}/`);

    try {
        await poolPromise;
    } catch (err) {
        console.error('⚠️ Error al conectar a la BD desde app.js');
    }
});