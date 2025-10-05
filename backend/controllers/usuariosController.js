// controllers/usuariosController.js
const Usuario = require('../models/Usuario');

// Función para crear un nuevo usuario
exports.crearUsuario = async (req, res) => {
    try {
        const nuevoUsuario = new Usuario(req.body); // Creamos el objeto Usuario con los datos del body
        await nuevoUsuario.save();                  // Guardamos en la base de datos
        res.status(201).json(nuevoUsuario);        // Respondemos con el usuario creado
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

// Función para listar todos los usuarios
exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find(); // Buscamos todos los usuarios
        res.json(usuarios);                    // Respondemos con la lista
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// Función para obtener un usuario por su ID
exports.obtenerUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// Función para actualizar un usuario por ID
exports.actualizarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

// Función para eliminar un usuario por ID
exports.eliminarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};
