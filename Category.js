const pool = require('../config/database');

class Category {
  static async findAll() {
    const [rows] = await pool.execute(
      'SELECT id, name, slug, image, description FROM categories ORDER BY name'
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, slug, image, description FROM categories WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findBySlug(slug) {
    const [rows] = await pool.execute(
      'SELECT id, name, slug, image, description FROM categories WHERE slug = ?',
      [slug]
    );
    return rows[0];
  }

  static async getProductCount(categoryId) {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as count FROM products WHERE category_id = ?',
      [categoryId]
    );
    return rows[0].count;
  }
}

module.exports = Category;