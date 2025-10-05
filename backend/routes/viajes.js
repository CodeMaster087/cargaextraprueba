const express = require('express');
const router = express.Router();

// Importamos el controlador de Viajes
const viajesController = require('../controllers/viajesController');

/**
 * @route   GET /api/viajes
 * @desc    Listar todos los viajes
 */
router.get('/', viajesController.listarViajes);

/**
 * @route   GET /api/viajes/:id
 * @desc    Obtener un viaje por ID
 */
router.get('/:id', viajesController.obtenerViaje);

/**
 * @route   POST /api/viajes
 * @desc    Crear un nuevo viaje
 */
router.post('/', viajesController.crearViaje);

/**
 * @route   PUT /api/viajes/:id
 * @desc    Actualizar un viaje por ID
 */
router.put('/:id', viajesController.actualizarViaje);

/**
 * @route   DELETE /api/viajes/:id
 * @desc    Eliminar un viaje por ID
 */
router.delete('/:id', viajesController.eliminarViaje);

module.exports = router;
