// controller/user.js
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { sequelize } = require("../config/database");

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "등록된 사용자가 없습니다." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    // 사용자 정보를 세션에 저장 또는 토큰 발급

    res.status(200).json({ message: "로그인 성공" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
}

async function signup(req, res) {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "이미 등록된 이메일입니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sequelize.transaction(async (t) => {
      // 트랜잭션을 사용하여 데이터베이스 작업 수행
      const newUser = await User.create(
        { email, password: hashedPassword },
        { transaction: t }
      );
      // 추가적인 작업이 있다면 이 부분에 작성
    });

    res.status(201).json({ message: "회원가입 성공" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
}

async function logout(req, res) {
  // 세션을 파괴하는 로직
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "서버 오류" });
    } else {
      res.status(200).json({ message: "로그아웃 성공" });
    }
  });
}

async function deleteAccount(req, res) {
  const userId = req.user.id; // 가정: 로그인한 사용자 정보는 req.user에 저장되어 있다.

  try {
    await sequelize.transaction(async (t) => {
      // 트랜잭션을 사용하여 데이터베이스 작업 수행
      await User.destroy({ where: { id: userId } }, { transaction: t });
      // 추가적인 작업이 있다면 이 부분에 작성
    });

    // 로그아웃 처리 - 세션을 파괴하는 로직
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "서버 오류" });
      } else {
        res.status(200).json({ message: "회원탈퇴 및 로그아웃 성공" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
}

module.exports = {
  login,
  signup,
  logout,
  deleteAccount,
};
