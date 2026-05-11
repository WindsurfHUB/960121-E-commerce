const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const jwt = require("jsonwebtoken"); // Added JWT import
const router = express.Router();

const dbPath = path.resolve(__dirname, "../../", process.env.DB_PATH);

// Changed to async to support await fetch()
router.post("/", async (req, res) => {
  try {
    const { cartItems, email, cardNumber } = req.body;

    // 1. Data Validation (Existing Gatekeeper Logic)
    if (!cartItems || cartItems.length === 0)
      return res.status(400).json({ message: "Cart is empty." });
      
    // Prevent application-layer DoS (Cart Size Limit Fix)
    if (cartItems.length > 50) 
      return res.status(400).json({ message: "Cart exceeds maximum allowed unique items." });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email format." });
    const ccRegex = /^\d{16}$/;
    const cleanCC = cardNumber ? cardNumber.replace(/\s/g, "") : "";
    if (!cleanCC || !ccRegex.test(cleanCC))
      return res.status(400).json({ message: "Invalid credit card." });

    // --- MICROSERVICE DECOUPLING (SESSION 09) ---
    // Instead of directly querying the DB for products here,
    // we simulate a network request to an independent "Catalog Service"
    let subtotal = 0;

    for (const item of cartItems) {
      // Making an HTTP request to our own server (simulating a separate microservice on port 8888)
      const productResponse = await fetch(
        `http://localhost:8888/api/products/${item.id}`,
      );

      if (!productResponse.ok) {
        return res
          .status(400)
          .json({
            message: `Catalog Service Error: Item ${item.id} unavailable`,
          });
      }

      const productData = await productResponse.json();
      
      // Strict boundary validation (Negative Quantity Exploit Fix)
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return res
          .status(400)
          .json({ message: "Invalid item quantity detected." });
      }
      
      // Server-side calculation using the True Price from the Catalog Service
      subtotal += productData.price * item.quantity;
    }

    const finalTotal = subtotal + 5.0 + subtotal * 0.07;

    // --- DATABASE INSERTION FLOW (Order Service) ---
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err)
        return res.status(500).json({ message: "Database connection failed." });
    });

    // --- REPLACED: Extract Identity from JWT (Broken Access Control Fix) ---
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        db.close();
        return res.status(401).json({ message: "Unauthorized: Missing session token." });
    }
    
    const token = authHeader.split(' ')[1];
    let userId;
    try {
        // Use the secret from your .env file
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id; 
    } catch (err) {
        db.close();
        return res.status(401).json({ message: "Unauthorized: Invalid or expired token." });
    }

    db.run(
      "INSERT INTO Orders (User_ID, total_price, status) VALUES (?, ?, ?)",
      [userId, finalTotal, "Completed"],
      function (err) {
        if (err) {
          db.close();
          return res
            .status(500)
            .json({ message: "Failed to create order record." });
        }

        const orderId = this.lastID; // Grab the auto-generated Order ID

        // Insert every item in the cart into Order_Items
        const insertItemStmt = db.prepare(
          "INSERT INTO Order_Items (Order_ID, Product_ID, quantity, locked_price) VALUES (?, ?, ?, ?)",
        );

        cartItems.forEach((item) => {
          insertItemStmt.run(orderId, item.id, item.quantity, item.price);
        });

        // Finalize the statement and close the database
        insertItemStmt.finalize((err) => {
          db.close();
          if (err)
            return res
              .status(500)
              .json({ message: "Failed to save order items." });

          // Send Final Success Response!
          return res.status(200).json({
            message: "Order placed successfully! Prices locked in database.",
            orderTotal: finalTotal.toFixed(2),
          });
        });
      },
    );
  } catch (error) {
    console.error("Checkout Transaction Error:", error);
    res.status(500).json({ message: "Internal Server Error during checkout." });
  }
});

module.exports = router;