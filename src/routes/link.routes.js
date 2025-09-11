const express = require("express");
const router = express.Router();
const {
  createLink,
  getUserLinks,
  deleteLink,
} = require("../controllers/link.controller");
const authenticate = require("../middlewares/authenticate.middleware");

router.post("/", authenticate(false), createLink);

router.get("/", authenticate(true), getUserLinks);

router.delete("/:id", authenticate(true), deleteLink);

module.exports = router;
