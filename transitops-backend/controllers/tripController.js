const pool = require('../db');

// @route   POST /api/trips/dispatch
// @desc    Create and dispatch a new trip
// @access  Private (Driver, Fleet Manager)
exports.dispatchTrip = async (req, res) => {
    const { source, destination, vehicle_id, driver_id, cargo_weight, planned_distance } = req.body;
    
    // Get a dedicated client from the pool for our transaction
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Start Transaction

        // 1. Validate Vehicle: Check capacity and availability
        const vehicleRes = await client.query("SELECT max_load_capacity, status FROM vehicles WHERE id = $1 FOR UPDATE", [vehicle_id]);
        if (vehicleRes.rows.length === 0) throw new Error("Vehicle not found.");
        
        const vehicle = vehicleRes.rows[0];
        if (vehicle.status !== 'Available') throw new Error("Vehicle is not available for dispatch.");
        if (cargo_weight > vehicle.max_load_capacity) throw new Error(`Cargo weight exceeds vehicle capacity of ${vehicle.max_load_capacity}kg.`);

        // 2. Validate Driver: Check availability
        const driverRes = await client.query("SELECT status FROM drivers WHERE id = $1 FOR UPDATE", [driver_id]);
        if (driverRes.rows.length === 0) throw new Error("Driver not found.");
        
        const driver = driverRes.rows[0];
        if (driver.status !== 'Available') throw new Error("Driver is not available or is suspended.");

        // 3. Create the Trip
        const newTrip = await client.query(
            `INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, status) 
             VALUES ($1, $2, $3, $4, $5, $6, 'Dispatched') RETURNING *`,
            [source, destination, vehicle_id, driver_id, cargo_weight, planned_distance]
        );

        // 4. Update Vehicle & Driver Status to 'On Trip'
        await client.query("UPDATE vehicles SET status = 'On Trip' WHERE id = $1", [vehicle_id]);
        await client.query("UPDATE drivers SET status = 'On Trip' WHERE id = $1", [driver_id]);

        await client.query('COMMIT'); // Commit Transaction
        res.status(201).json(newTrip.rows[0]);

    } catch (err) {
        await client.query('ROLLBACK'); // Cancel everything if there is an error
        console.error("Transaction Error: ", err.message);
        res.status(400).json({ error: err.message });
    } finally {
        client.release(); // Return client to the pool
    }
};

// @route   GET /api/trips
// @desc    Get all trips
// @access  Private
exports.getTrips = async (req, res) => {
    try {
        const trips = await pool.query(
            `SELECT t.*, v.registration_number, d.name AS driver_name 
             FROM trips t 
             JOIN vehicles v ON t.vehicle_id = v.id 
             JOIN drivers d ON t.driver_id = d.id 
             ORDER BY t.created_at DESC`
        );
        res.json(trips.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// @route   PUT /api/trips/:id/complete
// @desc    Complete a trip and log fuel
// @access  Private (Driver, Fleet Manager)
exports.completeTrip = async (req, res) => {
    const tripId = req.params.id;
    const { final_odometer, fuel_liters, fuel_cost } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Get the trip details
        const tripRes = await client.query("SELECT vehicle_id, driver_id, status FROM trips WHERE id = $1 FOR UPDATE", [tripId]);
        if (tripRes.rows.length === 0) throw new Error("Trip not found.");
        
        const trip = tripRes.rows[0];
        if (trip.status !== 'Dispatched') throw new Error("Only dispatched trips can be completed.");

        // 2. Update the Trip Status
        await client.query("UPDATE trips SET status = 'Completed', updated_at = CURRENT_TIMESTAMP WHERE id = $1", [tripId]);

        // 3. Update Vehicle (Status + Odometer) and Driver (Status)
        await client.query("UPDATE vehicles SET status = 'Available', odometer = $1 WHERE id = $2", [final_odometer, trip.vehicle_id]);
        await client.query("UPDATE drivers SET status = 'Available' WHERE id = $1", [trip.driver_id]);

        // 4. Log the Fuel (Automatic expense tracking)
        if (fuel_liters && fuel_cost) {
            await client.query(
                "INSERT INTO fuel_logs (vehicle_id, trip_id, liters, cost) VALUES ($1, $2, $3, $4)",
                [trip.vehicle_id, tripId, fuel_liters, fuel_cost]
            );
        }

        await client.query('COMMIT');
        res.json({ message: "Trip completed successfully, statuses restored to Available." });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Complete Trip Error: ", err.message);
        res.status(400).json({ error: err.message });
    } finally {
        client.release();
    }
};

// @route   PUT /api/trips/:id/cancel
// @desc    Cancel a trip
// @access  Private (Fleet Manager)
exports.cancelTrip = async (req, res) => {
    const tripId = req.params.id;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const tripRes = await client.query("SELECT vehicle_id, driver_id, status FROM trips WHERE id = $1 FOR UPDATE", [tripId]);
        if (tripRes.rows.length === 0) throw new Error("Trip not found.");
        
        const trip = tripRes.rows[0];
        if (trip.status !== 'Dispatched' && trip.status !== 'Draft') throw new Error("Cannot cancel this trip.");

        await client.query("UPDATE trips SET status = 'Cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = $1", [tripId]);
        await client.query("UPDATE vehicles SET status = 'Available' WHERE id = $1", [trip.vehicle_id]);
        await client.query("UPDATE drivers SET status = 'Available' WHERE id = $1", [trip.driver_id]);

        await client.query('COMMIT');
        res.json({ message: "Trip cancelled. Vehicle and driver are Available." });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: err.message });
    } finally {
        client.release();
    }
};