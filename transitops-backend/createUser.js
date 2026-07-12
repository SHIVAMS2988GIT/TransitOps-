const pool = require('./db');
const bcrypt = require('bcryptjs'); // <-- Make sure it says bcryptjs here // Or 'bcryptjs' depending on what you installed earlier

const createAdmin = async () => {
    try {
        console.log("Generating Fleet Manager account...");

        // 1. Hash the password 'admin123' securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // 2. Inject the user into the database
        await pool.query(
            "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)",
            ['Super Admin', 'admin@transitops.com', hashedPassword, 'Fleet Manager']
        );

        console.log("✅ Admin user created successfully!");
        console.log("-----------------------------------");
        console.log("Email: admin@transitops.com");
        console.log("Password: admin123");
        console.log("-----------------------------------");
        process.exit(0);
    } catch (err) {
        // If the user already exists, it will throw an error, which is fine!
        if (err.code === '23505') {
            console.log("Account already exists! You can log in with admin@transitops.com");
        } else {
            console.error("Error creating user:", err.message);
        }
        process.exit(1);
    }
};

createAdmin();