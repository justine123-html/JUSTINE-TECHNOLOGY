const pool = require('../config/database');

class Product {
  static async findAll(filters = {}, limit = 10, offset = 0) {
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    
    const params = [];
    
    // Apply filters
    if (filters.category) {
      query += ' AND (c.slug = ? OR c.id = ?)';
      params.push(filters.category, filters.category);
    }
    
    if (filters.brand) {
      query += ' AND p.brand = ?';
      params.push(filters.brand);
    }
    
    if (filters.minPrice) {
      query += ' AND p.price >= ?';
      params.push(filters.minPrice);
    }
    
    if (filters.maxPrice) {
      query += ' AND p.price <= ?';
      params.push(filters.maxPrice);
    }
    
    if (filters.rating) {
      query += ' AND p.rating >= ?';
      params.push(filters.rating);
    }
    
    if (filters.search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    // Sorting
    const sortOptions = {
      'price-low': 'p.price ASC',
      'price-high': 'p.price DESC',
      'rating': 'p.rating DESC',
      'newest': 'p.created_at DESC',
      'featured': 'p.created_at DESC'
    };
    
    const sortBy = sortOptions[filters.sort] || 'p.created_at DESC';
    query += ` ORDER BY ${sortBy}`;
    
    // Pagination
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT p.*, c.name as category_name, c.slug as category_slug 
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findBySlug(slug) {
    const [rows] = await pool.execute(
      `SELECT p.*, c.name as category_name, c.slug as category_slug 
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = ?`,
      [slug]
    );
    return rows[0];
  }

  static async getImages(productId) {
    const [rows] = await pool.execute(
      'SELECT id, image_url, is_primary FROM product_images WHERE product_id = ? ORDER BY is_primary DESC',
      [productId]
    );
    return rows;
  }

  static async getRelatedProducts(productId, categoryId, limit = 4) {
    const [rows] = await pool.execute(
      `SELECT id, name, slug, price, original_price, rating, badge,
              (SELECT image_url FROM product_images WHERE product_id = products.id AND is_primary = 1 LIMIT 1) as image
       FROM products 
       WHERE category_id = ? AND id != ? AND stock > 0 
       ORDER BY RAND() LIMIT ?`,
      [categoryId, productId, limit]
    );
    return rows;
  }

  static async count(filters = {}) {
    let query = `
      SELECT COUNT(*) as total 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (filters.category) {
      query += ' AND (c.slug = ? OR c.id = ?)';
      params.push(filters.category, filters.category);
    }
    
    if (filters.brand) {
      query += ' AND p.brand = ?';
      params.push(filters.brand);
    }
    
    const [rows] = await pool.execute(query, params);
    return rows[0].total;
  }

  static async updateStock(productId, quantity) {
    const [result] = await pool.execute(
      'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
      [quantity, productId, quantity]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Product;