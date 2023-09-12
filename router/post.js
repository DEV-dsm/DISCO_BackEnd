const router = require("express")();
const post = require("../controller/post");
const like = require("../controller/like");
const authMiddleware = require("../middleware/token");

router.get("/:postID", post.getPost);
router.get("/search", post.searchPost);
router.post("/:postID/like", authMiddleware, like.createLike);
router.delete("/:postID/like", authMiddleware, like.deleteLike);

module.exports = router;
