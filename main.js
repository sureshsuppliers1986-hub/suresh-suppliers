/**
 * SURESH SUPPLIERS (PVT) LTD — MAIN APPLICATION & INTERACTIVE FEATURES
 * Includes:
 * 1. Central Editable Configuration (WhatsApp, Phone, Email, Form Endpoint, Maps, Domain)
 * 2. Language Switcher (English & Sinhala with localStorage persistence)
 * 3. Mobile Navigation Drawer & Sticky Header
 * 4. Responsive Hero Image Slider (auto-play, pause on hover, keyboard support)
 * 5. Verified Company Figures Counter Animation
 * 6. Project Gallery Category Filter & Full-Screen Image Lightbox
 * 7. Accessible FAQ Accordion
 * 8. Client-Side Contact & Quotation Form Validation (No fake email delivery simulation)
 * 9. Scroll-to-Top & Scroll Reveal Animations
 */

window.SURESH_CONFIG = {
  companyName: "Suresh Suppliers (Pvt) Ltd",
  slogan: "Build Strong. Build Smart. Build Green!",
  factoryLocation: "Industrial Zone, Nagoda, Kalutara, Sri Lanka",
  showrooms: ["Beruwala", "Nagoda", "Wadduwa", "Moratuwa"],
  indicativeBrickPriceLKR: 85,
  // Replace placeholders below with verified production details before publishing:
  phoneDisplay: "+94 XX XXX XXXX (Configure Official Hotline)",
  phoneDial: "",
  whatsappNumber: "", // e.g., "94771234567" (leave empty until verified number is supplied)
  emailAddress: "info@sureshsuppliers.lk", // Replace with verified company email
  productionDomain: "https://www.sureshsuppliers.lk",
  // Production Form Endpoint (e.g., Formspree URL "https://formspree.io/f/your_id" or custom backend API)
  // Left empty by default so the site NEVER simulates fake email delivery.
  formEndpointUrl: "",
  googleMapsEmbedUrl: "https://www.google.com/maps?q=Nagoda,Kalutara,Sri+Lanka&output=embed",
  socialLinks: {
    facebook: "#configure-facebook-url",
    instagram: "#configure-instagram-url",
    youtube: "#configure-youtube-url"
  }
};

