export const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = [];

  if (!username || typeof username !== "string" || username.trim().length < 3) {
    errors.push("Username must be at least 3 characters");
  }

  if (username && username.trim().length > 30) {
    errors.push("Username must not exceed 30 characters");
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push("A valid email is required");
  }

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(", ") });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push("A valid email is required");
  }

  if (!password || typeof password !== "string" || password.trim() === "") {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(", ") });
  }

  next();
};