require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Marks = require('../models/Marks');
const ExamSchedule = require('../models/ExamSchedule');
const Assignment = require('../models/Assignment');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for Seeding');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Generate random number between min and max
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to get random date between start and end dates
const getRandomDate = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime);
};

// Helper function to set exam time based on count for that day
const assignExamTime = (date, countForDay, isSecond = false) => {
  const examDate = new Date(date);
  if (countForDay === 1 || !isSecond) {
    // Single exam or first exam: 10:00 AM - 12:00 PM
    examDate.setHours(10, 0, 0, 0);
  } else {
    // Second exam: 4:00 PM - 6:00 PM
    examDate.setHours(16, 0, 0, 0);
  }
  return examDate;
};

// Helper function to set quiz time based on count for that day
const assignQuizTime = (date, countForDay, isSecond = false) => {
  const quizDate = new Date(date);
  if (countForDay === 1 || !isSecond) {
    // Single quiz or first quiz: 10:00 AM - 10:30 AM
    quizDate.setHours(10, 0, 0, 0);
  } else {
    // Second quiz: 6:00 PM - 6:30 PM
    quizDate.setHours(18, 0, 0, 0);
  }
  return quizDate;
};

// Helper function to distribute dates with max 2 per day
const distributeScheduledDates = (startDate, endDate, count, type = 'exam') => {
  const dates = [];
  const dateMap = new Map();
  
  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let selectedDate;
    
    do {
      const randomDate = getRandomDate(startDate, endDate);
      const dateKey = randomDate.toDateString();
      const countForDay = dateMap.get(dateKey) || 0;
      
      if (countForDay < 2) {
        // Set appropriate time based on count for this day
        const isSecond = countForDay === 1;
        if (type === 'quiz') {
          selectedDate = assignQuizTime(randomDate, countForDay + 1, isSecond);
        } else {
          selectedDate = assignExamTime(randomDate, countForDay + 1, isSecond);
        }
        
        dateMap.set(dateKey, countForDay + 1);
        dates.push(selectedDate);
        break;
      }
      
      attempts++;
    } while (attempts < 100);
    
    if (attempts >= 100) {
      // Fallback: just add a date even if it violates the rule
      const fallbackDate = getRandomDate(startDate, endDate);
      if (type === 'quiz') {
        selectedDate = assignQuizTime(fallbackDate, 1, false);
      } else {
        selectedDate = assignExamTime(fallbackDate, 1, false);
      }
      dates.push(selectedDate);
    }
  }
  
  return dates.sort((a, b) => a - b);
};

// Sample data
const subjectsData = [
  {
    subjectName: 'Data Structures and Algorithms',
    subjectCode: 'CS301',
    professorName: 'Dr. Sarah Johnson',
    professorEmail: 'sarah.johnson@college.edu',
    totalClasses: 45,
    classesAttended: 38
  },
  {
    subjectName: 'Database Management Systems',
    subjectCode: 'CS302',
    professorName: 'Dr. Michael Chen',
    professorEmail: 'michael.chen@college.edu',
    totalClasses: 42,
    classesAttended: 35
  },
  {
    subjectName: 'Operating Systems',
    subjectCode: 'CS303',
    professorName: 'Dr. Emily Rodriguez',
    professorEmail: 'emily.rodriguez@college.edu',
    totalClasses: 40,
    classesAttended: 32
  },
  {
    subjectName: 'Computer Networks',
    subjectCode: 'CS304',
    professorName: 'Dr. James Wilson',
    professorEmail: 'james.wilson@college.edu',
    totalClasses: 38,
    classesAttended: 36
  },
  {
    subjectName: 'Web Development',
    subjectCode: 'CS305',
    professorName: 'Dr. Lisa Anderson',
    professorEmail: 'lisa.anderson@college.edu',
    totalClasses: 44,
    classesAttended: 40
  },
  {
    subjectName: 'Software Engineering',
    subjectCode: 'CS306',
    professorName: 'Dr. Robert Taylor',
    professorEmail: 'robert.taylor@college.edu',
    totalClasses: 41,
    classesAttended: 37
  }
];

