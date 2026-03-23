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

  // ============================================
  // GALLERY CAROUSEL - FIXED VERSION
  // ============================================

  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const indicatorsContainer = document.querySelector('.carousel-indicators');
  const currentSlideEl = document.querySelector('.current-slide');
  const totalSlidesEl = document.querySelector('.total-slides');

  // Only initialize if gallery exists on page
  if (!track || slides.length === 0) {
    console.log('Gallery not found on this page');
    return;
  }

  let currentIndex = 0;
  const totalSlides = slides.length;
  let touchStartX = 0;
  let touchEndX = 0;
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;

  // Initialize
  function initGallery() {
    console.log('Initializing gallery with', totalSlides, 'slides');
    
    // Update total counter
    if (totalSlidesEl) {
      totalSlidesEl.textContent = totalSlides;
    }
    
    // Create dot indicators
    createIndicators();
    
    // Set initial position
    updateSlidePosition();
    
    // Add event listeners
    prevBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Previous button clicked');
      prevSlide();
    });
    
    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Next button clicked');
      nextSlide();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      }
    });
    
    // Touch events
    track.addEventListener('touchstart', touchStart, { passive: true });
    track.addEventListener('touchend', touchEnd, { passive: true });
    track.addEventListener('touchmove', touchMove, { passive: true });
    
    // Mouse drag events
    track.addEventListener('mousedown', dragStart);
    track.addEventListener('mouseup', dragEnd);
    track.addEventListener('mouseleave', function() {
      if (isDragging) dragEnd();
    });
    track.addEventListener('mousemove', drag);
    
    // Prevent image drag
    track.querySelectorAll('img').forEach(img => {
      img.addEventListener('dragstart', function(e) {
        e.preventDefault();
      });
      img.addEventListener('contextmenu', function(e) {
        e.preventDefault();
      });
    });
    
    // Handle resize
    window.addEventListener('resize', function() {
      updateSlidePosition();
    });
  }

  function createIndicators() {
    if (!indicatorsContainer) return;
    
    indicatorsContainer.innerHTML = '';
    
    for (let i = 0; i < totalSlides; i++) {
      const indicator = document.createElement('button');
      indicator.classList.add('carousel-indicator');
      indicator.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      indicator.addEventListener('click', function() {
        goToSlide(i);
      });
      indicatorsContainer.appendChild(indicator);
    }
    
    updateIndicators();
  }

  function updateSlidePosition() {
    currentTranslate = currentIndex * -100;
    prevTranslate = currentTranslate;
    setSliderPosition();
    updateIndicators();
    updateCounter();
    updateButtons();
  }

  function setSliderPosition() {
    track.style.transform = 'translateX(' + currentTranslate + '%)';
  }

  function updateIndicators() {
    const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');
    indicators.forEach(function(indicator, index) {
      if (index === currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  function updateCounter() {
    if (currentSlideEl) {
      currentSlideEl.textContent = currentIndex + 1;
    }
  }

  function updateButtons() {
    // Optional: disable buttons at ends (remove if you want infinite loop)
    // if (prevBtn) prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
    // if (nextBtn) nextBtn.style.opacity = currentIndex === totalSlides - 1 ? '0.5' : '1';
  }

  function nextSlide() {
    console.log('nextSlide called, currentIndex:', currentIndex);
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
    } else {
      // Loop back to start
      currentIndex = 0;
    }
    updateSlidePosition();
  }

  function prevSlide() {
    console.log('prevSlide called, currentIndex:', currentIndex);
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      // Loop to end
      currentIndex = totalSlides - 1;
    }
    updateSlidePosition();
  }

  function goToSlide(index) {
    currentIndex = index;
    updateSlidePosition();
  }

  // Touch handlers
  function touchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }

  function touchMove(e) {
    touchEndX = e.changedTouches[0].screenX;
  }

  function touchEnd() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Mouse drag handlers
  function dragStart(e) {
    isDragging = true;
    startPos = e.pageX;
    track.classList.add('dragging');
    animationID = requestAnimationFrame(animation);
  }

  function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    const currentPosition = e.pageX;
    const diff = currentPosition - startPos;
    const movePercent = (diff / track.offsetWidth) * 100;
    currentTranslate = prevTranslate + movePercent;
    setSliderPosition();
  }

  function dragEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);
    track.classList.remove('dragging');
    
    const movedBy = currentTranslate - prevTranslate;
    const threshold = -15;
    
    if (movedBy < threshold && currentIndex < totalSlides - 1) {
      currentIndex++;
    } else if (movedBy > -threshold && currentIndex > 0) {
      currentIndex--;
    }
    
    updateSlidePosition();
  }

  function animation() {
    if (isDragging) requestAnimationFrame(animation);
  }

  // Start the gallery
  initGallery();
});

// Scroll to top function
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
