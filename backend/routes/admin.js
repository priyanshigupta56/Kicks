const express = require('express');
const router = express.Router();
const productController = require('../controllers/products');
const orderController = require("../controllers/orders");
const userController = require("../controllers/users");

// Products routes
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// Orders routes
router.get("/orders", orderController.getAllOrders);

// Users routes
router.get("/users", userController.getAllUsers);
router.patch("/users/:id/status", userController.updateUserStatus);

module.exports = router;