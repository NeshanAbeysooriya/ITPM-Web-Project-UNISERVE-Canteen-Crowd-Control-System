const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// 1. Import your specific module routes
const menuRoutes = require('./routes/menuRoutes');

// Initialize environment variables from .env file
dotenv.config();

const app = express();

// 2. Middleware
// 'cors' allows your React frontend (port 3000) to talk to this backend (port 5000)
app.use(cors()); 

// Allows the server to read JSON data sent in the request body (important for adding meals)
app.use(express.json()); 

// 3. Routes Configuration
// This tells the app: "If a request starts with /api/menus (or /api/menu), send it to menuRoutes.js"

app.use('/api/menus', menuRoutes); // keep backward compatibility

// 4. MongoDB Connection & Server Start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB Successfully!');
        // Only start the server if the database connection is successful
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
    });