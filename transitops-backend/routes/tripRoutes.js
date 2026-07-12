const express = require('express');
const router = express.Router();
const { dispatchTrip, getTrips } = require('../controllers/tripController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const { dispatchTrip, getTrips, completeTrip, cancelTrip } = require('../controllers/tripController');
router.post('/dispatch', verifyToken, authorizeRoles('Fleet Manager', 'Driver'), dispatchTrip);
router.get('/', verifyToken, getTrips);
// Add this to the top imports


// Add these routes below your existing ones
router.put('/:id/complete', verifyToken, authorizeRoles('Fleet Manager', 'Driver'), completeTrip);
router.put('/:id/cancel', verifyToken, authorizeRoles('Fleet Manager'), cancelTrip);

module.exports = router;
