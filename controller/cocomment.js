const { user } = require("../models");
const { comment } = require("../models");
const { cocomment } = require("../models");

//대댓글 생성
const createCocomment = async (req, res) => {
  const { userID } = req.decoded;
  const { body } = req.body;
  const { commentID } = req.params;

  try {
    const thisUser = await user.findOne({
      where: { userID },
    });

    const thisComment = await comment.findOne({
      where: { commentID },
    });

    if (!thisComment) {
      return res.status(404).json({
        massage: "댓글을 찾을수 없음",
      });
    }

    if (!thisUser) {
      return res.status(404).json({
        massage: "로그인 안된 사용자",
      });
    }

    await cocomment.create({
      userID: thisUser.userID,
      postID: thisComment.postID,
      commentID: commentID,
      body,
    });

    return res.status(201).json({
      massage: "요청에 성공했습니다.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      massage: "요청에 실패했습니다.",
    });
  }
};

//대댓글 목록조회
const getCocommentList = async (req, res) => {
  const { commentID } = req.params;

  try {
    const cocommentList = await cocomment.findAll({
      where: { commentID },
    });

    return res.status(200).json({
      massage: "요청에 성공했습니다",
      cocommentList,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      massage: "요청에 실패했습니다",
    });
  }
};

//대댓글 삭제
const deleteCocomment = async (req, res) => {
  const { userID } = req.decoded;
  const { cocommentID } = req.params;

  try {
    const thisCocomment = await cocomment.findOne({
      where: { cocommentID },
    });
    const thisUser = await user.findOne({
      where: { userID },
    });

    if (!thisCocomment) {
      return res.status(404).json({
        massage: "대댓글을 찾을수 없습니다.",
      });
    }
    if (!thisUser) {
      return res.status(404).json({
        massage: "존재하지 않는 유저",
      });
    }
    if (thisUser.userID != thisCocomment.userID) {
      return res.status(403).json({
        massage: "권한이 없는 사용자입니다",
      });
    }

    await thisCocomment.destroy({});

    return res.status(204).json({});
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      massage: "요청에 실패했습니다",
    });
  }
};

//대댓글 업뎃
const updateCocomment = async (req, res) => {
  const { cocommentID } = req.params;
  const { userID } = req.decoded;
  const { body } = req.body;
  try {
    const thisUser = await user.findOne({
      where: { userID },
    });
    const thisCocomment = await cocomment.findOne({
      where: { cocommentID },
    });

    if (!thisUser) {
      return res.status(404).json({
        massage: "존재하지 않는 사용자",
      });
    }
    if (!thisCocomment) {
      return res.status(404).json({
        massage: "존재하지 않는 대댓글",
      });
    }
    if (thisCocomment.userID != thisUser.userID) {
      return res.status(403).json({
        massage: "권한이 없는 사용자",
      });
    }

    await thisCocomment.update({
      body,
    });

    return res.status(200).json({
      massage: "요청에 성공했습니다.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      massage: "요청에 실패했습니다.",
    });
  }
};

module.exports = {
  createCocomment,
  getCocommentList,
  deleteCocomment,
  updateCocomment,
};
