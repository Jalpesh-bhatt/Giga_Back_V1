const express = require('express');
const router = express.Router();
const upload=require('../../utills/multerConfig')
const {searchListings,updateListing}=require('../../controllers/AdminControllers/AdminlistingControllers')
router.get("/search", searchListings);
router.put('/editlisting',upload.single('photo'),updateListing)
module.exports = router;
