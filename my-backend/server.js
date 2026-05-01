// 1. Import Express
const express = require('express');

// 2. Initialize the app
const app = express();

// 3. Define the Port
const PORT = 8888;

// 4. Create a test GET route (The Contract)
app.get('/api/test', (req, res) => {
    console.log("A request hit the server!");
    
    // The server responds with a JSON object
    res.status(200).json({ 
        message: "Hello from the Backend! Express is working perfectly.",
        status: "Success"
    });
});

// 5. Start the server (Listen for requests)
app.listen(PORT, () => {
    console.log(`Server is successfully running on http://localhost:${PORT}`);
});