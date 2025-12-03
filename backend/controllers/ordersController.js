// backend/controllers/orderController.js
const Order = require('../models/order');
const User = require('../models/user');

exports.createOrder = async (req, res) => {
  try {
    // req.user must be set by auth middleware
    const user = req.user;
    if (!user) return res.status(401).json({ msg: 'Authentication required' });

    const {
      productId,
      productName,
      qty,
      pricePerUnit,
      total,
      address,
      city,
      pincode,
      phone
    } = req.body;

    // Backend validation
    if (!productId || !productName) return res.status(400).json({ msg: 'Product details required' });
    if (!qty || qty < 1) return res.status(400).json({ msg: 'Quantity must be at least 1' });
    if (typeof pricePerUnit !== 'number' && typeof pricePerUnit !== 'string') return res.status(400).json({ msg: 'Price is required' });
    const parsedPrice = Number(pricePerUnit);
    const parsedTotal = Number(total);
    if (Number.isNaN(parsedPrice) || Number.isNaN(parsedTotal)) return res.status(400).json({ msg: 'Invalid price/total' });

    if (!address || !city || !pincode || !phone) {
      return res.status(400).json({ msg: 'Shipping address, city, pincode and phone are required' });
    }

    const order = new Order({
      user: user._id,
      items: [{
        productId,
        name: productName,
        qty,
        price: parsedPrice
      }],
      shipping: { address: address.trim(), city: city.trim(), pincode: pincode.trim(), phone: phone.trim() },
      total: parsedTotal
    });

    await order.save();

    return res.status(201).json({ success: true, order });
  } catch (err) {
    console.error('Create order error', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.getOrdersForUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ msg: 'Authentication required' });

    const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
    return res.json({ orders });
  } catch (err) {
    console.error('Get orders error', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};
