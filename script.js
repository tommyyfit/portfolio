// Simple JS for contact form (demo purposes)
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  if(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for reaching out!');
      form.reset();
    });
  }
});