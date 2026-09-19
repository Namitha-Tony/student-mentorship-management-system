const Goal = require('../models/Goal');
const Student = require('../models/Student');
const asyncHandler = require('../utils/asyncHandler');

const ownsOrMentors = (student, user) => String(student.user) === String(user._id) || (user.role === 'mentor' && String(student.mentor?.user) === String(user._id));
const getStudent = (id) => Student.findById(id).populate('mentor');

const createGoal = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });
  if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
  const goal = await Goal.create({ ...req.body, student: student._id });
  res.status(201).json({ success: true, message: 'Goal created successfully', data: goal });
});
const listStudentGoals = asyncHandler(async (req, res) => {
  const student = await getStudent(req.params.studentId);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  if (!ownsOrMentors(student, req.user)) return res.status(403).json({ success: false, message: 'You cannot access these goals' });
  res.json({ success: true, data: await Goal.find({ student: student._id }).sort({ deadline: 1 }) });
});
const getGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id).populate({ path: 'student', populate: ['user', 'mentor'] });
  if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
  if (!ownsOrMentors(goal.student, req.user)) return res.status(403).json({ success: false, message: 'You cannot access this goal' });
  res.json({ success: true, data: goal });
});
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id).populate({ path: 'student', populate: ['user', 'mentor'] });
  if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
  if (String(goal.student.user._id) !== String(req.user._id)) return res.status(403).json({ success: false, message: 'Only the goal owner can update it' });
  Object.assign(goal, req.body);
  await goal.save();
  res.json({ success: true, message: 'Goal updated successfully', data: goal });
});
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id).populate('student');
  if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
  if (String(goal.student.user) !== String(req.user._id)) return res.status(403).json({ success: false, message: 'Only the goal owner can delete it' });
  await goal.deleteOne();
  res.json({ success: true, message: 'Goal deleted successfully' });
});
module.exports = { createGoal, listStudentGoals, getGoal, updateGoal, deleteGoal };
