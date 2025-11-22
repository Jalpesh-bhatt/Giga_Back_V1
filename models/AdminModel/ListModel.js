const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // from "Storename" field in frontend
  },
  address: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: [String],
    default: [],
  },
  image: {
    type: String, // stored filename, e.g., '168924932-image.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Listing', listingSchema);
