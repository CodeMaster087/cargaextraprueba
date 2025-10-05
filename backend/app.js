// Importamos los módulos necesarios
const express = require('express');     // Framework web
const mongoose = require('mongoose');   // ORM para MongoDB
const bodyParser = require('body-parser'); // Para poder leer JSON en las solicitudes
const cors = require('cors');           // Para permitir peticiones desde otros dominios

// Importar las rutas de cada módulo
const usuariosRoutes = require('./routes/usuarios');
const vehiculosRoutes = require('./routes/vehiculos');
const cargasRoutes = require('./routes/cargas');
const viajesRoutes = require('./routes/viajes');

const app = express();                  // Creamos la aplicación de Express
const PORT = process.env.PORT || 3000;  // Puerto donde correrá el servidor

// -------------------- MIDDLEWARES --------------------
// Permite solicitudes desde cualquier origen
app.use(cors());

// Permite recibir datos en formato JSON
app.use(bodyParser.json());

// -------------------- CONEXIÓN A MONGODB --------------------
mongoose.connect('mongodb://127.0.0.1:27017/cargaextra', {
    useNewUrlParser: true,          // Para usar el nuevo parser de URLs
    useUnifiedTopology: true        // Para usar el nuevo motor de topología
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error de conexión:', err));

// -------------------- RUTAS --------------------
// Todas las rutas de usuarios comienzan con /api/usuarios
app.use('/api/usuarios', usuariosRoutes);

// Todas las rutas de vehículos comienzan con /api/vehiculos
app.use('/api/vehiculos', vehiculosRoutes);

// Todas las rutas de cargas comienzan con /api/cargas
app.use('/api/cargas', cargasRoutes);

// Todas las rutas de viajes comienzan con /api/viajes
app.use('/api/viajes', viajesRoutes);

// -------------------- INICIO DEL SERVIDOR --------------------
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
