const express = require("express");
const router = express.Router();
const user = require("../controller/user");
const token = require("../middleware/token");

router.post("/login", user.login);
router.post("/signup", user.signup);
router.get("/logout", token, user.logout);
router.post("/delete-account", token, user.deleteAccount);
router.get("/info", token, user.getUserInfo);
router.patch("/update", token, user.updateUser);
router.patch("/:mail", token, user.updateUser);

module.exports = router;
