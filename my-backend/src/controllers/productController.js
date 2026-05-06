const productService = require("../services/productService");

// 1. ADD 'async' HERE
const getProducts = async (req, res) => {
  try {
    const category = req.query.category;

    // 2. ADD 'await' HERE to pause the server until SQLite finishes searching
    const products = await productService.getAllProducts(category);

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getProducts,
};