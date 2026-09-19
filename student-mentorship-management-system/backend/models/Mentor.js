const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  employeeId: { type: String, required: true, unique: true, trim: true },
  department: { type: String, trim: true },
  designation: { type: String, trim: true },
  specialization: { type: String, trim: true },
  phone: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Mentor', mentorSchema);
