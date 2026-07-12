const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests to req.body

// Health Check Route
app.get('/', (req, res) => {
    res.send('TransitOps API is running smoothly.');
});

// Mounted API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/drivers', require('./routes/driverRoutes'));

// Future Routes (Placeholders for the next phases)
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is locked and loaded on port ${PORT}`);
});