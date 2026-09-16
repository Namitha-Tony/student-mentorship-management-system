const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, trim: true },
  category: { type: String, trim: true },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  progressPercentage: { type: Number, min: 0, max: 100, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
