const {
  registerUser,
  loginUser,
} = require("../services/auth.service");

const { verifyToken } = require("../config/jwt")

async function register(req, res) {
  const { username, email, password } = req.body;

  try {
    const { user, token } = await registerUser({ username, email, password });
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(201).json({ user, message: "Registration successful" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const { user, token } = await loginUser({ email, password });
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.json({ user, message: "Login successful" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function verify(req, res) {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({ valid: false, message: "No token provided" });
  }

  try {
    verifyToken(token);
    return res.json({ valid: true });
  } catch (err) {
    return res
      .status(401)
      .json({ valid: false, message: "Invalid or expired token" });
  }
}

module.exports = { register, login, verify };
