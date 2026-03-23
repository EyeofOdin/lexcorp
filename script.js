document.addEventListener('DOMContentLoaded', function() {
  
  // ===== FORM HANDLING =====
  const quoteForm = document.getElementById('quoteForm');
  const formSuccess = document.getElementById('formSuccess');
  
  if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
      e.preventDefault();
      quoteForm.classList.add('hidden');
      formSuccess.classList.remove('hidden');
      setTimeout(() => {
        quoteForm.reset();
        quoteForm.classList.remove('hidden');
        formSuccess.classList.add('hidden');
      }, 3000);
    });
  }
  
  // ===== SCROLL REVEAL =====
  const revealElements = document.querySelectorAll('.tape-band, .tape-strips, .quote-form-container, .contact-card, .badge, .chat-bubble');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  
  revealElements.forEach(el => revealObserver.observe(el));
  
  // ===== GALLERY CAROUSEL =====
  const galleryImages = [
    'images/gallery/image1.jpg', 'images/gallery/image2.jpg', 'images/gallery/image3.jpg',
    'images/gallery/image4.jpg', 'images/gallery/image5.jpg', 'images/gallery/image6.jpg',
    'images/gallery/image7.jpg', 'images/gallery/image8.jpg', 'images/gallery/image9.jpg',
    'images/gallery/image10.jpg', 'images/gallery/image11.jpg', 'images/gallery/image12.jpg',
    'images/gallery/image13.jpg', 'images/gallery/image14.jpg', 'images/gallery/image15.jpg',
    'images/gallery/image16.jpg', 'images/gallery/image17.jpg', 'images/gallery/image18.jpg',
    'images/gallery/image19.jpg', 'images/gallery/image20.jpg', 'images/gallery/image21.jpg',
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
    
    // Create slides
    galleryImages.forEach((src, index) => {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      slide.innerHTML = `<img src="${src}" alt="Gallery ${index+1}" loading="${index===0?'eager':'lazy'}">`;
      track.appendChild(slide);
      
      if (indicatorsContainer) {
        const dot = document.createElement('button');
        dot.className = 'carousel-indicator';
        dot.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(dot);
      }
    });
    
    // Buttons
    if (prevBtn) prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + galleryImages.length) % galleryImages.length;
      updateCarousel();
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % galleryImages.length;
      updateCarousel();
    });
    
    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { currentSlide = (currentSlide - 1 + galleryImages.length) % galleryImages.length; updateCarousel(); }
      if (e.key === 'ArrowRight') { currentSlide = (currentSlide + 1) % galleryImages.length; updateCarousel(); }
    });
    
    // Touch swipe
    let touchStart = 0;
    track.addEventListener('touchstart', (e) => touchStart = e.changedTouches[0].screenX, {passive: true});
    track.addEventListener('touchend', (e) => {
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
    
    if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
    if (currentEl) currentEl.textContent = currentSlide + 1;
  }
  
  initCarousel();
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
