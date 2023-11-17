const router = require("express")();
const post = require("../controller/post");
const like = require("../controller/like");
const authMiddleware = require("../middleware/token");

router.get("/issue", post.getIssue);
router.get("/:postID", post.getPost);
router.get("/search", post.searchPost);
router.get("/diary", authMiddleware, post.getDiary);
router.post("/:postID/like", authMiddleware, like.createLike);
router.delete("/:postID/like", authMiddleware, like.deleteLike);
router.post("/create", authMiddleware, post.createPost);
router.patch("/postld", authMiddleware, post.updatePost);
router.delete("/postld", authMiddleware, post.deletePost);

module.exports = router;
