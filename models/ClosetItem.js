const mongoose = require('mongoose');

const closetItemSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    imageBase64: { type: String, required: true },
    imageMimeType: { type: String, default: 'image/jpeg' },
    name: { type: String, default: '' },
    category: { type: String, enum: ['상의', '하의', '신발', '기타'], default: '기타' },
    price: { type: Number, default: 0 },
    purchaseDate: { type: String, default: '' },
    wearDates: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClosetItem', closetItemSchema);
