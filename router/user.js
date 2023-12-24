const express = require("express");
const router = express.Router();
const user = require("../controller/user");
const token = require("../middleware/token");

router.post("/login", user.login);
router.post("/signup", user.signup);
router.post("/logout", token, user.logout);
router.delete("/", token, user.deleteAccount);
router.get("/info", token, user.getUserInfo);
router.patch("/update", token, user.updateUser);
router.post("/certified", user.sendVerificationEmail);
router.post("/find-id", user.foundUserId);
router.post("/find-password", user.foundUserPassword);

module.exports = router;
