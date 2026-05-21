const express = require('express');
const router = express.Router();
const storeOwnerController = require('../controllers/storeOwnerController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// @route   GET /api/store-owner/dashboard
// @desc    Get store raters and average rating
// @access  Private/Store Owner
router.get('/dashboard', authMiddleware, roleMiddleware(['STORE_OWNER']), storeOwnerController.getDashboard);

module.exports = router;
