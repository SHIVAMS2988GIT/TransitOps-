const pool = require('../db');

exports.getKPIs = async (req, res) => {
  try {
    const [fleet, fuel, maintenance] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS total_vehicles,
        COUNT(*) FILTER (WHERE status = 'Available')::int AS available,
        COUNT(*) FILTER (WHERE status = 'On Trip')::int AS on_trip,
        COUNT(*) FILTER (WHERE status = 'In Shop')::int AS in_shop
        FROM vehicles`),
      pool.query('SELECT COALESCE(SUM(cost), 0) AS total_fuel FROM fuel_logs'),
      pool.query('SELECT COALESCE(SUM(cost), 0) AS total_maintenance FROM maintenance_logs')
    ]);
    const stats = fleet.rows[0];
    const utilization = Number(stats.total_vehicles) ? (Number(stats.on_trip) / Number(stats.total_vehicles)) * 100 : 0;
    const fuelCost = Number(fuel.rows[0].total_fuel || 0);
    const maintenanceCost = Number(maintenance.rows[0].total_maintenance || 0);
    res.json({
      fleet: stats,
      utilization: Number(utilization.toFixed(1)),
      costs: { fuel: fuelCost, maintenance: maintenanceCost, total: fuelCost + maintenanceCost }
    });
  } catch (err) {
    console.error('Report error:', err.message);
    res.status(500).json({ error: 'Server error fetching reports.' });
  }
};
