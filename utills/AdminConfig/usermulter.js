const multer = require('multer');
const path = require('path');
const fs = require('fs');
// const listing = require')

// Utility function to create dynamic folder paths
const getFolder = (avatars) => {
  const uploadPath = path.join(__dirname, '..','..','uploads', avatars);
  // return
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  return uploadPath;
};

// Multer storage config with dynamic destination
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Default to 'avatars' if no type is provided
    const type = req.body.type || 'avatars'; 
    const folder = getFolder(type);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, uniqueSuffix);
  },
});

// File type filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (['.jpg', '.jpeg', '.png'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, and .png files are allowed!'));
  }
};

// Export configured multer instance
const upload = multer({ storage, fileFilter });

module.exports = upload;
