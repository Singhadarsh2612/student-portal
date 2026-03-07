const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Marks = require('../models/Marks');
const ExamSchedule = require('../models/ExamSchedule');
const Assignment = require('../models/Assignment');

// Helper function to calculate end time for quizzes (30 minutes)
const getQuizEndTime = (startDate) => {
  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + 30);
  return endDate;
};

// Helper function to calculate end time for exams (2 hours)
const getExamEndTime = (startDate) => {
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 2);
  return endDate;
};

// Get student information
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch student data' 
    });
  }
};

// Get student subjects
exports.getStudentSubjects = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('assignedSubjects');
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    res.json({
      success: true,
      data: {
        studentId: student._id,
        studentName: student.name,
        subjects: student.assignedSubjects
      }
    });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch subjects' 
    });
  }
};

// Get student marks
exports.getStudentMarks = async (req, res) => {
  try {
    const marks = await Marks.find({ studentId: req.params.id }).populate('subjectId');
    
    const marksWithAverage = marks.map(mark => ({
      ...mark.toObject(),
      average: mark.calculateAverage()
    }));

    res.json({
      success: true,
      data: marksWithAverage
    });
  } catch (error) {
    console.error('Get marks error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch marks' 
    });
  }
};

// Get student attendance
exports.getStudentAttendance = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('assignedSubjects');
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    const attendanceData = student.assignedSubjects.map(subject => ({
      subjectId: subject._id,
      subjectName: subject.subjectName,
      subjectCode: subject.subjectCode,
      attendancePercentage: subject.attendancePercentage,
      classesAttended: subject.classesAttended,
      totalClasses: subject.totalClasses,
      isLowAttendance: subject.attendancePercentage < 75
    }));

    res.json({
      success: true,
      data: attendanceData
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch attendance' 
    });
  }
};

// Get student performance summary
exports.getPerformanceSummary = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId).populate('assignedSubjects');
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    const marks = await Marks.find({ studentId }).populate('subjectId');

    // Calculate subject-wise performance
    const subjectPerformance = marks.map(mark => ({
      subjectName: mark.subjectId.subjectName,
      subjectCode: mark.subjectId.subjectCode,
      averageMarks: mark.calculateAverage(),
      quiz1: mark.quiz1,
      quiz2: mark.quiz2,
      quiz3: mark.quiz3,
      midSem: mark.midSem,
      quiz4: mark.quiz4,
      quiz5: mark.quiz5,
      quiz6: mark.quiz6,
      endSem: mark.endSem,
      professorName: mark.subjectId.professorName,
      professorEmail: mark.subjectId.professorEmail
    }));

    // Calculate overall statistics
    let totalMarks = 0;
    marks.forEach(mark => {
      totalMarks += mark.calculateAverage();
    });
    const overallAverage = marks.length > 0 ? Math.round(totalMarks / marks.length) : 0;

    let totalAttendance = 0;
    student.assignedSubjects.forEach(subject => {
      totalAttendance += subject.attendancePercentage;
    });
    const averageAttendance = student.assignedSubjects.length > 0 
      ? Math.round(totalAttendance / student.assignedSubjects.length) 
      : 0;

    // Find subjects needing attention
    const lowPerformanceSubjects = subjectPerformance.filter(s => s.averageMarks < 60);
    const lowAttendanceSubjects = student.assignedSubjects
      .filter(s => s.attendancePercentage < 75)
      .map(s => ({
        subjectName: s.subjectName,
        attendancePercentage: s.attendancePercentage,
        professorEmail: s.professorEmail
      }));

    res.json({
      success: true,
      data: {
        studentInfo: {
          id: student._id,
          name: student.name,
          email: student.email
        },
        overallStatistics: {
          averageMarks: overallAverage,
          averageAttendance: averageAttendance,
          totalSubjects: student.assignedSubjects.length
        },
        subjectPerformance,
        needsAttention: {
          lowPerformanceSubjects,
          lowAttendanceSubjects
        },
        recommendations: generateRecommendations(overallAverage, averageAttendance, lowPerformanceSubjects, lowAttendanceSubjects)
      }
    });
  } catch (error) {
    console.error('Get performance summary error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch performance summary' 
    });
  }
};

