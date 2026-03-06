# 🚀 Adding Exam Schedule & Assignments Features

## 📋 What's New

You're adding TWO new features to your deployed student portal:

1. **📅 Exam Schedule Page** - View all exam dates for your subjects
2. **📝 Assignments Page** - Track upcoming, overdue, and completed assignments

---

## 📁 Files to Add/Update

### New Model Files (Add to `/models` folder):
1. `ExamSchedule.js` - Stores exam dates
2. `Assignment.js` - Stores assignment details

### New View Files (Add to `/views` folder):
1. `exam-schedule.ejs` - Exam schedule page
2. `assignments.ejs` - Assignments page

### Files to Replace (Update existing files):
1. `controllers/dashboardController.js` - Add new controller methods
2. `routes/dashboardRoutes.js` - Add new routes
3. `views/partials/sidebar.ejs` - Update sidebar links
4. `scripts/seedData.js` - Update seed script with new data

---

## 🔧 Step-by-Step Update Process

### Option 1: Update Already Deployed App (Recommended)

#### Step 1: Update Local Files

```bash
# Navigate to your project folder
cd student-portal-project

# Create new model files
# Copy the content from:
# - ExamSchedule.js → models/ExamSchedule.js
# - Assignment.js → models/Assignment.js

# Create new view files
# Copy the content from:
# - exam-schedule.ejs → views/exam-schedule.ejs
# - assignments.ejs → views/assignments.ejs

# Replace existing files with updated versions:
# - dashboardController.js → controllers/dashboardController.js
# - dashboardRoutes.js → routes/dashboardRoutes.js
# - sidebar.ejs → views/partials/sidebar.ejs
# - seedData.js → scripts/seedData.js
```

#### Step 2: Push to GitHub

```bash
git add .
git commit -m "Add exam schedule and assignments features"
git push origin main
```

#### Step 3: Wait for Render to Auto-Deploy

Render will automatically detect your GitHub push and redeploy (takes 2-3 minutes).

#### Step 4: Seed New Data

**Option A: Using the Seed Endpoint (if you still have it)**

Visit: `https://your-app.onrender.com/seed-database`

**Option B: Seed Locally to Atlas**

Since you're using MongoDB Atlas (cloud database), you can seed from your computer:

```bash
# Make sure your local .env has the Atlas URI
# MONGODB_URI=mongodb+srv://adarsh2612:YOUR_PASSWORD@cluster0.p9hbipx.mongodb.net/student_portal?appName=Cluster0

# Run seed script
npm run seed
```

The data goes directly to Atlas cloud, so your deployed app will have it immediately!

---

### Option 2: Fresh Deployment

If you want to start fresh:

1. Delete the old deployment on Render
2. Follow the original deployment steps
3. Use the new seed script

---

## 🎯 Quick File Copy Guide

### Where to Put Each File:

```
student-portal-project/
├── models/
│   ├── ExamSchedule.js       ← NEW FILE
│   └── Assignment.js          ← NEW FILE
│
├── controllers/
│   └── dashboardController.js ← REPLACE THIS
│
├── routes/
│   └── dashboardRoutes.js     ← REPLACE THIS
│
├── views/
│   ├── exam-schedule.ejs      ← NEW FILE
│   ├── assignments.ejs        ← NEW FILE
│   └── partials/
│       └── sidebar.ejs        ← REPLACE THIS
│
└── scripts/
    └── seedData.js            ← REPLACE THIS
```

---

## 🌱 Seeding Strategy (Important!)

### For Deployed App:

**Best Method: Seed Locally with Atlas URI**

1. Your MongoDB Atlas database is in the cloud
2. When you run `npm run seed` locally with Atlas URI, data goes to Atlas
3. Your deployed Render app uses the same Atlas database
4. So the data is immediately available to your deployed app!

**Steps:**

