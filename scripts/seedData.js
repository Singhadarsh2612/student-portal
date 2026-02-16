require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Marks = require('../models/Marks');

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

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Student.deleteMany({});
    await Subject.deleteMany({});
    await Marks.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create subjects
    console.log('📚 Creating subjects...');
    const subjects = await Subject.insertMany(subjectsData);
    console.log(`✅ Created ${subjects.length} subjects`);

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
    console.log('🚀 Start the server with: npm start\n');

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
