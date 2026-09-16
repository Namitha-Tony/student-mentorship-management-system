const { validationResult } = require('express-validator');
const User = require('../models/User');
const Student = require('../models/Student');
const Mentor = require('../models/Mentor');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }

  const { name, email, password, role } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(409).json({ success: false, message: 'Email is already registered' });

  const user = await User.create({ name, email, password, role });
  if (role === 'student') {
    await Student.create({ user: user._id, studentId: `STU-${user._id.toString().slice(-8)}` });
  } else {
    await Mentor.create({ user: user._id, employeeId: `MEN-${user._id.toString().slice(-8)}` });
  }
  return res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: { user: publicUser(user), token: generateToken(user) }
  });
});

const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }

  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { user: publicUser(user), token: generateToken(user) }
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: { user: publicUser(req.user) } });
});

module.exports = { register, login, getMe };
