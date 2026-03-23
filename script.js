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

// ===== GALLERY CAROUSEL LOGIC =====
const galleryImages = [
  'images/gallery/image1.jpg','images/gallery/image2.jpg','images/gallery/image3.jpg',
  'images/gallery/image4.jpg','images/gallery/image5.jpg','images/gallery/image6.jpg',
  'images/gallery/image7.jpg','images/gallery/image8.jpg','images/gallery/image9.jpg',
  'images/gallery/image10.jpg','images/gallery/image11.jpg','images/gallery/image12.jpg',
  'images/gallery/image13.jpg','images/gallery/image14.jpg','images/gallery/image15.jpg',
  'images/gallery/image16.jpg','images/gallery/image17.jpg','images/gallery/image18.jpg',
  'images/gallery/image19.jpg','images/gallery/image20.jpg','images/gallery/image21.jpg',
  'images/gallery/image22.jpg'
];
let currentSlide = 0;

function initCarousel() {
  const track = document.querySelector('.carousel-track');
  const indicatorsContainer = document.querySelector('.carousel-indicators');
  const totalEl = document.querySelector('.total-images');
  const currentEl = document.querySelector('.current-image');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  if (!track) return;
  if (totalEl) totalEl.textContent = galleryImages.length;
  
  galleryImages.forEach((src, index) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.innerHTML = '<img src="' + src + '" alt="Gallery ' + (index+1) + '" loading="' + (index===0?'eager':'lazy') + '">';
    track.appendChild(slide);
    if (indicatorsContainer) {
      const dot = document.createElement('button');
      dot.className = 'carousel-indicator';
      dot.addEventListener('click', function() { goToSlide(index); });
      indicatorsContainer.appendChild(dot);
    }
  });
  
  if (prevBtn) prevBtn.addEventListener('click', function() { currentSlide = (currentSlide - 1 + galleryImages.length) % galleryImages.length; updateCarousel(); });
  if (nextBtn) nextBtn.addEventListener('click', function() { currentSlide = (currentSlide + 1) % galleryImages.length; updateCarousel(); });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') { currentSlide = (currentSlide - 1 + galleryImages.length) % galleryImages.length; updateCarousel(); }
    if (e.key === 'ArrowRight') { currentSlide = (currentSlide + 1) % galleryImages.length; updateCarousel(); }
  });
  let touchStart = 0;
  track.addEventListener('touchstart', function(e) { touchStart = e.changedTouches[0].screenX; }, {passive: true});
  track.addEventListener('touchend', function(e) {
    const touchEnd = e.changedTouches[0].screenX;
    if (touchEnd < touchStart - 50) { currentSlide = (currentSlide + 1) % galleryImages.length; updateCarousel(); }
    if (touchEnd > touchStart + 50) { currentSlide = (currentSlide - 1 + galleryImages.length) % galleryImages.length; updateCarousel(); }
  }, {passive: true});
  updateCarousel();
}

function updateCarousel() {
  const track = document.querySelector('.carousel-track');
  const dots = document.querySelectorAll('.carousel-indicator');
  const currentEl = document.querySelector('.current-image');
  if (track) track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
  dots.forEach(function(dot, i) { dot.classList.toggle('active', i === currentSlide); });
  if (currentEl) currentEl.textContent = currentSlide + 1;
}

function goToSlide(index) { currentSlide = index; updateCarousel(); }

setTimeout(initCarousel, 100);
