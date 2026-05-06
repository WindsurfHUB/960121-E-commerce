const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Point to the data folder at the root of your project
const dataDir = path.join(__dirname, '../data');
const dbPath = path.join(dataDir, 'nordic_shop.db');

// Connect to (and create) the database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) return console.error('Error connecting to database:', err.message);
    console.log('Connected to SQLite database at:', dbPath);
});

db.serialize(() => {
    console.log('1. Building the Advanced Schema...');

    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        dateOfRegistration DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Products Table (Flattening the nested rating object)
    db.run(`CREATE TABLE IF NOT EXISTS Products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        category TEXT,
        image TEXT,
        rating_rate REAL,
        rating_count INTEGER
    )`);

    // Cart Items (For saved carts)
    db.run(`CREATE TABLE IF NOT EXISTS Cart_Items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        User_ID INTEGER,
        Product_ID INTEGER,
        quantity INTEGER,
        FOREIGN KEY(User_ID) REFERENCES Users(id),
        FOREIGN KEY(Product_ID) REFERENCES Products(id)
    )`);

    // Orders Table
    db.run(`CREATE TABLE IF NOT EXISTS Orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        User_ID INTEGER,
        total REAL NOT NULL,
        status TEXT NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(User_ID) REFERENCES Users(id)
    )`);

    // Order Items Table (Locks the price at checkout)
    db.run(`CREATE TABLE IF NOT EXISTS Order_Items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Order_ID INTEGER,
        Product_ID INTEGER,
        quantity INTEGER,
        locked_price REAL,
        FOREIGN KEY(Order_ID) REFERENCES Orders(id),
        FOREIGN KEY(Product_ID) REFERENCES Products(id)
    )`);

    console.log('2. Migrating JSON Data to SQLite...');

    // Migrate Users
    const usersPath = path.join(dataDir, 'auth_user.json');
    if (fs.existsSync(usersPath)) {
        const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        const insertUser = db.prepare(`INSERT OR IGNORE INTO Users (firstName, username, password, dateOfRegistration) VALUES (?, ?, ?, ?)`);
        
        users.forEach(user => {
            insertUser.run(user.firstName, user.username, user.password, user.dateOfRegistration);
        });
        insertUser.finalize();
        console.log(`Migrated ${users.length} users.`);
    }

    // Migrate Products
    const productsPath = path.join(dataDir, 'products.json');
    if (fs.existsSync(productsPath)) {
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        const insertProduct = db.prepare(`INSERT OR IGNORE INTO Products (id, title, price, description, category, image, rating_rate, rating_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
        
        products.forEach(p => {
            insertProduct.run(p.id, p.title, p.price, p.description, p.category, p.image, p.rating.rate, p.rating.count);
        });
        insertProduct.finalize();
        console.log(`Migrated ${products.length} products.`);
    }

    console.log('Database initialization and migration complete!');
});

// Close connection safely
db.close();