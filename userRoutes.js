// userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('./db');
const jwt = require('jsonwebtoken');
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
// router.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const query = 'SELECT * FROM users WHERE username = ?';
//         const [user] = await connection.query(query, [username]);
//         if (!user || !comparePassword(password, user[0].password)) {
//             res.status(401).json({ error: 'Invalid username or password' });
//             return;
//         }
//         const token = generateToken(user[0]);
//         res.json({ token });
//     } catch (error) {
//         console.error('Error logging in:', error);
//         res.status(500).json({ error: 'Error logging in' });
//     }
// });


router.post('/login', async (req, res) => {
    try {
        const sql = "SELECT * FROM users WHERE username = ?";
        const values = [
            req.body.username
        ]
        connection.query(sql, [values], async (err, result) => {
            if (err) return res.json("Error occurerd");
            if (result.length > 0) {
                const isValid = await bcrypt.compare(req.body.password, result[0].password);
                if (isValid) {
                    const token = jwt.sign({
                        email: result[0].email,
                        username: result[0].username
                    }, process.env.JWT_SECRET, {
                        expiresIn: '1h'
                    });

                    return res.status(200).json({
                        authentication_token: token,
                        message: 'Successfully Login'
                    });
                } else {
                    return res.status(400).json("Login Failed");
                }
            } else return res.status(500).json("Login Failed");
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Login Failed' });
    }
})

module.exports = router;
