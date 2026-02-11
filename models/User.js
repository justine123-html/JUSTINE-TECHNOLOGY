const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { name, email, password, phone, address } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      `INSERT INTO users (name, email, password, phone, address, role) 
       VALUES (?, ?, ?, ?, ?, 'customer')`,
      [name, email, hashedPassword, phone, address]
    );
    
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, password, role, phone, address FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, phone, address, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async update(id, userData) {
    const { name, phone, address } = userData;
    const [result] = await pool.execute(
      'UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?',
      [name, phone, address, id]
    );
    return result.affectedRows > 0;
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async emailExists(email) {
    const [rows] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    return rows.length > 0;
  }
}

module.exports = User;