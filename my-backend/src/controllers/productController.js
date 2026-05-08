const productService = require("../services/productService");

const getProducts = async (req, res) => {
  try {
    const category = req.query.category;
    const products = await productService.getAllProducts(category);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --- ADD THIS NEW FUNCTION ---
const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getProducts,
  getProductById // <-- ADD THIS EXPORT
};