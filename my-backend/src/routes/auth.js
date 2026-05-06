const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// This represents your database fetching logic
const { findUserByEmail } = require('../services/userService');

// --- THE LOGIN GATEKEEPER ---
router.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("THE GATEKEEPER SEES:", email, password);

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
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// --- THE REGISTER GATEKEEPER ---
router.post('/api/register', async (req, res) => {
    try {
        const { firstName, email, password } = req.body;

        // 1. Password Validation (Backend Safety Net)
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password must be 8+ characters with 1 uppercase and 1 special character." });
        }

        // 2. Check for existing username (email)
        const usersPath = path.join(__dirname, '../../../data/auth_user.json');
        const rawData = fs.readFileSync(usersPath, 'utf8');
        const users = JSON.parse(rawData);

        const existingUser = users.find(u => u.username === email);
        if (existingUser) {
            return res.status(400).json({ message: "Username (email) is already registered." });
        }

        // 3. Hash the new password securely
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create and save the new user
        const newUser = {
            firstName: firstName,
            username: email,
            password: hashedPassword,
            dateOfRegistration: new Date().toISOString()
        };

        users.push(newUser);
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

        res.status(201).json({ message: "Registration successful!" });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: "Internal Server Error during registration." });
    }
});

module.exports = router;