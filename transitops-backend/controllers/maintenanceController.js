const pool = require('../db');

// @route   POST /api/maintenance
// @desc    Create maintenance log & set vehicle to 'In Shop'
// @access  Private (Fleet Manager)
exports.createMaintenance = async (req, res) => {
    const { vehicle_id, description, cost } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const log = await client.query(
            "INSERT INTO maintenance_logs (vehicle_id, description, cost, is_active) VALUES ($1, $2, $3, true) RETURNING *",
            [vehicle_id, description, cost]
        );

        await client.query("UPDATE vehicles SET status = 'In Shop' WHERE id = $1", [vehicle_id]);

        await client.query('COMMIT');
        res.status(201).json(log.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: "Server Error during maintenance logging." });
    } finally {
        client.release();
    }
};

// @route   PUT /api/maintenance/:id/close
// @desc    Close maintenance & restore vehicle to 'Available'
// @access  Private (Fleet Manager)
exports.closeMaintenance = async (req, res) => {
    const logId = req.params.id;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const logRes = await client.query("UPDATE maintenance_logs SET is_active = false WHERE id = $1 RETURNING vehicle_id", [logId]);
        if (logRes.rows.length === 0) throw new Error("Log not found.");

        const vehicleId = logRes.rows[0].vehicle_id;
        
        // Ensure we don't accidentally make a retired vehicle available
        const vehicle = await client.query("SELECT status FROM vehicles WHERE id = $1", [vehicleId]);
        if (vehicle.rows[0].status !== 'Retired') {
            await client.query("UPDATE vehicles SET status = 'Available' WHERE id = $1", [vehicleId]);
        }

        await client.query('COMMIT');
        res.json({ message: "Maintenance closed. Vehicle is now Available." });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: err.message });
    } finally {
        client.release();
    }
};