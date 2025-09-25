/**
 * Main JavaScript file for Alex Johnson Portfolio Website
 * Handles navigation, form validation, animations, and interactive features
 */

// ===== DOM ELEMENTS =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const contactForm = document.getElementById('contact-form');

// ===== MOBILE NAVIGATION =====
class MobileNavigation {
    constructor() {
        this.toggle = navToggle;
        this.menu = navMenu;
        this.isOpen = false;
        this.init();
    }

    init() {
        if (this.toggle && this.menu) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
            this.closeOnResize();
            this.closeOnClickOutside();
        }
    }

    toggleMenu() {
        this.isOpen = !this.isOpen;
        this.menu.classList.toggle('active');
        this.toggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isOpen ? 'hidden' : '';
        
        // Update ARIA attributes for accessibility
        this.toggle.setAttribute('aria-expanded', this.isOpen);
        this.menu.setAttribute('aria-hidden', !this.isOpen);
    }

    closeOnResize() {
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.closeMenu();
            }
        });
    }

    closeOnClickOutside() {
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.menu.contains(e.target) && 
                !this.toggle.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    closeMenu() {
        this.isOpen = false;
        this.menu.classList.remove('active');
        this.toggle.classList.remove('active');
        document.body.style.overflow = '';
        this.toggle.setAttribute('aria-expanded', 'false');
        this.menu.setAttribute('aria-hidden', 'true');
    }
}

// ===== FORM VALIDATION =====
class FormValidator {
    constructor(form) {
        this.form = form;
        this.errors = {};
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            this.addRealTimeValidation();
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        if (this.validateForm()) {
            this.submitForm();
        } else {
            this.displayErrors();
        }
    }

    validateForm() {
        this.errors = {};
        
        // Required fields
        const requiredFields = ['name', 'email', 'subject', 'message'];
        requiredFields.forEach(field => {
            const input = this.form.querySelector(`[name="${field}"]`);
            if (!input.value.trim()) {
                this.errors[field] = `${this.getFieldLabel(field)} is required`;
            }
        });

        // Email validation
        const email = this.form.querySelector('[name="email"]');
        if (email.value && !this.isValidEmail(email.value)) {
            this.errors.email = 'Please enter a valid email address';
        }

        // Phone validation (optional)
        const phone = this.form.querySelector('[name="phone"]');
        if (phone.value && !this.isValidPhone(phone.value)) {
            this.errors.phone = 'Please enter a valid phone number';
        }

        return Object.keys(this.errors).length === 0;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    getFieldLabel(fieldName) {
        const labels = {
            name: 'Name',
            email: 'Email',
            phone: 'Phone',
            subject: 'Subject',
            message: 'Message'
        };
        return labels[fieldName] || fieldName;
    }

    addRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(input) {
        const fieldName = input.name;
        const value = input.value.trim();

        // Clear previous error
        this.clearFieldError(input);

        // Validate based on field type
        if (input.hasAttribute('required') && !value) {
            this.setFieldError(input, `${this.getFieldLabel(fieldName)} is required`);
        } else if (fieldName === 'email' && value && !this.isValidEmail(value)) {
            this.setFieldError(input, 'Please enter a valid email address');
        } else if (fieldName === 'phone' && value && !this.isValidPhone(value)) {
            this.setFieldError(input, 'Please enter a valid phone number');
        }
    }

    setFieldError(input, message) {
        const errorElement = document.getElementById(`${input.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            input.classList.add('error');
        }
    }

    clearFieldError(input) {
        const errorElement = document.getElementById(`${input.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            input.classList.remove('error');
        }
    }

    displayErrors() {
        Object.keys(this.errors).forEach(field => {
            const input = this.form.querySelector(`[name="${field}"]`);
            if (input) {
                this.setFieldError(input, this.errors[field]);
            }
        });
    }

    async submitForm() {
        const submitBtn = this.form.querySelector('.form-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-block';

        try {
            // Simulate form submission (replace with actual endpoint)
            await this.simulateSubmission();
            this.showSuccessMessage();
            this.form.reset();
        } catch (error) {
            this.showErrorMessage('Failed to send message. Please try again.');
        } finally {
            // Hide loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoading.style.display = 'none';
        }
    }

    async simulateSubmission() {
        // Simulate API call delay
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    showSuccessMessage() {
        const successElement = document.getElementById('form-success');
        if (successElement) {
            successElement.style.display = 'block';
            this.form.style.display = 'none';
            
            // Scroll to success message
            successElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    showErrorMessage(message) {
        alert(message); // In a real app, you'd show a proper error message
    }
}

// ===== PORTFOLIO FILTER =====
class PortfolioFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.portfolioItems = document.querySelectorAll('.portfolio-item');
        this.init();
    }

    init() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleFilter(e));
        });
    }

