const router = require("express")();
const cocomment = require("../controller/cocomment");

router.post("/create", cocomment.createCocomment);
router.get("/:commentID", cocomment.getCocommentList);
router.patch("/:cocommentID", cocomment.updateCocomment);
router.delete("/:cocommentID", cocomment.deleteCocomment);

module.exports = router;
