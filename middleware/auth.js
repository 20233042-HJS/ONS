const jwt = require('jsonwebtoken');

// Authorization: Bearer <token> 헤더를 검사해서 req.userId를 채워준다.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: '로그인이 만료됐어요. 다시 로그인해주세요.' });
  }
}

module.exports = { requireAuth };
