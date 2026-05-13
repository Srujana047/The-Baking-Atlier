import { verifyAccessToken } from "../utils/jwt.js";
import { User } from "../models/User.js";

/**
 * Checks `Authorization: Bearer <token>`.
 * If valid, attaches `req.user = { id, role, name, email }`.
 */
export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Missing auth token" });
    }

    const decoded = verifyAccessToken(token);

    // Keep the request user lightweight and current:
    const user = await User.findById(decoded.userId).select(
      "_id name email role"
    );
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

