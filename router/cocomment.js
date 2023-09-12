const router = require("express")();
const cocomment = require("../controller/cocomment");
const authMiddleware = require("../middleware/token");

router.post("/create", authMiddleware, cocomment.createCocomment);
router.get("/:commentID", cocomment.getCocommentList);
router.patch("/:cocommentID", authMiddleware, cocomment.updateCocomment);
router.delete("/:cocommentID", authMiddleware, cocomment.deleteCocomment);

module.exports = router;
