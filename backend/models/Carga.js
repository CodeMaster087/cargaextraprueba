const mongoose = require('mongoose');

const cargaSchema = new mongoose.Schema({
    descripcion: { type: String, required: true },
    peso: { type: Number, required: true },
    dimensiones: { type: String },
    origen: { type: String, required: true },
    destino: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Carga', cargaSchema);
