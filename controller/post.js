const { Op } = require("sequelize");
const post = require("../models");

const searchPost = async (req, res) => {
  const { keyword } = req.qurey;

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

const createPost = async (req, res) => {
  const { userID } = req.decoded;
  const { title, body } = req.body;

  try {
    await post.create({
      userID,
      title,
      body,
    });

    return res.status(201).json({
      message: "게시물 작성 성공",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "게시물 작성 실패",
    });
  }
};

const updatePost = async (req, res) => {
  const { userID } = req.decoded;
  const { postID, title, body } = req.body;

  try {
    const thisPost = await post.findOne({
      where: { postID, userID },
    });

    if (!thisPost) {
      return res.status(404).json({
        message: "게시물을 찾을 수 없습니다.",
      });
    }

    thisPost.title = title;
    thisPost.body = body;
    await thisPost.save();

    return res.status(200).json({
      message: "게시물 수정 성공",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "게시물 수정 실패",
    });
  }
};

const deletePost = async (req, res) => {
  const { userID } = req.decoded;
  const { postID } = req.params;

  try {
    const thisPost = await post.findOne({
      where: { postID, userID },
    });

    if (!thisPost) {
      return res.status(404).json({
        message: "게시물을 찾을 수 없습니다.",
      });
    }

    await thisPost.destroy();

    return res.status(204).json({});
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "게시물 삭제 실패",
    });
  }
};

module.exports = {
  searchPost,
  getPost,
  getDiary,
  getIssue,
  createPost,
  updatePost,
  deletePost,
};
