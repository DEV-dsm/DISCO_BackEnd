const user = require("../models/user");
const post = require("../models/post");
const comment = require("../models/comment");

//댓글 생성
const createComment = async (req, res) => {
  const token = req.header["access-token"];
  const { postID, body } = req.body;

  try {
    const thisUser = await user.findOne({
      where: { token },
    });
    const thisPost = await post.findOne({
      where: { postID },
    });

    if (!thisUser) {
      return res.status(401).json({
        massage: "로그인되지 않은 사용자",
      });
    }
    if (!thisPost) {
      return res.status(404).json({
        massage: "존재하지 않는 댓글",
      });
    }

    await comment.create({
      postID,
      userID: thisUser.userID,
      body,
    });

    return res.status(201).json({
      massage: "요청에 성공하였습니다.",
    });
  } catch (err) {
    return res.status(500).json({
      massage: "요청에 실패하였습니다.",
    });
  }
};

//댓글 목록조회
const getCommentList = async (req, res) => {
  const { postID } = req.body;
  try {
    const commentList = comment.findAll({
      where: postID,
    });
    if (!token) {
      return res.status(401).json({
        massage: "로그인 되지 않은 사용자",
      });
    }

    return res.status(200).json({
      massage: "요청에 성공했습니다.",
      commentList,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      massage: "요청에 실패했습니다.",
    });
  }
};

//댓글 업뎃
const updateComment = async (req, res) => {
  const token = req.header["access-token"];
  const { commentID, body } = req.body;

  try {
    const thisUser = await user.findOne({
      where: { token },
    });
    const thisComment = await comment.findOne({
      where: { commentID },
    });

    if (!thisUser) {
      return res.status(401).json({
        massage: "로그인 되지 않은 사용자",
      });
    }
    if (!thisComment) {
      return res.status(404).json({
        massage: "존재하지 않는 댓글",
      });
    }
    if (thisUser.userID != thisComment.userID) {
      return res.status(403).json({
        massage: "권한이 없는 사용자",
      });
    }

    await thisComment.update({
      body,
    });

    return res.status(200).json({
      massage: "요청에 성공했습니다.",
    });
  } catch (err) {
    return res.status(500).json({
      massage: "요청에 실패했습니다.",
    });
  }
};

//댓글 삭제
const deleteComment = async (req, res) => {
  const token = req.header["access-token"];
  const { commentID } = req.body;

  try {
    const thisUser = await user.findOne({
      where: { token },
    });
    const thisComment = await comment.findOne({
      where: { commentID },
    });

    if (!thisUser) {
      return res.status(401).json({
        massage: "로그인되지 않은 사용자",
      });
    }
    if (!thisComment) {
      return res.status(404).json({
        massage: "존재하지 않는 댓글",
      });
    }
    if (thisUser.userID != thisComment.userID) {
      return res.status(403).json({
        massage: "권한이 없는 사용자",
      });
    }

    await comment.destroy({
      where: { thisComment },
    });

    return res.status(204).json({});
  } catch (err) {
    return res.status(500).json({
      massage: "요청에 실패했습니다",
    });
  }
};

module.exports = {
  createComment,
  getCommentList,
  updateComment,
  deleteComment,
};
