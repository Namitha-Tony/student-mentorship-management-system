const Meeting = require('../models/Meeting');
const Student = require('../models/Student');
const Mentor = require('../models/Mentor');
const asyncHandler = require('../utils/asyncHandler');
const relevant = (meeting, user) => (user.role === 'student' ? String(meeting.student.user) === String(user._id) : String(meeting.mentor.user) === String(user._id));
const populated = (query) => query.populate({ path: 'student', populate: { path: 'user', select: 'name email' } }).populate({ path: 'mentor', populate: { path: 'user', select: 'name email' } });
const createMeeting = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id }).populate('mentor');
  if (!student || !student.mentor) return res.status(400).json({ success: false, message: 'You need an assigned mentor first' });
  if (req.body.startTime >= req.body.endTime) return res.status(400).json({ success: false, message: 'End time must be after start time' });
  const meeting = await Meeting.create({ ...req.body, student: student._id, mentor: student.mentor._id, status: 'requested' });
  res.status(201).json({ success: true, message: 'Meeting requested successfully', data: meeting });
});
const listStudentMeetings = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.studentId); if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  if (String(student.user) !== String(req.user._id)) return res.status(403).json({ success: false, message: 'You cannot access these meetings' });
  res.json({ success: true, data: await populated(Meeting.find({ student: student._id }).sort({ date: 1, startTime: 1 })) });
});
const listMentorMeetings = asyncHandler(async (req, res) => {
  const mentor = await Mentor.findById(req.params.mentorId); if (!mentor || String(mentor.user) !== String(req.user._id)) return res.status(403).json({ success: false, message: 'You cannot access these meetings' });
  res.json({ success: true, data: await populated(Meeting.find({ mentor: mentor._id }).sort({ date: 1, startTime: 1 })) });
});
const getMeeting = asyncHandler(async (req, res) => {
  const meeting = await populated(Meeting.findById(req.params.id)); if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });
  if (!relevant(meeting, req.user)) return res.status(403).json({ success: false, message: 'You cannot access this meeting' });
  res.json({ success: true, data: meeting });
});
const updateMeeting = asyncHandler(async (req, res) => {
  const meeting = await populated(Meeting.findById(req.params.id)); if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });
  if (!relevant(meeting, req.user)) return res.status(403).json({ success: false, message: 'You cannot update this meeting' });
  const mentorFields = ['status', 'discussion', 'actionItems'];
  const studentFields = ['date', 'startTime', 'endTime', 'type', 'purpose', 'status'];
  const fields = req.user.role === 'mentor' ? mentorFields : studentFields;
  fields.forEach((field) => { if (req.body[field] !== undefined) meeting[field] = req.body[field]; });
  if (req.user.role === 'student' && !['requested', 'cancelled'].includes(meeting.status)) return res.status(400).json({ success: false, message: 'Students can only cancel requested meetings' });
  await meeting.save(); res.json({ success: true, message: 'Meeting updated successfully', data: meeting });
});
const deleteMeeting = asyncHandler(async (req, res) => {
  const meeting = await populated(Meeting.findById(req.params.id)); if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });
  if (!relevant(meeting, req.user) || meeting.status !== 'requested') return res.status(403).json({ success: false, message: 'Only a related user can delete a requested meeting' });
  await meeting.deleteOne(); res.json({ success: true, message: 'Meeting deleted successfully' });
});
module.exports = { createMeeting, listStudentMeetings, listMentorMeetings, getMeeting, updateMeeting, deleteMeeting };
