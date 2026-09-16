const Mentor = require('../models/Mentor');
const Student = require('../models/Student');
const asyncHandler = require('../utils/asyncHandler');

const getMentor = asyncHandler(async (req, res) => {
  const mentor = await Mentor.findById(req.params.id).populate('user', 'name email role');
  if (!mentor) return res.status(404).json({ success: false, message: 'Mentor not found' });
  if (req.user.role === 'mentor' && String(mentor.user._id) !== String(req.user._id)) return res.status(403).json({ success: false, message: 'You cannot access this mentor profile' });
  const assignedStudent = await Student.findOne({ mentor: mentor._id, user: req.user._id });
  if (req.user.role === 'student' && !assignedStudent) return res.status(403).json({ success: false, message: 'You are not assigned to this mentor' });
  res.json({ success: true, data: mentor });
});

const getMentorStudents = asyncHandler(async (req, res) => {
  const mentor = await Mentor.findById(req.params.id);
  if (!mentor) return res.status(404).json({ success: false, message: 'Mentor not found' });
  if (String(mentor.user) !== String(req.user._id)) return res.status(403).json({ success: false, message: 'You can only view your assigned students' });
  const students = await Student.find({ mentor: mentor._id }).populate('user', 'name email');
  res.json({ success: true, data: students });
});

module.exports = { getMentor, getMentorStudents };
