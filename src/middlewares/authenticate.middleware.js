const jwt = require("jsonwebtoken");

function authenticate(required = true) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      if (required) {
        return res.status(401).json({ message: "Authorization header missing" });
      }
      req.user = null; // Anónimo
      return next();
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      if (required) {
        return res.status(401).json({ message: "Token missing" });
      }
      req.user = null;
      return next();
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (required) {
          return res.status(401).json({ message: "Invalid or expired token" });
        }
        req.user = null;
        return next();
      }
      req.user = decoded;
      next();
    });
  };
}

module.exports = authenticate;
