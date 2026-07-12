const jwt = require('jsonwebtoken');

// 1. Verify if the user is logged in
exports.verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(403).json({ error: "Access Denied. No token provided." });

    try {
        // Expecting token format: "Bearer <token>"
        const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = verified.user;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid Token" });
    }
};

// 2. Role-Based Access Control (RBAC)
exports.authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access Denied. You do not have permission." });
        }
        next();
    };
};