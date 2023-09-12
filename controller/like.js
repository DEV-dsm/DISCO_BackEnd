const { like } = require("../models");
const { post } = require("../models");

const createLike = async (req, res) => {
  const postID = req.params.postID;
  const user = req.decoded["access-token"];

  try {
    const thisPost = await post.findOne({
      where: { postID },
    });

    const thisLike = await like.findOne({
      where: { userID: user.userID, postID },
    });

    if (!thisPost) {
      return res.status(404).json({
        message: "게시물 찾을 수 없습니다.",
      });
    }

    if (!user) {
      return res.status(401).json({
        message: "로그인 안된 사용자",
      });
    }

    if (thisLike) {
      return res.status(409).json({
        message: "이미 등록된 좋아요",
      });
    }

    await like.create({
      userID: user.userID,
      postID,
    });

    return res.status(201).json({
      message: "요청 성공",
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "요청에 실패했습니다.",
    });
  }
};

const deleteLike = async (req, res) => {
  const postID = req.params.postID;
  const user = req.decoded["access-token"];

  try {
    const thisPost = await post.findOne({
      where: { postID },
    });

    const thisLike = await like.findOne({
      where: { userID: user.userID, postID },
    });

    if (!thisPost) {
      return res.status(404).json({
        message: "게시물 찾을 수 없습니다.",
      });
    }

    if (!user) {
      return res.status(401).json({
        message: "로그인 안된 사용자",
      });
    }

    if (!thisLike) {
      return res.status(409).json({
        message: "등록 안된 좋아요",
      });
    }

    await thisLike.destroy({});

    return res.status(204).json({});
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "요청에 실패했습니다.",
    });
  }
};

module.exports = {
  createLike,
  deleteLike,
};
