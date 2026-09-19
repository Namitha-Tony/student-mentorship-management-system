const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  studentId: { type: String, required: true, unique: true, trim: true },
  department: { type: String, trim: true },
  semester: { type: Number, min: 1, max: 12 },
  phone: { type: String, trim: true },
  dateOfBirth: Date,
  academicYear: { type: String, trim: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
