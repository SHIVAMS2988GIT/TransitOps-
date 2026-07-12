const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insert into database
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
            [name, email, password_hash, role]
        );

        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error during registration." });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        // Generate JWT
        const payload = {
            user: {
                id: user.rows[0].id,
                role: user.rows[0].role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "8h" }, // Perfect length for a hackathon
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.rows[0].role });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error during login." });
    }
};