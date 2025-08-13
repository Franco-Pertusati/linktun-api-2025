const express = require("express");
const authRoutes = require("./auth.routes");
const linksRoutes = require("./auth.routes");
// const analyticsRoutes = require("./analytics.routes");

const router = express.Router();

router.use("/auth", authRoutes);
// router.use("/links", linksRoutes);
// router.use("/analytics", analyticsRoutes);

module.exports = router;
