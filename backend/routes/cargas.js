const express = require('express');
const router = express.Router();

// Importamos el controlador de Cargas
const cargasController = require('../controllers/cargasController');

/**
 * @route   GET /api/cargas
 * @desc    Listar todas las cargas
 */
router.get('/', cargasController.listarCargas);

/**
 * @route   GET /api/cargas/:id
 * @desc    Obtener una carga por ID
 */
router.get('/:id', cargasController.obtenerCarga);

/**
 * @route   POST /api/cargas
 * @desc    Crear una nueva carga
 */
router.post('/', cargasController.crearCarga);

/**
 * @route   PUT /api/cargas/:id
 * @desc    Actualizar una carga por ID
 */
router.put('/:id', cargasController.actualizarCarga);

/**
 * @route   DELETE /api/cargas/:id
 * @desc    Eliminar una carga por ID
 */
router.delete('/:id', cargasController.eliminarCarga);

module.exports = router;
