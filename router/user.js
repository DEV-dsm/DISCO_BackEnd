const express = require("express");
const router = express.Router();
const user = require("../controller/user");
const token = require("../middleware/token");

router.post("/login", user.login);
router.post("/signup", user.signup);
<<<<<<< Updated upstream
router.get("/logout", token, user.logout);
router.post("/delete-account", token, user.deleteAccount);
router.get("/info", token, user.getUserInfo);
router.patch("/update", authMiddleware, user.updateUser);
=======
router.post("/logout", tocken, user.logout);
router.delete("/", tocken, user.deleteAccount);
>>>>>>> Stashed changes

module.exports = router;
