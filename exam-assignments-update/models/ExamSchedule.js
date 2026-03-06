const mongoose = require('mongoose');

const examScheduleSchema = new mongoose.Schema({
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  quiz1Date: {
    type: Date,
    required: true
  },
  quiz2Date: {
    type: Date,
    required: true
  },
  quiz3Date: {
    type: Date,
    required: true
  },
  midSemDate: {
    type: Date,
    required: true
  },
  quiz4Date: {
    type: Date,
    required: true
  },
  quiz5Date: {
    type: Date,
    required: true
  },
  quiz6Date: {
    type: Date,
    required: true
  },
  endSemDate: {
    type: Date,
    required: true
  },
  academicYear: {
    type: String,
    default: '2024-2025'
  },
  semester: {
    type: String,
    default: 'Spring 2025'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index to ensure one schedule per subject
examScheduleSchema.index({ subjectId: 1 }, { unique: true });

module.exports = mongoose.model('ExamSchedule', examScheduleSchema);
