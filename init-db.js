const mysql = require('mysql2/promise');
require('dotenv').config();

const initDB = async () => {
  let connection;
  
  try {
    // Create connection without database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306
    });

    console.log('📦 Creating database...');
    
    // Create database
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.query(`USE ${process.env.DB_NAME}`);
    
    console.log('✅ Database created/selected');

    // Create tables
    console.log('📊 Creating tables...');
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('customer', 'admin') DEFAULT 'customer',
        phone VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        image VARCHAR(255),
        description TEXT,
        parent_id INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
        INDEX idx_slug (slug)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(200) NOT NULL,
        slug VARCHAR(200) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        category_id INT,
        brand VARCHAR(100),
        price DECIMAL(10, 2) NOT NULL,
        original_price DECIMAL(10, 2),
        rating DECIMAL(3, 2) DEFAULT 0.00,
        review_count INT DEFAULT 0,
        stock INT DEFAULT 0,
        sku VARCHAR(50) UNIQUE,
        badge ENUM('new', 'sale', 'bestseller', 'none') DEFAULT 'none',
        specs JSON,
        shipping_info VARCHAR(255),
        delivery_time VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        INDEX idx_category (category_id),
        INDEX idx_brand (brand),
        INDEX idx_slug (slug),
        INDEX idx_price (price)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT,
        image_url VARCHAR(255) NOT NULL,
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_product (product_id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        product_id INT,
        quantity INT DEFAULT 1,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_cart_item (user_id, product_id),
        INDEX idx_user (user_id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        user_id INT,
        total_amount DECIMAL(10, 2) NOT NULL,
        shipping_address TEXT NOT NULL,
        billing_address TEXT NOT NULL,
        payment_method VARCHAR(50),
        payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
        order_status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        shipping_cost DECIMAL(10, 2) DEFAULT 0.00,
        tax_amount DECIMAL(10, 2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_user (user_id),
        INDEX idx_order_number (order_number)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT,
        product_id INT,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
        INDEX idx_order (order_id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        product_id INT,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_wishlist_item (user_id, product_id),
        INDEX idx_user (user_id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('new', 'read', 'replied') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_status (status)
      )
    `);

    console.log('✅ Tables created successfully');

    // Insert sample data
    console.log('📝 Inserting sample data...');

    // Insert categories
    const categories = [
      ['Smartphones', 'smartphones', 'Latest smartphones from top brands'],
      ['Laptops', 'laptops', 'Powerful laptops for work and gaming'],
      ['Tablets', 'tablets', 'Tablets for productivity and entertainment'],
      ['Headphones', 'headphones', 'Audio accessories and headphones'],
      ['Smart Watches', 'smart-watches', 'Wearable technology'],
      ['TVs', 'tvs', 'Televisions and home theater'],
      ['Cameras', 'cameras', 'Photography equipment'],
      ['Gaming', 'gaming', 'Gaming consoles and accessories'],
      ['Accessories', 'accessories', 'Electronic accessories']
    ];

    for (const [name, slug, description] of categories) {
      await connection.query(
        'INSERT IGNORE INTO categories (name, slug, description) VALUES (?, ?, ?)',
        [name, slug, description]
      );
    }

    // Insert admin user (password: admin123)
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await connection.query(
      `INSERT IGNORE INTO users (name, email, password, role) 
       VALUES (?, ?, ?, 'admin')`,
      ['Admin User', 'admin@justinetech.com', hashedPassword]
    );

    console.log('✅ Sample data inserted');
    console.log('🎉 Database initialization complete!');
    console.log('\n🔐 Default admin credentials:');
    console.log('   Email: admin@justinetech.com');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
  } finally {
    if (connection) await connection.end();
  }
};

// Run initialization
initDB();