const jwt = require("jsonwebtoken");

function authenticationMiddleware(req, res, next) {
  // 토큰 추출
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "인증 토큰이 없습니다." });
  }

  // 토큰 검증
  jwt.verify(token, "서버 시크릿 키", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "토큰이 유효하지 않습니다." });
    }
    req.user = decoded; // 사용자 정보를 요청 객체에 추가
    next();
  });
}

module.exports = token;
