const express = require('express');
const ClosetItem = require('../models/ClosetItem');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// 이 라우터의 모든 엔드포인트는 로그인 필요
router.use(requireAuth);

function toPublicItem(doc) {
  return {
    id: doc._id.toString(),
    imageBase64: doc.imageBase64,
    imageMimeType: doc.imageMimeType,
    name: doc.name,
    category: doc.category,
    price: doc.price,
    purchaseDate: doc.purchaseDate,
    wearDates: doc.wearDates,
    createdAt: doc.createdAt.getTime(),
  };
}

router.get('/', async (req, res) => {
  try {
    const items = await ClosetItem.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.json({ items: items.map(toPublicItem) });
  } catch (err) {
    console.error('list closet error', err);
    return res.status(500).json({ message: '옷장을 불러오지 못했어요.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { imageBase64, imageMimeType, name, category, price, purchaseDate } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ message: '사진 데이터가 없어요.' });
    }

    const item = await ClosetItem.create({
      userId: req.userId,
      imageBase64,
      imageMimeType: imageMimeType || 'image/jpeg',
      name: name || '',
      category: category || '기타',
      price: price || 0,
      purchaseDate: purchaseDate || '',
      wearDates: [],
    });

    return res.status(201).json({ item: toPublicItem(item) });
  } catch (err) {
    console.error('create closet error', err);
    return res.status(500).json({ message: '옷을 저장하지 못했어요.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await ClosetItem.deleteOne({ _id: req.params.id, userId: req.userId });
    return res.json({ ok: true });
  } catch (err) {
    console.error('delete closet error', err);
    return res.status(500).json({ message: '삭제하지 못했어요.' });
  }
});

// 클라이언트가 자기 기기의 "오늘" 날짜 문자열을 보내주면, 그 날짜를 착용기록에 추가/제거한다.
router.patch('/:id/toggle-worn', async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ message: '날짜가 필요해요.' });
    }

    const item = await ClosetItem.findOne({ _id: req.params.id, userId: req.userId });
    if (!item) {
      return res.status(404).json({ message: '옷을 찾을 수 없어요.' });
    }

    if (item.wearDates.includes(date)) {
      item.wearDates = item.wearDates.filter((d) => d !== date);
    } else {
      item.wearDates.push(date);
    }
    await item.save();

    return res.json({ item: toPublicItem(item) });
  } catch (err) {
    console.error('toggle worn error', err);
    return res.status(500).json({ message: '착용 기록을 변경하지 못했어요.' });
  }
});

module.exports = router;
