const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  subjectCode: {
    type: String,
    required: [true, 'Subject code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  professorName: {
    type: String,
    required: [true, 'Professor name is required'],
    trim: true
  },
  professorEmail: {
    type: String,
    required: [true, 'Professor email is required'],
    lowercase: true,
    trim: true
  },
  attendancePercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalClasses: {
    type: Number,
    default: 0,
    min: 0
  },
  classesAttended: {
    type: Number,
    default: 0,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate attendance percentage before saving
subjectSchema.pre('save', function(next) {
  if (this.totalClasses > 0) {
    this.attendancePercentage = Math.round((this.classesAttended / this.totalClasses) * 100);
  } else {
    this.attendancePercentage = 0;
  }
  next();
});

module.exports = mongoose.model('Subject', subjectSchema);
