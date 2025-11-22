const express = require('express');
const router = express.Router();
const packageController = require('../../controllers/AdminControllers/AdminPackageController');
const planIconUpload = require('../../utills/AdminConfig/planIconConfig');

// Add new package
router.post('/add',planIconUpload.single('icon') ,packageController.createPackage);

// Get all packages
router.get('/all', packageController.getPackages);

router.put('/editplan',planIconUpload.single('icon'),packageController.editPackage)

module.exports = router;
