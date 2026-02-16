const Student = require('../models/Student');

// Render registration page
exports.getRegister = (req, res) => {
  res.render('register', { 
    error: null,
    collegeDomain: process.env.COLLEGE_DOMAIN || '@college.edu'
  });
};

// Handle registration
exports.postRegister = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.render('register', { 
        error: 'All fields are required',
        collegeDomain: process.env.COLLEGE_DOMAIN || '@college.edu'
      });
    }

    if (password !== confirmPassword) {
      return res.render('register', { 
        error: 'Passwords do not match',
        collegeDomain: process.env.COLLEGE_DOMAIN || '@college.edu'
      });
    }

    if (password.length < 6) {
      return res.render('register', { 
        error: 'Password must be at least 6 characters long',
        collegeDomain: process.env.COLLEGE_DOMAIN || '@college.edu'
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.render('register', { 
        error: 'Email already registered',
        collegeDomain: process.env.COLLEGE_DOMAIN || '@college.edu'
      });
    }

    // Create new student
    const student = new Student({ name, email, password });
    await student.save();

    res.redirect('/login?registered=true');
  } catch (error) {
    console.error('Registration error:', error);
    res.render('register', { 
      error: error.message || 'Registration failed. Please try again.',
      collegeDomain: process.env.COLLEGE_DOMAIN || '@college.edu'
    });
  }
};

// Render login page
exports.getLogin = (req, res) => {
  const registered = req.query.registered === 'true';
  res.render('login', { 
    error: null,
    success: registered ? 'Registration successful! Please login.' : null
  });
};

// Handle login
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.render('login', { 
        error: 'Email and password are required',
        success: null
      });
    }

    // Find student
    const student = await Student.findOne({ email });
    if (!student) {
      return res.render('login', { 
        error: 'Invalid email or password',
        success: null
      });
    }

    // Check password
    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.render('login', { 
        error: 'Invalid email or password',
        success: null
      });
    }

    // Set session
    req.session.studentId = student._id;
    req.session.studentName = student.name;

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { 
      error: 'Login failed. Please try again.',
      success: null
    });
  }
};

// Handle logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
};
