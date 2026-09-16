const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
  endTime: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
  type: { type: String, enum: ['academic', 'career', 'personal', 'other'], required: true },
  purpose: { type: String, required: true, trim: true },
  status: { type: String, enum: ['requested', 'approved', 'rejected', 'completed', 'cancelled'], default: 'requested' },
  discussion: { type: String, trim: true, default: '' },
  actionItems: { type: String, trim: true, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);
