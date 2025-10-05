const Viaje = require('../models/Viaje');

// Crear un nuevo viaje
exports.crearViaje = async (req, res) => {
    try {
        const nuevoViaje = new Viaje(req.body);
        await nuevoViaje.save();
        res.status(201).json(nuevoViaje);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

// Listar todos los viajes
exports.listarViajes = async (req, res) => {
    try {
        const viajes = await Viaje.find()
            .populate('vehiculo', 'placa modelo tipo')
            .populate('carga', 'descripcion peso origen destino');
        res.json(viajes);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// Obtener un viaje por ID
exports.obtenerViaje = async (req, res) => {
    try {
        const viaje = await Viaje.findById(req.params.id)
            .populate('vehiculo', 'placa modelo tipo')
            .populate('carga', 'descripcion peso origen destino');
        if (!viaje) return res.status(404).json({ mensaje: 'Viaje no encontrado' });
        res.json(viaje);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// Actualizar un viaje por ID
exports.actualizarViaje = async (req, res) => {
    try {
        const viaje = await Viaje.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!viaje) return res.status(404).json({ mensaje: 'Viaje no encontrado' });
        res.json(viaje);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

// Eliminar un viaje por ID
exports.eliminarViaje = async (req, res) => {
    try {
        const viaje = await Viaje.findByIdAndDelete(req.params.id);
        if (!viaje) return res.status(404).json({ mensaje: 'Viaje no encontrado' });
        res.json({ mensaje: 'Viaje eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};
