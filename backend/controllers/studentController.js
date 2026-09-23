const Student = require('../models/Student');
const Mentor = require('../models/Mentor');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const findStudentForUser = (userId) => Student.findOne({ user: userId });
const canAccessStudent = (student, user) => user.role === 'mentor'
  ? String(student.mentor?.user?._id || student.mentor?.user) === String(user._id)
  : String(student.user) === String(user._id);

const getStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id).populate('user', 'name email role').populate({ path: 'mentor', populate: { path: 'user', select: 'name email' } });
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  if (!canAccessStudent(student, req.user)) return res.status(403).json({ success: false, message: 'You cannot access this student profile' });
  res.json({ success: true, data: student });
});

const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  if (String(student.user) !== String(req.user._id)) return res.status(403).json({ success: false, message: 'You can only update your own profile' });
  const allowedFields = ['studentId', 'department', 'semester', 'phone', 'dateOfBirth', 'academicYear'];
  allowedFields.forEach((field) => { if (req.body[field] !== undefined) student[field] = req.body[field]; });
  await student.save();
  res.json({ success: true, message: 'Student profile updated successfully', data: student });
});

const getStudentMentor = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id).populate({ path: 'mentor', populate: { path: 'user', select: 'name email' } });
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  if (!canAccessStudent(student, req.user)) return res.status(403).json({ success: false, message: 'You cannot access this student profile' });
  res.json({ success: true, data: student.mentor });
});

const assignMentor = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.studentId);
  const mentor = await Mentor.findById(req.body.mentorId).populate('user', 'role');
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  if (!mentor || mentor.user.role !== 'mentor') return res.status(404).json({ success: false, message: 'Mentor not found' });
  if (req.user.role === 'mentor' && String(mentor.user._id) !== String(req.user._id)) return res.status(403).json({ success: false, message: 'A mentor can only assign themselves' });
  student.mentor = mentor._id;
  await student.save();
  res.json({ success: true, message: 'Mentor assignment updated successfully', data: await student.populate('mentor') });
});
const getMyStudent = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id })
    .populate('user', 'name email role')
    .populate({
      path: 'mentor',
      populate: {
        path: 'user',
        select: 'name email'
      }
    });

  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Student profile not found'
    });
  }

  res.json({
    success: true,
    data: student
  });
});
const ensureStudentProfile = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'student') return next();
  const student = await findStudentForUser(req.user._id);
  if (student) req.studentProfile = student;
  next();
});

module.exports = {
  getStudent,
  getMyStudent,
  updateStudent,
  getStudentMentor,
  assignMentor,
  findStudentForUser,
  ensureStudentProfile
};