// controller/user.js
const bcrypt = require("bcrypt");
const { user } = require("../models");
const jwt = require("jsonwebtoken");

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const thisUser = await user.findOne({ where: { email } });

    if (!thisUser) {
      return res.status(404).json({
        message: "등록된 사용자가 없습니다.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, thisUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "비밀번호가 일치하지 않습니다.",
      });
    }

    // jwt 토큰 발행
    let accessToken = jwt.sign(
      {
        userID: thisUser.userID,
      },
      process.env.SECRET,
      {
        expiresIn: "3h",
      }
    );

    await thisUser.update({
      token: accessToken,
    });

    let miliSecond = 0;
    jwt.verify(accessToken, process.env.SECRET, (err, decoded) => {
      if (err)
        return res.status(500).json({
          message: "해독과정에서 오류발생",
        });
      req.decoded = decoded;
    });

    const iat = new Date(
      req.decoded.iat * 1000 + 1000 * 3600 * 9
    ).toISOString();
    const exp = new Date(
      req.decoded.exp * 1000 + 1000 * 3600 * 9
    ).toISOString();

    res.status(200).json({
      message: "로그인 성공",
      accessToken,
      발행시간: iat,
      만료시간: exp,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
}

async function signup(req, res) {
  const { username, email, password } = req.body;

  try {
    const existingUser = await user.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: "이미 등록된 이메일입니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 이메일 인증을 위한 랜덤 토큰 생성
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // 사용자 생성
    const createdUser = await user.create({
      name: username,
      password: hashedPassword,
      email,
      verificationToken,
    });

    // 이메일 인증 메일 발송
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: "회원가입 성공. 이메일로 인증해주세요." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
}

async function verifyEmail(req, res) {
  const { email } = req.params;

  if (!token) {
    return res.status(400).json({ message: "토큰이 필요합니다." });
  }

  try {
    const thisUser = await user.findOne({
      where: { verificationToken: token },
    });

    if (!thisUser) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    // 인증 완료 처리
    await thisUser.update({
      isVerified: true,
      verificationToken: null,
    });

    return res.status(200).json({
      message: "이메일 인증이 완료되었습니다.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "이메일 인증에 실패했습니다.",
    });
  }
}

async function logout(req, res) {
  const { userID } = req.decoded;

  try {
    const thisUser = await user.findOne({ where: { userID } });

    if (!thisUser) {
      return res.status(404).json({
        message: "존재하지 않는 유저입니다.",
      });
    }

    await thisUser.update({
      token: null,
    });

    return res.status(200).json({
      message: "로그아웃 성공",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "서버 에러",
    });
  }
}

async function deleteAccount(req, res) {
  const { userID } = req.decoded;

  try {
    const thisUser = await user.findOne({ where: { userID } });

    if (!thisUser) {
      return res.status(404).json({
        message: "존재하지 않는 유저.",
      });
    }

    await user.destroy({
      where: { userID: thisUser.userID },
    });

    return res.status(200).json({
      message: "회원 탈퇴 성공",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "서버 오류",
    });
  }
}

async function getUserInfo(req, res) {
  const { userID } = req.decoded;

  try {
    const userInfo = await user.findOne({
      where: { userID },
      attributes: { exclude: ["password", "token"] }, // 민감한 정보는 제외
    });

    if (!userInfo) {
      return res.status(404).json({ message: "유저 정보를 찾을 수 없습니다." });
    }

    return res.status(200).json({ userInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
}

async function updateUser(req, res) {
  const { userID } = req.decoded;
  const { name, password, email, status } = req.body;

  try {
    const thisUser = await user.findOne({
      where: { userID },
    });

    if (!thisUser) {
      return res.status(404).json({
        message: "유저를 찾을 수 없습니다.",
      });
    }

    // 원하는 수정 로직을 여기에 추가
    // 예: 이름, 비밀번호, 이메일, 상태메시지를 업데이트
    if (name) thisUser.name = name;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      thisUser.password = hashedPassword;
    }
    if (email) thisUser.email = email;
    if (status) thisUser.status = status;

    await thisUser.save();

    return res.status(200).json({
      message: "유저 정보가 성공적으로 수정되었습니다.",
      updatedUser: {
        name: thisUser.name,
        email: thisUser.email,
        status: thisUser.status,
        // 원하는 필드 추가 가능
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "유저 정보 수정에 실패했습니다.",
    });
  }
}

module.exports = {
  login,
  signup,
  logout,
  deleteAccount,
  getUserInfo,
  updateUser,
};
