const router = require("express")();

router.use("/user", require("./user"));
router.use("/comment", require("./comment"));
router.use("/cocomment", require("./cocomment"));
router.use("/post", require("./post"));

module.exports = router;
