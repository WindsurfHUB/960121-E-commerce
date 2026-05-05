const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// This represents your database fetching logic
const { findUserByEmail } = require('../services/userService');

router.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if the user exists in the database
        const user = await findUserByEmail(email);
        if (!user) {
            // Generic error message prevents hackers from knowing which emails exist
            return res.status(401).json({ message: 'Unauthorized: Invalid email or password' });
        }

        // 2. Compare the submitted password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Unauthorized: Invalid email or password' });
        }

        // 3. Sign the JWT containing the user's ID
        // Note: Always use environment variables for your secret key in production
        const secretKey = process.env.JWT_SECRET || 'your_temporary_secret_key';
        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });

        // 4. Return the 200 status and the token
        return res.status(200).json({ token: token, message: 'Login successful' });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;