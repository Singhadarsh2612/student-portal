# 🔌 API Endpoints Update

## ✅ What's Added

Two new API endpoints for exam schedules and assignments!

---

## 📋 Files to Update

### 1. Replace `controllers/apiController.js`
- Adds `getStudentExamSchedule()` method
- Adds `getStudentAssignments()` method

### 2. Replace `routes/apiRoutes.js`
- Adds route: `/api/student/:id/exam-schedule`
- Adds route: `/api/student/:id/assignments`

### 3. Replace `scripts/seedData.js`
- Fixed: 8 hardcoded assignments (same for all students)
- Fixed: 2 completed, 6 upcoming
- Fixed: Dates are March 15-17, 2026 (not 2025!)
- Fixed: Exam dates in 2026

### 4. Update `views/profile.ejs` (Manual Edit)
Add these two lines to the API endpoints list:
```html
- /api/student/<%= student._id %>/exam-schedule<br>
- /api/student/<%= student._id %>/assignments
```

---

## 🚀 Quick Update Steps

### Step 1: Copy Updated Files
```bash
# Copy these 3 files to your project:
# - controllers/apiController.js
# - routes/apiRoutes.js
# - scripts/seedData.js
```

### Step 2: Update Profile Page
Open `views/profile.ejs` and find this section:
```html
Available Endpoints:<br>
- /api/student/<%= student._id %><br>
- /api/student/<%= student._id %>/subjects<br>
- /api/student/<%= student._id %>/marks<br>
- /api/student/<%= student._id %>/attendance<br>
- /api/student/<%= student._id %>/performance-summary
```

Add these two lines at the end:
```html
- /api/student/<%= student._id %>/exam-schedule<br>
- /api/student/<%= student._id %>/assignments
```

### Step 3: Re-seed Database
```bash
npm run seed
```

This will:
- ✅ Create 8 assignments per student (2 completed, 6 upcoming)
- ✅ Set assignment dates to March 15-17, 2026
- ✅ Set exam dates to Feb-April 2026

### Step 4: Restart Server
```bash
npm start
```

---

## 🧪 Test New API Endpoints

Get your student ID from the profile page, then test:

### Exam Schedule API
```bash
curl http://localhost:3000/api/student/YOUR_ID/exam-schedule
```

**Response:**
```json
{
  "success": true,
  "data": {
    "studentId": "...",
    "studentName": "John Doe",
    "totalSubjects": 5,
    "examSchedules": [
      {
        "subject": {
          "id": "...",
          "name": "Data Structures",
          "code": "CS301",
          "professor": "Dr. Sarah Johnson",
          "professorEmail": "sarah.johnson@college.edu"
        },
        "exams": {
          "quiz1": "2026-02-15T...",
          "quiz2": "2026-02-18T...",
          "quiz3": "2026-02-22T...",
          "midSem": "2026-02-27T...",
          "quiz4": "2026-04-12T...",
          "quiz5": "2026-04-16T...",
          "quiz6": "2026-04-22T...",
          "endSem": "2026-04-28T..."
        },
        "academicYear": "2025-2026",
        "semester": "Spring 2026"
      }
    ]
  }
}
```

### Assignments API
```bash
curl http://localhost:3000/api/student/YOUR_ID/assignments
```

**Response:**
```json
{
  "success": true,
  "data": {
    "studentId": "...",
    "studentName": "John Doe",
    "summary": {
      "totalAssignments": 8,
      "upcoming": 6,
      "overdue": 0,
      "completed": 2
    },
    "assignments": {
      "upcoming": [
        {
          "id": "...",
          "title": "Process Scheduling Algorithms",
          "description": "Compare FCFS, SJF, and Round Robin...",
          "subject": {
            "id": "...",
            "name": "Operating Systems",
            "code": "CS303"
          },
          "assignedDate": "2026-03-05T...",
          "dueDate": "2026-03-15T...",
          "totalMarks": 50,
          "status": "pending",
          "priority": "high",
          "daysUntilDue": 9,
          "isOverdue": false
        }
      ],
      "overdue": [],
      "completed": [
        {
          "title": "Binary Search Tree Implementation",
          "status": "submitted",
          ...
        }
      ]
    }
  }
}
```

---

## 📊 Assignment Data Summary

**8 Hardcoded Assignments (Same for ALL students):**

1. ✅ **Binary Search Tree Implementation** - Due: March 15 - COMPLETED
2. ✅ **Database Normalization Project** - Due: March 16 - COMPLETED
3. 📝 **Process Scheduling Algorithms** - Due: March 15 - UPCOMING
4. 📝 **Socket Programming** - Due: March 16 - UPCOMING
5. 📝 **REST API Development** - Due: March 16 - UPCOMING
6. 📝 **Unit Testing Project** - Due: March 17 - UPCOMING
7. 📝 **SQL Query Optimization** - Due: March 17 - UPCOMING
8. 📝 **Frontend Development Challenge** - Due: March 17 - UPCOMING

**All dates are in March 2026** ✅

---

## 🎯 Complete API List

After update, you'll have **7 API endpoints**:

```
/api/student/:id                      - Student info
/api/student/:id/subjects             - Assigned subjects
/api/student/:id/marks                - All marks
/api/student/:id/attendance           - Attendance records
/api/student/:id/performance-summary  - Complete analytics
/api/student/:id/exam-schedule        - Exam dates (NEW!)
/api/student/:id/assignments          - Assignments (NEW!)
```

---

## ✅ Verification Checklist

After updating:
- [ ] New API endpoints return data
- [ ] Profile page shows 7 endpoints (not 5)
- [ ] Assignments page shows 8 assignments
- [ ] 2 assignments are completed
- [ ] 6 assignments are upcoming
- [ ] Assignment dates are March 15-17, 2026
- [ ] Exam schedule shows dates in Feb-April 2026

---

**Ready to update!** 🚀
