const mongoose = require('mongoose');

const socialSchema = new mongoose.Schema({
  facebook: String,
  instagram: String,
  linkedin: String,
  threads: String
});

const listingSchema = new mongoose.Schema({
  userId: { type: String, required: false },
  userName: { type: String, required: false },
  customerName: { type: String },
  userEmail: { type: String, required: false },
  name: { type: String, required: true },
  address: { type: String, required: false },
  phone: String,
  email: String,
  location: String,
  image: String, // store image URL or base64
  social: socialSchema,
  website: String,
  membership: String,
  plan: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: {type: [String], required: true }
  
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);
