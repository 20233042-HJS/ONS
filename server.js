require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const closetRoutes = require('./routes/closet');

const app = express();
app.use(cors());
// 사진을 base64로 받기 때문에 기본 100kb 제한을 늘려줌
app.use(express.json({ limit: '15mb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/closet', closetRoutes);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI 환경변수가 설정되지 않았어요. .env 또는 Render 환경변수를 확인하세요.');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB 연결 성공');
    app.listen(PORT, () => {
      console.log(`서버 실행 중: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB 연결 실패', err);
    process.exit(1);
  });
