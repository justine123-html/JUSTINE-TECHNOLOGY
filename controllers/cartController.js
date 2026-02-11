const Cart = require('../models/Cart');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const items = await Cart.getCart(req.user.id);
    const total = await Cart.getCartTotal(req.user.id);
    const itemCount = await Cart.getCartCount(req.user.id);

    res.json({
      success: true,
      items,
      total: parseFloat(total),
      itemCount: parseInt(itemCount) || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const success = await Cart.addToCart(req.user.id, productId, quantity);

    if (success) {
      const itemCount = await Cart.getCartCount(req.user.id);
      res.json({
        success: true,
        message: 'Product added to cart',
        itemCount: parseInt(itemCount) || 0
      });
    } else {
      res.status(400).json({ message: 'Failed to add to cart' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 0) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }

    const success = await Cart.updateQuantity(req.user.id, productId, quantity);

    if (success) {
      const items = await Cart.getCart(req.user.id);
      const total = await Cart.getCartTotal(req.user.id);
      const itemCount = await Cart.getCartCount(req.user.id);

      res.json({
        success: true,
        message: 'Cart updated',
        items,
        total: parseFloat(total),
        itemCount: parseInt(itemCount) || 0
      });
    } else {
      res.status(400).json({ message: 'Failed to update cart' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const success = await Cart.removeFromCart(req.user.id, productId);

    if (success) {
      const items = await Cart.getCart(req.user.id);
      const total = await Cart.getCartTotal(req.user.id);
      const itemCount = await Cart.getCartCount(req.user.id);

      res.json({
        success: true,
        message: 'Item removed from cart',
        items,
        total: parseFloat(total),
        itemCount: parseInt(itemCount) || 0
      });
    } else {
      res.status(400).json({ message: 'Failed to remove item' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const success = await Cart.clearCart(req.user.id);

    if (success) {
      res.json({
        success: true,
        message: 'Cart cleared'
      });
    } else {
      res.status(400).json({ message: 'Failed to clear cart' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};