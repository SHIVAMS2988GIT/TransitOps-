const express = require('express');
const router = express.Router();
const { getKPIs } = require('../controllers/reportController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/kpis', verifyToken, authorizeRoles('Fleet Manager', 'Financial Analyst'), getKPIs);

module.exports = router;