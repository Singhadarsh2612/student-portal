const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
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
  quiz1: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  quiz2: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  quiz3: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  midSem: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  quiz4: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  quiz5: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  quiz6: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  endSem: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one marks record per student per subject
marksSchema.index({ studentId: 1, subjectId: 1 }, { unique: true });

// Method to calculate average marks
marksSchema.methods.calculateAverage = function() {
  const marks = [
    this.quiz1, this.quiz2, this.quiz3,
    this.midSem,
    this.quiz4, this.quiz5, this.quiz6,
    this.endSem
  ];
  
  const total = marks.reduce((sum, mark) => sum + mark, 0);
  return Math.round(total / marks.length);
};

module.exports = mongoose.model('Marks', marksSchema);
