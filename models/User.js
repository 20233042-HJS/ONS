const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['남성', '여성', '선택안함'], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
