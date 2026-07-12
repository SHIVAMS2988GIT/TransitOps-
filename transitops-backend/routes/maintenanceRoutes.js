const express = require('express');
const router = express.Router();
const { createMaintenance, closeMaintenance } = require('../controllers/maintenanceController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', verifyToken, authorizeRoles('Fleet Manager'), createMaintenance);
router.put('/:id/close', verifyToken, authorizeRoles('Fleet Manager'), closeMaintenance);

module.exports = router;