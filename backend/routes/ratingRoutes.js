const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// @route   POST /api/ratings
// @desc    Submit or modify a store rating (Normal User Only)
// @access  Private/Normal User
router.post('/', authMiddleware, roleMiddleware(['NORMAL']), ratingController.submitRating);

module.exports = router;
