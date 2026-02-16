// Main JavaScript file for Student Portal

// Highlight active navigation link
document.addEventListener('DOMContentLoaded', function() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.sidebar .nav-link');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});

// Auto-dismiss alerts after 5 seconds
document.addEventListener('DOMContentLoaded', function() {
  const alerts = document.querySelectorAll('.alert:not(.alert-light)');
  
  alerts.forEach(alert => {
    setTimeout(() => {
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    }, 5000);
  });
});

// Form validation helper
function validateForm(formId) {
  const form = document.getElementById(formId);
  
  if (!form) return;
  
  form.addEventListener('submit', function(event) {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    form.classList.add('was-validated');
  }, false);
}

// Initialize tooltips
document.addEventListener('DOMContentLoaded', function() {
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  
  tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});

// Format numbers with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Calculate grade from percentage
function calculateGrade(percentage) {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
}

// Show loading spinner
function showLoading() {
  const loader = document.createElement('div');
  loader.id = 'loading-spinner';
  loader.className = 'position-fixed top-50 start-50 translate-middle';
  loader.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  `;
  document.body.appendChild(loader);
}

// Hide loading spinner
function hideLoading() {
  const loader = document.getElementById('loading-spinner');
  if (loader) {
    loader.remove();
  }
}

// Show toast notification
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`;
  toast.style.zIndex = '9999';
  toast.innerHTML = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Export for potential future use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateForm,
    formatNumber,
    calculateGrade,
    showLoading,
    hideLoading,
    showToast
  };
}
