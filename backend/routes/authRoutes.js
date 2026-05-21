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

// @route   POST /api/auth/admin/register-user
// @desc    Register a new user with any role (Admin Only)
// @access  Private/Admin
router.post('/admin/register-user', authMiddleware, roleMiddleware(['ADMIN']), authController.registerUserByAdmin);

// @route   PATCH /api/auth/change-password
// @desc    Change password for logged-in user
// @access  Private
router.patch('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
