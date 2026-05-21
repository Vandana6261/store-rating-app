const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// @route   POST /api/stores
// @desc    Add a new store (Admin Only)
// @access  Private/Admin
router.post('/', authMiddleware, roleMiddleware(['ADMIN']), storeController.addStore);

// @route   GET /api/stores
// @desc    Get all stores (with optional search and sorting)
// @access  Private (All authenticated users can view)
router.get('/', authMiddleware, storeController.getStores);

module.exports = router;
