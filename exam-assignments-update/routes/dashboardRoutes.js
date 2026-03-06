const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { isAuthenticated } = require('../middleware/auth');

// All dashboard routes require authentication
router.use(isAuthenticated);

// Dashboard routes
router.get('/dashboard', dashboardController.getDashboard);
router.get('/attendance', dashboardController.getAttendance);
router.get('/marks', dashboardController.getMarks);
router.get('/profile', dashboardController.getProfile);

// NEW: Exam schedule and assignments routes
router.get('/exam-schedule', dashboardController.getExamSchedule);
router.get('/assignments', dashboardController.getAssignments);

module.exports = router;
