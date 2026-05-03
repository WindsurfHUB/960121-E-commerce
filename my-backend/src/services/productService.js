const fs = require('fs');
const path = require('path');

// Helper function to read the static JSON file
const getProductsData = () => {
    // Navigates up 3 levels to reach the root 'data' folder
    const filePath = path.join(__dirname, '../../../data/products.json');
    const rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
};

// SERVICE LAYER: The Gatekeeper's Business Logic
const getAllProducts = (category) => {
    let products = getProductsData();
    
    // Gatekeeper Check: If a specific category is requested, filter the data array
    if (category && category !== 'All') {
        products = products.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    return products;
};

module.exports = {
    getAllProducts
};