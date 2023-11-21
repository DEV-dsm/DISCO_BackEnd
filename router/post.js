const router = require("express")();
const post = require("../controller/post");
const like = require("../controller/like");
const authMiddleware = require("../middleware/token");

// 테스트 필요
router.get("/issue", post.getIssue);
router.post("/create", authMiddleware, post.createPost);
router.get("/search", post.searchPost);

router.get("/diary", authMiddleware, post.getDiary);
router.get("/:postID", post.getPost);
router.patch("/:postID", authMiddleware, post.updatePost);
router.delete("/:postID", authMiddleware, post.deletePost);
router.post("/:postID/like", authMiddleware, like.createLike);
router.delete("/:postID/like", authMiddleware, like.deleteLike);

module.exports = router;
