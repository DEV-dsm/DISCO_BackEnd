const jwt = require("jsonwebtoken");

function authenticationMiddleware(req, res, next) {
  // 토큰 추출
  const token = req.headers["Authorization"];

  if (!token) {
    return res.status(401).json({ message: "인증 토큰이 없습니다." });
  }

  // 토큰 검증
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "토큰이 유효하지 않습니다." });
    }
    req.decoded = decoded; // 사용자 정보를 요청 객체에 추가
    next();
  });
}

module.exports = authenticationMiddleware;
