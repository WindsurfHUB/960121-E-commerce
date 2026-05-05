const fs = require('fs');
const path = require('path');

// Helper function to read the auth database
const getAuthUsers = () => {
    // This path travels up 3 folders from 'services' to reach the root 'data' folder
    // __dirname is my-backend/src/services
    // ../../../ travels up to the nordic-1.0.0 root folder
    const filePath = path.join(__dirname, '../../../data/auth_user.json');
    
    try {
        const rawData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Error reading database:", error.message);
        return []; // Return empty array if file fails to load
    }
};

// The function our auth.js route is looking for
const findUserByEmail = async (email) => {
    const users = getAuthUsers();
    // auth_user.json uses "username" for the email field
    const user = users.find(u => u.username === email); 
    return user; 
};

module.exports = {
    findUserByEmail
};
