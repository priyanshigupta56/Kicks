const Order = require('../models/order');

exports.createOrder = async (req, res) => {
  try {
    const { product, quantity, address } = req.body;

    const order = await Order.create({
      user: req.user._id, 
      product,
      quantity,
      address,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("product", "title price");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
