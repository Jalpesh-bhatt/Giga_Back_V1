const express = require('express');
const router = express.Router();
const { registerUser,loginUser } = require('../controllers/authController');
const useController = require('../controllers/useController')
const authenticateToken = require('../middleware/authMiddleware')
router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/getProfile',authenticateToken,useController.getProfile)
module.exports = router;
