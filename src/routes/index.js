const express = require("express");
const authRoutes = require("./auth.routes");
const linkRoutes = require("./link.routes")
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/links", linkRoutes);

module.exports = router;
