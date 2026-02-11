const db = require("../db");

exports.getAllUsers = (req, res) => {
    db.query("SELECT id, name, email, role FROM users", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};
