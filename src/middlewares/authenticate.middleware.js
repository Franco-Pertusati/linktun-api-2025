const { verifyToken } = require("../config/jwt");


function authenticate(required = true) {
  return (req, res, next) => {
    const token = req.cookies?.access_token;

    if (!token) {
      if (required) {
        return res.status(401).json({ message: "Token missing" });
      }
      req.user = null;
      return next();
    }

    try {
      req.user = verifyToken(token);
      next();
    } catch (err) {
      if (required) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      req.user = null;
      next();
    }
  };
}

module.exports = authenticate;
