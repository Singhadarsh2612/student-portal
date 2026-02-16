// Middleware to check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.studentId) {
    return next();
  }
  res.redirect('/login');
};

// Middleware to redirect authenticated users away from login/register
exports.redirectIfAuthenticated = (req, res, next) => {
  if (req.session && req.session.studentId) {
    return res.redirect('/dashboard');
  }
  next();
};
