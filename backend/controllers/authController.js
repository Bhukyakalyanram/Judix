const User = require('../models/User');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Helper to create JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  console.log('typeof next:', typeof next);
  const { name, email, password } = req.body;

  // 1. Create user (password is hashed in User model pre-save hook)
  const newUser = await User.create({
    name,
    email,
    password,
  });

  // 2. Generate token
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: { user: { id: newUser._id, name, email } }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;


  // 1. Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2. Check if user exists & password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3. If everything ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
    data: { user: { id: user._id, name: user.name, email: user.email } }
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  // req.user is populated by your protect middleware
  res.status(200).json({
    status: 'success',
    data: { user: req.user }
  });
});
// Add this to your authController.js
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password) {
    return next(new AppError('This route is not for password updates.', 400));
  }

  // 2) Update user document
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id, 
    { name: req.body.name, email: req.body.email }, 
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Check if req.user exists (Security Guard)
  // console.log(req)
  if (!req.user) {
    return next(new AppError('You are not logged in.', 401));
  }

  // 2) Get user and include password (use ._id or .id depending on your middleware)
  const user = await User.findById(req.user._id || req.user.id).select('+password');

  // 3) Check if current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 4) Update and Save (Triggers hashing hook)
  user.password = req.body.password;
  await user.save();

  // 5) Send new token
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});