// backend/controllers/authController.js
const pool = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async(req, res) => {
    const { username, password, interests } = req.body;

    try {
        // Check if username exists
        const existing = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in the users table
        const userResult = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]
        );
        const user = userResult.rows[0];

        // Add interests (if any)
        if (Array.isArray(interests)) {
            for (const interest of interests) {
                await pool.query(
                    'INSERT INTO interests (user_id, interest) VALUES ($1, $2)', [user.id, interest]
                );
            }
        }

        // Retrieve interests from the database
        const interestsResult = await pool.query(
            'SELECT interest FROM interests WHERE user_id = $1', [user.id]
        );
        const userInterests = interestsResult.rows.map(row => row.interest);

        // Generate a token a
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, userId: user.id, interests: userInterests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

const login = async(req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = userResult.rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const interestsResult = await pool.query(
            'SELECT interest FROM interests WHERE user_id = $1', [user.id]
        );
        const userInterests = interestsResult.rows.map(row => row.interest);

        //  JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userId: user.id, interests: userInterests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
};

module.exports = { register, login };