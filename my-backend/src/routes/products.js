const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// ROUTE LAYER: Maps the URL endpoint to the Controller.
// Listens for GET requests at /api/products and /api/products?category=...
router.get('/', productController.getProducts);

module.exports = router;