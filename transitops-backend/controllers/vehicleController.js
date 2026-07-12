const pool = require('../db');

// @route   POST /api/vehicles
// @desc    Register a new vehicle
// @access  Private (Fleet Manager only)
exports.createVehicle = async (req, res) => {
    const { registration_number, model, type, max_load_capacity, odometer, acquisition_cost } = req.body;
    
    try {
        const newVehicle = await pool.query(
            `INSERT INTO vehicles 
            (registration_number, model, type, max_load_capacity, odometer, acquisition_cost) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [registration_number, model, type, max_load_capacity, odometer || 0, acquisition_cost]
        );
        res.status(201).json(newVehicle.rows[0]);
    } catch (err) {
        console.error(err.message);
        if (err.code === '23505') { // PostgreSQL unique violation code
            return res.status(400).json({ error: "Vehicle with this registration number already exists." });
        }
        res.status(500).send("Server Error");
    }
};

// @route   GET /api/vehicles
// @desc    Get all vehicles (with optional status filter)
// @access  Private
exports.getVehicles = async (req, res) => {
    const { status } = req.query;
    try {
        let vehicles;
        if (status) {
            vehicles = await pool.query("SELECT * FROM vehicles WHERE status = $1", [status]);
        } else {
            vehicles = await pool.query("SELECT * FROM vehicles ORDER BY created_at DESC");
        }
        res.json(vehicles.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};