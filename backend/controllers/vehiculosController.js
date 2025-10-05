const Vehiculo = require('../models/Vehiculo');

// Crear un nuevo vehículo
exports.crearVehiculo = async (req, res) => {
    try {
        const nuevoVehiculo = new Vehiculo(req.body);
        await nuevoVehiculo.save();
        res.status(201).json(nuevoVehiculo);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

// Listar todos los vehículos
exports.listarVehiculos = async (req, res) => {
    try {
        const vehiculos = await Vehiculo.find().populate('conductor', 'nombre email rol');
        res.json(vehiculos);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// Obtener un vehículo por ID
exports.obtenerVehiculo = async (req, res) => {
    try {
        const vehiculo = await Vehiculo.findById(req.params.id).populate('conductor', 'nombre email rol');
        if (!vehiculo) return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
        res.json(vehiculo);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// Actualizar un vehículo por ID
exports.actualizarVehiculo = async (req, res) => {
    try {
        const vehiculo = await Vehiculo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!vehiculo) return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
        res.json(vehiculo);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

// Eliminar un vehículo por ID
exports.eliminarVehiculo = async (req, res) => {
    try {
        const vehiculo = await Vehiculo.findByIdAndDelete(req.params.id);
        if (!vehiculo) return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
        res.json({ mensaje: 'Vehículo eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};
