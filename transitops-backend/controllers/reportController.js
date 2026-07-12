const pool = require('../db');

// @route   GET /api/reports/kpis
// @desc    Get Fleet Utilization and Financial KPIs
// @access  Private (Fleet Manager, Financial Analyst)
exports.getKPIs = async (req, res) => {
    try {
        // 1. Aggregate Fleet Status Metrics
        const fleet = await pool.query(`
            SELECT 
                COUNT(*) as total_vehicles,
                COUNT(CASE WHEN status = 'Available' THEN 1 END) as available,
                COUNT(CASE WHEN status = 'On Trip' THEN 1 END) as on_trip,
                COUNT(CASE WHEN status = 'In Shop' THEN 1 END) as in_shop
            FROM vehicles
        `);

        // 2. Aggregate Operational Costs
        const fuel = await pool.query('SELECT COALESCE(SUM(cost), 0) as total_fuel FROM fuel_logs');
        const maintenance = await pool.query('SELECT COALESCE(SUM(cost), 0) as total_maintenance FROM maintenance_logs');

        const stats = fleet.rows[0];
        
        // Calculate Fleet Utilization (%)
        const utilization = stats.total_vehicles > 0 
            ? ((stats.on_trip / stats.total_vehicles) * 100).toFixed(1) 
            : 0;

        const totalCost = parseFloat(fuel.rows[0].total_fuel) + parseFloat(maintenance.rows[0].total_maintenance);

        res.json({
            fleet: stats,
            utilization: utilization,
            costs: {
                fuel: fuel.rows[0].total_fuel,
                maintenance: maintenance.rows[0].total_maintenance,
                total: totalCost
            }
        });
    } catch (err) {
        console.error("Report Error:", err.message);
        res.status(500).json({ error: "Server Error fetching reports" });
    }
};