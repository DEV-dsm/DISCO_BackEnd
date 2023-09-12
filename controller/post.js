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
    return res.status(400).json({
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

    return res.status(200).json({
      message: "요청에 성공했습니다",
      thisPost,
    });
  } catch (err) {
    return res.status(400).json({
      message: "요청에 실패했습니다.",
    });
  }
};

module.exports = {
  searchPost,
  getPost,
};
