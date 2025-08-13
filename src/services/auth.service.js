// const User = require("../models/user.model");
// const jwtUtil = require("../utils/jwt.util");
// const hashUtil = require("../utils/hash.util");

// exports.register = async ({ username, email, password }) => {
//   const hashedPassword = await hashUtil.hashPassword(password);
//   const newUser = await User.create({ username, email, password: hashedPassword });
//   return { id: newUser.id, username: newUser.username, email: newUser.email };
// };

// exports.login = async ({ email, password }) => {
//   const user = await User.findByEmail(email);
//   if (!user || !(await hashUtil.verifyPassword(password, user.password))) {
//     const err = new Error("Invalid credentials");
//     err.status = 401;
//     throw err;
//   }
//   const accessToken = jwtUtil.generateToken({ id: user.id, email: user.email });
//   return { accessToken, tokenType: "Bearer", expiresIn: 3600 };
// };
