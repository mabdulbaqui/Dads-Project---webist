/**
 * NEON COLOR - Content Loader
 * Loads and renders content from JSON files (Real company data)
 * Works seamlessly with the enhanced LanguageSystem
 */

const ContentLoader = {
  content: null,
  services: null,
  projects: null,
  seo: null,
  isLoaded: false,
  
  /**
   * Initialize content loader - load all JSON files
   */
  async init() {
    try {
      // Load all JSON files in parallel with error handling
      const results = await Promise.allSettled([
        this.loadJSON('data/content.json'),
        this.loadJSON('data/services.json'),
        this.loadJSON('data/projects.json'),
        this.loadJSON('data/seo.json')
      ]);
      
      // Process results even if some fail
      this.content = results[0].status === 'fulfilled' ? results[0].value : null;
      this.services = results[1].status === 'fulfilled' ? results[1].value : null;
      this.projects = results[2].status === 'fulfilled' ? results[2].value : null;
      this.seo = results[3].status === 'fulfilled' ? results[3].value : null;
      
      // Log any failures
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.warn(`Failed to load data file ${index}:`, result.reason);
        }
      });
      
      // Store content globally for language system
      window.siteContent = this.content;
      window.siteServices = this.services;
      window.siteProjects = this.projects;
      window.siteSEO = this.seo;
      
      this.isLoaded = true;
      
      // Render all sections
      this.renderAll();
      
      // Listen for language changes
      window.addEventListener('languageChanged', () => {
        this.renderAll();
      });
      
      console.log('📄 Content Loader initialized');
      return true;
    } catch (error) {
      console.error('Failed to load content:', error);
      return false;
    }
  },
  
  /**
   * Load a JSON file with caching
   */
  async loadJSON(path) {
    const response = await fetch(path, {
      cache: 'default'
    });
    if (!response.ok) {
      throw new Error(`Failed to load ${path}: ${response.status}`);
    }
    return response.json();
  },
  
  /**
   * Get current language
   */
  getLang() {
    return window.LanguageSystem?.getCurrentLang() || 'ar';
  },
  
  /**
   * Get localized text from object with ar/en keys
   */
  localize(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    const lang = this.getLang();
    return obj[lang] || obj['ar'] || obj['en'] || '';
  },
  
  /**
   * Render all sections
   */
  renderAll() {
    try {
      this.renderHero();
      this.renderServices();
      this.renderProjects();
      this.renderAbout();
      this.renderStats();
      this.renderContact();
      this.renderFooter();
      this.updateSEO();
    } catch (error) {
      console.error('Error rendering content:', error);
    }
  },
  
  /**
   * Render hero section
   */
  renderHero() {
    if (!this.content?.hero) return;

    const hero = this.localize(this.content.hero);
    const heroBadge = this.localize(this.content.hero_badge);
    const heroStats = this.content.hero_stats;

    // Update badge text
    const badgeText = document.getElementById('hero-badge-text');
    if (badgeText) badgeText.textContent = heroBadge || hero.badge || '';

    // Update multi-line headline
    const headline = document.getElementById('hero-headline');
    if (headline) {
      const accentSpan = headline.querySelector('.hero-title-accent');
      const mainSpan = headline.querySelector('.hero-title-main');
      const locationSpan = headline.querySelector('.hero-title-location');

      if (accentSpan) accentSpan.textContent = hero.headline_accent || '';
      if (mainSpan) mainSpan.textContent = hero.headline_main || '';
      if (locationSpan) locationSpan.textContent = hero.headline_location || '';
    }

    // Update subtitle
    const subheadline = document.getElementById('hero-subheadline');
    if (subheadline) subheadline.textContent = hero.subheadline || hero.description || '';

    // Update primary CTA
    const ctaPrimary = document.getElementById('hero-cta-primary');
    if (ctaPrimary) {
      const ctaSpan = ctaPrimary.querySelector('span');
      if (ctaSpan) ctaSpan.textContent = hero.cta_primary || '';
    }

    // Update secondary CTA
    const ctaSecondary = document.getElementById('hero-cta-secondary');
    if (ctaSecondary) {
      const ctaSpan = ctaSecondary.querySelector('span');
      if (ctaSpan) ctaSpan.textContent = hero.cta_secondary || '';
    }

    // Update trust indicator labels
    if (heroStats) {
      const projectsLabel = document.querySelector('.trust-item [data-i18n="stats.projects"]');
      const clientsLabel = document.querySelector('.trust-item [data-i18n="stats.clients"]');
      const citiesLabel = document.querySelector('.trust-item [data-i18n="stats.cities"]');

      if (projectsLabel) projectsLabel.textContent = this.localize(heroStats.projects) || '';
      if (clientsLabel) clientsLabel.textContent = this.localize(heroStats.clients) || '';
      if (citiesLabel) citiesLabel.textContent = this.localize(heroStats.cities) || '';
    }
  },
  
  /**
   * Render services section
   */
  renderServices() {
    if (!this.services?.services) return;
    
    const container = document.getElementById('services-grid');
    if (!container) return;
    
    // Render section title from content
    const sectionTitle = this.localize(this.content?.services_overview);
    if (sectionTitle) {
      this.setText('#services-title', sectionTitle.title);
      this.setText('#services-subtitle', sectionTitle.subtitle);
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    // Render each service
    this.services.services.forEach(service => {
      const card = this.createServiceCard(service);
      container.appendChild(card);
    });
  },
  
  /**
   * Create a service card element
   */
  createServiceCard(service) {
    const card = document.createElement('article');
    card.className = 'service-card';
    
    const name = this.localize(service.name);
    const tagline = this.localize(service.tagline);
    const description = this.localize(service.description);
    const features = this.localize(service.features) || [];
    const icon = service.icon || '🏢';
    
    card.innerHTML = `
      <div class="service-icon">
        <span style="font-size: 2.5rem;">${icon}</span>
      </div>
      <h3 class="service-title">${name}</h3>
      ${tagline ? `<p class="service-tagline"><strong>${tagline}</strong></p>` : ''}
      <p class="service-description">${description}</p>
      ${features.length ? `
        <ul class="service-features">
          ${features.slice(0, 3).map(f => `<li>${f}</li>`).join('')}
        </ul>
      ` : ''}
    `;
    
    return card;
  },
  
  /**
   * Render projects section
   */
  renderProjects() {
    if (!this.projects?.projects) return;
    
    const container = document.getElementById('projects-grid');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Get featured projects first, then others
    const featured = this.projects.projects.filter(p => p.featured);
    const others = this.projects.projects.filter(p => !p.featured);
    const allProjects = [...featured, ...others].slice(0, 6);
    
    // Render each project
    allProjects.forEach(project => {
      const card = this.createProjectCard(project);
      container.appendChild(card);
    });
    
    // Render filter buttons
    this.renderProjectFilters();
  },
  
  /**
   * Render project filter buttons
   */
  renderProjectFilters() {
    const container = document.getElementById('projects-filter');
    if (!container || !this.projects?.categories) return;
    
    container.innerHTML = '';
    
    const categories = this.projects.categories;
    Object.keys(categories).forEach((key, index) => {
      const btn = document.createElement('button');
      btn.className = `filter-btn${index === 0 ? ' active' : ''}`;
      btn.setAttribute('data-filter', key);
      btn.textContent = this.localize(categories[key]);
      btn.addEventListener('click', () => this.filterProjects(key, btn));
      container.appendChild(btn);
    });
  },
  
  /**
   * Filter projects by category
   */
  filterProjects(category, activeBtn) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
    
    // Filter projects
    const container = document.getElementById('projects-grid');
    if (!container) return;
    
    const cards = container.querySelectorAll('.project-card');
    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      if (category === 'all' || cardCategory === category) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  },
  
  /**
   * Create a project card element
   */
  createProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.setAttribute('data-category', project.category);
    
    // Use placeholder image if actual image doesn't exist
    const imageSrc = project.images?.[0] || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%23b11226" width="400" height="300"/><text x="200" y="150" font-family="Arial" font-size="20" fill="white" text-anchor="middle">Neon Color</text></svg>';
    
    const categoryName = this.projects?.categories?.[project.category] 
      ? this.localize(this.projects.categories[project.category]) 
      : project.category;
    
    card.innerHTML = `
      <img 
        src="${imageSrc}" 
        alt="${this.localize(project.title)}" 
        class="project-image"
        loading="lazy"
        onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22><rect fill=%22%23b11226%22 width=%22400%22 height=%22300%22/><text x=%22200%22 y=%22150%22 font-family=%22Arial%22 font-size=%2220%22 fill=%22white%22 text-anchor=%22middle%22>Neon Color</text></svg>'"
      >
      <div class="project-overlay">
        <h3 class="project-title">${this.localize(project.title)}</h3>
        <p class="project-category">${categoryName}</p>
      </div>
    `;
    
    return card;
  },
  
  /**
   * Render about section
   */
  renderAbout() {
    if (!this.content?.about) return;
    
    const about = this.localize(this.content.about);
    this.setText('#about-title', about.title);
    this.setText('#about-description', about.content);
  },
  
  /**
   * Render stats section
   */
  renderStats() {
    if (!this.content?.stats) return;
    
    const stats = this.content.stats;
    const lang = this.getLang();
    
    // Years
    if (stats.years_experience) {
      this.setText('#stat-years', stats.years_experience.value);
      this.setText('#stat-years-label', stats.years_experience[`label_${lang}`]);
    }
    
    // Clients
    if (stats.clients_served) {
      this.setText('#stat-clients', stats.clients_served.value);
      this.setText('#stat-clients-label', stats.clients_served[`label_${lang}`]);
    }
    
    // Projects
    if (stats.projects_completed) {
      this.setText('#stat-projects', stats.projects_completed.value);
      this.setText('#stat-projects-label', stats.projects_completed[`label_${lang}`]);
    }
  },
  
  /**
   * Render contact section
   */
  renderContact() {
    if (!this.content?.contact) return;
    
    const contact = this.content.contact;
    
    // Update contact info
    const phoneEl = document.getElementById('contact-phone');
    if (phoneEl && contact.phone) {
      phoneEl.textContent = contact.phone;
      if (phoneEl.tagName === 'A') {
        phoneEl.href = `tel:${contact.phone.replace(/\s/g, '')}`;
      }
    }
    
    const whatsappEl = document.getElementById('contact-whatsapp');
    if (whatsappEl && contact.whatsapp) {
      whatsappEl.textContent = contact.whatsapp;
      const phone = contact.whatsapp.replace(/[^0-9]/g, '');
      if (whatsappEl.tagName === 'A') {
        whatsappEl.href = `https://wa.me/${phone}`;
      }
    }
    
    const emailEl = document.getElementById('contact-email');
    if (emailEl && contact.email) {
      emailEl.textContent = contact.email;
      if (emailEl.tagName === 'A') {
        emailEl.href = `mailto:${contact.email}`;
      }
    }
    
    const addressEl = document.getElementById('contact-address');
    if (addressEl && contact.address) {
      addressEl.textContent = this.localize(contact.address);
    }
    
    // Update WhatsApp floating button
    const whatsappFloat = document.getElementById('whatsapp-float');
    if (whatsappFloat && contact.whatsapp) {
      const phone = contact.whatsapp.replace(/[^0-9]/g, '');
      whatsappFloat.href = `https://wa.me/${phone}`;
    }
    
    // Update phone floating button
    const callFloat = document.getElementById('call-float');
    if (callFloat && contact.phone) {
      callFloat.href = `tel:${contact.phone.replace(/\s/g, '')}`;
    }
  },
  
  /**
   * Render footer
   */
  renderFooter() {
    if (!this.content?.footer) return;
    
    const footer = this.localize(this.content.footer);
    this.setText('#footer-tagline', footer.tagline);
    this.setText('#footer-quick-links', footer.quick_links_title);
    this.setText('#footer-services', footer.services_title);
    this.setText('#footer-contact', footer.contact_title);
    
    // Update social links
    if (this.content.social) {
      this.setHref('#social-facebook', this.content.social.facebook);
      this.setHref('#social-instagram', this.content.social.instagram);
      this.setHref('#social-tiktok', this.content.social.tiktok);
    }
  },
  
  /**
   * Update SEO meta tags
   */
  updateSEO() {
    if (!this.seo?.pages?.home) return;
    
    const lang = this.getLang();
    const seo = this.seo.pages.home[lang];
    
    if (seo) {
      // Update title
      document.title = seo.title;
      
      // Update meta tags
      this.setMeta('description', seo.description);
      this.setMeta('keywords', seo.keywords);
      this.setMeta('og:title', seo.og_title || seo.title, 'property');
      this.setMeta('og:description', seo.og_description || seo.description, 'property');
      
      // Update html lang attribute
      document.documentElement.lang = lang;
    }
    
    // Inject structured data
    this.injectStructuredData();
  },
  
  /**
   * Inject JSON-LD structured data
   */
  injectStructuredData() {
    if (!this.seo?.structured_data) return;
    
    // Remove existing
    document.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());
    
    // Add organization schema
    if (this.seo.structured_data.organization) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(this.seo.structured_data.organization);
      document.head.appendChild(script);
    }
    
    // Add local business schema
    if (this.seo.structured_data.local_business) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(this.seo.structured_data.local_business);
      document.head.appendChild(script);
    }
  },
  
  /**
   * Helper: Set text content
   */
  setText(selector, text) {
    const el = document.querySelector(selector);
    if (el && text !== undefined && text !== null) el.textContent = text;
  },
  
  /**
   * Helper: Set href
   */
  setHref(selector, url) {
    const el = document.querySelector(selector);
    if (el && url) el.href = url;
  },
  
  /**
   * Helper: Set meta tag
   */
  setMeta(name, content, attr = 'name') {
    if (!content) return;
    let meta = document.querySelector(`meta[${attr}="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attr, name);
      document.head.appendChild(meta);
    }
    meta.content = content;
  }
};

// Export for use in other modules
window.ContentLoader = ContentLoader;
