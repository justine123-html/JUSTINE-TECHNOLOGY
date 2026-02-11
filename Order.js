const pool = require('../config/database');

class Order {
  static async create(orderData) {
    const {
      userId,
      orderNumber,
      totalAmount,
      shippingAddress,
      billingAddress,
      paymentMethod,
      shippingCost,
      taxAmount,
      items
    } = orderData;
    
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Create order
      const [orderResult] = await connection.execute(
        `INSERT INTO orders 
         (order_number, user_id, total_amount, shipping_address, billing_address, 
          payment_method, shipping_cost, tax_amount) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderNumber, userId, totalAmount, shippingAddress, billingAddress, 
         paymentMethod, shippingCost, taxAmount]
      );
      
      const orderId = orderResult.insertId;
      
      // Add order items
      for (const item of items) {
        await connection.execute(
          `INSERT INTO order_items (order_id, product_id, quantity, price, subtotal)
           VALUES (?, ?, ?, ?, ?)`,
          [orderId, item.productId, item.quantity, item.price, item.subtotal]
        );
        
        // Update product stock
        await connection.execute(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.productId]
        );
      }
      
      // Clear user's cart
      await connection.execute(
        'DELETE FROM cart WHERE user_id = ?',
        [userId]
      );
      
      await connection.commit();
      return orderId;
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findByUser(userId) {
    const [rows] = await pool.execute(
      `SELECT o.*, 
              (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async findById(orderId, userId = null) {
    let query = `
      SELECT o.*, 
             (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
      FROM orders o
      WHERE o.id = ?
    `;
    
    const params = [orderId];
    
    if (userId) {
      query += ' AND o.user_id = ?';
      params.push(userId);
    }
    
    const [rows] = await pool.execute(query, params);
    return rows[0];
  }

  static async getOrderItems(orderId) {
    const [rows] = await pool.execute(
      `SELECT oi.*, p.name, p.slug,
              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    return rows;
  }

  static async updateStatus(orderId, status) {
    const [result] = await pool.execute(
      'UPDATE orders SET order_status = ? WHERE id = ?',
      [status, orderId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Order;