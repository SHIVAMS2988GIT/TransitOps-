const express = require('express');
const router = express.Router();
const { createDriver, getDrivers } = require('../controllers/driverController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Safety Officers and Fleet Managers can add drivers
router.post('/', verifyToken, authorizeRoles('Fleet Manager', 'Safety Officer'), createDriver);
router.get('/', verifyToken, getDrivers);

module.exports = router;