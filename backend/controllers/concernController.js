const Concern = require('../models/Concern');
const Student = require('../models/Student');
const Mentor = require('../models/Mentor');
const asyncHandler = require('../utils/asyncHandler');

const isStudentOwner = (student, user) => String(student.user) === String(user._id);
const isMentorOwner = (mentor, user) => String(mentor.user) === String(user._id);
const createConcern = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id }).populate('mentor');
  if (!student || !student.mentor) return res.status(400).json({ success: false, message: 'You need an assigned mentor first' });
  const concern = await Concern.create({ ...req.body, student: student._id, mentor: student.mentor._id });
  res.status(201).json({ success: true, message: 'Concern created successfully', data: concern });
});
const listStudentConcerns = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.studentId);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  if (!isStudentOwner(student, req.user)) return res.status(403).json({ success: false, message: 'You cannot access these concerns' });
  res.json({ success: true, data: await Concern.find({ student: student._id }).sort('-createdAt') });
});
const listMentorConcerns = asyncHandler(async (req, res) => {
  const mentor = await Mentor.findById(req.params.mentorId);
  if (!mentor || !isMentorOwner(mentor, req.user)) return res.status(403).json({ success: false, message: 'You can only access your concerns' });
  res.json({ success: true, data: await Concern.find({ mentor: mentor._id }).populate('student').sort('-createdAt') });
});
const getConcern = asyncHandler(async (req, res) => {
  const concern = await Concern.findById(req.params.id).populate('student').populate('mentor');
  if (!concern) return res.status(404).json({ success: false, message: 'Concern not found' });
  const allowed = req.user.role === 'student' ? isStudentOwner(concern.student, req.user) : isMentorOwner(concern.mentor, req.user);
  if (!allowed) return res.status(403).json({ success: false, message: 'You cannot access this concern' });
  res.json({ success: true, data: concern });
});
const updateConcern = asyncHandler(async (req, res) => {
  const concern = await Concern.findById(req.params.id).populate('student').populate('mentor');
  if (!concern) return res.status(404).json({ success: false, message: 'Concern not found' });
  if (req.user.role === 'student') {
    if (!isStudentOwner(concern.student, req.user)) return res.status(403).json({ success: false, message: 'You cannot update this concern' });
    if (req.body.mentorResponse !== undefined || req.body.status !== undefined) return res.status(403).json({ success: false, message: 'Students cannot update concern status or mentor response' });
    ['title', 'description', 'category'].forEach((field) => { if (req.body[field] !== undefined) concern[field] = req.body[field]; });
  } else {
    if (!isMentorOwner(concern.mentor, req.user)) return res.status(403).json({ success: false, message: 'You cannot update this concern' });
    ['status', 'mentorResponse'].forEach((field) => { if (req.body[field] !== undefined) concern[field] = req.body[field]; });
  }
  await concern.save();
  res.json({ success: true, message: 'Concern updated successfully', data: concern });
});
module.exports = { createConcern, listStudentConcerns, listMentorConcerns, getConcern, updateConcern };
