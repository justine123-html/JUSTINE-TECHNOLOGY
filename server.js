<<<<<<< HEAD
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

=======
>>>>>>> f343de0 (Initial commit)
const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const db = require("./db");
const adminOnly = require("./middleware/adminOnly");
require('dotenv').config();

const app = express();

<<<<<<< HEAD
const PORT = 3000;
>>>>>>> 7cc7d24 (Initial commit)
=======
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
>>>>>>> f343de0 (Initial commit)

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
<<<<<<< HEAD
            if (err) return res.status(500).json({ error: "Database error" });
=======
            if (err) return res.status(500).json({ error: err.message });
>>>>>>> 7cc7d24 (Initial commit)
=======
            if (err) return res.status(500).json({ error: "Database error" });
>>>>>>> f343de0 (Initial commit)
            if (results.length === 0)
                return res.status(401).json({ error: "User not found" });

            const user = results[0];
<<<<<<< HEAD
<<<<<<< HEAD
            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch)
=======

            if (password !== user.password)
>>>>>>> 7cc7d24 (Initial commit)
=======
            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch)
>>>>>>> f343de0 (Initial commit)
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
<<<<<<< HEAD
=======
>>>>>>> f343de0 (Initial commit)
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

<<<<<<< HEAD
=======
>>>>>>> 7cc7d24 (Initial commit)
=======
>>>>>>> f343de0 (Initial commit)
    db.query(
        "SELECT id FROM users WHERE email = ?",
        [email],
        (err, results) => {
<<<<<<< HEAD
<<<<<<< HEAD
            if (err) return res.status(500).json({ error: "Database error" });
=======
            if (err) return res.status(500).json({ error: err.message });
>>>>>>> 7cc7d24 (Initial commit)
=======
            if (err) return res.status(500).json({ error: "Database error" });
>>>>>>> f343de0 (Initial commit)
            if (results.length > 0)
                return res.status(400).json({ error: "User already exists" });

            db.query(
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
<<<<<<< HEAD
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
=======
                [name, email, hashedPassword],
                (err, result) => {
                    if (err) return res.status(500).json({ error: "Database error" });
                    res.json({
                        message: "User registered successfully",
                        userId: result.insertId
                    });
>>>>>>> f343de0 (Initial commit)
                }
            );
        }
    );
});

/* =======================
<<<<<<< HEAD
<<<<<<< HEAD
   ADMIN DASHBOARD STATS
======================= */
=======
   ADMIN DASHBOARD
======================= */

>>>>>>> 7cc7d24 (Initial commit)
=======
   ADMIN DASHBOARD STATS
======================= */
>>>>>>> f343de0 (Initial commit)
app.get("/api/admin/stats", adminOnly, (req, res) => {
    const stats = {};

    db.query("SELECT COUNT(*) AS totalOrders FROM orders", (err, r1) => {
        if (err) return res.status(500).json({ error: "DB error" });
        stats.totalOrders = r1[0].totalOrders;

<<<<<<< HEAD
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
=======
        db.query(
            "SELECT SUM(total_amount) AS totalRevenue FROM orders WHERE status != 'cancelled'",
            (err, r2) => {
>>>>>>> f343de0 (Initial commit)
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
                });
            }
        );
    });
});

/* =======================
   ADMIN USERS
======================= */
app.get("/api/admin/users", adminOnly, (req, res) => {
    db.query(
<<<<<<< HEAD
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
=======
        "SELECT id, name, email, role, phone, created_at FROM users ORDER BY created_at DESC",
        (err, users) => {
>>>>>>> f343de0 (Initial commit)
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
        });
    });
});
<<<<<<< HEAD
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
=======

/* =======================
   FRONTEND ROUTES (catch-all using app.use)
======================= */
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
>>>>>>> f343de0 (Initial commit)
});

/* =======================
   SERVER START
======================= */
<<<<<<< HEAD
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
=======
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
>>>>>>> f343de0 (Initial commit)
