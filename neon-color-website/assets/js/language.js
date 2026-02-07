/**
 * NEON COLOR - Enhanced Language System
 * Robust bilingual (Arabic/English) switching with RTL/LTR support
 * Optimized UX profiles for each language
 */

const LanguageSystem = {
  currentLang: "ar",
  defaultLang: "ar",
  supportedLangs: ["ar", "en"],
  isInitialized: false,
  
  // Language-specific configurations
  langConfig: {
    ar: {
      dir: "rtl",
      fontFamily: "'Cairo', 'Noto Sans Arabic', sans-serif",
      fontWeight: "500",
      lineHeight: "1.8",
      letterSpacing: "0",
      dateLocale: "ar-EG",
      numberLocale: "ar-EG",
      currency: "EGP"
    },
    en: {
      dir: "ltr",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      fontWeight: "400",
      lineHeight: "1.6",
      letterSpacing: "0.01em",
      dateLocale: "en-US",
      numberLocale: "en-US",
      currency: "EGP"
    }
  },

  // Static translations for UI elements
  translations: {
    nav: {
      ar: { home: "الرئيسية", services: "خدماتنا", projects: "أعمالنا", about: "من نحن", contact: "تواصل معنا" },
      en: { home: "Home", services: "Services", projects: "Projects", about: "About", contact: "Contact" }
    },
    header: {
      ar: { cta: "احصل على عرض سعر" },
      en: { cta: "Get a Quote" }
    },
    contact: {
      labels: {
        ar: { phone: "الهاتف", whatsapp: "واتساب", email: "البريد الإلكتروني", address: "العنوان" },
        en: { phone: "Phone", whatsapp: "WhatsApp", email: "Email", address: "Address" }
      },
      form: {
        ar: { title: "أرسل لنا رسالة", name: "الاسم الكامل", phone: "رقم الهاتف", service: "اختر نوع الخدمة", message: "اكتب رسالتك هنا...", submit: "إرسال الرسالة" },
        en: { title: "Send us a Message", name: "Full Name", phone: "Phone Number", service: "Select Service Type", message: "Write your message here...", submit: "Send Message" }
      }
    },
    services: {
      ar: { signage: "لافتات إعلانية", hospital: "تجهيز مستشفيات", retail: "تجهيز محلات", decoration: "ديكور وتشطيبات", printing: "طباعة رقمية", led: "إضاءة LED", other: "أخرى" },
      en: { signage: "Advertising Signs", hospital: "Hospital Setup", retail: "Retail Setup", decoration: "Decoration & Finishing", printing: "Digital Printing", led: "LED Lighting", other: "Other" }
    },
    buttons: {
      ar: { viewMore: "عرض المزيد", getQuote: "احصل على عرض سعر", seeAll: "مشاهدة الكل" },
      en: { viewMore: "View More", getQuote: "Get a Quote", seeAll: "See All" }
    },
    footer: {
      ar: { quickLinks: "روابط سريعة", followUs: "تابعنا", copyright: "© 2024 نيون كلر. جميع الحقوق محفوظة" },
      en: { quickLinks: "Quick Links", followUs: "Follow Us", copyright: "© 2024 Neon Color. All rights reserved" }
    }
  },

  /**
   * Initialize language system with error handling
   */
  init() {
    try {
      // Check URL parameter first
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      
      if (urlLang && this.supportedLangs.includes(urlLang)) {
        this.currentLang = urlLang;
      } else {
        // Get saved language or detect from browser
        const savedLang = localStorage.getItem("neoncolor-lang");
        const browserLang = navigator.language?.substring(0, 2) || this.defaultLang;

        if (savedLang && this.supportedLangs.includes(savedLang)) {
          this.currentLang = savedLang;
        } else if (this.supportedLangs.includes(browserLang)) {
          this.currentLang = browserLang;
        } else {
          this.currentLang = this.defaultLang;
        }
      }

      this.applyLanguage(this.currentLang);
      this.setupSwitcher();
      this.isInitialized = true;
      
      console.log(`🌐 Language System initialized: ${this.currentLang.toUpperCase()}`);
    } catch (error) {
      console.error("Language System initialization failed:", error);
      // Fallback to Arabic
      this.currentLang = this.defaultLang;
      this.applyBasicLanguage(this.currentLang);
    }
  },

  /**
   * Apply language to the page with full configuration
   */
  applyLanguage(lang) {
    if (!this.supportedLangs.includes(lang)) {
      console.warn(`Unsupported language: ${lang}, falling back to ${this.defaultLang}`);
      lang = this.defaultLang;
    }

    const config = this.langConfig[lang];
    this.currentLang = lang;
    
    // Save preference
    try {
      localStorage.setItem("neoncolor-lang", lang);
    } catch (e) {
      console.warn("Could not save language preference");
    }

    // Update HTML attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = config.dir;

    // Update body classes
    document.body.classList.remove("rtl", "ltr", "lang-ar", "lang-en");
    document.body.classList.add(config.dir, `lang-${lang}`);

    // Apply font configuration
    this.applyFontConfig(config);

    // Update all translatable elements
    this.updateTranslatableElements();
    
    // Update form elements
    this.updateFormElements();

    // Update language switcher display
    this.updateSwitcherDisplay();

    // Dispatch custom event for other scripts (with safety check)
    try {
      window.dispatchEvent(
        new CustomEvent("languageChanged", {
          detail: { language: lang, config: config }
        })
      );
    } catch (e) {
      console.warn("Could not dispatch language change event");
    }
  },

  /**
   * Apply font configuration for the current language
   */
  applyFontConfig(config) {
    const root = document.documentElement;
    root.style.setProperty('--font-family-current', config.fontFamily);
    root.style.setProperty('--font-weight-current', config.fontWeight);
    root.style.setProperty('--line-height-current', config.lineHeight);
    root.style.setProperty('--letter-spacing-current', config.letterSpacing);
  },

  /**
   * Basic language application (fallback)
   */
  applyBasicLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.classList.add(lang === "ar" ? "rtl" : "ltr");
  },

  /**
   * Toggle between languages
   */
  toggle() {
    const newLang = this.currentLang === "ar" ? "en" : "ar";
    this.applyLanguage(newLang);
  },

  /**
   * Set language explicitly
   */
  setLanguage(lang) {
    if (this.supportedLangs.includes(lang)) {
      this.applyLanguage(lang);
    }
  },

  /**
   * Update all elements with data-i18n attributes
   */
  updateTranslatableElements() {
    // Update navigation
    document.querySelectorAll("[data-nav]").forEach((element) => {
      const key = element.getAttribute("data-nav");
      const translation = this.translations.nav[this.currentLang]?.[key];
      if (translation) element.textContent = translation;
    });

    // Update contact labels
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const translation = this.getStaticTranslation(key);
      if (translation) {
        if (element.hasAttribute("placeholder")) {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });
  },

  /**
   * Update form elements with translations
   */
  updateFormElements() {
    const formTrans = this.translations.contact.form[this.currentLang];
    const serviceTrans = this.translations.services[this.currentLang];
    
    // Form title
    const formTitle = document.querySelector('.contact-form-wrapper h3');
    if (formTitle) formTitle.textContent = formTrans.title;
    
    // Form placeholders
    const nameInput = document.getElementById('form-name');
    if (nameInput) nameInput.placeholder = formTrans.name;
    
    const phoneInput = document.getElementById('form-phone');
    if (phoneInput) phoneInput.placeholder = formTrans.phone;
    
    const messageInput = document.getElementById('form-message');
    if (messageInput) messageInput.placeholder = formTrans.message;
    
    // Submit button
    const submitBtn = document.getElementById('form-submit');
    if (submitBtn) {
      // Keep the SVG icon, just update text
      const svg = submitBtn.querySelector('svg');
      submitBtn.textContent = '';
      if (svg) submitBtn.appendChild(svg);
      submitBtn.appendChild(document.createTextNode(' ' + formTrans.submit));
    }
    
    // Service select options
    const serviceSelect = document.getElementById('form-service');
    if (serviceSelect) {
      const firstOption = serviceSelect.querySelector('option[value=""]');
      if (firstOption) firstOption.textContent = formTrans.service;
      
      // Update service options
      serviceSelect.querySelectorAll('option[value]:not([value=""])').forEach(option => {
        const key = option.value;
        if (serviceTrans[key]) option.textContent = serviceTrans[key];
      });
    }
    
    // Contact labels
    const contactLabels = this.translations.contact.labels[this.currentLang];
    document.querySelectorAll('.contact-text h4').forEach(label => {
      const parent = label.closest('.contact-item');
      if (parent?.querySelector('.phone-number:not([target])')) {
        label.textContent = contactLabels.phone;
      } else if (parent?.querySelector('[target="_blank"]')) {
        label.textContent = contactLabels.whatsapp;
      } else if (parent?.querySelector('.email-link')) {
        label.textContent = contactLabels.email;
      } else if (parent?.querySelector('#contact-address')) {
        label.textContent = contactLabels.address;
      }
    });
    
    // Footer
    const footerTrans = this.translations.footer[this.currentLang];
    const copyright = document.getElementById('footer-copyright');
    if (copyright) copyright.textContent = footerTrans.copyright;
  },

  /**
   * Get static translation from translations object
   */
  getStaticTranslation(keyPath) {
    const keys = keyPath.split(".");
    let value = this.translations;

    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key];
      } else {
        return null;
      }
    }

    if (value && typeof value === "object" && this.currentLang in value) {
      return value[this.currentLang];
    }

    return typeof value === "string" ? value : null;
  },

  /**
   * Get translation from content JSON (for dynamic content)
   */
  getTranslation(keyPath) {
    if (!window.siteContent) return null;

    const keys = keyPath.split(".");
    let value = window.siteContent;

    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key];
      } else {
        return null;
      }
    }

    if (value && typeof value === "object" && this.currentLang in value) {
      return value[this.currentLang];
    }

    return typeof value === "string" ? value : null;
  },

  /**
   * Get localized content from an object with ar/en keys
   */
  localize(obj) {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[this.currentLang] || obj["ar"] || obj["en"] || "";
  },

  /**
   * Format number according to current locale
   */
  formatNumber(num) {
    const config = this.langConfig[this.currentLang];
    return new Intl.NumberFormat(config.numberLocale).format(num);
  },

  /**
   * Format date according to current locale
   */
  formatDate(date, options = {}) {
    const config = this.langConfig[this.currentLang];
    return new Intl.DateTimeFormat(config.dateLocale, options).format(date);
  },

  /**
   * Setup language switcher button(s)
   */
  setupSwitcher() {
    // Primary switcher
    const switcher = document.getElementById("lang-switcher");
    if (switcher) {
      switcher.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggle();
      });
    }
    
    // Also handle any element with data-lang-toggle
    document.querySelectorAll("[data-lang-toggle]").forEach(el => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggle();
      });
    });
  },

  /**
   * Update language switcher display
   */
  updateSwitcherDisplay() {
    const switcherText = document.getElementById("lang-switcher-text");
    if (switcherText) {
      switcherText.textContent = this.currentLang === "ar" ? "EN" : "عربي";
    }

    const switcherLabel = document.getElementById("lang-switcher-label");
    if (switcherLabel) {
      switcherLabel.textContent = this.currentLang === "ar" ? "English" : "العربية";
    }
    
    // Update aria labels for accessibility
    const switcher = document.getElementById("lang-switcher");
    if (switcher) {
      switcher.setAttribute("aria-label", 
        this.currentLang === "ar" ? "Switch to English" : "التبديل إلى العربية"
      );
    }
  },

  /**
   * Get current language
   */
  getCurrentLang() {
    return this.currentLang;
  },

  /**
   * Check if current language is RTL
   */
  isRTL() {
    return this.currentLang === "ar";
  },
  
  /**
   * Get current language config
   */
  getConfig() {
    return this.langConfig[this.currentLang];
  }
};

// Export for use in other modules
window.LanguageSystem = LanguageSystem;
