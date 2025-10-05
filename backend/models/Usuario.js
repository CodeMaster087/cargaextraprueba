// models/Usuario.js
const mongoose = require('mongoose');

// Definimos el esquema para los usuarios
const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },        // Nombre del usuario
    email: { type: String, required: true, unique: true }, // Correo electrónico único
    password: { type: String, required: true },      // Contraseña del usuario
    rol: { type: String, enum: ['Cliente', 'Conductor'], required: true } // Tipo de usuario
}, { timestamps: true }); // Crea campos automáticos createdAt y updatedAt

// Exportamos el modelo para poder usarlo en los controladores
module.exports = mongoose.model('Usuario', usuarioSchema);
