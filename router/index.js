const router = require("express")();

router.use("/comment", require("./comment"));
router.use("/cocomment", require("./cocomment"));

module.exports = router;
