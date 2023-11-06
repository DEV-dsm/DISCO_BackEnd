const express = require("express");
const router = express.Router();
const user = require("../controller/user");
const tokenMiddleware = require("../middleware/token");

router.post("/login", user.login);
router.post("/signup", user.signup);
router.post("/logout", tokenMiddleware, user.logout);
router.delete("/", tokenMiddleware, user.deleteAccount);

module.exports = router;
