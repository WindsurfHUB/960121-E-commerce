const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

const dbPath = path.join(__dirname, '../../../data/nordic_shop.db');

router.post('/', (req, res) => {
    try {
        const { cartItems, email, cardNumber } = req.body;

        // 1-3. Data Validation (Your existing logic)
        if (!cartItems || cartItems.length === 0) return res.status(400).json({ message: "Cart is empty." });
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) return res.status(400).json({ message: "Invalid email format." });
        const ccRegex = /^\d{16}$/;
        const cleanCC = cardNumber ? cardNumber.replace(/\s/g, '') : ''; 
        if (!cleanCC || !ccRegex.test(cleanCC)) return res.status(400).json({ message: "Invalid credit card." });

        // 4. Calculate server-side total
        let subtotal = 0;
        cartItems.forEach(item => { subtotal += (item.price * item.quantity); });
        const finalTotal = subtotal + 5.00 + (subtotal * 0.07);

        // --- DATABASE INSERTION FLOW ---
        const db = new sqlite3.Database(dbPath);

        // Step A: Find the User ID associated with this email
        db.get('SELECT id FROM Users WHERE username = ?', [email], (err, userRow) => {
            if (err) {
                db.close();
                return res.status(500).json({ message: "Database error during user lookup." });
            }
            if (!userRow) {
                db.close();
                return res.status(400).json({ message: "Checkout Failed: No registered account found for this email." });
            }

            const userId = userRow.id;

            // Step B: Insert the main Order record
            db.run('INSERT INTO Orders (User_ID, total, status) VALUES (?, ?, ?)', [userId, finalTotal, 'Completed'], function(err) {
                if (err) {
                    db.close();
                    return res.status(500).json({ message: "Failed to create order record." });
                }

                const orderId = this.lastID; // Grab the auto-generated Order ID

                // Step C: Insert every item in the cart into Order_Items
                const insertItemStmt = db.prepare('INSERT INTO Order_Items (Order_ID, Product_ID, quantity, locked_price) VALUES (?, ?, ?, ?)');

                cartItems.forEach(item => {
                    insertItemStmt.run(orderId, item.id, item.quantity, item.price);
                });

                // Finalize the statement and close the database
                insertItemStmt.finalize((err) => {
                    db.close(); 
                    if (err) return res.status(500).json({ message: "Failed to save order items." });

                    // Send Final Success Response!
                    return res.status(200).json({ 
                        message: "Order placed successfully! Prices locked in database.", 
                        orderTotal: finalTotal.toFixed(2) 
                    });
                });
            });
        });

    } catch (error) {
        console.error('Checkout Transaction Error:', error);
        res.status(500).json({ message: "Internal Server Error during checkout." });
    }
});

module.exports = router;