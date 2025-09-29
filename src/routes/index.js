const express = require("express");
const authRoutes = require("./auth.routes");
const linkRoutes = require("./link.routes");
const { getLinkByCode } = require("../controllers/link.controller");
const { demoLink } = require("../controllers/link.controller");
const router = express.Router();

router.use("/try", demoLink)
router.use("/auth", authRoutes);
router.use("/links", linkRoutes);
router.use("/:shortCode", getLinkByCode);

module.exports = router;
