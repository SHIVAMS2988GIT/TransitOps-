const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');

const app = express();

const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: allowedOrigin,
    credentials: false
  })
);

app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
  res.json({
    service: 'TransitOps API',
    status: 'ok'
  });
});

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT current_database() AS database, current_user AS user'
    );

    res.json({
      status: 'ok',
      database: result.rows[0].database,
      user: result.rows[0].user
    });
  } catch (err) {
    console.error('Health check failed:', err.message);

    res.status(503).json({
      status: 'error',
      error: 'Database unavailable'
    });
  }
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/drivers', require('./routes/driverRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

app.use((err, req, res, next) => {
  console.error('Unhandled API error:', err);

  res.status(500).json({
    error: 'Unexpected server error.'
  });
});

const PORT = Number(process.env.PORT) || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`TransitOps API running on port ${PORT}`);
});

const shutdown = async () => {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);