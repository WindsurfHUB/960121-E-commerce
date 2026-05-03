const productService = require('../services/productService');

// CONTROLLER LAYER: Manages the Request (envelope) and Response (package)
const getProducts = (req, res) => {
    try {
        // 1. Extracts the query parameter (e.g., ?category=Clothing)
        const category = req.query.category;
        
        // 2. Asks the Service layer to process the data
        const products = productService.getAllProducts(category);
        
        // 3. Sends the Response (200 OK Status + JSON Data Package)
        res.status(200).json(products);

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    getProducts
};