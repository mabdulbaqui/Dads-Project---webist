/**
 * NEON COLOR - Main Application
 * Core functionality and interactions
 */

const App = {
  /**
   * Initialize the application
   */
  async init() {
    console.log('🚀 Neon Color - Initializing...');
    
    // Load content first
    const contentLoaded = await ContentLoader.init();
    if (!contentLoaded) {
      console.error('Failed to load content');
    }
    
    // Initialize language system
    LanguageSystem.init();
    
    // Setup UI components
    this.setupHeader();
    this.setupMobileMenu();
    this.setupSmoothScroll();
    this.setupContactForm();
    this.setupAnimations();
    this.setupLazyLoading();
    
    console.log('✅ Neon Color - Ready!');
  },
  
  /**
   * Setup header scroll behavior
   */
  setupHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      // Add shadow when scrolled
      if (currentScroll > 50) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
      
      // Hide/show on scroll direction (optional)
      // if (currentScroll > lastScroll && currentScroll > 300) {
      //   header.style.transform = 'translateY(-100%)';
      // } else {
      //   header.style.transform = 'translateY(0)';
      // }
      
      lastScroll = currentScroll;
    });
  },
  
  /**
   * Setup mobile menu toggle
   */
  setupMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (!menuBtn || !nav) return;
    
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      nav.classList.toggle('active');
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking nav links
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
        menuBtn.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  },
  
  /**
   * Setup smooth scrolling for anchor links
   */
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (!target) return;
        
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  },
  
  /**
   * Setup contact form handling
   */
  setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        message: formData.get('message')
      };
      
      // Validate
      if (!this.validateForm(data)) return;
      
      // Send via WhatsApp
      this.sendToWhatsApp(data);
    });
  },
  
  /**
   * Validate form data
   * @param {Object} data - Form data
   * @returns {boolean}
   */
  validateForm(data) {
    let isValid = true;
    
    // Name validation
    if (!data.name || data.name.trim().length < 2) {
      this.showFieldError('form-name', 'Please enter your name');
      isValid = false;
    } else {
      this.clearFieldError('form-name');
    }
    
    // Phone validation
    const phoneRegex = /^[\d\s+()-]{8,}$/;
    if (!data.phone || !phoneRegex.test(data.phone)) {
      this.showFieldError('form-phone', 'Please enter a valid phone number');
      isValid = false;
    } else {
      this.clearFieldError('form-phone');
    }
    
    return isValid;
  },
  
  /**
   * Show field error
   */
  showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    // Add error message
    const errorEl = document.createElement('span');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    errorEl.style.cssText = 'color: #dc3545; font-size: 0.875rem; display: block; margin-top: 0.25rem;';
    field.parentNode.appendChild(errorEl);
  },
  
  /**
   * Clear field error
   */
  clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    field.classList.remove('error');
    const errorEl = field.parentNode.querySelector('.error-message');
    if (errorEl) errorEl.remove();
  },
  
  /**
   * Send form data to WhatsApp
   * @param {Object} data - Form data
   */
  sendToWhatsApp(data) {
    const lang = window.LanguageSystem?.getCurrentLang() || 'ar';
    const phone = window.siteContent?.contact?.whatsapp?.replace(/[^0-9]/g, '') || '';
    
    // Build message
    let message = '';
    if (lang === 'ar') {
      message = `*طلب عرض سعر جديد*\n\n`;
      message += `الاسم: ${data.name}\n`;
      message += `الهاتف: ${data.phone}\n`;
      if (data.service) message += `الخدمة: ${data.service}\n`;
      if (data.message) message += `الرسالة: ${data.message}\n`;
    } else {
      message = `*New Quote Request*\n\n`;
      message += `Name: ${data.name}\n`;
      message += `Phone: ${data.phone}\n`;
      if (data.service) message += `Service: ${data.service}\n`;
      if (data.message) message += `Message: ${data.message}\n`;
    }
    
    // Open WhatsApp
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  },
  
  /**
   * Setup scroll animations
   */
  setupAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe elements with animation class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
    
    // Counter animation for stats
    this.setupCounterAnimation();
  },
  
  /**
   * Setup counter animation for statistics
   */
  setupCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
      threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const targetValue = parseInt(target.textContent) || 0;
          this.animateCounter(target, 0, targetValue, 2000);
          observer.unobserve(target);
        }
      });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
  },
  
  /**
   * Animate a counter from start to end value
   * @param {HTMLElement} element - Target element
   * @param {number} start - Start value
   * @param {number} end - End value  
   * @param {number} duration - Animation duration in ms
   */
  animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const current = Math.floor(start + (end - start) * easeOut);
      element.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = end.toLocaleString();
      }
    };
    
    requestAnimationFrame(updateCounter);
  },
  
  /**
   * Setup lazy loading for images
   */
  setupLazyLoading() {
    // Native lazy loading is used via loading="lazy" attribute
    // This adds fallback for older browsers
    
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading supported
      return;
    }
    
    // Fallback with Intersection Observer
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// Export for use
window.App = App;
