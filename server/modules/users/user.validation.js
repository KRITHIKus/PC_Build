export const validateUpdateProfile = (req, res, next) => {
  const { username } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "No update fields provided" });
  }

  if (username !== undefined) {
    if (typeof username !== "string" || username.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Username cannot be empty" });
    }
    if (username.trim().length < 3) {
      return res.status(400).json({ success: false, message: "Username must be at least 3 characters" });
    }
    if (username.trim().length > 30) {
      return res.status(400).json({ success: false, message: "Username must not exceed 30 characters" });
    }
  }

  next();
};