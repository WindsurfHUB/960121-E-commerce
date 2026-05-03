const express = require('express');
const cors = require('cors'); // Imports CORS to allow frontend requests
const app = express();

const productRoutes = require('./src/routes/products');
const PORT = 8888;

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(express.json()); // Parses incoming JSON requests

// Mounts the modular product routes to the base '/api/products' path
app.use('/api/products', productRoutes);

// Health Check Route
app.get('/', (req, res) => {
    res.status(200).send("Nordic Shop API is Running!");
});

// Starts the server
app.listen(PORT, () => {
    console.log(`Server is successfully running on http://localhost:${PORT}`);
});