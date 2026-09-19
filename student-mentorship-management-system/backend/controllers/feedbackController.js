const Feedback = require('../models/Feedback');
const Student = require('../models/Student');
const Mentor = require('../models/Mentor');
const Meeting = require('../models/Meeting');
const asyncHandler = require('../utils/asyncHandler');
const createFeedback = asyncHandler(async (req, res) => {
  const mentor = await Mentor.findOne({ user: req.user._id }); const student = await Student.findById(req.body.student).populate('mentor');
  if (!mentor || !student || String(student.mentor?._id) !== String(mentor._id)) return res.status(403).json({ success: false, message: 'You can only provide feedback to your assigned students' });
  if (req.body.meeting) { const meeting = await Meeting.findOne({ _id: req.body.meeting, student: student._id, mentor: mentor._id }); if (!meeting) return res.status(400).json({ success: false, message: 'Meeting is not related to this student' }); }
  const feedback = await Feedback.create({ ...req.body, mentor: mentor._id }); res.status(201).json({ success: true, message: 'Feedback created successfully', data: feedback });
});
const listStudentFeedback = asyncHandler(async (req, res) => { const student = await Student.findById(req.params.studentId); if (!student || String(student.user) !== String(req.user._id)) return res.status(403).json({ success: false, message: 'You cannot access this feedback' }); res.json({ success: true, data: await Feedback.find({ student: student._id }).populate('mentor') }); });
const listMentorFeedback = asyncHandler(async (req, res) => { const mentor = await Mentor.findById(req.params.mentorId); if (!mentor || String(mentor.user) !== String(req.user._id)) return res.status(403).json({ success: false, message: 'You cannot access this feedback' }); res.json({ success: true, data: await Feedback.find({ mentor: mentor._id }).populate('student') }); });
const getFeedback = asyncHandler(async (req, res) => { const feedback = await Feedback.findById(req.params.id).populate('student').populate('mentor'); if (!feedback) return res.status(404).json({ success: false, message: 'Feedback not found' }); const allowed = req.user.role === 'mentor' ? String(feedback.mentor.user) === String(req.user._id) : String(feedback.student.user) === String(req.user._id); if (!allowed) return res.status(403).json({ success: false, message: 'You cannot access this feedback' }); res.json({ success: true, data: feedback }); });
const updateFeedback = asyncHandler(async (req, res) => { const feedback = await Feedback.findById(req.params.id).populate('mentor'); if (!feedback) return res.status(404).json({ success: false, message: 'Feedback not found' }); if (String(feedback.mentor.user) !== String(req.user._id)) return res.status(403).json({ success: false, message: 'Only the feedback author can update it' }); ['rating', 'comments', 'strengths', 'areasForImprovement', 'recommendations'].forEach((field) => { if (req.body[field] !== undefined) feedback[field] = req.body[field]; }); await feedback.save(); res.json({ success: true, message: 'Feedback updated successfully', data: feedback }); });
module.exports = { createFeedback, listStudentFeedback, listMentorFeedback, getFeedback, updateFeedback };
