/**
 * Admin Authorization Middleware
 * Checks if the authenticated user has admin role
 * Should be used after requireAuth middleware
 */
export function requireAdmin(req, res, next) {
  // requireAuth middleware should be applied first to populate req.user
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ 
      message: "Admin access required to perform this action" 
    });
  }

  next();
}
