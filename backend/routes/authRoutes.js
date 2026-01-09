const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protected routes (User must be logged in)
router.get('/me', protect, authController.getMe);
router.patch('/updateMe', protect, authController.updateMe);
router.patch('/updatePassword',protect, authController.updatePassword);

module.exports = router;