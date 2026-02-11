module.exports = (req, res, next) => {
    const role = req.headers["x-role"];

    if (!role) {
        return res.status(403).json({ error: "No role provided" });
    }

    if (role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }

    next();
};
