const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper function to generate order number
const generateOrderNumber = () => {
  const prefix = 'JT';
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}-${timestamp}-${random.toString().padStart(4, '0')}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      shippingAddress,
      billingAddress,
      paymentMethod,
      shippingCost = 5.99,
      taxAmount = 0
    } = req.body;

    // Validation
    if (!shippingAddress || !billingAddress || !paymentMethod) {
      return res.status(400).json({ 
        message: 'Please provide shipping address, billing address, and payment method' 
      });
    }

    // Get cart items
    const cartItems = await Cart.getCart(userId);
    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const totalAmount = subtotal + shippingCost + taxAmount;

    // Prepare order data
    const orderData = {
      userId,
      orderNumber: generateOrderNumber(),
      totalAmount,
      shippingAddress: JSON.stringify(shippingAddress),
      billingAddress: JSON.stringify(billingAddress),
      paymentMethod,
      shippingCost,
      taxAmount,
      items: cartItems.map(item => ({
        productId: item.product_id,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      }))
    };

    // Create order
    const orderId = await Order.create(orderData);

    // Get created order
    const order = await Order.findById(orderId, userId);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        ...order,
        orderNumber: orderData.orderNumber
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    const orders = await Order.findByUser(req.user.id);

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id, req.user.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const items = await Order.getOrderItems(id);

    res.json({
      success: true,
      order: {
        ...order,
        items
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order status (admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const success = await Order.updateStatus(id, status);

    if (success) {
      res.json({
        success: true,
        message: 'Order status updated'
      });
    } else {
      res.status(400).json({ message: 'Failed to update order status' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus
};