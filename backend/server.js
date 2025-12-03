// Dependency imports
const express = require('express');
const db = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

const { isAuthenticated, isAdmin } = require('./middleware/auth'); 

// .env configuration
dotenv.config();

// db connection
db();

// express instance
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth',require('./routes/auth'));

app.use('/api/products', isAuthenticated,require('./routes/products'));
app.use('/api/orders', isAuthenticated, require('./routes/orders'));
app.use('/api/admin',isAuthenticated,isAdmin, require('./routes/admin'));
app.use('/api/contact', require('./routes/contact'));

// health
app.get("/",(req,res)=> {
    res.send("API is running")
});

// listening
const PORT = process.env.PORT;
app.listen(PORT,()=>console.log(`Server running at http://localhost:${PORT}`));
