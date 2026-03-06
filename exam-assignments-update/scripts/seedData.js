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
const getFebruaryDate = (year = 2025) => {
  const day = randomNumber(15, 28); // Last 2 weeks of February
  return new Date(year, 1, day); // Month is 0-indexed, so 1 = February
};

// Helper function to get random date in April (last 3 weeks)
const getAprilDate = (year = 2025) => {
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

// Assignment templates
const assignmentTemplates = [
  {
    title: 'Data Structure Implementation',
    description: 'Implement Binary Search Tree with insert, delete, and search operations',
    priority: 'high',
    totalMarks: 100
  },
  {
    title: 'Database Design Project',
    description: 'Design and implement a relational database for a library management system',
    priority: 'high',
    totalMarks: 100
  },
  {
    title: 'Process Scheduling Simulation',
    description: 'Create a simulation of various CPU scheduling algorithms',
    priority: 'medium',
    totalMarks: 75
  },
  {
    title: 'Network Protocol Analysis',
    description: 'Analyze TCP/IP protocol using Wireshark and write a detailed report',
    priority: 'medium',
    totalMarks: 50
  },
  {
    title: 'Full Stack Web Application',
    description: 'Build a CRUD application using Node.js, Express, and MongoDB',
    priority: 'high',
    totalMarks: 150
  },
  {
    title: 'Software Testing Case Study',
    description: 'Write test cases and perform unit testing for a given software module',
    priority: 'low',
    totalMarks: 50
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
        academicYear: '2024-2025',
        semester: 'Spring 2025'
      });
      
      await examSchedule.save();
    }
    console.log(`✅ Created ${subjects.length} exam schedules`);

    // Create assignments for all subjects
    console.log('📝 Creating assignments...');
    let assignmentCount = 0;
    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i];
      const template = assignmentTemplates[i];
      
      // Create 2-3 assignments per subject
      const numAssignments = randomNumber(2, 3);
      
      for (let j = 0; j < numAssignments; j++) {
        const assignedDate = new Date(2025, randomNumber(0, 2), randomNumber(1, 28)); // Jan-Mar
        const daysToComplete = randomNumber(7, 21);
        const dueDate = new Date(assignedDate);
        dueDate.setDate(dueDate.getDate() + daysToComplete);
        
        // Randomly mark some as submitted
        const isSubmitted = Math.random() > 0.5;
        
        const assignment = new Assignment({
          subjectId: subject._id,
          title: `${template.title} ${j + 1}`,
          description: template.description,
          assignedDate,
          dueDate,
          totalMarks: template.totalMarks,
          status: isSubmitted ? 'submitted' : 'pending',
          priority: template.priority
        });
        
        await assignment.save();
        assignmentCount++;
      }
    }
    console.log(`✅ Created ${assignmentCount} assignments`);

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
    console.log(`   - ${assignmentCount} assignments\n`);

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
