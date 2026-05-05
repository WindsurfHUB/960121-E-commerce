const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    try {
        // Body Parsing: Unpacking the JSON payload sent from the frontend
        const { cartItems, email, cardNumber } = req.body;

        // 1. Check incoming cart items
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "Validation Failed: Cart is empty." });
        }

        // 2. Validate Email using Regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ message: "Validation Failed: Invalid email format." });
        }

        // 3. Validate 16-digit Credit Card using Regex
        const ccRegex = /^\d{16}$/;
        // Remove spaces just in case the user typed "1234 5678..."
        const cleanCC = cardNumber ? cardNumber.replace(/\s/g, '') : ''; 
        if (!cleanCC || !ccRegex.test(cleanCC)) {
            return res.status(400).json({ message: "Validation Failed: Invalid credit card. Must be 16 digits." });
        }

        // 4. Calculate the total server-side (Never trust frontend prices!)
        let subtotal = 0;
        cartItems.forEach(item => {
            subtotal += (item.price * item.quantity);
        });
        const shipping = 5.00;
        const tax = subtotal * 0.07;
        const finalTotal = subtotal + shipping + tax;

        // If all validation passes, return a 200 Success status
        res.status(200).json({ 
            message: "Order placed successfully!", 
            orderTotal: finalTotal.toFixed(2) 
        });

    } catch (error) {
        console.error('Checkout Transaction Error:', error);
        res.status(500).json({ message: "Internal Server Error during checkout." });
    }
});

module.exports = router;