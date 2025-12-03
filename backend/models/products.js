const mongoose = require('mongoose');

const Product = new mongoose.Schema(
    {
        image: {type: String, required: true},
        title: {type: String, required: true, unique: true},
        description: {type: String, required: true},
        price: {type: String, required: true},
    },
    {   timestamps:true}
);
module.exports = mongoose.model('Product', Product);