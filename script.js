// ========================================
// CUSTOM CURSOR
// ========================================
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');

if (window.matchMedia('(min-width: 1024px)').matches) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, input, textarea');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
  });
}

// ========================================
// SCROLL PROGRESS
// ========================================
const scrollProgress = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = scrollPercent + '%';
});

// ========================================
// NAVIGATION SCROLL EFFECT
// ========================================
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// ========================================
// MOBILE MENU
// ========================================
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ========================================
// PARTICLE ANIMATION
// ========================================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 40;
let animationId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.3 + 0.1
    });
  }
}

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(particle => {
    // Mouse influence
    const dx = mouseX - particle.x;
    const dy = mouseY - particle.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 150) {
      particle.vx += dx * 0.00005;
      particle.vy += dy * 0.00005;
    }

    particle.x += particle.vx;
    particle.y += particle.vy;

    // Boundary check
    if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

    // Draw particle
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(197, 251, 103, ${particle.opacity})`;
    ctx.fill();
  });

  animationId = requestAnimationFrame(animateParticles);
}

// Initialize particles
resizeCanvas();
createParticles();
animateParticles();

window.addEventListener('resize', () => {
  resizeCanvas();
  createParticles();
});

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================
const revealElements = document.querySelectorAll('.section-header, .skills-grid, .skill-card, .project-card, .certificate-card, .service-card, .about-image-wrapper, .about-content, .contact-info, .contact-form-wrapper, .testimonials-slider, .testimonials-stats');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      
      // Animate skill progress bars
      if (entry.target.classList.contains('skills-grid')) {
        const progressFills = entry.target.querySelectorAll('.skill-progress-fill');
        const skillPercents = entry.target.querySelectorAll('.skill-percent');
        
        progressFills.forEach((fill, index) => {
          const percent = fill.dataset.percent;
          setTimeout(() => {
            fill.style.width = percent + '%';
          }, index * 100);
        });
        
        skillPercents.forEach((percent, index) => {
          const targetPercent = parseInt(percent.dataset.percent);
          setTimeout(() => {
            animateNumber(percent, targetPercent);
          }, index * 100);
        });
      }
      
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Number animation helper
function animateNumber(element, target) {
  let current = 0;
  const duration = 1500;
  const step = target / (duration / 16);
  
  function update() {
    current += step;
    if (current < target) {
      element.textContent = Math.round(current) + '%';
      requestAnimationFrame(update);
    } else {
      element.textContent = target + '%';
    }
  }
  
  update();
}

// ========================================
// TESTIMONIALS SLIDER
// ========================================
const track = document.getElementById('testimonials-track');
const dots = document.querySelectorAll('.testimonials-dots .dot');
const prevBtn = document.getElementById('testimonial-prev');
const nextBtn = document.getElementById('testimonial-next');

if (track && prevBtn && nextBtn && dots.length > 0) {
  const slides = track.querySelectorAll('.testimonial-slide');
  let currentSlide = 0;
  let autoPlayInterval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active', 'prev');
      if (i === index) {
        slide.classList.add('active');
      } else if (i < index) {
        slide.classList.add('prev');
      }
    });
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  // Event listeners
  nextBtn.addEventListener('click', () => {
    nextSlide();
    stopAutoPlay();
    startAutoPlay();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    stopAutoPlay();
    startAutoPlay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      showSlide(currentSlide);
      stopAutoPlay();
      startAutoPlay();
    });
  });

  // Initialize
  showSlide(0);
  startAutoPlay();
}

// ========================================
// CONTACT FORM
// ========================================
const contactForm = document.getElementById('contact-form');
const toast = document.getElementById('toast');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.classList.add('loading');
  
  // Simulate form submission
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Show toast
  toast.classList.add('show');
  
  // Reset form
  contactForm.reset();
  submitBtn.classList.remove('loading');
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
});

// ========================================
// BACK TO TOP
// ========================================
const backToTop = document.getElementById('back-to-top');

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ========================================
// PARALLAX EFFECT FOR ABOUT IMAGE
// ========================================
const aboutImage = document.querySelector('.about-image-wrapper');

if (aboutImage && window.matchMedia('(min-width: 1024px)').matches) {
  window.addEventListener('scroll', () => {
    const rect = aboutImage.getBoundingClientRect();
    const scrolled = window.innerHeight - rect.top;
    
    if (scrolled > 0 && rect.bottom > 0) {
      const offset = scrolled * 0.05;
      aboutImage.style.transform = `translateY(${offset}px)`;
    }
  });
}

// ========================================
// VISIBILITY API - PAUSE ANIMATIONS WHEN TAB HIDDEN
// ========================================
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(animationId);
    stopAutoPlay();
  } else {
    animateParticles();
    startAutoPlay();
  }
});
