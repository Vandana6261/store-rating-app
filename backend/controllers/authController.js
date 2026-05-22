const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

// --- Helper Validation Functions ---
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  // 8-20 characters, at least one uppercase letter, and one special character
  const re = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/;
  return re.test(password);
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    const role = 'NORMAL'; // Force role to NORMAL for public registration


    if (!name || name.length > 20) {
      return res.status(400).json({ message: 'Name must be maximum 20 characters.' });
    }
    if (!address || address.length > 400) {
      return res.status(400).json({ message: 'Address must not exceed 400 characters.' });
    }
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }
    if (!password || !validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be 8-20 characters long and include at least one uppercase letter and one special character.' });
    }


    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role: role || 'NORMAL', // Default to normal user if not provided
      },
    });

    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
};

exports.registerUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Default to NORMAL if no valid role provided
    const userRole = ['ADMIN', 'NORMAL', 'STORE_OWNER'].includes(role) ? role : 'NORMAL';


    if (!name || name.length > 20) {
      return res.status(400).json({ message: 'Name must be maximum 20 characters.' });
    }
    if (!address || address.length > 400) {
      return res.status(400).json({ message: 'Address must not exceed 400 characters.' });
    }
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }
    if (!password || !validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be 8-20 characters long and include at least one uppercase letter and one special character.' });
    }


    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role: userRole,
      },
    });

    res.status(201).json({ message: `${userRole} created successfully`, userId: newUser.id });
  } catch (error) {
    console.error('Admin Registration Error:', error);
    res.status(500).json({ message: 'Internal server error during store owner registration.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;


    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email address.' });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.' });
    }


    const payload = {
      id: user.id,
      role: user.role,
    };
    
    // Fallback to a default secret for development if JWT_SECRET isn't in .env yet
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_development';
    const token = jwt.sign(payload, secret, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required.' });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({ message: 'New password must be 8-20 characters long and include at least one uppercase letter and one special character.' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ message: 'Internal server error while changing password.' });
  }
};
