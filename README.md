# 🎓 Academic Student Portal

A full-stack web application for managing student academic performance, attendance, and marks. Built with Node.js, Express, MongoDB, and EJS templating.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Default Credentials](#default-credentials)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)

## ✨ Features

### Student Authentication
- 🔐 Secure registration with college email validation
- 🔑 Login with session management
- 🔒 Password hashing using bcrypt
- 🚪 Logout functionality

### Dashboard Features
- 📊 Academic performance overview
- 📈 Subject-wise marks display
- 📅 Attendance tracking
- 👨‍🏫 Professor contact information
- 📉 Performance analytics

### Attendance Module
- ✅ Real-time attendance percentage
- 📊 Subject-wise attendance records
- ⚠️ Low attendance warnings (< 75%)
- 📧 Professor contact for low attendance subjects

### Marks Management
- 📝 Quiz marks (Quiz 1-6)
- 📄 Mid-semester exam marks
- 📋 End-semester exam marks
- 🎯 Average calculation per subject
- 🏆 Grade assignment

### Student Profile
- 👤 Personal information display
- 📚 Enrolled subjects overview
- 📊 Overall academic summary
- 💡 Performance insights and recommendations

### REST API (AI Agent Ready)
- 🤖 RESTful endpoints for AI integration
- 📡 JSON responses for all student data
- 🔍 Performance summary with recommendations
- 📨 Structured data for automated email agents

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

### Frontend
- **EJS** - Templating engine
- **Bootstrap 5** - CSS framework
- **Bootstrap Icons** - Icon library

### Security & Session
- **bcrypt** - Password hashing
- **express-session** - Session management
- **connect-mongo** - MongoDB session store

### Development
- **nodemon** - Auto-restart server
- **dotenv** - Environment variables

## 📁 Project Structure

```
student-portal-project/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── dashboardController.js # Dashboard logic
│   └── apiController.js     # API endpoints logic
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   ├── Student.js           # Student schema
│   ├── Subject.js           # Subject schema
│   └── Marks.js             # Marks schema
├── public/
│   ├── css/
│   │   └── style.css        # Custom styles
│   └── js/
│       └── main.js          # Client-side JavaScript
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   ├── dashboardRoutes.js   # Dashboard routes
│   └── apiRoutes.js         # API routes
├── scripts/
│   └── seedData.js          # Database seeder
├── views/
│   ├── partials/
│   │   ├── navbar.ejs       # Navigation bar
│   │   └── sidebar.ejs      # Sidebar navigation
│   ├── home.ejs             # Landing page
│   ├── register.ejs         # Registration page
│   ├── login.ejs            # Login page
│   ├── dashboard.ejs        # Main dashboard
│   ├── attendance.ejs       # Attendance page
│   ├── marks.ejs            # Marks page
│   ├── profile.ejs          # Student profile
│   └── error.ejs            # Error page
├── .env                     # Environment variables
├── package.json             # Dependencies
└── server.js                # Application entry point
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Steps

1. **Clone or extract the project**
```bash
cd student-portal-project
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up MongoDB**
   - Make sure MongoDB is running on your system
   - Or use MongoDB Atlas (cloud database)

4. **Configure environment variables**
   - Edit the `.env` file with your settings
   ```env
   MONGODB_URI=mongodb://localhost:27017/student_portal
   SESSION_SECRET=your_secret_key_here
   PORT=3000
   COLLEGE_DOMAIN=@college.edu
   ```

5. **Seed the database with dummy data**
```bash
npm run seed
```

This will create:
- 5 sample students
- 6 subjects with professors
- Random attendance records
- Random marks for all students

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/student_portal` |
| `SESSION_SECRET` | Secret key for sessions | `your_secret_key_here` |
| `PORT` | Server port | `3000` |
| `COLLEGE_DOMAIN` | Valid college email domain | `@college.edu` |

## 🎮 Running the Application

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Seed Database
```bash
npm run seed
```

The application will be available at: `http://localhost:3000`

## 🔌 API Endpoints

All API endpoints return JSON responses and are designed for AI agent integration.

### Student Information
```
GET /api/student/:id
```
Returns student basic information (without password)

### Student Subjects
```
GET /api/student/:id/subjects
```
Returns all subjects assigned to the student with professor details

### Student Marks
```
GET /api/student/:id/marks
```
Returns all marks for the student across all subjects with averages

### Student Attendance
```
GET /api/student/:id/attendance
```
Returns attendance records for all subjects with low attendance flags

### Performance Summary
```
GET /api/student/:id/performance-summary
```
Returns comprehensive performance analysis including:
- Overall statistics
- Subject-wise performance
- Subjects needing attention
- AI-ready recommendations

### Sample API Response
```json
{
  "success": true,
  "data": {
    "studentInfo": {
      "id": "...",
      "name": "John Doe",
      "email": "john.doe@college.edu"
    },
    "overallStatistics": {
      "averageMarks": 78,
      "averageAttendance": 85,
      "totalSubjects": 5
    },
    "needsAttention": {
      "lowPerformanceSubjects": [...],
      "lowAttendanceSubjects": [...]
    },
    "recommendations": [...]
  }
}
```

## 🔑 Default Credentials

After running the seed script, you can login with these credentials:

| Email | Password |
|-------|----------|
| john.doe@college.edu | password123 |
| jane.smith@college.edu | password123 |
| alex.johnson@college.edu | password123 |
| emily.brown@college.edu | password123 |
| michael.davis@college.edu | password123 |

**Note:** Change these passwords in production!

## 📸 Features Overview

### 1. Home Page
- Welcome screen with login and register options
- Feature highlights
- Responsive design

### 2. Registration
- College email validation
- Password strength requirements
- Confirm password matching
- Error handling

### 3. Dashboard
- Statistics cards (subjects, marks, attendance)
- Complete academic performance table
- Low attendance alerts
- Placeholder sections for AI features

### 4. Attendance Page
- Subject-wise attendance cards
- Visual progress bars
- Low attendance warnings
- Calculation of classes needed to reach 75%
- Professor contact information

### 5. Marks Page
- Subject-wise marks display
- Quiz, mid-sem, and end-sem marks
- Visual performance indicators
- Grade calculation
- Average marks per subject

### 6. Profile Page
- Student information
- Academic summary
- Performance insights
- Enrolled subjects with professor details
- API access information

## 🔮 Future Enhancements

### Planned Features
- 🤖 AI-powered study recommendations
- 📧 Automated email notifications to professors
- 📅 Exam schedule management
- 📝 Assignment deadline tracking
- 📊 Advanced analytics and visualizations
- 📱 Mobile responsive improvements
- 🔔 Real-time notifications
- 📈 Progress tracking over semesters
- 👥 Student collaboration features
- 📄 Report card generation (PDF)

### AI Integration Possibilities
- Personalized study plans
- Performance prediction
- Attendance improvement suggestions
- Automated professor communication
- Smart scheduling recommendations
- Resource recommendations based on performance

## 🛡️ Security Features

- ✅ Password hashing with bcrypt
- ✅ Session-based authentication
- ✅ Protected routes middleware
- ✅ College email domain validation
- ✅ MongoDB injection prevention (Mongoose)
- ✅ Environment variable security

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running
```bash
# On macOS
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### Port Already in Use
```bash
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Change the PORT in `.env` file or kill the process using port 3000

### Seeding Fails
**Solution:** Make sure MongoDB is running and the connection string in `.env` is correct

## 👨‍💻 Development

### Adding New Features
1. Create new routes in `routes/`
2. Add controller logic in `controllers/`
3. Create views in `views/`
4. Update models if needed in `models/`

### Database Schema Changes
1. Update the model file
2. Run the seed script again to regenerate data

## 📝 License

This project is created for educational purposes.

## 🤝 Contributing

This is a demonstration project. Feel free to use it as a template for your own projects.

## 📧 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Verify MongoDB connection
4. Check environment variables

---

**Built with ❤️ using Node.js, Express, MongoDB, and EJS**

Happy Coding! 🚀
