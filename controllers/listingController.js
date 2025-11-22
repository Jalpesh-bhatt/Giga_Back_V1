const Listing = require('../models/listing');
const mongoose = require('mongoose');
const getUserListings = async (req, res) => {
  // console.log('hii')
  // console.log(req.params)
  try {
    const {id:userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid userId format' });
  }
    // console.log(id)
    const listings = await Listing.find({ userId });
    // console.log(listings);
    
    res.status(200).json({ message: 'Success', data: listings });
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createListing = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      name,
      address,
      phone,
      email,
      location,
      membership,
      website,
      plan,
      userId,
      userName,
      userEmail,
      customerName,
      social // optional: expected as JSON string if using multipart/form-data
    } = req.body;
    // console.log('listing',req.body);
    
    // ✅ Parse subcategory (expected as JSON string or already an array)
    let parsedSubcategory = [];
    if (typeof subcategory === 'string') {
      try {
        parsedSubcategory = JSON.parse(subcategory);
        if (!Array.isArray(parsedSubcategory)) {
          parsedSubcategory = [parsedSubcategory];
        }
      } catch {
        parsedSubcategory = [subcategory];
      }
    } else if (Array.isArray(subcategory)) {
      parsedSubcategory = subcategory;
    }

    // ✅ Parse social media links if provided (stringified JSON)
    let parsedSocial = {};
    if (social) {
      try {
        parsedSocial = typeof social === 'string' ? JSON.parse(social) : social;
      } catch (err) {
        return res.status(400).json({ message: 'Invalid social media format' });
      }
    }

    // ✅ Handle uploaded image
    const image = req.file ? req.file.filename : null;

    // ✅ Create and save listing
    const newListing = new Listing({
      category,
      subcategory: parsedSubcategory,
      name,
      address,
      phone,
      email,
      location,
      website,
      membership,
      plan,
      image,
      social: parsedSocial,
      userId,
      userName,
      userEmail,
      customerName,
    });

    await newListing.save();

    res.status(201).json({
      message: 'Listing created successfully',
      data: newListing,
    });

  } catch (error) {
    console.error('Error in createListing:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};


const planOrder = ['Premium', 'Diamond', 'Platinium', 'Gold', 'Silver', 'Classic'];
const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find()
          .populate('userId', 'username email').lean()// populate only username and email from User
    // Sort listings by planOrder
    listings.sort((a, b) => {
      const planA = a.plan || '';
      const planB = b.plan || '';
      // Get index in planOrder or a large number if not found (push to end)
      const indexA = planOrder.indexOf(planA) !== -1 ? planOrder.indexOf(planA) : planOrder.length;
      const indexB = planOrder.indexOf(planB) !== -1 ? planOrder.indexOf(planB) : planOrder.length;
      return indexA - indexB;
    });

        res.status(200).json({ message: "Success", data: listings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch listings", error: error.message });
  }
};

const tagMap = {
  Premium: 'Trending',
  Diamond: 'Promoted',
  Platinum: 'Recommended',
  Gold: 'Top Rated',
  Silver: 'Verified',
  Classic: 'Basic'
};

const getListingsByCategory = async (req, res) => {
  try {
    const { name, category: searchCategory, location } = req.query; // query params
    const { category, subcategory } = req.params; // route params

    // Start with category/subcategory filter
    const filter = {
      category,
      subcategory
    };

    // Add optional search filters
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }
    if (searchCategory) {
      filter.category = { $regex: searchCategory, $options: "i" };
    }
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    const listings = await Listing.find(filter);

    // Sort by plan priority
    const sorted = listings.sort((a, b) => {
      const indexA = planOrder.indexOf(a.plan) !== -1 ? planOrder.indexOf(a.plan) : planOrder.length;
      const indexB = planOrder.indexOf(b.plan) !== -1 ? planOrder.indexOf(b.plan) : planOrder.length;
      return indexA - indexB;
    });

    // Add tag mapping if needed
    const tagged = sorted.map(listing => ({
      ...listing._doc,
      tag: tagMap[listing.plan] || ''
    }));

    res.status(200).json(tagged);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const searchListings = async (req, res) => {
  const { name, category, location } = req.query;
  const query = {};
// console.log('hoo');

  if (name) query.name = { $regex: name, $options: "i" };
  if (category) query.category = { $regex: category, $options: "i" };
  if (location) query.location = { $regex: location, $options: "i" };
  
  try {
    const listings = await Listing.find(query)
      .populate('userId', 'username email')
      .lean(); // Convert Mongoose documents to plain JS objects

    // Custom sorting by plan priority
    listings.sort((a, b) => {
      const indexA = planOrder.indexOf(a.plan) !== -1 ? planOrder.indexOf(a.plan) : planOrder.length;
      const indexB = planOrder.indexOf(b.plan) !== -1 ? planOrder.indexOf(b.plan) : planOrder.length;
      return indexA - indexB;
    });
// console.log(listings);

    res.status(200).json({ success: true, data: listings });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
module.exports = { createListing,getUserListings,getAllListings,getListingsByCategory,searchListings};
