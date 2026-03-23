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

/* ===== GALLERY CAROUSEL STYLES ===== */
.gallery-section { min-height: 100vh; padding: 12vh 0; }
.gallery-container { position: relative; z-index: 1; width: 100%; max-width: 1400px; margin: 0 auto; padding: 0 6vw; }
.gallery-header { text-align: center; margin-bottom: 6vh; }
.carousel-wrapper { position: relative; display: flex; align-items: center; gap: 20px; }
.carousel-track-container { flex: 1; overflow: hidden; border-radius: 12px; background-color: rgba(0,0,0,0.5); border: 2px solid var(--accent); }
.carousel-track { display: flex; transition: transform 0.5s ease; height: 60vh; min-height: 400px; }
.carousel-slide { flex: 0 0 100%; display: flex; align-items: center; justify-content: center; padding: 20px; }
.carousel-slide img { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
.carousel-btn { width: 56px; height: 56px; border-radius: 50%; background-color: var(--accent); color: var(--text-dark); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; transition: all 0.3s ease; flex-shrink: 0; }
.carousel-btn:hover { background-color: #e6c200; transform: scale(1.1); }
.carousel-indicators { display: flex; justify-content: center; gap: 8px; margin-top: 24px; flex-wrap: wrap; }
.carousel-indicator { width: 12px; height: 12px; border-radius: 50%; background-color: rgba(255,255,255,0.3); border: 2px solid transparent; cursor: pointer; transition: all 0.3s ease; }
.carousel-indicator.active { background-color: var(--accent); border-color: var(--accent); transform: scale(1.2); }
.carousel-counter { text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 14px; color: var(--text-secondary); margin-top: 16px; }
.carousel-counter .current-image { color: var(--accent); font-weight: 600; }
@media (max-width: 968px) { .carousel-track { height: 50vh; min-height: 300px; } .carousel-btn { width: 44px; height: 44px; font-size: 20px; } }
@media (max-width: 640px) { .carousel-track { height: 40vh; min-height: 250px; } .carousel-btn { width: 36px; height: 36px; font-size: 18px; } .carousel-indicator { width: 10px; height: 10px; } }