// NEW: Get student exam schedule
exports.getStudentExamSchedule = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('assignedSubjects');
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    // Get exam schedules for student's subjects
    const subjectIds = student.assignedSubjects.map(s => s._id);
    const examSchedules = await ExamSchedule.find({ 
      subjectId: { $in: subjectIds } 
    }).populate('subjectId');

    const scheduleData = examSchedules.map(schedule => ({
      subject: {
        id: schedule.subjectId._id,
        name: schedule.subjectId.subjectName,
        code: schedule.subjectId.subjectCode,
        professor: schedule.subjectId.professorName,
        professorEmail: schedule.subjectId.professorEmail
      },
      exams: {
        quiz1: {
          startTime: schedule.quiz1Date,
          endTime: getQuizEndTime(schedule.quiz1Date),
          duration: '30 minutes'
        },
        quiz2: {
          startTime: schedule.quiz2Date,
          endTime: getQuizEndTime(schedule.quiz2Date),
          duration: '30 minutes'
        },
        quiz3: {
          startTime: schedule.quiz3Date,
          endTime: getQuizEndTime(schedule.quiz3Date),
          duration: '30 minutes'
        },
        midSem: {
          startTime: schedule.midSemDate,
          endTime: getExamEndTime(schedule.midSemDate),
          duration: '2 hours'
        },
        quiz4: {
          startTime: schedule.quiz4Date,
          endTime: getQuizEndTime(schedule.quiz4Date),
          duration: '30 minutes'
        },
        quiz5: {
          startTime: schedule.quiz5Date,
          endTime: getQuizEndTime(schedule.quiz5Date),
          duration: '30 minutes'
        },
        quiz6: {
          startTime: schedule.quiz6Date,
          endTime: getQuizEndTime(schedule.quiz6Date),
          duration: '30 minutes'
        },
        endSem: {
          startTime: schedule.endSemDate,
          endTime: getExamEndTime(schedule.endSemDate),
          duration: '2 hours'
        }
      },
      academicYear: schedule.academicYear,
      semester: schedule.semester
    }));

    res.json({
      success: true,
      data: {
        studentId: student._id,
        studentName: student.name,
        totalSubjects: student.assignedSubjects.length,
        examSchedules: scheduleData
      }
    });
  } catch (error) {
    console.error('Get exam schedule error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch exam schedule' 
    });
  }
};

// NEW: Get student assignments
exports.getStudentAssignments = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('assignedSubjects');
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    // Get assignments for THIS SPECIFIC STUDENT only
    const assignments = await Assignment.find({ 
      studentId: req.params.id  // Filter by studentId
    }).populate('subjectId').sort({ dueDate: 1 });

    // Categorize and format assignments
    const upcoming = [];
    const overdue = [];
    const completed = [];

    assignments.forEach(assignment => {
      const assignmentData = {
        id: assignment._id,
        title: assignment.title,
        description: assignment.description,
        subject: {
          id: assignment.subjectId._id,
          name: assignment.subjectId.subjectName,
          code: assignment.subjectId.subjectCode
        },
        assignedDate: assignment.assignedDate,
        dueDate: assignment.dueDate,
        totalMarks: assignment.totalMarks,
        status: assignment.status,
        priority: assignment.priority,
        daysUntilDue: assignment.daysUntilDue(),
        isOverdue: assignment.isOverdue()
      };

      if (assignment.status === 'submitted') {
        completed.push(assignmentData);
      } else if (assignment.isOverdue()) {
        overdue.push(assignmentData);
      } else {
        upcoming.push(assignmentData);
      }
    });

    res.json({
      success: true,
      data: {
        studentId: student._id,
        studentName: student.name,
        summary: {
          totalAssignments: assignments.length,
          upcoming: upcoming.length,
          overdue: overdue.length,
          completed: completed.length
        },
        assignments: {
          upcoming,
          overdue,
          completed
        }
      }
    });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch assignments' 
    });
  }
};

// Helper function to generate recommendations
function generateRecommendations(avgMarks, avgAttendance, lowPerformance, lowAttendance) {
  const recommendations = [];

  if (avgAttendance < 75) {
    recommendations.push({
      type: 'attendance',
      priority: 'high',
      message: 'Your overall attendance is below 75%. This may affect your academic eligibility.',
      action: 'Contact professors for low attendance subjects'
    });
  }

  if (avgMarks < 60) {
    recommendations.push({
      type: 'academics',
      priority: 'high',
      message: 'Your overall performance is below average. Consider seeking academic support.',
      action: 'Schedule study sessions or tutoring'
    });
  }

  if (lowPerformance.length > 0) {
    recommendations.push({
      type: 'subject_specific',
      priority: 'medium',
      message: `You need improvement in ${lowPerformance.length} subject(s).`,
      action: 'Focus on weak subjects: ' + lowPerformance.map(s => s.subjectName).join(', ')
    });
  }

  if (lowAttendance.length > 0) {
    recommendations.push({
      type: 'attendance_specific',
      priority: 'medium',
      message: `Low attendance in ${lowAttendance.length} subject(s).`,
      action: 'Improve attendance in: ' + lowAttendance.map(s => s.subjectName).join(', ')
    });
  }

  if (avgMarks >= 80 && avgAttendance >= 90) {
    recommendations.push({
      type: 'positive',
      priority: 'low',
      message: 'Excellent performance! Keep up the great work!',
      action: 'Maintain current study habits'
    });
  }

  return recommendations;
}