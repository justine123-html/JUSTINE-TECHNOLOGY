<<<<<<< HEAD
const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const db = require("./db");
const adminOnly = require("./middleware/adminOnly");
require('dotenv').config();

const app = express();

/* =======================
   MIDDLEWARE
======================= */
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-role"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   STATIC FRONTEND
======================= */
app.use(express.static(path.join(__dirname, "public")));
=======

const express = require("express");
const cors = require("cors");
const db = require("./db");

const adminOnly = require("./middleware/adminOnly");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
>>>>>>> 7cc7d24 (Initial commit)

/* =======================
   AUTH
======================= */

// LOGIN
app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, results) => {
<<<<<<< HEAD
            if (err) return res.status(500).json({ error: "Database error" });
=======
            if (err) return res.status(500).json({ error: err.message });
>>>>>>> 7cc7d24 (Initial commit)
            if (results.length === 0)
                return res.status(401).json({ error: "User not found" });

            const user = results[0];
<<<<<<< HEAD
            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch)
=======

            if (password !== user.password)
>>>>>>> 7cc7d24 (Initial commit)
                return res.status(401).json({ error: "Wrong password" });

            res.json({
                message: "Login successful",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }
    );
});

// REGISTER
app.post("/api/auth/register", (req, res) => {
    const { name, email, password } = req.body;

<<<<<<< HEAD
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

=======
>>>>>>> 7cc7d24 (Initial commit)
    db.query(
        "SELECT id FROM users WHERE email = ?",
        [email],
        (err, results) => {
<<<<<<< HEAD
            if (err) return res.status(500).json({ error: "Database error" });
=======
            if (err) return res.status(500).json({ error: err.message });
>>>>>>> 7cc7d24 (Initial commit)
            if (results.length > 0)
                return res.status(400).json({ error: "User already exists" });

            db.query(
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
<<<<<<< HEAD
                [name, email, hashedPassword],
                (err, result) => {
                    if (err) return res.status(500).json({ error: "Database error" });
                    res.json({
                        message: "User registered successfully",
                        userId: result.insertId
                    });
=======
                [name, email, password],
                (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: "User registered", userId: result.insertId });
>>>>>>> 7cc7d24 (Initial commit)
                }
            );
        }
    );
});

/* =======================
<<<<<<< HEAD
   ADMIN DASHBOARD STATS
======================= */
=======
   ADMIN DASHBOARD
======================= */

