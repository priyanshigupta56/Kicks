const mongoose = require('mongoose');

const User = new mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        confirmPassword: {type: String, required: true},
        phone: {type: String, required: true},
        status: {type: String, enum: ["active", "blocked"], default: "active"},    
    },
    {   timestamps:true}
);
module.exports = mongoose.model('User', User);