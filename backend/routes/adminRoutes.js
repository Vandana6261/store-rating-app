const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// @route   GET /api/admin/dashboard
// @desc    Get total users, stores, ratings counts
// @access  Private/Admin
router.get('/dashboard', authMiddleware, roleMiddleware(['ADMIN']), adminController.getDashboardStats);

// @route   GET /api/admin/users
// @desc    Get list of all users with sorting/filtering
// @access  Private/Admin
router.get('/users', authMiddleware, roleMiddleware(['ADMIN']), adminController.getUsers);

module.exports = router;
