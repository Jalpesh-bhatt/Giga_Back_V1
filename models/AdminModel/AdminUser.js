const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['Administrator', 'Developer', 'Analyst', 'Support', 'Trial', 'User'], required: true },
  avatar: { type: String }, // stores image filename
}, { timestamps: true });

module.exports = mongoose.model('AdminUser', userSchema);
