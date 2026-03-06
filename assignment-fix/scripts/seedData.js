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

// Helper function to get random date in February (last 2 weeks)
const getFebruaryDate = (year = 2026) => {
  const day = randomNumber(15, 28); // Last 2 weeks of February
  return new Date(year, 1, day); // Month is 0-indexed, so 1 = February
};

// Helper function to get random date in April (last 3 weeks)
const getAprilDate = (year = 2026) => {
  const day = randomNumber(10, 30); // Last 3 weeks of April
  return new Date(year, 3, day); // Month is 0-indexed, so 3 = April
};

// Helper to ensure max 2 exams per day
const distributeExamDates = (month, count) => {
  const dates = [];
  const dateMap = new Map();
  
  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let date;
    
    do {
      date = month === 'feb' ? getFebruaryDate() : getAprilDate();
      const dateKey = date.toDateString();
      const examsOnDate = dateMap.get(dateKey) || 0;
      
      if (examsOnDate < 2) {
        dateMap.set(dateKey, examsOnDate + 1);
        dates.push(date);
        break;
      }
      
      attempts++;
    } while (attempts < 50);
    
    if (attempts >= 50) {
      dates.push(date); // Fallback if we can't find a suitable date
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
const hardcodedAssignments = [
  {
    title: 'Binary Search Tree Implementation',
    description: 'Implement BST with insert, delete, and search operations in C++',
    assignedDate: new Date(2026, 2, 1), // March 1, 2026
    dueDate: new Date(2026, 2, 15), // March 15, 2026
    totalMarks: 100,
    status: 'submitted', // COMPLETED 1
    priority: 'high'
  },
  {
    title: 'Database Normalization Project',
    description: 'Normalize a given database schema up to 3NF and create ER diagram',
    assignedDate: new Date(2026, 2, 3), // March 3, 2026
    dueDate: new Date(2026, 2, 16), // March 16, 2026
    totalMarks: 75,
    status: 'submitted', // COMPLETED 2
    priority: 'medium'
  },
  {
    title: 'Process Scheduling Algorithms',
    description: 'Compare FCFS, SJF, and Round Robin scheduling algorithms',
    assignedDate: new Date(2026, 2, 5), // March 5, 2026
    dueDate: new Date(2026, 2, 15), // March 15, 2026 - UPCOMING
    totalMarks: 50,
    status: 'pending',
    priority: 'high'
  },
  {
    title: 'Socket Programming',
    description: 'Create a client-server chat application using TCP sockets',
    assignedDate: new Date(2026, 2, 7), // March 7, 2026
    dueDate: new Date(2026, 2, 16), // March 16, 2026 - UPCOMING
    totalMarks: 100,
    status: 'pending',
    priority: 'high'
  },
  {
    title: 'REST API Development',
    description: 'Build a RESTful API for a todo application using Express.js',
    assignedDate: new Date(2026, 2, 8), // March 8, 2026
    dueDate: new Date(2026, 2, 16), // March 16, 2026 - UPCOMING
    totalMarks: 150,
    status: 'pending',
    priority: 'high'
  },
  {
    title: 'Unit Testing Project',
    description: 'Write comprehensive unit tests using Jest for a given module',
    assignedDate: new Date(2026, 2, 9), // March 9, 2026
    dueDate: new Date(2026, 2, 17), // March 17, 2026 - UPCOMING
    totalMarks: 50,
    status: 'pending',
    priority: 'medium'
  },
  {
    title: 'SQL Query Optimization',
    description: 'Optimize slow queries and implement proper indexing strategies',
    assignedDate: new Date(2026, 2, 10), // March 10, 2026
    dueDate: new Date(2026, 2, 17), // March 17, 2026 - UPCOMING
    totalMarks: 75,
    status: 'pending',
    priority: 'medium'
  },
  {
    title: 'Frontend Development Challenge',
    description: 'Create a responsive portfolio website using React and Tailwind CSS',
    assignedDate: new Date(2026, 2, 11), // March 11, 2026
    dueDate: new Date(2026, 2, 17), // March 17, 2026 - UPCOMING
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

    // Create exam schedules for all subjects
    console.log('📅 Creating exam schedules...');
    for (const subject of subjects) {
      // Distribute February exams (Quiz 1-3, Mid Sem)
      const febDates = distributeExamDates('feb', 4);
      
      // Distribute April exams (Quiz 4-6, End Sem)
      const aprilDates = distributeExamDates('apr', 4);
      
      const examSchedule = new ExamSchedule({
        subjectId: subject._id,
        quiz1Date: febDates[0],
        quiz2Date: febDates[1],
        quiz3Date: febDates[2],
        midSemDate: febDates[3], // Mid sem after all quizzes
        quiz4Date: aprilDates[0],
        quiz5Date: aprilDates[1],
        quiz6Date: aprilDates[2],
        endSemDate: aprilDates[3], // End sem after all quizzes
        academicYear: '2025-2026',
        semester: 'Spring 2026'
      });
      
      await examSchedule.save();
    }
    console.log(`✅ Created ${subjects.length} exam schedules`);

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
    console.log('📝 Creating assignments (8 hardcoded for all students)...');
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
          dueDate: template.dueDate,
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
    console.log(`   - ${subjects.length} exam schedules (dates in Feb-April 2026)`);
    console.log(`   - ${assignmentCount} assignments (8 per student, 2 completed + 6 upcoming)`);
    console.log(`   - Assignment deadlines: March 15-17, 2026\n`);

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