>>>>>>> 7cc7d24 (Initial commit)
app.get("/api/admin/stats", adminOnly, (req, res) => {
    const stats = {};

    db.query("SELECT COUNT(*) AS totalOrders FROM orders", (err, r1) => {
        if (err) return res.status(500).json({ error: "DB error" });
        stats.totalOrders = r1[0].totalOrders;

<<<<<<< HEAD
        db.query(
            "SELECT SUM(total_amount) AS totalRevenue FROM orders WHERE status != 'cancelled'",
            (err, r2) => {
                if (err) return res.status(500).json({ error: "DB error" });
                stats.totalRevenue = r2[0].totalRevenue || 0;

                db.query("SELECT COUNT(*) AS totalUsers FROM users", (err, r3) => {
                    if (err) return res.status(500).json({ error: "DB error" });
                    stats.totalUsers = r3[0].totalUsers;

                    db.query("SELECT COUNT(*) AS totalProducts FROM products", (err, r4) => {
                        if (err) return res.status(500).json({ error: "DB error" });
                        stats.totalProducts = r4[0].totalProducts;

                        res.json(stats);
                    });
=======
        db.query("SELECT SUM(total_amount) AS totalRevenue FROM orders WHERE status != 'cancelled'", (err, r2) => {
            if (err) return res.status(500).json({ error: "DB error" });
            stats.totalRevenue = r2[0].totalRevenue || 0;

            db.query("SELECT COUNT(*) AS totalUsers FROM users", (err, r3) => {
                if (err) return res.status(500).json({ error: "DB error" });
                stats.totalUsers = r3[0].totalUsers;

                db.query("SELECT COUNT(*) AS totalProducts FROM products", (err, r4) => {
                    if (err) return res.status(500).json({ error: "DB error" });
                    stats.totalProducts = r4[0].totalProducts;
                    
                    // Recent orders for dashboard
                    db.query(
                        `SELECT o.id, u.name AS customerName, o.total_amount AS total,
                         o.created_at, o.status
                         FROM orders o
                         JOIN users u ON o.user_id = u.id
                         ORDER BY o.created_at DESC LIMIT 5`,
                        (err, recentOrders) => {
                            if (err) return res.status(500).json({ error: "DB error" });
                            stats.recentOrders = recentOrders;
                            res.json(stats);
                        }
                    );
                });
            });
        });
    });
});

/* =======================
   ADMIN USERS CRUD
======================= */

/* =======================
   ADMIN USERS CRUD
======================= */

// GET ALL USERS FROM DATABASE
app.get("/api/admin/users", adminOnly, (req, res) => {
    console.log('📋 Fetching users from database...');
    
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    // First get total count
    let countQuery = "SELECT COUNT(*) AS total FROM users";
    let countParams = [];
    
    if (search) {
        countQuery += " WHERE name LIKE ? OR email LIKE ?";
        countParams.push(`%${search}%`, `%${search}%`);
    }

    db.query(countQuery, countParams, (err, countResult) => {
        if (err) {
            console.error('❌ Database count error:', err);
            return res.status(500).json({ 
                error: "Database error", 
                details: err.message 
            });
        }

        const totalUsers = countResult[0].total;
        const totalPages = Math.ceil(totalUsers / limit);

        // Now get users with pagination
        let usersQuery = `
            SELECT 
                u.id, 
                u.name, 
                u.email, 
                u.role, 
                u.phone,
                u.created_at,
                COUNT(o.id) as orders_count
            FROM users u
            LEFT JOIN orders o ON u.id = o.user_id
        `;
        
        let usersParams = [];
        
        if (search) {
            usersQuery += " WHERE u.name LIKE ? OR u.email LIKE ?";
            usersParams.push(`%${search}%`, `%${search}%`);
        }
        
        usersQuery += " GROUP BY u.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?";
        usersParams.push(limit, offset);

        db.query(usersQuery, usersParams, (err, users) => {
            if (err) {
                console.error('❌ Database users error:', err);
                return res.status(500).json({ 
                    error: "Database error", 
                    details: err.message 
                });
            }

            console.log(`✅ Found ${users.length} users from database`);
            
            // Format dates properly
            const formattedUsers = users.map(user => ({
                ...user,
                created_at: user.created_at ? 
                    new Date(user.created_at).toISOString() : 
                    new Date().toISOString(),
                orders_count: user.orders_count || 0
            }));

            res.json({
                success: true,
                users: formattedUsers,
                total: totalUsers,
                totalPages: totalPages,
                currentPage: page
            });
        });
    });
});

// GET SINGLE USER
app.get("/api/admin/users/:id", adminOnly, (req, res) => {
    const userId = req.params.id;

    db.query(
        "SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?",
        [userId],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json({ user: results[0] });
        }
    );
});

// CREATE USER
app.post("/api/admin/users", adminOnly, (req, res) => {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    db.query("SELECT id FROM users WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        db.query(
            "INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)",
            [name, email, password, role, phone || null],
            (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ 
                    message: "User created successfully", 
                    userId: result.insertId 
>>>>>>> 7cc7d24 (Initial commit)
                });
            }
        );
    });
});

<<<<<<< HEAD
/* =======================
   ADMIN USERS
======================= */
app.get("/api/admin/users", adminOnly, (req, res) => {
    db.query(
        "SELECT id, name, email, role, phone, created_at FROM users ORDER BY created_at DESC",
        (err, users) => {
            if (err) return res.status(500).json({ error: "DB error" });
            res.json({ success: true, users });
        }
    );
});

