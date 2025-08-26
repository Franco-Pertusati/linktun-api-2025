const { registerUser, loginUser } = require("../services/auth.service");

async function register(req, res) {
  const { username, email, password } = req.body;

  try {
    const { user, token } = await registerUser({ username, email, password });
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    });
    res.json({ user, message: "Registration successful" });
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
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    });
    res.json({ user, message: "Login successful" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = { register, login };
