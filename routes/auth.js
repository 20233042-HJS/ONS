const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const USERNAME_REGEX = /^[A-Za-z0-9_]{6,20}$/;
// 문자 + 숫자 + 특수문자 포함, 8~20자
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/;
const GENDER_OPTIONS = ['남성', '여성', '선택안함'];

function signToken(user) {
  return jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}

function toPublicUser(user) {
  return {
    id: user._id.toString(),
    username: user.username,
    name: user.name,
    gender: user.gender,
  };
}

router.post('/signup', async (req, res) => {
  try {
    const { username, password, name, gender } = req.body;

    if (!username || !password || !name || !gender) {
      return res.status(400).json({ message: '필수 항목을 모두 입력해주세요.' });
    }
    if (!USERNAME_REGEX.test(username)) {
      return res.status(400).json({ message: '아이디는 영문/숫자/밑줄로 6~20자여야 해요.' });
    }
    if (!PASSWORD_REGEX.test(password)) {
      return res
        .status(400)
        .json({ message: '비밀번호는 문자, 숫자, 특수문자를 포함해 8~20자여야 해요.' });
    }
    if (!GENDER_OPTIONS.includes(gender)) {
      return res.status(400).json({ message: '성별 값이 올바르지 않아요.' });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ message: '이미 사용 중인 아이디예요.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash, name, gender });

    const token = signToken(user);
    return res.status(201).json({ token, user: toPublicUser(user) });
  } catch (err) {
    console.error('signup error', err);
    return res.status(500).json({ message: '회원가입 중 문제가 발생했어요.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않아요.' });
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않아요.' });
    }

    const token = signToken(user);
    return res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ message: '로그인 중 문제가 발생했어요.' });
  }
});

// 앱을 다시 열었을 때 저장된 토큰이 아직 유효한지 확인하는 용도 (자동 로그인)
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없어요.' });
    }
    return res.json({ user: toPublicUser(user) });
  } catch (err) {
    console.error('me error', err);
    return res.status(500).json({ message: '사용자 정보를 불러오지 못했어요.' });
  }
});

module.exports = router;
