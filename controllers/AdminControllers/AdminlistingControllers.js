const Listing = require('../../models/listing');
const mongoose = require('mongoose');
const planOrder = ['Premium', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Classic'];
const path = require('path');
const fs = require('fs');

const searchListings = async (req, res) => {
  const {  name, category, location, page = 1, limit = 5  } = req.query;
  const query = {};
// console.log('hoo');

  if (name) query.name = { $regex: name, $options: "i" };
  if (category) query.category = { $regex: category, $options: "i" };
  if (location) query.location = { $regex: location, $options: "i" };

  try {
     const skip = (parseInt(page) - 1) * parseInt(limit);

    const totalItems = await Listing.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    const listings = await Listing.find(query)
      .populate('userId', 'username email')
      .lean(); // Convert Mongoose documents to plain JS objects

    // Custom sorting by plan priority
    listings.sort((a, b) => {
      const indexA = planOrder.indexOf(a.plan) !== -1 ? planOrder.indexOf(a.plan) : planOrder.length;
      const indexB = planOrder.indexOf(b.plan) !== -1 ? planOrder.indexOf(b.plan) : planOrder.length;
      return indexA - indexB;
    });
    const paginatedListings = listings.slice(skip, skip + parseInt(limit));
    res.status(200).json({  success: true,
      data: paginatedListings,
      totalPages,
      currentPage: parseInt(page),
      totalItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

const updateListing = async (req, res) => {
  try {
    const { id } = req.query;
    const {
      Storename,
      address,
      category,
      subcategory,
    } = req.body;
    console.log(req.body);
    
    let parsedSubcategory = subcategory;
    if (typeof parsedSubcategory === "string") {
      parsedSubcategory = JSON.parse(parsedSubcategory);
    }

    const existingListing = await Listing.findById(id);
    if (!existingListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // ✅ Handle image update
    if (req.file) {
      const oldImagePath = path.join(__dirname, '..', '..', 'uploads', 'listings', existingListing.image || '');

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      existingListing.image = req.file.filename;
    }

    // ✅ Update fields
    existingListing.name = Storename;
    existingListing.address = address;
    existingListing.category = category;
    existingListing.subcategory = parsedSubcategory;

    await existingListing.save();

    res.status(200).json({ message: "Listing updated", data: existingListing });

  } catch (error) {
    console.error("Error updating listing:", error);
    res.status(500).json({ error: "Failed to update listing" });
  }
};

module.exports={searchListings,updateListing}