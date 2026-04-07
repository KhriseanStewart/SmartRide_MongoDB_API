import env from "../config/env.js";

function requireAdmin(req, res, next) {
  const adminToken = req.headers["x-admin-token"];

  if (!env.adminToken) {
    return res.status(500).json({
      success: false,
      message: "Admin access is not configured",
    });
  }

  if (!adminToken || adminToken !== env.adminToken) {
    return res.status(401).json({
      success: false,
      message: "Missing or invalid x-admin-token header",
    });
  }

  next();
}

export { requireAdmin };
