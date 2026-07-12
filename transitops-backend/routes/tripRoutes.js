const express = require('express');
const router = express.Router();
const { getTrips, dispatchTrip, completeTrip, cancelTrip } = require('../controllers/tripController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Get all trips
router.get('/', verifyToken, getTrips);

// Dispatch a new trip
router.post('/dispatch', verifyToken, authorizeRoles('Fleet Manager'), dispatchTrip);

// Complete a trip
router.put('/:id/complete', verifyToken, authorizeRoles('Fleet Manager', 'Driver'), completeTrip);

// Cancel a trip
router.put('/:id/cancel', verifyToken, authorizeRoles('Fleet Manager'), cancelTrip);

module.exports = router;