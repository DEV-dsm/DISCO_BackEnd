const router = require("express")();
const post = require("../controller/post");
const like = require("../controller/like");

router.get("/:postID", post.getPost);
router.get("/search", post.searchPost);
router.post("/:postID/like", like.createLike);
router.delete("/:postID/like", like.deleteLike);

module.exports = router;
