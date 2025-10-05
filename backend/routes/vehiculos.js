const express = require('express');
const router = express.Router();

// Importamos el controlador de Vehículos
const vehiculosController = require('../controllers/vehiculosController');

/**
 * @route   GET /api/vehiculos
 * @desc    Listar todos los vehículos
 */
router.get('/', vehiculosController.listarVehiculos);

/**
 * @route   GET /api/vehiculos/:id
 * @desc    Obtener un vehículo por ID
 */
router.get('/:id', vehiculosController.obtenerVehiculo);

/**
 * @route   POST /api/vehiculos
 * @desc    Crear un nuevo vehículo
 */
router.post('/', vehiculosController.crearVehiculo);

/**
 * @route   PUT /api/vehiculos/:id
 * @desc    Actualizar un vehículo por ID
 */
router.put('/:id', vehiculosController.actualizarVehiculo);

/**
 * @route   DELETE /api/vehiculos/:id
 * @desc    Eliminar un vehículo por ID
 */
router.delete('/:id', vehiculosController.eliminarVehiculo);

module.exports = router;
