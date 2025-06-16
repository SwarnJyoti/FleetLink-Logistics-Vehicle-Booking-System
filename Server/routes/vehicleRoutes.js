const express = require('express');
const router = express.Router();
const { addVehicle } = require('../controllers/vehicleController');
const { getAvailableVehicles } = require('../controllers/bookingController');

router.post('/vehicles', addVehicle);
router.get('/vehicles/available', getAvailableVehicles);

module.exports = router;
