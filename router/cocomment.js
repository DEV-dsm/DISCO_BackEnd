const router = require("express")();
const cocomment = require("../controller/cocomment");

router.post("/create", cocomment.createCocomment);
router.get("/?commentID=", cocomment.getCocommentList);
router.patch("/?commentID=", cocomment.updateCocomment);
router.delete("/?commentID=", cocomment.deleteCocomment);

module.exports = router;
