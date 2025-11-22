const express = require('express');
const { createListing } = require('../controllers/listingController');
const {getUserListings} = require('../controllers/listingController')
const {getAllListings} = require('../controllers/listingController')
const {searchListings}=require('../controllers/listingController')
const {getListingsByCategory}=require('../controllers/listingController')
const router = express.Router();
const multer = require('multer');
const upload = require('../utills/multerConfig'); // use your configured multer
router.post('/add-listing',upload.single('image'), createListing);
router.get('/user-listings/:id', getUserListings);
router.get('/all-listings', getAllListings);
router.get("/search", searchListings);
router.get('/:category/:subcategory', getListingsByCategory);
module.exports = router;
