const express = require('express');
const router = express.Router();
const { createVehicle, getVehicles } = require('../controllers/vehicleController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', verifyToken, authorizeRoles('Fleet Manager'), createVehicle);
router.get('/', verifyToken, getVehicles);

module.exports = router;