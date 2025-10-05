// routes/usuarios.js
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Ruta para crear un usuario
router.post('/', usuariosController.crearUsuario);

// Ruta para listar todos los usuarios
router.get('/', usuariosController.listarUsuarios);

// Ruta para obtener un usuario por ID
router.get('/:id', usuariosController.obtenerUsuario);

// Ruta para actualizar un usuario por ID
router.put('/:id', usuariosController.actualizarUsuario);

// Ruta para eliminar un usuario por ID
router.delete('/:id', usuariosController.eliminarUsuario);

module.exports = router; // Exportamos las rutas para usar en app.js
