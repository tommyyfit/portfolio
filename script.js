// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeLoader();
  initializeMobileMenu();
  initializeFAB();
  initializeProgressBar();
  initializeScrollAnimations();
  initializeTypingEffect();
  initializeFormHandling();
  initializeCardAnimations();
});

// Initialize loader with animation
function initializeLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  
  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 400);
  }, 1000);
}

// Initialize mobile menu functionality
function initializeMobileMenu() {
  const mobileBtn = document.getElementById('mobile-btn');
  const closeMenu = document.getElementById('close-menu');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!mobileBtn || !closeMenu || !mobileMenu) return;

  mobileBtn.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    mobileBtn.setAttribute('aria-expanded', 'true');
  });

  closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = 'auto';
    mobileBtn.setAttribute('aria-expanded', 'false');
  });

  // Close mobile menu when clicking on links
  document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = 'auto';
      mobileBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// Initialize floating action button
function initializeFAB() {
  const fab = document.getElementById('fab');
  if (!fab) return;

  fab.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Throttle scroll event for better performance
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > window.innerHeight * 0.5) {
          fab.style.opacity = '1';
          fab.style.visibility = 'visible';
        } else {
          fab.style.opacity = '0';
          fab.style.visibility = 'hidden';
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  fab.style.opacity = '0';
  fab.style.visibility = 'hidden';
  fab.style.transition = 'opacity 0.3s, visibility 0.3s';
}

// Initialize progress bar
function initializeProgressBar() {
  const progress = document.getElementById('progress');
  if (!progress) return;

  // Throttle scroll event for better performance
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progressWidth = (window.pageYOffset / totalHeight) * 100;
        progress.style.width = progressWidth + '%';
        ticking = false;
      });
      ticking = true;
    }
  });
}

// Initialize scroll animations for sections
function initializeScrollAnimations() {
  const sections = document.querySelectorAll('.section-reveal');
  if (sections.length === 0) return;

  const revealSection = (entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('section-visible');
      observer.unobserve(entry.target);
    });
  };

  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
  });

  sections.forEach(section => {
    sectionObserver.observe(section);
  });
}

// Initialize typing effect
function initializeTypingEffect() {
  const typedSubtitle = document.getElementById('typed-subtitle');
  if (!typedSubtitle) return;

  const subtitle = 'Fitness • Nutrition • Travel • Web Development';
  let idx = 0;

  function type() {
    if (idx < subtitle.length) {
      typedSubtitle.innerHTML += subtitle.charAt(idx);
      idx++;
      setTimeout(type, 60 + Math.random() * 30);
    } else {
      typedSubtitle.classList.add('cursor-blink');
    }
  }

  // Start typing after a short delay
  setTimeout(type, 1000);
}

// Initialize form handling with Formspree
function initializeFormHandling() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  // Don't override the action attribute here - keep it in HTML
  contactForm.addEventListener('submit', handleFormSubmit);
}

// Initialize card animations
function initializeCardAnimations() {
  const resourceCards = document.querySelectorAll('#resources .card-hover');
  if (resourceCards.length === 0) return;

  resourceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px) scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });
}

// Form submission handler for Formspree
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const submitBtn = document.getElementById('submit-btn');
  const messageContainer = document.getElementById('form-message');
  
  // Reset error messages
  document.querySelectorAll('.error-message').forEach(el => {
    el.textContent = '';
    el.classList.add('hidden');
  });
  
  // Basic validation
  let isValid = true;
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');
  
  if (!name || name.trim().length < 2) {
    showError('name-error', 'Please enter your name');
    isValid = false;
  }
  
  if (!email || !isValidEmail(email)) {
    showError('email-error', 'Please enter a valid email address');
    isValid = false;
  }
  
  if (!message || message.trim().length < 10) {
    showError('message-error', 'Please enter a message with at least 10 characters');
    isValid = false;
  }
  
  if (!isValid) return;
  
  // Show loading state
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  form.classList.add('form-loading');
  
  try {
    // Submit to Formspree
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      // Show success message
      showMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
      form.reset();
    } else {
      // Handle Formspree errors
      try {
        const data = await response.json();
        if (data.errors) {
          showMessage(data.errors.map(error => error.message).join(', '), 'error');
        } else {
          showMessage('Sorry, there was an error sending your message. Please try again later.', 'error');
        }
      } catch (parseError) {
        showMessage('Sorry, there was an error sending your message. Please try again later.', 'error');
      }
    }
  } catch (error) {
    // Show error message
    showMessage('Sorry, there was an error sending your message. Please try again later.', 'error');
  } finally {
    // Reset button state
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    form.classList.remove('form-loading');
  }
}

// Helper function to show error messages
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (!errorElement) return;
  
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
  
  // Add shake animation to the input field
  const inputElement = errorElement.previousElementSibling;
  if (inputElement) {
    inputElement.classList.add('animate-shake');
    setTimeout(() => {
      inputElement.classList.remove('animate-shake');
    }, 500);
  }
}

// Helper function to show messages
function showMessage(message, type) {
  const messageContainer = document.getElementById('form-message');
  if (!messageContainer) return;
  
  messageContainer.textContent = message;
  messageContainer.classList.remove('hidden', 'success', 'error');
  messageContainer.classList.add(type);
  
  // Auto hide after 5 seconds
  setTimeout(() => {
    messageContainer.classList.add('hidden');
  }, 5000);
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallaxElement = document.getElementById('hero');
  if (parallaxElement) {
    const rate = scrolled * -0.5;
    parallaxElement.style.transform = `translate3d(0px, ${rate}px, 0px)`;
  }
});

// Add shake animation to CSS if not already present
if (!document.querySelector('style#dynamic-animations')) {
  const style = document.createElement('style');
  style.id = 'dynamic-animations';
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    .animate-shake {
      animation: shake 0.5s ease-in-out;
    }
    .cursor-blink::after {
      content: '|';
      animation: blink 1s steps(1) infinite;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}