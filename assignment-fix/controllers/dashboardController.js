const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Marks = require('../models/Marks');
const ExamSchedule = require('../models/ExamSchedule');
const Assignment = require('../models/Assignment');

// Render dashboard
exports.getDashboard = async (req, res) => {
  try {
    const studentId = req.session.studentId;

    // Get student with populated subjects
    const student = await Student.findById(studentId).populate('assignedSubjects');

    if (!student) {
      return res.redirect('/login');
    }

    // Get marks for all subjects
    const marks = await Marks.find({ studentId }).populate('subjectId');

    // Create a map of subject marks
    const marksMap = {};
    marks.forEach(mark => {
      if (mark.subjectId) {
        marksMap[mark.subjectId._id.toString()] = mark;
      }
    });

    // Calculate overall statistics
    let totalMarks = 0;
    let subjectCount = 0;
    let totalAttendance = 0;
    let lowAttendanceSubjects = [];

    student.assignedSubjects.forEach(subject => {
      totalAttendance += subject.attendancePercentage;
      
      if (subject.attendancePercentage < 75) {
        lowAttendanceSubjects.push(subject);
      }

      const subjectMarks = marksMap[subject._id.toString()];
      if (subjectMarks) {
        totalMarks += subjectMarks.calculateAverage();
        subjectCount++;
      }
    });

    const averageMarks = subjectCount > 0 ? Math.round(totalMarks / subjectCount) : 0;
    const averageAttendance = student.assignedSubjects.length > 0 
      ? Math.round(totalAttendance / student.assignedSubjects.length) 
      : 0;

    res.render('dashboard', {
      student,
      subjects: student.assignedSubjects,
      marksMap,
      averageMarks,
      averageAttendance,
      lowAttendanceSubjects,
      studentName: req.session.studentName
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).render('error', { 
      error: 'Failed to load dashboard',
      studentName: req.session.studentName
    });
  }
};

// Render attendance page
exports.getAttendance = async (req, res) => {
  try {
    const studentId = req.session.studentId;
    const student = await Student.findById(studentId).populate('assignedSubjects');

    if (!student) {
      return res.redirect('/login');
    }

    res.render('attendance', {
      student,
      subjects: student.assignedSubjects,
      studentName: req.session.studentName
    });
  } catch (error) {
    console.error('Attendance error:', error);
    res.status(500).render('error', { 
      error: 'Failed to load attendance',
      studentName: req.session.studentName
    });
  }
};

// Render marks page
exports.getMarks = async (req, res) => {
  try {
    const studentId = req.session.studentId;
    const marks = await Marks.find({ studentId }).populate('subjectId');

    res.render('marks', {
      marks,
      studentName: req.session.studentName
    });
  } catch (error) {
    console.error('Marks error:', error);
    res.status(500).render('error', { 
      error: 'Failed to load marks',
      studentName: req.session.studentName
    });
  }
};

// Render profile page
exports.getProfile = async (req, res) => {
  try {
    const studentId = req.session.studentId;
    const student = await Student.findById(studentId).populate('assignedSubjects');

    if (!student) {
      return res.redirect('/login');
    }

    // Calculate overall summary
    const marks = await Marks.find({ studentId });
    
    let totalMarks = 0;
    let subjectCount = 0;
    
    marks.forEach(mark => {
      totalMarks += mark.calculateAverage();
      subjectCount++;
    });

    const overallAverage = subjectCount > 0 ? Math.round(totalMarks / subjectCount) : 0;

    let totalAttendance = 0;
    student.assignedSubjects.forEach(subject => {
      totalAttendance += subject.attendancePercentage;
    });

    const averageAttendance = student.assignedSubjects.length > 0 
      ? Math.round(totalAttendance / student.assignedSubjects.length) 
      : 0;

    res.render('profile', {
      student,
      overallAverage,
      averageAttendance,
      studentName: req.session.studentName
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).render('error', { 
      error: 'Failed to load profile',
      studentName: req.session.studentName
    });
  }
};

// NEW: Render exam schedule page
exports.getExamSchedule = async (req, res) => {
  try {
    const studentId = req.session.studentId;
    const student = await Student.findById(studentId).populate('assignedSubjects');

    if (!student) {
      return res.redirect('/login');
    }

    // Get exam schedules for student's subjects
    const subjectIds = student.assignedSubjects.map(s => s._id);
    const examSchedules = await ExamSchedule.find({ 
      subjectId: { $in: subjectIds } 
    }).populate('subjectId');

    // Create a map of schedules by subject ID
    const scheduleMap = {};
    examSchedules.forEach(schedule => {
      scheduleMap[schedule.subjectId._id.toString()] = schedule;
    });

    res.render('exam-schedule', {
      student,
      subjects: student.assignedSubjects,
      scheduleMap,
      studentName: req.session.studentName
    });
  } catch (error) {
    console.error('Exam schedule error:', error);
    res.status(500).render('error', { 
      error: 'Failed to load exam schedule',
      studentName: req.session.studentName
    });
  }
};

// NEW: Render assignments page
exports.getAssignments = async (req, res) => {
  try {
    const studentId = req.session.studentId;
    const student = await Student.findById(studentId).populate('assignedSubjects');

    if (!student) {
      return res.redirect('/login');
    }

    // Get assignments for THIS SPECIFIC STUDENT only
    const assignments = await Assignment.find({ 
      studentId: studentId  // Filter by studentId
    }).populate('subjectId').sort({ dueDate: 1 });

    // Categorize assignments
    const upcomingAssignments = [];
    const overdueAssignments = [];
    const completedAssignments = [];

    assignments.forEach(assignment => {
      if (assignment.status === 'submitted') {
        completedAssignments.push(assignment);
      } else if (assignment.isOverdue()) {
        assignment.status = 'overdue';
        overdueAssignments.push(assignment);
      } else {
        upcomingAssignments.push(assignment);
      }
    });

    res.render('assignments', {
      student,
      upcomingAssignments,
      overdueAssignments,
      completedAssignments,
      studentName: req.session.studentName
    });
  } catch (error) {
    console.error('Assignments error:', error);
    res.status(500).render('error', { 
      error: 'Failed to load assignments',
      studentName: req.session.studentName
    });
  }
};
