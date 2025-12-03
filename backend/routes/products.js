const express = require('express');
const router = express.Router();
const productController = require('../controllers/products');

// PUBLIC ROUTES
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

module.exports = router;
