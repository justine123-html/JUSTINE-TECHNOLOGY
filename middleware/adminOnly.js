// middleware/adminOnly.js
module.exports = function(req, res, next) {
    try {
        // Simulate admin check for demo
        // In production, use proper JWT
        
        // Method 1: Check from Authorization header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.slice(7);
            // Decode base64 token
            const decoded = Buffer.from(token, 'base64').toString();
            const userData = JSON.parse(decoded);
            
            if (userData.role === 'admin') {
                req.user = userData;
                return next();
            }
        }
        
        // Method 2: Check from query parameters (for testing)
        const userParam = req.query._user;
        if (userParam) {
            const userData = JSON.parse(Buffer.from(userParam, 'base64').toString());
            if (userData.role === 'admin') {
                req.user = userData;
                return next();
            }
        }
        
        // Method 3: DEMO MODE - allow if no auth header (remove in production)
        // For development/testing only
        console.log('⚠️ Admin route accessed without proper auth (DEMO MODE)');
        // Simulate admin user
        req.user = { id: 1, role: 'admin', email: 'demo@admin.com' };
        return next();
        
        // In production, uncomment this:
        // return res.status(401).json({ error: "Unauthorized" });
        
    } catch (error) {
        console.error('Auth error:', error);
        
        // DEMO MODE - allow access even if token parsing fails
        console.log('⚠️ Auth error, but allowing access in DEMO MODE');
        req.user = { id: 1, role: 'admin', email: 'demo@admin.com' };
        return next();
        
        // In production:
        // return res.status(401).json({ error: "Invalid token" });
    }
};