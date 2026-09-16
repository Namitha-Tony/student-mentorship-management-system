const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication token is required' });
  }

  try {
    const { userId } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(401).json({ success: false, message: 'User no longer exists' });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token' });
  }
});

module.exports = protect;
