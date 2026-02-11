const express = require("express");
const router = express.Router();
const db = require("../db"); // mysql connection
const adminAuth = require("../middleware/adminAuth");

/* ======================
   GET ALL USERS
====================== */
router.get("/", adminAuth, (req, res) => {
    const sql = "SELECT id, name, email, role, created_at FROM users";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ users: results });
    });
});

/* ======================
   GET SINGLE USER
====================== */
router.get("/:id", adminAuth, (req, res) => {
    const sql = "SELECT id, name, email, role FROM users WHERE id=?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result[0]);
    });
});

/* ======================
   CREATE USER
====================== */
router.post("/", adminAuth, (req, res) => {
    const { name, email, role } = req.body;
    const sql = "INSERT INTO users (name, email, role) VALUES (?, ?, ?)";
    db.query(sql, [name, email, role], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User created successfully" });
    });
});

/* ======================
   UPDATE USER
====================== */
router.put("/:id", adminAuth, (req, res) => {
    const { name, email, role } = req.body;
    const sql = "UPDATE users SET name=?, email=?, role=? WHERE id=?";
    db.query(sql, [name, email, role, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User updated successfully" });
    });
});

/* ======================
   DELETE USER
====================== */
router.delete("/:id", adminAuth, (req, res) => {
    const sql = "DELETE FROM users WHERE id=?";
    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User deleted successfully" });
    });
});

module.exports = router;