```bash
# 1. Make sure .env has Atlas URI
MONGODB_URI=mongodb+srv://adarsh2612:YOUR_PASSWORD@cluster0.p9hbipx.mongodb.net/student_portal?appName=Cluster0

# 2. Run seed locally
npm run seed

# 3. Data is now in Atlas cloud
# 4. Your deployed app can access it immediately!
```

---

## ✅ Verification Steps

After updating:

### 1. Check Deployment
- Visit: `https://your-app.onrender.com`
- Login with: `john.doe@college.edu` / `password123`

### 2. Test New Pages
- Click **"Exam Schedule"** in sidebar
- Should see exam dates for all subjects
- Click **"Assignments"** in sidebar
- Should see upcoming/overdue/completed assignments

### 3. Verify Data
- Exam dates should be in Feb (last 2 weeks) and April (last 3 weeks)
- Quiz dates before mid-sem/end-sem dates
- Assignments should have varied due dates

---

## 🎨 What the Pages Look Like

### Exam Schedule Page:
- **Table view**: All exams in one table
- **Timeline view**: Separated by February and April
- **Color-coded**: Mid-sem (yellow), End-sem (red)
- **Exam tips**: Helpful study suggestions

### Assignments Page:
- **Statistics cards**: Upcoming, Overdue, Completed counts
- **Upcoming section**: Cards with countdown timers
- **Overdue alerts**: Red warnings for late assignments
- **Completed section**: Table of submitted work
- **Assignment tips**: Study guidance

---

## 🚨 Troubleshooting

### Issue: New pages show "Schedule not available"
**Solution:** You forgot to run the seed script. Run `npm run seed` locally.

### Issue: Sidebar links don't work
**Solution:** Make sure you updated `dashboardRoutes.js` and pushed to GitHub.

### Issue: Can't see exam dates
**Solution:** The ExamSchedule collection might be empty. Re-run seed script.

### Issue: Render deployment failed
**Solution:** Check Render logs. Might be a typo in updated files.

---

## 📊 Database Structure

### New Collections Added:

**examschedules:**
```javascript
{
  subjectId: ObjectId,
  quiz1Date: Date,
  quiz2Date: Date,
  quiz3Date: Date,
  midSemDate: Date,
  quiz4Date: Date,
  quiz5Date: Date,
  quiz6Date: Date,
  endSemDate: Date,
  academicYear: "2024-2025",
  semester: "Spring 2025"
}
```

**assignments:**
```javascript
{
  subjectId: ObjectId,
  title: String,
  description: String,
  assignedDate: Date,
  dueDate: Date,
  totalMarks: Number,
  status: "pending" | "submitted" | "overdue",
  priority: "low" | "medium" | "high"
}
```

---

## 🎓 Feature Details

### Exam Schedule Logic:
- ✅ First 3 quizzes BEFORE mid-sem
- ✅ Mid-sem date is AFTER quiz 1-3
- ✅ Last 3 quizzes BEFORE end-sem
- ✅ End-sem date is AFTER quiz 4-6
- ✅ Max 2 exams per day
- ✅ Feb dates: Last 2 weeks (15-28)
- ✅ April dates: Last 3 weeks (10-30)

### Assignment Features:
- ✅ 2-3 assignments per subject
- ✅ Countdown timer (days until due)
- ✅ Color-coded urgency (red if < 2 days)
- ✅ Auto-categorize as overdue
- ✅ Random submission status

---

## 🎯 Summary

**Files to Add:** 4 new files
**Files to Update:** 3 existing files
**Time Required:** ~10 minutes
**Deployment:** Automatic via GitHub push
**Seeding:** Run locally, data goes to Atlas cloud

---

**Once you push to GitHub, Render auto-deploys in 2-3 minutes. Then run seed locally and you're done!** 🚀

---

## 💡 Pro Tip

After seeding, check MongoDB Atlas:
1. Go to Atlas → Browse Collections
2. You should see 2 new collections:
   - `examschedules` (6 documents - one per subject)
   - `assignments` (12-18 documents - 2-3 per subject)

---

**Need help with any step? Let me know!** 🙌
