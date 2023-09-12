const user = require("../models/user");
const comment = require("../models/comment");
const cocomment = require("../models/cocomment");

const createCocomment = async (req, res) => {
  const token = req.header["access-token"];
  const { commentID, body } = req.body;

  try {
    const thisUser = await user.findOne({
      where: { token },
    });
    const thisComment = await comment.findOne({
      where: { commentID },
    });

    if (thisComment == null) {
      return res.status(404).json({
        massage: "댓글을 찾을수 없음",
      });
    }
    if (thisUser == null) {
      return res.status(401).json({
        massage: "로그인 안된 사용자",
      });
    }

    await cocomment.create({
      userID: thisUser.userID,
      comment: commentID,
      body,
    });

    return res.status(201).json({
      massage: "요청에 성공했습니다.",
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      massage: "요청에 실패했습니다.",
    });
  }
};

//회의 후 개발
const getCocommentList = async (req, res) => {
  const token = req.header["access-token"];
  const { commentID } = req.body;
  try {
    const cocommentList = await cocomment.findALL({
      where: commentID,
    });
    if (!cocomments) {
      return res.status(404).json({
        message: "해당 댓글의 대댓글을 찾을수 없음",
      });
    }
    if (!token) {
      return res.status(401).json({
        message: "로그인 되지 않은 사용자",
      });
    }

    return res.status(200).json({
      massage: "요청에 성공했습니다",
      cocommentList,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      massage: "요청 실패",
    });
  }
};

const deleteCocomment = async (req, res) => {
  const token = req.header["access-token"];
  const cocommentID = req.body;

  try {
    const thisCocomment = await cocomment.findOne({
      where: { cocommentID },
    });
    const thisUser = await cocomment.findOne({
      where: { token },
    });

    if (!thisCocomment) {
      return res.status(404).json({
        massage: "대댓글을 찾을수 없습니다.",
      });
    }
    if (!thisUser) {
      return res.status(401).json({
        massage: "로그인 되지 않은 유저",
      });
    }
    if (thisUser.userID != thisCocomment.userID) {
      return res.status(403).json({
        massage: "권한이 없는 사용자입니다",
      });
    }

    await cocomment.destroy({
      where: { thisCocomment },
    });

    return res.status(200).json({
      massage: "요청에 성공했습니다.",
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      massage: "요청에 실패했습니다",
    });
  }
};

const updateCocomment = async (req, res) => {
  const token = req.header["access-token"];
  const { cocommentID, body } = req.body;
  try {
    const thisUser = await user.findOne({
      where: { token },
    });
    const thisCocoment = await cocomment.findOne({
      where: { cocommentID },
    });

    if (!thisUser) {
      return res.status(401).json({
        massage: "로그인 되지 않은 사용자",
      });
    }
    if (!thisCocoment) {
      return res.status(404).json({
        massage: "존재하지 않는 대댓글",
      });
    }
    if (thisCocoment.userID != thisUser.userID) {
      return res.status(403).json({
        massage: "권한이 없는 사용자",
      });
    }

    await thisCocomment.update({
      body,
    });

    return res.status(204).json({});
  } catch (err) {
    return res.status(404).json({
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
