const express = require("express");
const router = express.Router();
const user = require("../controller/user");
const tocken = require("../middleware/token");

router.post("/login", user.login);
router.post("/signup", user.signup);
router.get("/logout", tocken, user.logout);
router.post("/delete-account", tocken, user.deleteAccount);

module.exports = router;