/* =======================
   ADMIN PRODUCTS
======================= */
app.get("/api/admin/products", adminOnly, (req, res) => {
    db.query("SELECT * FROM products ORDER BY created_at DESC", (err, products) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json({ success: true, products });
    });
});

/* =======================
   ADMIN ORDERS
======================= */
app.get("/api/admin/orders", adminOnly, (req, res) => {
    db.query(
        `SELECT o.id, u.name AS customer, o.total_amount, o.status, o.created_at
         FROM orders o
         JOIN users u ON o.user_id = u.id
         ORDER BY o.created_at DESC`,
        (err, orders) => {
            if (err) return res.status(500).json({ error: "DB error" });
            res.json({ success: true, orders });
        }
    );
});

/* =======================
   TEST DB
======================= */
app.get("/api/test-db", (req, res) => {
    db.query("SELECT COUNT(*) AS users FROM users", (err, r) => {
        if (err) return res.status(500).json({ status: "error" });
        res.json({
            status: "success",
            users: r[0].users
=======
// UPDATE USER
app.put("/api/admin/users/:id", adminOnly, (req, res) => {
    const userId = req.params.id;
    const { name, email, role, phone } = req.body;

    if (!name || !email || !role) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    db.query("SELECT id FROM users WHERE id = ?", [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if email exists for another user
        db.query("SELECT id FROM users WHERE email = ? AND id != ?", [email, userId], (err, emailResults) => {
            if (err) return res.status(500).json({ error: err.message });
            if (emailResults.length > 0) {
                return res.status(400).json({ error: "Email already in use" });
            }

            db.query(
                "UPDATE users SET name = ?, email = ?, role = ?, phone = ? WHERE id = ?",
                [name, email, role, phone || null, userId],
                (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: "User updated successfully" });
                }
            );
        });
    });
});

// DELETE USER
app.delete("/api/admin/users/:id", adminOnly, (req, res) => {
    const userId = req.params.id;

    db.query("SELECT id FROM users WHERE id = ?", [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        db.query("DELETE FROM users WHERE id = ?", [userId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "User deleted successfully" });
>>>>>>> 7cc7d24 (Initial commit)
        });
    });
});

/* =======================
<<<<<<< HEAD
   FRONTEND ROUTES (catch-all using app.use)
======================= */
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
=======
   ADMIN PRODUCTS CRUD
======================= */

// GET ALL PRODUCTS
app.get("/api/admin/products", adminOnly, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';

    let query = "SELECT * FROM products";
    let countQuery = "SELECT COUNT(*) AS total FROM products";
    let params = [];
    let countParams = [];

    const conditions = [];
    
    if (search) {
        conditions.push("(name LIKE ? OR description LIKE ?)");
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm);
        countParams.push(searchTerm, searchTerm);
    }
    
    if (category) {
        conditions.push("category = ?");
        params.push(category);
        countParams.push(category);
    }

    if (conditions.length > 0) {
        const whereClause = " WHERE " + conditions.join(" AND ");
        query += whereClause;
        countQuery += whereClause;
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    db.query(countQuery, countParams, (err, countResult) => {
        if (err) return res.status(500).json({ error: "DB error" });

        const totalProducts = countResult[0].total;
        const totalPages = Math.ceil(totalProducts / limit);

        db.query(query, params, (err, products) => {
            if (err) return res.status(500).json({ error: "DB error" });

            res.json({
                products,
                total: totalProducts,
                totalPages,
                currentPage: page
            });
        });
    });
});

// GET SINGLE PRODUCT
//app.get("/api/admin/products/:id", adminOnly, (req, res) => {
   // const productId = req.params.id;

    //db.query("SELECT * FROM products WHERE id = ?", [productId], (err, results) => {
        //if (err) return res.status(500).json({ error: err.message });
        //if (results.length === 0) {
        //    return res.status(404).json({ error: "Product not found" });
      // }
       // res.json({ product: results[0] });
   // });
//});
// GET ALL PRODUCTS
app.get("/api/admin/products", adminOnly, (req, res) => {
    console.log('📦 Fetching products from database...');
    
    db.query("SELECT * FROM products", (err, results) => {
        if (err) {
            console.error('❌ Database error:', err);
            return res.status(500).json({ 
                error: "Database error", 
                message: err.message 
            });
        }
        
        console.log(`✅ Found ${results.length} products`);
        
        // Check what columns actually exist
        if (results.length > 0) {
            console.log('First product columns:', Object.keys(results[0]));
        }
        
        // Map to consistent field names
        const products = results.map(product => ({
            id: product.id,
            name: product.name || product.product_name,
            category: product.category,
            price: product.price,
            stock: product.stock || product.quantity,
            description: product.description,
            brand: product.brand,
            // Use whatever image column exists
            image: product.image || product.image_url || product.image_path || null,
            original_price: product.original_price || product.originalPrice || null,
            badge: product.badge,
            created_at: product.created_at || product.createdAt
        }));
        
        res.json({
            success: true,
            products: products
        });
    });
});

// CREATE PRODUCT
app.post("/api/admin/products", adminOnly, (req, res) => {
    const { name, category, price, stock, description, brand, image, original_price, badge } = req.body;

    if (!name || !category || !price || !stock) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    db.query(
        `INSERT INTO products 
        (name, category, price, stock, description, brand, image_url, original_price, badge) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, category, price, stock, description || null, brand || null, 
         image || null, original_price || null, badge || null],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ 
                message: "Product created successfully", 
                productId: result.insertId 
            });
        }
    );
});

// UPDATE PRODUCT
app.put("/api/admin/products/:id", adminOnly, (req, res) => {
    const productId = req.params.id;
    const { name, category, price, stock, description, brand, image, original_price, badge } = req.body;

    if (!name || !category || !price || !stock) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    db.query("SELECT id FROM products WHERE id = ?", [productId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        db.query(
            `UPDATE products SET 
            name = ?, category = ?, price = ?, stock = ?, description = ?, 
            brand = ?, image_url = ?, original_price = ?, badge = ?
            WHERE id = ?`,
            [name, category, price, stock, description || null, brand || null, 
             image || null, original_price || null, badge || null, productId],
            (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Product updated successfully" });
            }
        );
    });
});

// DELETE PRODUCT
app.delete("/api/admin/products/:id", adminOnly, (req, res) => {
    const productId = req.params.id;

    db.query("SELECT id FROM products WHERE id = ?", [productId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        db.query("DELETE FROM products WHERE id = ?", [productId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Product deleted successfully" });
        });
    });
});

/* =======================
   ADMIN ORDERS CRUD
======================= */

// GET ALL ORDERS
app.get("/api/admin/orders", adminOnly, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const status = req.query.status || '';
    const dateFrom = req.query.dateFrom || '';
    const dateTo = req.query.dateTo || '';

    let query = `SELECT o.id, u.name AS customer, o.total_amount AS total,
                 o.created_at, o.status, COUNT(oi.id) AS items_count
                 FROM orders o
                 JOIN users u ON o.user_id = u.id
                 LEFT JOIN order_items oi ON o.id = oi.order_id`;
    
    let countQuery = `SELECT COUNT(*) AS total FROM orders o WHERE 1=1`;
    
    const params = [];
    const countParams = [];

    if (status && status !== 'all') {
        query += " WHERE o.status = ?";
        countQuery += " AND o.status = ?";
        params.push(status);
        countParams.push(status);
    }

    if (dateFrom) {
        if (params.length === 0) query += " WHERE";
        else query += " AND";
        query += " DATE(o.created_at) >= ?";
        
        countQuery += " AND DATE(o.created_at) >= ?";
        params.push(dateFrom);
        countParams.push(dateFrom);
    }

    if (dateTo) {
        if (params.length === 0) query += " WHERE";
        else query += " AND";
        query += " DATE(o.created_at) <= ?";
        
        countQuery += " AND DATE(o.created_at) <= ?";
        params.push(dateTo);
        countParams.push(dateTo);
    }

    query += " GROUP BY o.id ORDER BY o.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    db.query(countQuery, countParams, (err, countResult) => {
        if (err) return res.status(500).json({ error: "DB error" });

        const totalOrders = countResult[0].total;
        const totalPages = Math.ceil(totalOrders / limit);

        db.query(query, params, (err, orders) => {
            if (err) return res.status(500).json({ error: "DB error" });

            res.json({
                orders,
                total: totalOrders,
                totalPages,
                currentPage: page
            });
        });
    });
});

// GET SINGLE ORDER
app.get("/api/admin/orders/:id", adminOnly, (req, res) => {
    const orderId = req.params.id;

    db.query(
        `SELECT o.*, u.name AS customer_name, u.email AS customer_email,
         u.phone AS customer_phone
         FROM orders o
         JOIN users u ON o.user_id = u.id
         WHERE o.id = ?`,
        [orderId],
        (err, orderResults) => {
            if (err) return res.status(500).json({ error: err.message });
            if (orderResults.length === 0) {
                return res.status(404).json({ error: "Order not found" });
            }

            const order = orderResults[0];

            db.query(
                `SELECT oi.*, p.name, p.image_url, p.price 
                 FROM order_items oi
                 JOIN products p ON oi.product_id = p.id
                 WHERE oi.order_id = ?`,
                [orderId],
                (err, itemsResults) => {
                    if (err) return res.status(500).json({ error: err.message });

                    res.json({
                        id: order.id,
                        customerName: order.customer_name,
                        customerEmail: order.customer_email,
                        customerPhone: order.customer_phone,
                        total: order.total_amount,
                        subtotal: order.subtotal || 0,
                        shippingCost: order.shipping_cost || 0,
                        taxAmount: order.tax_amount || 0,
                        status: order.status,
                        paymentMethod: order.payment_method,
                        shippingAddress: order.shipping_address,
                        createdAt: order.created_at,
                        items: itemsResults
                    });
                }
            );
        }
    );
});

// UPDATE ORDER STATUS
app.put("/api/admin/orders/:id/status", adminOnly, (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }

    db.query("SELECT id FROM orders WHERE id = ?", [orderId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        db.query(
            "UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?",
            [status, orderId],
            (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Order status updated successfully" });
            }
        );
    });
});

/* =======================
   ANALYTICS
======================= */

app.get("/api/admin/analytics", adminOnly, (req, res) => {
    const analytics = {};

    // Revenue trend (last 30 days)
    db.query(
        `SELECT DATE(created_at) as date, SUM(total_amount) as revenue
         FROM orders 
         WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
         AND status != 'cancelled'
         GROUP BY DATE(created_at)
         ORDER BY date`,
        (err, revenueData) => {
            if (err) return res.status(500).json({ error: "DB error" });
            analytics.revenueData = revenueData;

            // Top categories
            db.query(
                `SELECT p.category, COUNT(oi.product_id) as sales_count
                 FROM order_items oi
                 JOIN products p ON oi.product_id = p.id
                 JOIN orders o ON oi.order_id = o.id
                 WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                 GROUP BY p.category
                 ORDER BY sales_count DESC LIMIT 5`,
                (err, categoriesData) => {
                    if (err) return res.status(500).json({ error: "DB error" });
                    analytics.categoriesData = categoriesData;

                    // Top products
                    db.query(
                        `SELECT p.name, COUNT(oi.product_id) as sales_count
                         FROM order_items oi
                         JOIN products p ON oi.product_id = p.id
                         JOIN orders o ON oi.order_id = o.id
                         WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                         GROUP BY p.id
                         ORDER BY sales_count DESC LIMIT 5`,
                        (err, productsData) => {
                            if (err) return res.status(500).json({ error: "DB error" });
                            analytics.productsData = productsData;

                            // User growth (last 30 days)
                            db.query(
                                `SELECT DATE(created_at) as date, COUNT(*) as user_count
                                 FROM users 
                                 WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                                 GROUP BY DATE(created_at)
                                 ORDER BY date`,
                                (err, usersData) => {
                                    if (err) return res.status(500).json({ error: "DB error" });
                                    analytics.usersData = usersData;

                                    res.json(analytics);
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

/* =======================
   CART
======================= */

app.post("/api/cart/add", (req, res) => {
    const { userId, productId, quantity = 1 } = req.body; // Default quantity = 1
    
    console.log('🛒 Cart add request:', { userId, productId, quantity });

    if (!userId || !productId) {
        console.error('❌ Missing required fields');
        return res.status(400).json({ 
            error: "Missing required fields",
            message: "User ID and Product ID are required" 
        });
    }

    // Check if user exists
    db.query("SELECT id FROM users WHERE id = ?", [userId], (err, userResults) => {
        if (err) {
            console.error('User check error:', err);
            return res.status(500).json({ error: "Database error" });
        }
        
        if (userResults.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if product exists
        db.query("SELECT id FROM products WHERE id = ?", [productId], (err, productResults) => {
            if (err) {
                console.error('Product check error:', err);
                return res.status(500).json({ error: "Database error" });
            }
            
            if (productResults.length === 0) {
                return res.status(404).json({ error: "Product not found" });
            }

            // Check if item already in cart
            db.query(
                "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
                [userId, productId],
                (err, results) => {
                    if (err) {
                        console.error('Cart check error:', err);
                        return res.status(500).json({ error: "Database error" });
                    }

                    if (results.length > 0) {
                        // Update quantity
                        const newQty = results[0].quantity + quantity;
                        
                        db.query(
                            "UPDATE cart SET quantity = ? WHERE id = ?",
                            [newQty, results[0].id],
                            (err) => {
                                if (err) {
                                    console.error('Update error:', err);
                                    return res.status(500).json({ error: "Database error" });
                                }
                                res.json({ 
                                    success: true, 
                                    message: "Cart updated",
                                    action: "updated" 
                                });
                            }
                        );
                    } else {
                        // Add new item
                        db.query(
                            "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
                            [userId, productId, quantity],
                            (err, result) => {
                                if (err) {
                                    console.error('Insert error:', err);
                                    return res.status(500).json({ error: "Database error" });
                                }
                                res.json({ 
                                    success: true, 
                                    message: "Added to cart",
                                    action: "added",
                                    cartId: result.insertId 
                                });
                            }
                        );
                    }
                }
            );
        });
    });
});
// Test database connection endpoint
app.get("/api/test-db", (req, res) => {
    console.log('🔍 Testing database connection...');
    
    // Test 1: Check users table
    db.query("SHOW TABLES LIKE 'users'", (err, results) => {
        if (err) {
            console.error('❌ Database connection error:', err);
            return res.status(500).json({ 
                status: "error", 
                message: "Database connection failed",
                error: err.message 
            });
        }
        
        if (results.length === 0) {
            console.log('⚠️ Users table not found');
            return res.json({ 
                status: "warning", 
                message: "Users table not found in database" 
            });
        }
        
        // Test 2: Get sample users
        db.query("SELECT COUNT(*) as user_count FROM users", (err, countResults) => {
            if (err) {
                return res.status(500).json({ 
                    status: "error", 
                    message: "Failed to query users",
                    error: err.message 
                });
            }
            
            const userCount = countResults[0].user_count;
            
            // Test 3: Get first 5 users
            db.query("SELECT id, name, email, role FROM users LIMIT 5", (err, sampleUsers) => {
                if (err) {
                    return res.status(500).json({ 
                        status: "error", 
                        message: "Failed to get sample users",
                        error: err.message 
                    });
                }
                
                console.log(`✅ Database connected. Found ${userCount} users`);
                
                res.json({
                    status: "success",
                    message: `Database connection successful. Found ${userCount} users.`,
                    sample_users: sampleUsers,
                    tables: ["users", "products", "orders", "cart"] // Adjust based on your DB
                });
            });
        });
    });
>>>>>>> 7cc7d24 (Initial commit)
});

/* =======================
   SERVER START
======================= */
<<<<<<< HEAD
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
=======

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin`);
});
>>>>>>> 7cc7d24 (Initial commit)
