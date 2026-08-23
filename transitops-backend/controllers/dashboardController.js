const pool = require('../db');

exports.getSummary = async (req, res) => {
  try {
    const [fleet, drivers, trips, recentTrips] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS total_vehicles,
        COUNT(*) FILTER (WHERE status = 'Available')::int AS available,
        COUNT(*) FILTER (WHERE status = 'On Trip')::int AS on_trip,
        COUNT(*) FILTER (WHERE status = 'In Shop')::int AS in_shop
        FROM vehicles`),
      pool.query(`SELECT COUNT(*)::int AS total_drivers,
        COUNT(*) FILTER (WHERE status = 'Available')::int AS available_drivers
        FROM drivers`),
      pool.query(`SELECT COUNT(*) FILTER (WHERE status = 'Dispatched')::int AS active_trips,
        COUNT(*) FILTER (WHERE status = 'Completed')::int AS completed_trips
        FROM trips`),
      pool.query(`SELECT t.id, t.source, t.destination, t.status,
        v.registration_number, d.name AS driver_name
        FROM trips t
        JOIN vehicles v ON v.id = t.vehicle_id
        JOIN drivers d ON d.id = t.driver_id
        WHERE t.status = 'Dispatched'
        ORDER BY t.created_at DESC LIMIT 6`)
    ]);

    const f = fleet.rows[0];
    const d = drivers.rows[0];
    const t = trips.rows[0];
    const utilization = Number(f.total_vehicles) ? (Number(f.on_trip) / Number(f.total_vehicles)) * 100 : 0;

    res.json({
      fleet: { ...f, ...d, ...t },
      utilization: Number(utilization.toFixed(1)),
      recentTrips: recentTrips.rows
    });
  } catch (err) {
    console.error('Dashboard summary error:', err.message);
    res.status(500).json({ error: 'Unable to load dashboard data.' });
  }
};
