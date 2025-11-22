const express = require('express');
const router = express.Router();
const { submitFeedback } = require('../controllers/FeedbackControllers');

router.post('/submit', submitFeedback);

module.exports = router;
