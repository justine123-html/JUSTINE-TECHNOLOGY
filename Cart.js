const pool = require('../config/database');

class Cart {
  static async getCart(userId) {
    const [rows] = await pool.execute(
      `SELECT c.*, p.name, p.slug, p.price, p.original_price, p.stock,
              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );
    return rows;
  }

  static async addToCart(userId, productId, quantity = 1) {
    // Check if item exists
    const [existing] = await pool.execute(
      'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    
    if (existing.length > 0) {
      // Update quantity
      const newQuantity = existing[0].quantity + quantity;
      const [result] = await pool.execute(
        'UPDATE cart SET quantity = ? WHERE id = ?',
        [newQuantity, existing[0].id]
      );
      return result.affectedRows > 0;
    } else {
      // Add new item
      const [result] = await pool.execute(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, productId, quantity]
      );
      return result.affectedRows > 0;
    }
  }

  static async updateQuantity(userId, productId, quantity) {
    if (quantity <= 0) {
      return await this.removeFromCart(userId, productId);
    }
    
    const [result] = await pool.execute(
      'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [quantity, userId, productId]
    );
    return result.affectedRows > 0;
  }

  static async removeFromCart(userId, productId) {
    const [result] = await pool.execute(
      'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    return result.affectedRows > 0;
  }

  static async clearCart(userId) {
    const [result] = await pool.execute(
      'DELETE FROM cart WHERE user_id = ?',
      [userId]
    );
    return result.affectedRows > 0;
  }

  static async getCartTotal(userId) {
    const [rows] = await pool.execute(
      `SELECT SUM(c.quantity * p.price) as total 
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );
    return rows[0].total || 0;
  }

  static async getCartCount(userId) {
    const [rows] = await pool.execute(
      'SELECT SUM(quantity) as count FROM cart WHERE user_id = ?',
      [userId]
    );
    return rows[0].count || 0;
  }
}

module.exports = Cart;