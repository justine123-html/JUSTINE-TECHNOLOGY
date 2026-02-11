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
            if (err) return res.status(500).json({ error: "Database error" });
            if (results.length === 0)
                return res.status(401).json({ error: "User not found" });

            const user = results[0];
            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch)
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

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query(
        "SELECT id FROM users WHERE email = ?",
        [email],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });
            if (results.length > 0)
                return res.status(400).json({ error: "User already exists" });

            db.query(
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                [name, email, hashedPassword],
                (err, result) => {
                    if (err) return res.status(500).json({ error: "Database error" });
                    res.json({
                        message: "User registered successfully",
                        userId: result.insertId
                    });
                }
            );
        }
    );
});

/* =======================
   ADMIN DASHBOARD STATS
======================= */
app.get("/api/admin/stats", adminOnly, (req, res) => {
    const stats = {};

    db.query("SELECT COUNT(*) AS totalOrders FROM orders", (err, r1) => {
        if (err) return res.status(500).json({ error: "DB error" });
        stats.totalOrders = r1[0].totalOrders;

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
        });
    });
});

/* =======================
   FRONTEND ROUTES (catch-all using app.use)
======================= */
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* =======================
   SERVER START
======================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
