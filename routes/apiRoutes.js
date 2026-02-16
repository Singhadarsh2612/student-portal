const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// API routes for AI agent integration
router.get('/student/:id', apiController.getStudent);
router.get('/student/:id/subjects', apiController.getStudentSubjects);
router.get('/student/:id/marks', apiController.getStudentMarks);
router.get('/student/:id/attendance', apiController.getStudentAttendance);
router.get('/student/:id/performance-summary', apiController.getPerformanceSummary);

module.exports = router;
