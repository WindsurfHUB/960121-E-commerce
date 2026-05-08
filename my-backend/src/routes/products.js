const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Existing route
router.get("/", productController.getProducts);

// --- ADD THIS NEW ROUTE ---
router.get("/:id", productController.getProductById);

module.exports = router;