// LEXCORP MZILANKATHA HARDWARE - JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Form handling
  const quoteForm = document.getElementById('quoteForm');
  const formSuccess = document.getElementById('formSuccess');
  
  if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(quoteForm);
      const data = Object.fromEntries(formData);
      
      // Log the quote request (in production, send to server)
      console.log('Quote request:', data);
      
      // Show success message
      quoteForm.classList.add('hidden');
      formSuccess.classList.remove('hidden');
      
      // Reset after 3 seconds
      setTimeout(() => {
        quoteForm.reset();
        quoteForm.classList.remove('hidden');
        formSuccess.classList.add('hidden');
      }, 3000);
    });
  }
  
  // Scroll reveal animations
  const revealElements = document.querySelectorAll('.tape-band, .tape-strips, .quote-form-container, .contact-card, .badge, .chat-bubble');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    revealObserver.observe(el);
  });
  
  // Add revealed class styles
  const style = document.createElement('style');
  style.textContent = `
    .revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
  
  // Parallax effect for background images
  const bgImages = document.querySelectorAll('.bg-image');
  
  let ticking = false;
  
  function updateParallax() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    bgImages.forEach((bg, index) => {
      const section = bg.parentElement;
      const rect = section.getBoundingClientRect();
      
      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        const offset = (progress - 0.5) * 30;
        bg.style.transform = `translateY(${offset}px) scale(1.05)`;
      }
    });
    
    ticking = false;
  }
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
  
  // Initial parallax update
  updateParallax();
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// Scroll to top function
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}