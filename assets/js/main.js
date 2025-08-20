/**
 * AXEL INTEGRAÇÕES - JAVASCRIPT PRINCIPAL
 * Funcionalidades principais otimizadas para UX moderna
 */

// Configurações globais
const CONFIG = {
    whatsappNumber: '5519997330171',
    emailContact: 'axelintegracoes@gmail.com',
    instagramUrl: '#',
    animationDuration: 300,
    scrollOffset: 100
};

// Estado da aplicação
const AppState = {
    isScrolling: false,
    currentSection: '',
    mobileMenuOpen: false,
    observers: new Map(),
    isReduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

/**
 * Inicialização moderna da aplicação
 */
class AxelApp {
    constructor() {
        this.init();
    }

    async init() {
        // Aguarda DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.initCoreFeatures();
        this.initInteractions();
        this.initPerformanceOptimizations();
        this.initAccessibility();
        
        console.log('Axel Integrações - App inicializado');
    }

    initCoreFeatures() {
        this.setupSmoothScrolling();
        this.setupNavigationHighlight();
        this.setupScrollProgress();
        this.setupMobileMenu();
    }

    initInteractions() {
        this.setupContactButtons();
        this.setupIntersectionObserver();
        this.setupKeyboardNavigation();
    }

    initPerformanceOptimizations() {
        this.setupLazyLoading();
        this.setupResourceHints();
        this.setupErrorHandling();
    }

    initAccessibility() {
        this.setupReducedMotion();
        this.setupFocusManagement();
        this.setupScreenReader();
    }

    /**
     * Navegação suave moderna
     */
    setupSmoothScrolling() {
        // Delegação de eventos para melhor performance
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                this.scrollToElement(targetElement, link);
            }
        });
    }

    scrollToElement(element, trigger) {
        const offsetTop = element.offsetTop - CONFIG.scrollOffset;
        
        // Modern scroll API com fallback
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: offsetTop,
                behavior: AppState.isReduced ? 'auto' : 'smooth'
            });
        } else {
            // Fallback para browsers antigos
            window.scrollTo(0, offsetTop);
        }

        // Fechar menu mobile se necessário
        if (AppState.mobileMenuOpen) {
            this.toggleMobileMenu();
        }

        // Analytics otimizado
        this.trackEvent('Navigation', 'Scroll', trigger.getAttribute('href'));
    }

    /**
     * Highlight de navegação otimizado
     */
    setupNavigationHighlight() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (!sections.length || !navLinks.length) return;

        // Intersection Observer para melhor performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.updateActiveNavigation(entry.target.id, navLinks);
                }
            });
        }, {
            rootMargin: `-${CONFIG.scrollOffset}px 0px -70% 0px`,
            threshold: 0
        });

        sections.forEach(section => observer.observe(section));
        AppState.observers.set('navigation', observer);
    }

    updateActiveNavigation(sectionId, navLinks) {
        if (sectionId === AppState.currentSection) return;
        
        AppState.currentSection = sectionId;
        
        // Batch DOM updates
        requestAnimationFrame(() => {
            navLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${sectionId}`;
                link.classList.toggle('active', isActive);
                link.setAttribute('aria-current', isActive ? 'page' : 'false');
            });
        });
    }

    /**
     * Barra de progresso otimizada
     */
    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-indicator';
        progressBar.setAttribute('role', 'progressbar');
        progressBar.setAttribute('aria-label', 'Progresso da página');
        document.body.appendChild(progressBar);

        let ticking = false;

        const updateProgress = () => {
            const scrollTop = window.pageYOffset;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = Math.min((scrollTop / documentHeight) * 100, 100);
            
            progressBar.style.width = `${progress}%`;
            progressBar.setAttribute('aria-valuenow', Math.round(progress));
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Menu mobile moderno
     */
    setupMobileMenu() {
        const menuButton = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (!menuButton || !mobileMenu) return;

        menuButton.addEventListener('click', () => this.toggleMobileMenu());
        
        // Fechar com Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && AppState.mobileMenuOpen) {
                this.toggleMobileMenu();
            }
        });

        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (AppState.mobileMenuOpen && 
                !menuButton.contains(e.target) && 
                !mobileMenu.contains(e.target)) {
                this.toggleMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const menuButton = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const icon = menuButton.querySelector('i');
        
        AppState.mobileMenuOpen = !AppState.mobileMenuOpen;
        
        // Batch DOM updates
        requestAnimationFrame(() => {
            mobileMenu.classList.toggle('hidden', !AppState.mobileMenuOpen);
            icon.classList.toggle('fa-bars', !AppState.mobileMenuOpen);
            icon.classList.toggle('fa-times', AppState.mobileMenuOpen);
            
            // Accessibility
            menuButton.setAttribute('aria-expanded', AppState.mobileMenuOpen);
            mobileMenu.setAttribute('aria-hidden', !AppState.mobileMenuOpen);
            
            // Prevent body scroll
            document.body.style.overflow = AppState.mobileMenuOpen ? 'hidden' : '';
        });
    }

    /**
     * Botões de contato inteligentes
     */
    setupContactButtons() {
        // WhatsApp buttons
        document.addEventListener('click', (e) => {
            const whatsappBtn = e.target.closest('[href*="wa.me"], .cta-whatsapp');
            if (whatsappBtn) {
                this.handleWhatsAppClick(whatsappBtn);
            }

            const instagramBtn = e.target.closest('.cta-instagram');
            if (instagramBtn) {
                this.handleInstagramClick(instagramBtn, e);
            }

            //const formBtn = e.target.closest('.cta-form');
            //if (formBtn) {
            //   this.handleFormClick(formBtn, e);
            //}
        });

        // Update WhatsApp links with context
        this.updateWhatsAppLinks();
    }

    handleWhatsAppClick(button) {
        // Update URLs se necessário
        const href = button.getAttribute('href');
        if (href && href.includes('5519999999999')) {
            const newHref = href.replace('5519999999999', CONFIG.whatsappNumber);
            button.setAttribute('href', newHref);
        }
        
        this.trackEvent('Contact', 'WhatsApp', 'Click');
    }

    handleInstagramClick(button, event) {
        if (button.getAttribute('href') === '#') {
            event.preventDefault();
            this.showNotification('Instagram em breve! Entre em contato pelo WhatsApp.');
        }
        this.trackEvent('Contact', 'Instagram', 'Click');
    }

   // handleFormClick(button, event) {
    //    window.open('forms.gle/1Bd6AnhzhsCyZ7zL7S', '_blank');
//this.trackEvent('Contact', 'Form', 'Click');
   // }

    /**
     * Intersection Observer moderno
     */
    setupIntersectionObserver() {
        const elementsToAnimate = document.querySelectorAll(`
            .card-hover, .service-card, .problem-card, 
            .project-card, .platform-category, .benefit-item
        `);

        if (!elementsToAnimate.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });

        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            observer.observe(el);
        });

        AppState.observers.set('animation', observer);
    }

    animateElement(element) {
        if (AppState.isReduced) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            return;
        }

        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }

    /**
     * Navegação por teclado
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    /**
     * Lazy loading inteligente
     */
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if (!images.length) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
        AppState.observers.set('images', imageObserver);
    }

    /**
     * Resource hints para performance
     */
    setupResourceHints() {
        // Preconnect para recursos externos
        const connections = [
            'https://fonts.googleapis.com',
            'https://cdnjs.cloudflare.com'
        ];

        connections.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = url;
            document.head.appendChild(link);
        });
    }

    /**
     * Redução de movimento para acessibilidade
     */
    setupReducedMotion() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleChange = (e) => {
            AppState.isReduced = e.matches;
            document.documentElement.style.setProperty(
                '--animation-duration', 
                e.matches ? '0ms' : '300ms'
            );
        };

        mediaQuery.addEventListener('change', handleChange);
        handleChange(mediaQuery);
    }

    /**
     * Gerenciamento de foco
     */
    setupFocusManagement() {
        // Skip links
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link sr-only focus:not-sr-only';
        skipLink.textContent = 'Pular para conteúdo principal';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Focus trap para modal
        this.setupFocusTrap();
    }

    setupFocusTrap() {
        const focusableSelectors = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
        
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab' || !AppState.mobileMenuOpen) return;

            const mobileMenu = document.getElementById('mobile-menu');
            const focusableElements = mobileMenu.querySelectorAll(focusableSelectors);
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        });
    }

    /**
     * Screen reader support
     */
    setupScreenReader() {
        // Anúncios de mudança de página
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.id = 'announcer';
        document.body.appendChild(announcer);
    }

    announce(message) {
        const announcer = document.getElementById('announcer');
        announcer.textContent = message;
        setTimeout(() => announcer.textContent = '', 1000);
    }

    /**
     * Notificações modernas
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <span>${message}</span>
                <button class="notification__close" aria-label="Fechar notificação">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove
        setTimeout(() => this.removeNotification(notification), 5000);

        // Close button
        notification.querySelector('.notification__close').addEventListener('click', () => {
            this.removeNotification(notification);
        });

        // Accessibility
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');
    }

    removeNotification(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-100%)';
        setTimeout(() => notification.remove(), 300);
    }

    /**
     * Atualização de links WhatsApp com contexto
     */
    updateWhatsAppLinks() {
        const contexts = {
            projetos: 'Olá! Vi os cases de automação no site e gostaria de conversar sobre meu projeto.',
            servicos: 'Olá! Tenho interesse em integração de sistemas. Podemos conversar?',
            contato: 'Olá! Gostaria de uma consultoria sobre automação para minha empresa.',
            geral: 'Olá! Gostaria de saber mais sobre automação de processos.'
        };

        document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
            const section = link.closest('section');
            const context = section ? section.id : 'geral';
            const message = contexts[context] || contexts.geral;
            
            const url = new URL(link.href);
            url.searchParams.set('text', message);
            link.href = url.toString();
        });
    }

    /**
     * Analytics otimizado
     */
    trackEvent(category, action, label) {
        // Debounce tracking
        clearTimeout(this.trackingTimeout);
        this.trackingTimeout = setTimeout(() => {
            // Google Analytics 4
            if (typeof gtag !== 'undefined') {
                gtag('event', action, {
                    event_category: category,
                    event_label: label,
                    custom_parameter_1: window.location.pathname
                });
            }

            // Console para debug
            if (window.location.hostname === 'localhost') {
                console.log(`📊 ${category} - ${action} - ${label}`);
            }
        }, 100);
    }

    /**
     * Tratamento de erros
     */
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Erro JavaScript:', e.error);
            this.trackEvent('Error', 'JavaScript', e.message);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promise rejeitada:', e.reason);
            this.trackEvent('Error', 'Promise', e.reason.toString());
        });
    }

    /**
     * Cleanup ao sair da página
     */
    cleanup() {
        AppState.observers.forEach(observer => observer.disconnect());
        AppState.observers.clear();
    }
}

// CSS para notificações
const notificationCSS = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    opacity: 1;
    transform: translateY(0);
    transition: all 0.3s ease;
    max-width: 400px;
}

.notification__content {
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.notification__close {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s;
}

.notification__close:hover {
    opacity: 1;
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    white-space: nowrap;
    border: 0;
}

.sr-only.focus:not-sr-only {
    position: static;
    width: auto;
    height: auto;
    padding: inherit;
    margin: inherit;
    overflow: visible;
    clip: auto;
    white-space: inherit;
}

.skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 1001;
}

.skip-link:focus {
    top: 6px;
}

.keyboard-navigation *:focus {
    outline: 2px solid #3894A3 !important;
    outline-offset: 2px !important;
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = notificationCSS;
document.head.appendChild(style);

// Inicializar aplicação
const app = new AxelApp();

// Cleanup ao sair
window.addEventListener('beforeunload', () => app.cleanup());