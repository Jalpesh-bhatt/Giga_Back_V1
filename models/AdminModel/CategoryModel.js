const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    categoryname: { type: String, required: true },
  subcategory: { type: [String], required: true },
  // subcategory: { type: String, required: true },
  description: { type: String },
  image: { type: String }, // Optional avatar upload
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
