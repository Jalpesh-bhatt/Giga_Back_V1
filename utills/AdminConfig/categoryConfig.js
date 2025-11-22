const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Utility to create category folder if it doesn't exist
const getCategoryFolder = () => {
  const uploadPath = path.join(__dirname, '..', '..', 'uploads', 'categories');
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  return uploadPath;
};

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = getCategoryFolder();
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, uniqueSuffix);
  },
});

// File filter for categories
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (['.jpg', '.jpeg', '.png'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, and .png files are allowed for category images!'));
  }
};

// Export multer instance
const categoryUpload = multer({ storage, fileFilter });

module.exports = categoryUpload;
