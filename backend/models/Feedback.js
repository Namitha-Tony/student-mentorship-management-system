const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
  meeting: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting', default: null },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comments: { type: String, trim: true },
  strengths: { type: String, trim: true },
  areasForImprovement: { type: String, trim: true },
  recommendations: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