const studentsData = [
  {
    name: 'John Doe',
    email: 'john.doe@college.edu',
    password: 'password123'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@college.edu',
    password: 'password123'
  },
  {
    name: 'Alex Johnson',
    email: 'alex.johnson@college.edu',
    password: 'password123'
  },
  {
    name: 'Emily Brown',
    email: 'emily.brown@college.edu',
    password: 'password123'
  },
  {
    name: 'Michael Davis',
    email: 'michael.davis@college.edu',
    password: 'password123'
  }
];

// HARDCODED 8 assignments - same for all students
// Deadlines set to 11:59 PM
const hardcodedAssignments = [
  {
    title: 'Binary Search Tree Implementation',
    description: 'Implement BST with insert, delete, and search operations in C++',
    assignedDate: new Date(2026, 2, 1, 0, 0, 0), // March 1, 2026 12:00 AM
    dueDate: new Date(2026, 2, 15, 23, 59, 0), // March 15, 2026 11:59 PM
    totalMarks: 100,
    status: 'submitted', // COMPLETED 1
    priority: 'high'
  },
  {
    title: 'Database Normalization Project',
    description: 'Normalize a given database schema up to 3NF and create ER diagram',
    assignedDate: new Date(2026, 2, 3, 0, 0, 0), // March 3, 2026 12:00 AM
    dueDate: new Date(2026, 2, 16, 23, 59, 0), // March 16, 2026 11:59 PM
    totalMarks: 75,
    status: 'submitted', // COMPLETED 2
    priority: 'medium'
  },
  {
    title: 'Process Scheduling Algorithms',
    description: 'Compare FCFS, SJF, and Round Robin scheduling algorithms',
    assignedDate: new Date(2026, 2, 5, 0, 0, 0), // March 5, 2026 12:00 AM
    dueDate: new Date(2026, 2, 15, 23, 59, 0), // March 15, 2026 11:59 PM - UPCOMING
    totalMarks: 50,
    status: 'pending',
    priority: 'high'
  },
  {
    title: 'Socket Programming',
    description: 'Create a client-server chat application using TCP sockets',
    assignedDate: new Date(2026, 2, 7, 0, 0, 0), // March 7, 2026 12:00 AM
    dueDate: new Date(2026, 2, 16, 23, 59, 0), // March 16, 2026 11:59 PM - UPCOMING
    totalMarks: 100,
    status: 'pending',
    priority: 'high'
  },
  {
    title: 'REST API Development',
    description: 'Build a RESTful API for a todo application using Express.js',
    assignedDate: new Date(2026, 2, 8, 0, 0, 0), // March 8, 2026 12:00 AM
    dueDate: new Date(2026, 2, 16, 23, 59, 0), // March 16, 2026 11:59 PM - UPCOMING
    totalMarks: 150,
    status: 'pending',
    priority: 'high'
  },
  {
    title: 'Unit Testing Project',
    description: 'Write comprehensive unit tests using Jest for a given module',
    assignedDate: new Date(2026, 2, 9, 0, 0, 0), // March 9, 2026 12:00 AM
    dueDate: new Date(2026, 2, 17, 23, 59, 0), // March 17, 2026 11:59 PM - UPCOMING
    totalMarks: 50,
    status: 'pending',
    priority: 'medium'
  },
  {
    title: 'SQL Query Optimization',
    description: 'Optimize slow queries and implement proper indexing strategies',
    assignedDate: new Date(2026, 2, 10, 0, 0, 0), // March 10, 2026 12:00 AM
    dueDate: new Date(2026, 2, 17, 23, 59, 0), // March 17, 2026 11:59 PM - UPCOMING
    totalMarks: 75,
    status: 'pending',
    priority: 'medium'
  },
  {
    title: 'Frontend Development Challenge',
    description: 'Create a responsive portfolio website using React and Tailwind CSS',
    assignedDate: new Date(2026, 2, 11, 0, 0, 0), // March 11, 2026 12:00 AM
    dueDate: new Date(2026, 2, 17, 23, 59, 0), // March 17, 2026 11:59 PM - UPCOMING
    totalMarks: 100,
    status: 'pending',
    priority: 'high'
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Student.deleteMany({});
    await Subject.deleteMany({});
    await Marks.deleteMany({});
    await ExamSchedule.deleteMany({});
    await Assignment.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create subjects
    console.log('📚 Creating subjects...');
    const subjects = await Subject.insertMany(subjectsData);
    console.log(`✅ Created ${subjects.length} subjects`);

    // Create exam schedules for all subjects with new scheduling rules
    console.log('📅 Creating exam schedules with time slots...');
    
    // Define date windows
    const quiz123Start = new Date(2026, 2, 11); // March 11, 2026
    const quiz123End = new Date(2026, 2, 20);   // March 20, 2026
    const midSemStart = new Date(2026, 2, 28);  // March 28, 2026
    const midSemEnd = new Date(2026, 2, 31);    // March 31, 2026
    const quiz456Start = new Date(2026, 3, 11); // April 11, 2026
    const quiz456End = new Date(2026, 3, 20);   // April 20, 2026
    const endSemStart = new Date(2026, 3, 25);  // April 25, 2026
    const endSemEnd = new Date(2026, 3, 30);    // April 30, 2026
    
    // Distribute quiz dates (3 quizzes each period)
    const quiz123Dates = distributeScheduledDates(quiz123Start, quiz123End, subjects.length, 'quiz');
    const quiz456Dates = distributeScheduledDates(quiz456Start, quiz456End, subjects.length, 'quiz');
    
    // Distribute exam dates (midsem and endsem)
    const midSemDates = distributeScheduledDates(midSemStart, midSemEnd, subjects.length, 'exam');
    const endSemDates = distributeScheduledDates(endSemStart, endSemEnd, subjects.length, 'exam');
    
    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i];
      
      // Get individual quiz dates for this subject (distribute across the 3-quiz dates)
      const quiz1Date = quiz123Dates[i % quiz123Dates.length];
      const quiz2Date = quiz123Dates[(i + 1) % quiz123Dates.length];
      const quiz3Date = quiz123Dates[(i + 2) % quiz123Dates.length];
      
      const quiz4Date = quiz456Dates[i % quiz456Dates.length];
      const quiz5Date = quiz456Dates[(i + 1) % quiz456Dates.length];
      const quiz6Date = quiz456Dates[(i + 2) % quiz456Dates.length];
      
      const examSchedule = new ExamSchedule({
        subjectId: subject._id,
        quiz1Date: quiz1Date,
        quiz2Date: quiz2Date,
        quiz3Date: quiz3Date,
        midSemDate: midSemDates[i],
        quiz4Date: quiz4Date,
        quiz5Date: quiz5Date,
        quiz6Date: quiz6Date,
        endSemDate: endSemDates[i],
        academicYear: '2025-2026',
        semester: 'Spring 2026'
      });
      
      await examSchedule.save();
    }
    console.log(`✅ Created ${subjects.length} exam schedules with proper time slots`);

    // Create students
    console.log('👥 Creating students...');
    const createdStudents = [];
    
    for (const studentData of studentsData) {
      const student = new Student(studentData);
      
      // Assign random 4-6 subjects to each student
      const numSubjects = randomNumber(4, 6);
      const shuffledSubjects = subjects.sort(() => 0.5 - Math.random());
      student.assignedSubjects = shuffledSubjects.slice(0, numSubjects).map(s => s._id);
      
      await student.save();
      createdStudents.push(student);
    }
    console.log(`✅ Created ${createdStudents.length} students`);

    // Create HARDCODED 8 assignments for ALL students
    console.log('📝 Creating assignments (8 hardcoded for all students, deadlines at 11:59 PM)...');
    let assignmentCount = 0;
    
    for (const student of createdStudents) {
      // For each student, create all 8 assignments
      // Use student's FIRST subject for all assignments (simpler)
      const firstSubjectId = student.assignedSubjects[0];
      
      for (let i = 0; i < hardcodedAssignments.length; i++) {
        const template = hardcodedAssignments[i];
        
        const assignment = new Assignment({
          studentId: student._id, // IMPORTANT: Link to specific student
          subjectId: firstSubjectId,
          title: template.title,
          description: template.description,
          assignedDate: template.assignedDate,
          dueDate: template.dueDate, // Set to 11:59 PM
          totalMarks: template.totalMarks,
          status: template.status,
          priority: template.priority
        });
        
        await assignment.save();
        assignmentCount++;
      }
    }
    console.log(`✅ Created ${assignmentCount} assignments (${hardcodedAssignments.length} per student)`);

    // Create marks for each student-subject combination
    console.log('📊 Creating marks records...');
    let marksCount = 0;
    
    for (const student of createdStudents) {
      for (const subjectId of student.assignedSubjects) {
        // Generate realistic marks
        const basePerformance = randomNumber(50, 95); // Base performance level
        
        const marks = new Marks({
          studentId: student._id,
          subjectId: subjectId,
          quiz1: Math.min(100, basePerformance + randomNumber(-10, 10)),
          quiz2: Math.min(100, basePerformance + randomNumber(-10, 10)),
          quiz3: Math.min(100, basePerformance + randomNumber(-10, 10)),
          midSem: Math.min(100, basePerformance + randomNumber(-5, 15)),
          quiz4: Math.min(100, basePerformance + randomNumber(-10, 10)),
          quiz5: Math.min(100, basePerformance + randomNumber(-10, 10)),
          quiz6: Math.min(100, basePerformance + randomNumber(-10, 10)),
          endSem: Math.min(100, basePerformance + randomNumber(-5, 15))
        });
        
        await marks.save();
        marksCount++;
      }
    }
    console.log(`✅ Created ${marksCount} marks records`);

    // Update attendance for subjects with varied percentages
    console.log('📅 Updating attendance records...');
    for (const subject of subjects) {
      subject.classesAttended = randomNumber(
        Math.floor(subject.totalClasses * 0.6), 
        subject.totalClasses
      );
      await subject.save();
    }
    console.log('✅ Attendance records updated');

    console.log('\n🎉 Database seeding completed successfully!\n');
    
    // Print sample login credentials
    console.log('📝 Sample Login Credentials:');
    console.log('═══════════════════════════════════════');
    studentsData.forEach(student => {
      console.log(`Email: ${student.email}`);
      console.log(`Password: ${student.password}`);
      console.log('───────────────────────────────────────');
    });
    
    console.log('\n💡 You can now login with any of the above credentials');
    console.log('🚀 Start the server with: npm start');
    console.log('\n📋 Summary:');
    console.log(`   - ${subjects.length} subjects`);
    console.log(`   - ${createdStudents.length} students`);
    console.log(`   - ${marksCount} marks records`);
    console.log(`   - ${subjects.length} exam schedules`);
    console.log(`   - ${assignmentCount} assignments (8 per student, 2 completed + 6 upcoming)`);
    console.log('\n📅 Scheduling Details:');
    console.log('   - Quizzes 1-3: March 11-20, 2026');
    console.log('   - Quizzes 4-6: April 11-20, 2026');
    console.log('   - Mid-semester: March 28-31, 2026');
    console.log('   - End-semester: April 25-30, 2026');
    console.log('   - Quiz times: 10:00-10:30 AM (1st) / 6:00-6:30 PM (2nd)');
    console.log('   - Exam times: 10:00 AM-12:00 PM (1st) / 4:00-6:00 PM (2nd)');
    console.log('   - Assignment deadlines: 11:59 PM\n');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
  }
};

// Run seeder
connectDB().then(() => {
  seedDatabase();
});