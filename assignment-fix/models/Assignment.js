const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  assignedDate: {
    type: Date,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  totalMarks: {
    type: Number,
    default: 100,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'submitted', 'overdue'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to check if assignment is overdue
assignmentSchema.methods.isOverdue = function() {
  return new Date() > this.dueDate && this.status !== 'submitted';
};

// Method to get days until due
assignmentSchema.methods.daysUntilDue = function() {
  const today = new Date();
  const due = new Date(this.dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

module.exports = mongoose.model('Assignment', assignmentSchema);
