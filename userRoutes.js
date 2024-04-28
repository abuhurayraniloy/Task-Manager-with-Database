// userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('./db');
const { generateToken, comparePassword } = require('./auth');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        await connection.query(query, [username, email, hashedPassword]);
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
});

// userRoutes.js
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const query = 'SELECT * FROM users WHERE username = ?';
        const [user] = await connection.query(query, [username]);
        if (!user || !comparePassword(password, user[0].password)) {
            res.status(401).json({ error: 'Invalid username or password' });
            return;
        }
        const token = generateToken(user[0]);
        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Error logging in' });
    }
});

module.exports = router;
