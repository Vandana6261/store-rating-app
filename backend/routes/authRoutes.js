const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', authController.login);

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// @route   POST /api/auth/admin/register-owner
// @desc    Register a new Store Owner (Admin Only)
// @access  Private/Admin
router.post('/admin/register-owner', authMiddleware, roleMiddleware(['ADMIN']), authController.registerStoreOwner);

module.exports = router;
