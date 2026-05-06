const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

// Import our new SQLite-powered user service
const { findUserByEmail } = require('../services/userService');

// Point directly to the database file
const dbPath = path.join(__dirname, '../../../data/nordic_shop.db');

// --- THE LOGIN GATEKEEPER ---
router.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if the user exists in the database
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: Invalid email or password' });
        }

        // 2. Compare the submitted password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Unauthorized: Invalid email or password' });
        }

        // 3. Sign the JWT containing the user's ID
        const secretKey = process.env.JWT_SECRET || 'your_temporary_secret_key';
        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });

        // 4. Return the 200 status and the token
        return res.status(200).json({ token: token, message: 'Login successful' });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// --- THE REGISTER GATEKEEPER ---
router.post('/api/register', async (req, res) => {
    try {
        const { firstName, email, password } = req.body;

        // 1. Password Validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password must be 8+ characters with 1 uppercase and 1 special character." });
        }

        // 2. Check for existing username using our new SQLite service!
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "Username (email) is already registered." });
        }

        // 3. Hash the new password securely
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Save the new user to SQLite
        const db = new sqlite3.Database(dbPath);
        const insertQuery = `INSERT INTO Users (firstName, username, password) VALUES (?, ?, ?)`;

        // We use an array [firstName, email, hashedPassword] to prevent SQL Injection
        db.run(insertQuery, [firstName, email, hashedPassword], function(err) {
            db.close(); // Always close the connection
            
            if (err) {
                console.error('Database Insert Error:', err.message);
                return res.status(500).json({ message: "Failed to create account in database." });
            }

            // Success! Send 201 Created
            return res.status(201).json({ message: "Registration successful!" });
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: "Internal Server Error during registration." });
    }
});

module.exports = router;