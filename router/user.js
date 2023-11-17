const express = require("express");
const router = express.Router();
const user = require("../controller/user");
const tokenMiddleware = require("../middleware/token");

router.post("/login", user.login);
router.post("/signup", user.signup);
router.get("/logout", tokenMiddleware, user.logout);
router.post("/", tokenMiddleware, user.deleteAccount);
router.get("/info", tokenMiddleware, user.getUserInfo);
router.patch("/update", tokenMiddleware, user.updateUser);
router.post("/logout", tokenMiddleware, user.logout);
router.delete("/", tokenMiddleware, user.deleteAccount);

module.exports = router;
