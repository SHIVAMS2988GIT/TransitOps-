const pool = require('./db');

const seedDatabase = async () => {
    try {
        console.log("Injecting test data into TransitOps...");
        
        // Clear existing data to prevent errors if you run this multiple times
        await pool.query("TRUNCATE vehicles, drivers, trips, maintenance_logs, fuel_logs RESTART IDENTITY CASCADE");

        // Insert Test Vehicles
        await pool.query(`
            INSERT INTO vehicles (registration_number, model, type, max_load_capacity, odometer, acquisition_cost, status) VALUES 
            ('VAN-001', 'Ford Transit', 'Van', 500, 15000, 30000, 'Available'),
            ('TRK-002', 'Volvo FH16', 'Truck', 5000, 120000, 85000, 'Available'),
            ('TRK-003', 'Scania R500', 'Truck', 6000, 85000, 90000, 'Available'),
            ('VAN-004', 'Mercedes Sprinter', 'Van', 800, 45000, 40000, 'In Shop')
        `);

        // Insert Test Drivers
        await pool.query(`
            INSERT INTO drivers (name, license_number, license_category, license_expiry_date, contact_number, safety_score, status) VALUES 
            ('Alex Turner', 'DL-1001', 'Heavy', '2028-12-31', '555-0101', 95, 'Available'),
            ('Maria Garcia', 'DL-1002', 'Light', '2027-06-15', '555-0102', 88, 'Available'),
            ('James Smith', 'DL-1003', 'Heavy', '2029-01-20', '555-0103', 100, 'Available'),
            ('David Crash', 'DL-1004', 'Light', '2025-10-31', '555-0104', 45, 'Suspended')
        `);

        console.log("Database seeded successfully! Your fleet is ready.");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding database:", err);
        process.exit(1);
    }
};

seedDatabase();