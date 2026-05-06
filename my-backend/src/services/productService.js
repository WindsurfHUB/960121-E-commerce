const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Point to the SQLite database
const dbPath = path.join(__dirname, '../../../data/nordic_shop.db');

// Replace ONLY the getAllProducts function in productService.js
const getAllProducts = (category) => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
            if (err) return reject(err);
        });

        // Dynamic Relational Logic
        let query = `SELECT * FROM Products`;
        let params = []; // Array to hold our safe variables to prevent SQL Injection

        // If the frontend sent a category, filter the database!
        if (category && category !== 'All') {
            query += ` WHERE category = ?`;
            params.push(category);
        }
        
        db.all(query, params, (err, rows) => {
            db.close(); 
            if (err) return reject(err);
            
            const formattedProducts = rows.map(row => ({
                id: row.id,
                title: row.title,
                price: row.price,
                description: row.description,
                category: row.category,
                image: row.image,
                rating: { rate: row.rating_rate, count: row.rating_count }
            }));

            resolve(formattedProducts);
        });
    });
};

const getProductById = (id) => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);
        
        const query = `SELECT * FROM Products WHERE id = ?`;
        
        db.get(query, [id], (err, row) => {
            db.close();
            if (err) return reject(err);
            if (!row) return resolve(null);

            // Reconstruct the nested rating object for the single product
            const formattedProduct = {
                id: row.id,
                title: row.title,
                price: row.price,
                description: row.description,
                category: row.category,
                image: row.image,
                rating: {
                    rate: row.rating_rate,
                    count: row.rating_count
                }
            };

            resolve(formattedProduct);
        });
    });
};

module.exports = {
    getAllProducts,
    getProductById
};