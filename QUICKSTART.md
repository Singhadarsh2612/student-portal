# 🚀 Quick Start Guide

## Prerequisites Check
```bash
# Check Node.js installation
node --version  # Should be v14 or higher

# Check npm installation
npm --version

# Check MongoDB installation
mongod --version  # Should be v4.4 or higher
```

## Setup in 5 Minutes

### 1. Navigate to Project Directory
```bash
cd student-portal-project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start MongoDB
```bash
# On macOS
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### 4. Configure Environment
The `.env` file is already configured with default values. You can modify if needed:
```env
MONGODB_URI=mongodb://localhost:27017/student_portal
SESSION_SECRET=your_secret_key_here_change_in_production
PORT=3000
COLLEGE_DOMAIN=@college.edu
```

### 5. Seed Database with Sample Data
```bash
npm run seed
```

Expected output:
```
✅ MongoDB Connected for Seeding
🗑️  Clearing existing data...
✅ Existing data cleared
📚 Creating subjects...
✅ Created 6 subjects
👥 Creating students...
✅ Created 5 students
📊 Creating marks records...
✅ Created XX marks records
📅 Updating attendance records...
✅ Attendance records updated
🎉 Database seeding completed successfully!
```

### 6. Start the Application
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

### 7. Access the Application
Open your browser and go to:
```
http://localhost:3000
```

### 8. Login with Sample Credentials
```
Email: john.doe@college.edu
Password: password123
```

## What You'll See

1. **Home Page** - Landing page with login/register options
2. **Login** - Enter credentials
3. **Dashboard** - Your academic overview
4. **Attendance** - View attendance records
5. **Marks** - Check your exam scores
6. **Profile** - Student profile and API info

## Test the API Endpoints

After logging in, check the Profile page for your student ID, then test the API:

```bash
# Get student information
curl http://localhost:3000/api/student/YOUR_STUDENT_ID

# Get student subjects
curl http://localhost:3000/api/student/YOUR_STUDENT_ID/subjects

# Get performance summary
curl http://localhost:3000/api/student/YOUR_STUDENT_ID/performance-summary
```

## Common Issues

### Issue: MongoDB connection refused
**Solution:** Start MongoDB service
```bash
brew services start mongodb-community  # macOS
sudo systemctl start mongod           # Linux
net start MongoDB                     # Windows
```

### Issue: Port 3000 already in use
**Solution:** Change PORT in `.env` file
```env
PORT=3001
```

### Issue: Cannot find module
**Solution:** Install dependencies
```bash
npm install
```

## Next Steps

- ✅ Explore all pages (Dashboard, Attendance, Marks, Profile)
- ✅ Test API endpoints with different student IDs
- ✅ Register new students with @college.edu email
- ✅ Check the code structure and comments
- ✅ Customize for your needs

## All Available Sample Accounts

| Email | Password |
|-------|----------|
| john.doe@college.edu | password123 |
| jane.smith@college.edu | password123 |
| alex.johnson@college.edu | password123 |
| emily.brown@college.edu | password123 |
| michael.davis@college.edu | password123 |

## Project Features Checklist

- ✅ User Registration with Email Validation
- ✅ Secure Login with Session Management
- ✅ Dashboard with Statistics
- ✅ Attendance Tracking
- ✅ Marks Management
- ✅ Student Profile
- ✅ REST API for AI Integration
- ✅ Professor Contact Information
- ✅ Performance Analytics
- ✅ Responsive Design

## Need Help?

1. Check `README.md` for detailed documentation
2. Review code comments in each file
3. Verify MongoDB is running
4. Check `.env` configuration
5. Look at console logs for errors

---

**You're all set! 🎉**

Start exploring the portal and building amazing features!
