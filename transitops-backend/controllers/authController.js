const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ error: 'Name, email, password and role are required.' });
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name.trim(), email.trim().toLowerCase(), passwordHash, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Registration error:', err.message);
    if (err.code === '23505') return res.status(409).json({ error: 'An account with this email already exists.' });
    res.status(500).json({ error: 'Server error during registration.' });
  }
};

exports.login = async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is missing from backend .env');
    return res.status(500).json({ error: 'Server authentication is not configured.' });
  }

  try {
    const result = await pool.query('SELECT id, name, email, password_hash, role FROM users WHERE LOWER(email) = $1 LIMIT 1', [email]);
    if (!result.rows.length) return res.status(401).json({ error: 'Invalid email or password.' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password.' });

    const token = jwt.sign({ user: { id: user.id, name: user.name, role: user.role } }, process.env.JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, role: user.role, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error during login.' });
  }
};
