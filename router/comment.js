const router = require("express")();
const comment = require("../controller/comment");

router.post("/create", comment.createComment);
router.get("/?postID=", comment.getCommentList);
router.patch("/?commentID=", comment.updateComment);
router.delete("/?commentID=", comment.deleteComment);

module.exports = router;
