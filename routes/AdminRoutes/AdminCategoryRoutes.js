const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/AdminControllers/AdminCategoryContoller');
const categoryUpload = require('../../utills/AdminConfig/categoryConfig');

// Routes
router.post('/add', categoryUpload.single('image'), categoryController.addCategory);
router.put('/edit/', categoryUpload.single('image'), categoryController.updateCategory);
router.get('/getcategory', categoryController.getCategories);
module.exports=router