(function () {
  'use strict';

  /* ========================================================================
     1. LANGUAGE SWITCHER (ENGLISH / SINHALA)
     ======================================================================== */
  function applyLanguage(lang) {
    const dictionary = window.SURESH_TRANSLATIONS && window.SURESH_TRANSLATIONS[lang];
    if (!dictionary) return;

    document.documentElement.lang = lang === 'si' ? 'si' : 'en';

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dictionary[key]) {
        el.textContent = dictionary[key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dictionary[key]) {
        el.setAttribute('placeholder', dictionary[key]);
      }
    });

    document.querySelectorAll('.lang-btn').forEach((btn) => {
      const isMatch = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    });

    try {
      localStorage.setItem('suresh_preferred_lang', lang);
    } catch (e) {
      // Ignore storage restrictions
    }
  }

  function initLanguageSwitcher() {
    let savedLang = 'en';
    try {
      savedLang = localStorage.getItem('suresh_preferred_lang') || 'en';
    } catch (e) {
      savedLang = 'en';
    }

    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', function () {
        const selected = this.getAttribute('data-lang') || 'en';
        applyLanguage(selected);
      });
    });

    applyLanguage(savedLang);
  }

  /* ========================================================================
     2. STICKY HEADER & MOBILE MENU
     ======================================================================== */
  function initNavigation() {
    const header = document.querySelector('.site-header');
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (header) {
      window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 20);
      }, { passive: true });
    }

    if (toggleBtn && navMenu) {
      toggleBtn.addEventListener('click', function () {
        const isOpen = navMenu.classList.toggle('open');
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      // Close menu on Escape key or link click
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          toggleBtn.setAttribute('aria-expanded', 'false');
          toggleBtn.focus();
        }
      });

      navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', function () {
          navMenu.classList.remove('open');
          toggleBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /* ========================================================================
     3. RESPONSIVE HERO SLIDER
     ======================================================================== */
  function initHeroSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.hero-slide');
    const dots = slider.querySelectorAll('.slider-dot');
    const prevBtn = slider.querySelector('[data-slider-prev]');
    const nextBtn = slider.querySelector('[data-slider-next]');
    if (slides.length <= 1) return;

    let currentIndex = 0;
    let intervalId = null;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function goToSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === currentIndex);
      });
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
        dot.setAttribute('aria-current', idx === currentIndex ? 'true' : 'false');
      });
    }

    function startAutoPlay() {
      if (prefersReducedMotion) return;
      stopAutoPlay();
      intervalId = setInterval(function () {
        goToSlide(currentIndex + 1);
      }, 5500);
    }

    function stopAutoPlay() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goToSlide(currentIndex - 1);
        startAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goToSlide(currentIndex + 1);
        startAutoPlay();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', function () {
        goToSlide(idx);
        startAutoPlay();
      });
    });

    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    startAutoPlay();
  }

  /* ========================================================================
     4. ANIMATED STATISTIC COUNTERS (VERIFIED SPECS & LOCATIONS ONLY)
     ======================================================================== */
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter-target]');
    if (!counters.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animateCounter(el) {
      const target = parseFloat(el.getAttribute('data-counter-target')) || 0;
      const prefix = el.getAttribute('data-counter-prefix') || '';
      const suffix = el.getAttribute('data-counter-suffix') || '';
      const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);

      if (prefersReducedMotion) {
        el.textContent = prefix + target.toFixed(decimals) + suffix;
        return;
      }

      const duration = 1200;
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        el.textContent = prefix + current.toFixed(decimals) + suffix;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = prefix + target.toFixed(decimals) + suffix;
        }
      }

      requestAnimationFrame(tick);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.35 });

      counters.forEach((c) => observer.observe(c));
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ========================================================================
     5. PROJECT GALLERY FILTERING & FULL-SCREEN LIGHTBOX
     ======================================================================== */
  function initGalleryAndLightbox() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const projectItems = document.querySelectorAll('[data-category]');

    if (filterButtons.length && projectItems.length) {
      filterButtons.forEach((btn) => {
        btn.addEventListener('click', function () {
          const category = this.getAttribute('data-filter');

          filterButtons.forEach((b) => {
            b.classList.toggle('active', b === this);
            b.setAttribute('aria-pressed', b === this ? 'true' : 'false');
          });

          projectItems.forEach((item) => {
            const itemCat = item.getAttribute('data-category');
            const matches = category === 'all' || itemCat === category;
            item.style.display = matches ? '' : 'none';
          });
        });
      });
    }

    // Lightbox Modal
    const lightbox = document.getElementById('projectLightbox');
    if (!lightbox) return;

    const lbImg = document.getElementById('lightboxImage');
    const lbTitle = document.getElementById('lightboxTitle');
    const lbMeta = document.getElementById('lightboxMeta');
    const lbClose = document.getElementById('lightboxCloseBtn');

    document.querySelectorAll('[data-lightbox-src]').forEach((trigger) => {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        const src = this.getAttribute('data-lightbox-src');
        const title = this.getAttribute('data-lightbox-title') || 'Project Showcase';
        const meta = this.getAttribute('data-lightbox-meta') || '';

        if (lbImg) {
          lbImg.src = src;
          lbImg.alt = title;
        }
        if (lbTitle) lbTitle.textContent = title;
        if (lbMeta) lbMeta.textContent = meta;

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        if (lbClose) lbClose.focus();
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      if (lbImg) lbImg.src = '';
    }

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  /* ========================================================================
     6. ACCESSIBLE FAQ ACCORDION
     ======================================================================== */
  function initFaqAccordion() {
    const triggers = document.querySelectorAll('.faq-trigger');
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', function () {
        const item = this.closest('.faq-item');
        const panel = item ? item.querySelector('.faq-panel') : null;
        if (!item || !panel) return;

        const isOpen = item.classList.contains('open');

        // Close sibling items for clean UX
        const parentList = item.parentElement;
        if (parentList) {
          parentList.querySelectorAll('.faq-item.open').forEach((openItem) => {
            if (openItem !== item) {
              openItem.classList.remove('open');
              const openBtn = openItem.querySelector('.faq-trigger');
              const openPanel = openItem.querySelector('.faq-panel');
              if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
              if (openPanel) openPanel.style.maxHeight = null;
            }
          });
        }

        if (isOpen) {
          item.classList.remove('open');
          this.setAttribute('aria-expanded', 'false');
          panel.style.maxHeight = null;
        } else {
          item.classList.add('open');
          this.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });
  }

  /* ========================================================================
     7. CONTACT & QUOTATION FORM VALIDATION (NO FAKE EMAIL DELIVERY)
     ======================================================================== */
  function initForms() {
    // Pre-fill query params if navigated from calculator or service cards
    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get('service');
    const qtyParam = params.get('qty');
    const msgParam = params.get('msg');

    const serviceSelect = document.getElementById('contactService');
    const qtyInput = document.getElementById('contactQuantity');
    const msgInput = document.getElementById('contactMessage');

    if (serviceParam && serviceSelect) {
      Array.from(serviceSelect.options).forEach((opt) => {
        if (opt.value.toLowerCase().includes(serviceParam.toLowerCase())) {
          serviceSelect.value = opt.value;
        }
      });
    }
    if (qtyParam && qtyInput) qtyInput.value = qtyParam;
    if (msgParam && msgInput) msgInput.value = msgParam;

    const forms = document.querySelectorAll('.validated-inquiry-form');
    forms.forEach((form) => {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();

        let isValid = true;
        const statusBox = form.querySelector('.form-status');
        const submitBtn = form.querySelector('button[type="submit"]');

        // Clear previous errors
        form.querySelectorAll('.field-error').forEach((el) => (el.textContent = ''));
        form.querySelectorAll('.form-control').forEach((el) => el.classList.remove('invalid'));
        if (statusBox) {
          statusBox.className = 'form-status';
          statusBox.textContent = '';
        }

        // Validate required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach((field) => {
          const val = field.value.trim();
          const errEl = field.parentElement.querySelector('.field-error');

          if (!val) {
            isValid = false;
            field.classList.add('invalid');
            if (errEl) errEl.textContent = 'This field is required.';
            return;
          }

          if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(val)) {
              isValid = false;
              field.classList.add('invalid');
              if (errEl) errEl.textContent = 'Please enter a valid email address.';
            }
          }

          if (field.name === 'mobile' || field.type === 'tel') {
            const phoneRegex = /^[0-9+\-\s()]{9,16}$/;
            if (!phoneRegex.test(val)) {
              isValid = false;
              field.classList.add('invalid');
              if (errEl) errEl.textContent = 'Please enter a valid Sri Lankan mobile/telephone number.';
            }
          }
        });

        if (!isValid) return;

        const endpoint = (window.SURESH_CONFIG && window.SURESH_CONFIG.formEndpointUrl) || form.getAttribute('data-endpoint') || '';
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());

        const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Processing Inquiry...';
        }

        // IMPORTANT REQUIREMENT: Do NOT simulate successful email delivery when no backend is configured.
        if (!endpoint || endpoint.includes('YOUR_') || endpoint.trim() === '') {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }

          const mailtoSubject = encodeURIComponent('Quotation Inquiry — ' + (payload.service || 'Eco Bricks / Construction'));
          const mailtoBody = encodeURIComponent(
            'Full Name: ' + (payload.fullName || '') + '\n' +
            'Mobile Number: ' + (payload.mobile || '') + '\n' +
            'Email: ' + (payload.email || '') + '\n' +
            'District: ' + (payload.district || '') + '\n' +
            'Service Required: ' + (payload.service || '') + '\n' +
            'Estimated Quantity / Project Size: ' + (payload.quantity || '') + '\n' +
            'Message:\n' + (payload.message || '')
          );

          if (statusBox) {
            statusBox.className = 'form-status visible warning';
            statusBox.innerHTML =
              '<strong>Backend Form Service Not Yet Connected:</strong> Your input passed client-side validation, ' +
              'but automatic email delivery is disabled until the administrator sets <code>SURESH_CONFIG.formEndpointUrl</code> in <code>/js/main.js</code> (e.g., Formspree, Web3Forms, or server API).<br><br>' +
              'You can send your validated inquiry immediately using your email client: ' +
              '<a href="mailto:' + window.SURESH_CONFIG.emailAddress + '?subject=' + mailtoSubject + '&body=' + mailtoBody + '" style="text-decoration:underline;font-weight:700;">Open Pre-Filled Email Client →</a>';
          }
          return;
        }

        // Real HTTP POST when endpoint is configured
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          if (response.ok) {
            form.reset();
            if (statusBox) {
              statusBox.className = 'form-status visible success';
              statusBox.textContent = 'Thank you! Your inquiry has been transmitted to Suresh Suppliers (Pvt) Ltd.';
            }
          } else {
            throw new Error('Server returned HTTP ' + response.status);
          }
        } catch (err) {
          if (statusBox) {
            statusBox.className = 'form-status visible error';
            statusBox.textContent = 'Submission failed (' + err.message + '). Please verify the configured backend endpoint or contact our Nagoda showroom directly.';
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
        }
      });
    });
  }

  /* ========================================================================
     8. SCROLL-TO-TOP, WHATSAPP BUTTON & SCROLL REVEAL
     ======================================================================== */
  function initScrollAndFloatingActions() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
      window.addEventListener('scroll', function () {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 380);
      }, { passive: true });

      scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Configure WhatsApp links dynamically
    document.querySelectorAll('[data-whatsapp-trigger]').forEach((el) => {
      el.addEventListener('click', function (e) {
        const waNum = (window.SURESH_CONFIG && window.SURESH_CONFIG.whatsappNumber) || '';
        const customMsg = this.getAttribute('data-whatsapp-msg') ||
          'Hello Suresh Suppliers (Pvt) Ltd! I would like to inquire about Eco Bricks (CSEB) and construction services.';
        if (waNum && !waNum.includes('X')) {
          e.preventDefault();
          window.open('https://wa.me/' + waNum.replace(/\D/g, '') + '?text=' + encodeURIComponent(customMsg), '_blank', 'noopener');
        }
      });
    });

    // Scroll reveal
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
      const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      revealEls.forEach((el) => revealObserver.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('revealed'));
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initLanguageSwitcher();
    initNavigation();
    initHeroSlider();
    initCounters();
    initGalleryAndLightbox();
    initFaqAccordion();
    initForms();
    initScrollAndFloatingActions();
  });
})();
