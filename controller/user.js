// controller/user.js
const bcrypt = require("bcrypt");
const { user } = require("../models");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

async function login(req, res) {
  const { username, password } = req.body;

  try {
    const thisUser = await user.findOne({ where: { name: username } });

    if (!thisUser) {
      return res.status(404).json({
        message: "등록된 사용자가 없습니다."
      });
    }

    const isPasswordValid = await bcrypt.compare(password, thisUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "비밀번호가 일치하지 않습니다."
      });
    }

    // jwt 토큰 발행
    let accessToken = jwt.sign(
      {
        userID: thisUser.userID
      },
      process.env.SECRET,
      {
        expiresIn: "3h"
      }
    );

    await thisUser.update({
      token: accessToken
    });

    jwt.verify(accessToken, process.env.SECRET, (err, decoded) => {
      if (err)
        return res.status(500).json({
          message: "해독과정에서 오류발생"
        });
      req.decoded = decoded;
    });

    const iat = new Date(req.decoded.iat * 1000 + 1000 * 3600 * 9).toISOString();
    const exp = new Date(req.decoded.exp * 1000 + 1000 * 3600 * 9).toISOString();

    res.status(200).json({
      message: "로그인 성공",
      accessToken,
      userID: thisUser.userID,
      발행시간: iat,
      만료시간: exp
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

    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    console.log(hashedPassword);

    await user.create({
      name: username,
      password: hashedPassword,
      email
    });

    res.status(201).json({ message: "회원가입 성공" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
}

async function logout(req, res) {
  const { userID } = req.decoded;

  try {
    const thisUser = await user.findOne({ where: { userID } });

    if (!thisUser) {
      return res.status(404).json({
        message: "존재하지 않는 유저입니다."
      });
    }

    await thisUser.update({
      token: null
    });

    return res.status(200).json({
      message: "로그아웃 성공"
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "서버 에러"
    });
  }
}

async function deleteAccount(req, res) {
  const { userID } = req.decoded;

  try {
    const thisUser = await user.findOne({ where: { userID } });

    if (!thisUser) {
      return res.status(404).json({
        message: "존재하지 않는 유저."
      });
    }

    await user.destroy({
      where: { userID: thisUser.userID }
    });

    return res.status(200).json({
      message: "회원 탈퇴 성공"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "서버 오류"
    });
  }
}

async function getUserInfo(req, res) {
  const { userID } = req.decoded;

  try {
    const userInfo = await user.findOne({
      where: { userID },
      attributes: { exclude: ["password", "token"] } // 민감한 정보는 제외
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
      where: { userID }
    });

    if (!thisUser) {
      return res.status(404).json({
        message: "유저를 찾을 수 없습니다."
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
        status: thisUser.status
        // 원하는 필드 추가 가능
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "유저 정보 수정에 실패했습니다."
    });
  }
}

//이메일 전송
async function sendVerificationEmail(req, res) {
  const { email } = req.body;
  const code = Math.floor(Math.random() * 89999 + 10000);

  const emailStyle = `<div id="container">
      <img src="/img/logo.png" class="logo" style="width: 150px" />
      <p class="title" style="margin-top: 30px; font-weight: 600; font-size: 25px">이메일 인증을 진행해주세요</p>
      <p class="subTitle">안녕하세요, DISCO를 이용해주셔서 감사합니다 :)<br />DISCO 가입을 위해 아래 인증번호를 입력해주세요</p>
      <div class="code" style="width: 400px; height: 70px; font-size: 40px; background-color: lightgray">
        <p class="codeText" style="font-weight: 200px; letter-spacing: 10px; margin: 0 0 0 125px">${code}</p>
      </div>
      <p class="notice" style="width: 400px; text-align: center; font-size: 13px; color: gray">발행된 코드는 일회성입니다</p>
    </div>`;

  try {
    // nodemailer 전송 설정
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: "DISCO 이메일 인증",
      html: `<h2>이메일 인증</h2>
      <div class="email">${email}</div>
      <p>아래 인증코드를 입력해 본인임을 확인해주세요</p>
      <div class="code">${code}</div>`
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "인증 코드가 발행되었습니다",
      code
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "인증 코드 발행에 실패했습니다"
    });
  }
}

//아이디 찾기
async function foundUserId(req, res) {
  const { email } = req.body;

  try {
    const userFound = await user.findOne({ where: { email } });

    if (!userFound) {
      return res.status(404).json({
        message: "등록된 사용자가 없습니다."
      });
    }

    // 사용자의 아이디 찾기
    const foundUserId = userFound.userID;

    return res.status(200).json({
      userID: foundUserId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
}

async function foundUserPassword(req, res) {
  const { email } = req.body;

  try {
    const userFound = await user.findOne({ where: { email } });

    if (!userFound) {
      return res.status(404).json({
        message: "등록된 사용자가 없습니다."
      });
    }

    return res.status(200).json({
      userPassword: userFound.password
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
  getUserInfo,
  updateUser,
  sendVerificationEmail,
  foundUserId,
  foundUserPassword
};
