const mongoose = require('mongoose');

const vehiculoSchema = new mongoose.Schema({
    placa: { type: String, required: true, unique: true },
    modelo: { type: String, required: true },
    tipo: { type: String, required: true },
    capacidad: { type: Number, required: true },
    conductor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Vehiculo', vehiculoSchema);
