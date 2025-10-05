const Carga = require('../models/Carga');

// Crear una nueva carga
exports.crearCarga = async (req, res) => {
    try {
        const nuevaCarga = new Carga(req.body);
        await nuevaCarga.save();
        res.status(201).json(nuevaCarga);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

// Listar todas las cargas
exports.listarCargas = async (req, res) => {
    try {
        const cargas = await Carga.find().populate('usuario', 'nombre email rol');
        res.json(cargas);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// Obtener una carga por ID
exports.obtenerCarga = async (req, res) => {
    try {
        const carga = await Carga.findById(req.params.id).populate('usuario', 'nombre email rol');
        if (!carga) return res.status(404).json({ mensaje: 'Carga no encontrada' });
        res.json(carga);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// Actualizar una carga por ID
exports.actualizarCarga = async (req, res) => {
    try {
        const carga = await Carga.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!carga) return res.status(404).json({ mensaje: 'Carga no encontrada' });
        res.json(carga);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

// Eliminar una carga por ID
exports.eliminarCarga = async (req, res) => {
    try {
        const carga = await Carga.findByIdAndDelete(req.params.id);
        if (!carga) return res.status(404).json({ mensaje: 'Carga no encontrada' });
        res.json({ mensaje: 'Carga eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};
