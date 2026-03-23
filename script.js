// LEXCORP MZILANKATHA HARDWARE - JavaScript
document.addEventListener('DOMContentLoaded', function() {
  
  // ===== FORM HANDLING =====
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
  
  // ===== SCROLL REVEAL ANIMATIONS =====
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
  style.textContent = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);
  
  // ===== PARALLAX EFFECT =====
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
  
  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
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
  
  // ===== GALLERY CAROUSEL =====
  const galleryImages = [
    'images/gallery/image1.jpg',
    'images/gallery/image2.jpg',
    'images/gallery/image3.jpg',
    'images/gallery/image4.jpg',
    'images/gallery/image5.jpg',
    'images/gallery/image6.jpg',
    'images/gallery/image7.jpg',
    'images/gallery/image8.jpg',
    'images/gallery/image9.jpg',
    'images/gallery/image10.jpg',
    'images/gallery/image11.jpg',
    'images/gallery/image12.jpg',
    'images/gallery/image13.jpg',
    'images/gallery/image14.jpg',
    'images/gallery/image15.jpg',
    'images/gallery/image16.jpg',
    'images/gallery/image17.jpg',
    'images/gallery/image18.jpg',
    'images/gallery/image19.jpg',
    'images/gallery/image20.jpg',
    'images/gallery/image21.jpg',
    'images/gallery/image22.jpg'
  ];
  
  let currentSlide = 0;
  let carouselTrack, carouselIndicators, totalImagesEl, currentImageEl;
  
  function initCarousel() {
    carouselTrack = document.querySelector('.carousel-track');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    totalImagesEl = document.querySelector('.total-images');
    currentImageEl = document.querySelector('.current-image');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!carouselTrack) return; // Exit if gallery not on page
    
    // Set total images count
    if (totalImagesEl) totalImagesEl.textContent = galleryImages.length;
    
    // Create slides
    galleryImages.forEach((src, index) => {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      slide.innerHTML = `<img src="${src}" alt="Gallery image ${index + 1}" loading="${index === 0 ? 'eager' : 'lazy'}">`;
      carouselTrack.appendChild(slide);
      
      // Create indicator
      if (indicatorsContainer) {
        const indicator = document.createElement('button');
        indicator.className = 'carousel-indicator';
        indicator.setAttribute('aria-label', `Go to image ${index + 1}`);
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
      }
    });
    
    // Add event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carouselTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carouselTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      if (touchEndX < touchStartX - 50) nextSlide();
      if (touchEndX > touchStartX + 50) prevSlide();
    }
    
    updateCarousel();
  }
  
  function updateCarousel() {
    if (!carouselTrack) return;
    
    const slides = carouselTrack.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    // Update track position
    carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update indicators
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentSlide);
    });
    
    // Update counter
    if (currentImageEl) {
      currentImageEl.textContent = currentSlide + 1;
    }
  }
  
  function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % galleryImages.length;
    updateCarousel();
  }
  
  function prevSlide() {
    currentSlide = (currentSlide - 1 + galleryImages.length) % galleryImages.length;
    updateCarousel();
  }
  
  function handleKeyPress(e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  }
  
  // Initialize carousel when DOM is loaded
  initCarousel();
  
});

// Scroll to top function
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
