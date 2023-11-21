const jwt = require("jsonwebtoken");
const { user } = require("../models");

async function authenticationMiddleware(req, res, next) {
  // 토큰 추출
  const token = req.headers.authorization;

  try {
    if (!token) {
      return res.status(401).json({ message: "인증 토큰이 없습니다." });
    }

    // 토큰 검증
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "토큰이 유효하지 않습니다.",
        });
      }
      req.decoded = decoded; // 사용자 정보를 요청 객체에 추가
      next();
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "토큰 인증과정 중 서버에서 오류발생",
    });
  }
}

module.exports = authenticationMiddleware;
