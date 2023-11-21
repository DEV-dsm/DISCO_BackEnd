const router = require("express")();
const comment = require("../controller/comment");
const authMiddleware = require("../middleware/token");

router.post("/create/:postID", authMiddleware, comment.createComment);
router.get("/:postID", comment.getCommentList);
router.patch("/:commentID", authMiddleware, comment.updateComment);
router.delete("/:commentID", authMiddleware, comment.deleteComment);

module.exports = router;
