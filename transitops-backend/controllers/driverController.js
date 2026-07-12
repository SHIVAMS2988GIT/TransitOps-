const pool = require('../db');

// @route   POST /api/drivers
// @desc    Register a new driver
// @access  Private (Fleet Manager, Safety Officer)
exports.createDriver = async (req, res) => {
    const { name, license_number, license_category, license_expiry_date, contact_number, safety_score } = req.body;
    
    try {
        const newDriver = await pool.query(
            `INSERT INTO drivers 
            (name, license_number, license_category, license_expiry_date, contact_number, safety_score) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [name, license_number, license_category, license_expiry_date, contact_number, safety_score || 100]
        );
        res.status(201).json(newDriver.rows[0]);
    } catch (err) {
        console.error(err.message);
        if (err.code === '23505') {
            return res.status(400).json({ error: "Driver with this license number already exists." });
        }
        res.status(500).send("Server Error");
    }
};

// @route   GET /api/drivers
// @desc    Get all drivers
// @access  Private
exports.getDrivers = async (req, res) => {
    const { status } = req.query;
    try {
        let drivers;
        if (status) {
            drivers = await pool.query("SELECT * FROM drivers WHERE status = $1", [status]);
        } else {
            drivers = await pool.query("SELECT * FROM drivers ORDER BY id DESC");
        }
        res.json(drivers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};