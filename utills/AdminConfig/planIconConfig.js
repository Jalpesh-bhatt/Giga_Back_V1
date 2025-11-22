const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Utility to create the 'planIcons' folder if it doesn't exist
const getCategoryFolder = () => {
  const uploadPath = path.join(__dirname, '..', '..', 'uploads', 'planIcons');
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  return uploadPath;
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = getCategoryFolder();
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // Replace spaces with dashes to ensure safe filenames
    const originalName = file.originalname.replace(/\s+/g, '-');
    cb(null, originalName); // Save using original name
  },
});

// File filter for validating image types
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (['.jpg', '.jpeg', '.png'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, and .png files are allowed for package icons!'));
  }
};

// Export configured multer instance
const planIconUpload = multer({ storage, fileFilter });

module.exports = planIconUpload;
