const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, unique: true },
  academicProgress: { type: Number, min: 0, max: 100, default: 0 },
  attendancePercentage: { type: Number, min: 0, max: 100, default: 0 },
  goalCompletionPercentage: { type: Number, min: 0, max: 100, default: 0 },
  overallProgress: { type: Number, min: 0, max: 100, default: 0 },
  remarks: { type: String, trim: true, default: '' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
