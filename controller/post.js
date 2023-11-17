const { Op } = require("sequelize");
const post = require("../models");

const searchPost = async (req, res) => {
  const { keyword } = req.query;

  try {
    let postList = await post.findAll({
      [Op.or]: [
        { title: { [Op.like]: `%${keyword}%` } },
        { body: { [Op.like]: `%${keyword}%` } },
      ],
    });

    return res.status(200).json({
      message: "요청에 성공했습니다",
      postList,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "요청에 실패했습니다",
    });
  }
};

const getPost = async (req, res) => {
  const postID = req.params.postID;

  try {
    const thisPost = await post.findOne({
      where: { postID },
    });

    if (!thisPost) {
      return res.status(404).json({
        message: "게시물 찾을수 없음",
      });
    }

    return res.status(200).json({
      message: "요청에 성공했습니다",
      thisPost,
    });
  } catch (err) {
    return res.status(500).json({
      message: "요청에 실패했습니다.",
    });
  }
};

const getDiary = async (req, res) => {
  const { userID } = req.decoded;

  try {
    if (!userID) {
      return res.status(401).json({
        message: "로그인 되지 않은 사용자",
      });
    }

    const diary = await post.findAll({
      where: { userID },
    });

    return res.status(200).json({
      message: "요청 성공",
      diary,
    });
  } catch (err) {
    return res.status(500).json({
      message: "요청 실패",
    });
  }
};

const getIssue = async (req, res) => {
  const day = new Date();

  try {
    const issues = await post.findAll({
      where: { createdAt: { [Op.like]: `%${day}` } },
    });

    return res.status(200).json({
      message: "요청에 성공했습니다",
      issues,
    });
  } catch (err) {
    return res.status(500).json({
      message: "요청에 실패했습니다",
    });
  }
};

module.exports = {
  searchPost,
  getPost,
  getDiary,
  getIssue,
};
