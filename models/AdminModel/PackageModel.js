const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  features: { type: [String], required: true },
    icon: { type: String }, // For image filename
//   cbaolor: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