    handleFilter(e) {
        const filter = e.target.getAttribute('data-filter');
        
        // Update active button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // Filter portfolio items
        this.portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                item.classList.add('animate-fade-in');
            } else {
                item.style.display = 'none';
                item.classList.remove('animate-fade-in');
            }
        });
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('.scroll-animate');
        this.init();
    }

    init() {
        this.observeElements();
        this.animateSkillBars();
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-bar__fill');
        
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.getAttribute('data-width');
                    entry.target.style.width = width + '%';
                }
            });
        }, {
            threshold: 0.5
        });

        skillBars.forEach(bar => {
            skillObserver.observe(bar);
        });
    }
}

// ===== SMOOTH SCROLLING =====
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Handle anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleAnchorClick(e));
        });
    }

    handleAnchorClick(e) {
        const href = e.target.getAttribute('href');
        
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// ===== HEADER SCROLL EFFECT =====
class HeaderScrollEffect {
    constructor() {
        this.header = document.querySelector('.header');
        this.init();
    }

    init() {
        if (this.header) {
            window.addEventListener('scroll', () => this.handleScroll());
        }
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
}

// ===== FAQ ACCORDION =====
class FAQAccordion {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
    }

    init() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => this.toggleItem(item));
            }
        });
    }

    toggleItem(item) {
        const isActive = item.classList.contains('active');
        
        // Close all items
        this.faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    }
}

// ===== UTILITY FUNCTIONS =====
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new MobileNavigation();
    new FormValidator(contactForm);
    new PortfolioFilter();
    new ScrollAnimations();
    new SmoothScroll();
    new HeaderScrollEffect();
    new FAQAccordion();

    // Add scroll animation classes to elements
    const elementsToAnimate = document.querySelectorAll(
        '.service-card, .project-card, .portfolio-item, .skill-showcase, .process-step, .timeline__item'
    );
    
    elementsToAnimate.forEach((element, index) => {
        element.classList.add('scroll-animate');
        element.style.animationDelay = `${index * 0.1}s`;
    });

    // Add loading animation to skill bars
    const skillBars = document.querySelectorAll('.skill-bar__fill');
    skillBars.forEach(bar => {
        bar.style.width = '0%';
    });

    // Initialize tooltips (if needed)
    initializeTooltips();
});

// ===== TOOLTIPS =====
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const text = e.target.getAttribute('data-tooltip');
    if (!text) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    setTimeout(() => tooltip.style.opacity = '1', 10);
    
    e.target._tooltip = tooltip;
}

function hideTooltip(e) {
    const tooltip = e.target._tooltip;
    if (tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => tooltip.remove(), 300);
        delete e.target._tooltip;
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Lazy loading for images (if added later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Preload critical resources
function preloadCriticalResources() {
    const criticalImages = [
        // Add critical image paths here
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // In production, you might want to send this to an error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    // In production, you might want to send this to an error tracking service
});

// ===== ACCESSIBILITY ENHANCEMENTS =====
function enhanceAccessibility() {
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main';
    }
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MobileNavigation,
        FormValidator,
        PortfolioFilter,
        ScrollAnimations,
        SmoothScroll,
        HeaderScrollEffect,
        FAQAccordion,
        Utils
    };
}
