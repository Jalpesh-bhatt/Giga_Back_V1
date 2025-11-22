const express = require('express');
const router = express.Router();
const upload = require('../../utills/AdminConfig/usermulter');
const { createUser, getUsers,updateUsers } = require('../../controllers/AdminControllers/AdminUserControllers');

router.post('/add', upload.single('photo'), createUser);
router.get('/all', getUsers);
router.put('/update',upload.single('image'),updateUsers );

module.exports = router;
