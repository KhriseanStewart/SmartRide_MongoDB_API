function requireUser(req, res, next) {
  const userId = req.headers["x-user-id"];
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Missing x-user-id header",
    });
  }

  req.userId = String(userId);
  next();
}

export { requireUser };
