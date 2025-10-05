const mongoose = require('mongoose');

const viajeSchema = new mongoose.Schema({
    vehiculo: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehiculo', required: true },
    carga: { type: mongoose.Schema.Types.ObjectId, ref: 'Carga', required: true },
    fechaSalida: { type: Date, required: true },
    fechaLlegada: { type: Date },
    estado: { type: String, enum: ['pendiente', 'en curso', 'finalizado'], default: 'pendiente' }
}, { timestamps: true });

module.exports = mongoose.model('Viaje', viajeSchema);
