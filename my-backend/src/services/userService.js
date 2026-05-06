const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Point to the new SQLite database
const dbPath = path.join(__dirname, '../../../data/nordic_shop.db');

const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        // Open the database in Read-Only mode for security
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                console.error("Database connection error:", err.message);
                return reject(err);
            }
        });

        // The Relational Logic: Find the row where the username matches the email
        const query = `SELECT * FROM Users WHERE username = ?`;
        
        // We use the [email] array here to prevent SQL Injection attacks!
        db.get(query, [email], (err, row) => {
            db.close(); // Always close the connection to free up memory
            
            if (err) {
                return reject(err);
            }
            
            // 'row' will contain the user object, or 'undefined' if no match is found
            resolve(row); 
        });
    });
};

module.exports = {
    findUserByEmail
};