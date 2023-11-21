const { like } = require("../models");
const { post } = require("../models");

//좋아요 등록
const createLike = async (req, res) => {
  const postID = Number(req.params.postID);
  const { userID } = req.decoded;

  try {
    const thisPost = await post.findOne({
      where: { postID },
    });

    if (!thisPost) {
      return res.status(404).json({
        message: "게시물 찾을 수 없습니다.",
      });
    }

    if (!userID) {
      return res.status(401).json({
        message: "로그인 안된 사용자",
      });
    }

    const thisLike = await like.findOne({
      where: { userID, postID },
    });

    if (thisLike) {
      return res.status(409).json({
        message: "이미 등록된 좋아요",
      });
    }

    await like.create({
      userID,
      postID,
    });

    return res.status(201).json({
      message: "요청에 성공했습니다",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "요청에 실패했습니다.",
    });
  }
};

//좋아요 삭제
const deleteLike = async (req, res) => {
  const postID = req.params.postID;
  const { userID } = req.decoded;

  try {
    const thisPost = await post.findOne({
      where: { postID },
    });

    if (!thisPost) {
      return res.status(404).json({
        message: "게시물 찾을 수 없습니다.",
      });
    }

    if (!userID) {
      return res.status(401).json({
        message: "로그인 안된 사용자",
      });
    }

    const thisLike = await like.findOne({
      where: { userID, postID },
    });

    if (!thisLike) {
      return res.status(409).json({
        message: "등록 안된 좋아요",
      });
    }

    await thisLike.destroy({});

    return res.status(204).json({});
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "요청에 실패했습니다.",
    });
  }
};

module.exports = {
  createLike,
  deleteLike,
};
