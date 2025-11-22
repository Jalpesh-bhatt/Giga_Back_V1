const path = require('path');
const fs = require('fs');
const Package = require('../../models/AdminModel/PackageModel')
// Create Package
exports.createPackage = async (req, res) => {
  // console.log(req.body)
  try {
    const { name, price } = req.body;
    let features = req.body.features;

    // Parse features JSON string into array
    if (typeof features === 'string') {
      features = JSON.parse(features);
    }

    // Check if package with the same name exists
    const existing = await Package.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Package with this name already exists." });
    }
    
    const newPackage = new Package({
      name,
      price,
      features,
      icon: req.file ? req.file.filename : null, // if you're storing file name
    });
    // console.log(newPackage)
    // return
    await newPackage.save();
    res.status(201).json({ message: "Package added successfully", data: newPackage });
  } catch (error) {
    console.error("Create Package Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get All Packages
exports.getPackages = async (req, res) => {
  try {
    const paginate = req.query.paginate !== "false"; // default true    
    const searchTerm = req.query.user || "";
    const query = searchTerm
      ? { package: { $regex: searchTerm, $options: "i" } }
      : {};

    let packages, totalPages = 1, page = 1;

    if (paginate) {
      page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const totalCount = await Package.countDocuments(query);
      totalPages = Math.ceil(totalCount / limit);
      const skip = (page - 1) * limit;

      packages = await Package.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    } else {
      packages = await Package.find(query).sort({ createdAt: -1 });
    }

    res.status(200).json({
      data: packages,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ message: "Failed to fetch packages" });
  }
};


// Update Package
exports.editPackage = async (req, res) => {
  // return
  // console.log(req.query);
  
  try {
    const packageId = req.query.id;
    const { name, price } = req.body;
    let features = req.body.features;

    if (typeof features === 'string') {
      features = JSON.parse(features);
    }

    const existingPackage = await Package.findById(packageId);
    if (!existingPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    // ✅ Delete old icon if new file uploaded
    if (req.file) {
      const oldIconPath = path.join(__dirname, '..', '..', 'uploads', 'planIcons', existingPackage.icon);

      // Check if file exists before deleting
      if (fs.existsSync(oldIconPath)) {
        fs.unlinkSync(oldIconPath); // Delete old file
      }

      existingPackage.icon = req.file.filename;
    }
      console.log(existingPackage.icon)
      // return
    // ✅ Update other fields
    existingPackage.name = name;
    existingPackage.price = price;
    existingPackage.features = features;

    await existingPackage.save();

    res.status(200).json({ message: 'Package updated successfully', data: existingPackage });
  } catch (error) {
    console.error("Edit Package Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
