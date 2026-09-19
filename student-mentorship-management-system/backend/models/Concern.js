const mongoose = require('mongoose');

const concernSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, trim: true },
  category: { type: String, trim: true },
  status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
  mentorResponse: { type: String, trim: true, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Concern', concernSchema);
