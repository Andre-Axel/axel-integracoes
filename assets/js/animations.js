/**
 * AXEL INTEGRAÇÕES - SISTEMA DE ANIMAÇÕES CORRIGIDO
 * Arquivo: assets/js/animations.js
 */

class AxelAnimations {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.initScrollAnimations();
        this.initCounterAnimations();
        this.initProgressBars();
        this.initParallax();
        this.initHoverEffects();
        this.initTypingEffects();
        this.setupStaggerAnimations();
    }

    /**
     * Configuração das animações de scroll - CORRIGIDO
     */
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        // CORREÇÃO: Usar arrow function para preservar 'this'
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                        
                        // CORREÇÃO: Chamar método corretamente
                        this.handleSpecialAnimations(entry.target);
                        
                    }, delay);
                    
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observa todos os elementos com animação de scroll
        document.querySelectorAll('.scroll-animate').forEach((el) => {
            scrollObserver.observe(el);
        });
    }

    /**
     * NOVO: Sistema dedicado para contadores
     */
    initCounterAnimations() {
        const counters = document.querySelectorAll('.counter');
        
        if (counters.length === 0) return;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.target.classList.contains('counter')) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    /**
     * Manipula animações especiais - CORRIGIDO
     */
    handleSpecialAnimations(element) {
        if (element.classList.contains('counter')) {
            // Counter já tem seu próprio observer, pular aqui
            return;
        }
        
        if (element.classList.contains('progress-bar')) {
            this.animateProgressBar(element);
        }
        
        if (element.classList.contains('typing')) {
            this.startTypingEffect(element);
        }
        
        if (element.classList.contains('text-reveal')) {
            this.animateTextReveal(element);
        }
    }

    /**
     * Animação de contadores - CORRIGIDO E MELHORADO
     */
    animateCounter(element) {
        const target = parseInt(element.dataset.target || element.textContent.replace(/\D/g, ''));
        const duration = parseInt(element.dataset.duration) || 1000;
        const suffix = element.dataset.suffix || '';
        const prefix = element.dataset.prefix || '';
        
        if (isNaN(target)) return;
        
        // Prevenir re-execução
        if (element.dataset.animated === 'true') return;
        element.dataset.animated = 'true';
        
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            const value = Math.floor(current);
            element.textContent = `${prefix}${value}${suffix}`;
        }, 16);
    }

    /**
     * Animação de barras de progresso
     */
    animateProgressBar(element) {
        const width = element.dataset.width || '100%';
        element.style.setProperty('--progress-width', width);
        element.classList.add('animate');
    }

    /**
     * Efeito de digitação
     */
    startTypingEffect(element) {
        const text = element.textContent;
        const speed = parseInt(element.dataset.speed) || 50;
        
        element.textContent = '';
        element.style.borderRight = '2px solid #3894A3';
        
        let i = 0;
        const timer = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            
            if (i > text.length) {
                clearInterval(timer);
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        }, speed);
    }

    /**
     * Animação de revelação de texto
     */
    animateTextReveal(element) {
        element.classList.add('visible');
    }

    /**
     * Configuração de animações escalonadas
     */
    setupStaggerAnimations() {
        const staggerGroups = document.querySelectorAll('[data-stagger-group]');
        
        staggerGroups.forEach(group => {
            const items = group.querySelectorAll('.stagger-item');
            const delay = parseInt(group.dataset.staggerDelay) || 150;
            
            items.forEach((item, index) => {
                item.style.setProperty('--stagger-delay', index);
                item.dataset.delay = index * delay;
            });
        });
    }

    /**
     * Sistema de parallax
     */
    initParallax() {
        if (window.innerWidth <= 768) return;
        
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('[class*="parallax-"]');
            
            parallaxElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                
                if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                    let speed = 0.5;
                    
                    if (element.classList.contains('parallax-slow')) speed = 0.3;
                    if (element.classList.contains('parallax-medium')) speed = 0.5;
                    if (element.classList.contains('parallax-fast')) speed = 0.8;
                    
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                }
            });
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Efeitos de hover
     */
    initHoverEffects() {
        document.querySelectorAll('.card-animate').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCardHover(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCardHover(card, false);
            });
        });

        document.querySelectorAll('.button-animate').forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.triggerShimmerEffect(button);
            });
        });
    }

    animateCardHover(card, isHover) {
        if (isHover) {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = '0 25px 50px -12px rgba(47, 65, 79, 0.2)';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
        }
    }

    triggerShimmerEffect(button) {
        const shimmer = button.querySelector('.shimmer') || document.createElement('div');
        shimmer.className = 'shimmer';
        shimmer.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            transition: left 0.6s ease;
            pointer-events: none;
        `;
        
        if (!button.querySelector('.shimmer')) {
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(shimmer);
        }
        
        setTimeout(() => {
            shimmer.style.left = '100%';
        }, 10);
    }

    /**
     * Efeitos de digitação
     */
    initTypingEffects() {
        document.querySelectorAll('[data-typing]').forEach(element => {
            const text = element.dataset.typing || element.textContent;
            const speed = parseInt(element.dataset.typingSpeed) || 100;
            
            element.textContent = '';
            
            let i = 0;
            const timer = setInterval(() => {
                element.textContent += text.charAt(i);
                i++;
                
                if (i >= text.length) {
                    clearInterval(timer);
                }
            }, speed);
        });
    }

    /**
     * Utilitários públicos
     */
    animateElement(selector, animationClass = 'fade-up') {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.add('scroll-animate', animationClass);
            element.classList.add('visible');
        }
    }

    removeAnimation(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.remove('scroll-animate', 'visible');
        }
    }

    triggerCounter(selector) {
        const element = document.querySelector(selector);
        if (element && element.classList.contains('counter')) {
            this.animateCounter(element);
        }
    }

    addDelay(selector, delay) {
        const element = document.querySelector(selector);
        if (element) {
            element.dataset.delay = delay;
        }
    }

    resetAnimations() {
        document.querySelectorAll('.scroll-animate.visible').forEach(el => {
            el.classList.remove('visible');
        });
        
        this.initScrollAnimations();
        this.initCounterAnimations();
    }
}

/**
 * Funções utilitárias globais
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function addScrollAnimation(element, animationType = 'fade-up', delay = 0) {
    if (typeof element === 'string') {
        element = document.querySelector(element);
    }
    
    if (element) {
        element.classList.add('scroll-animate', animationType);
        if (delay > 0) {
            element.dataset.delay = delay;
        }
    }
}

function createStaggerGroup(selector, options = {}) {
    const container = document.querySelector(selector);
    if (!container) return;
    
    const {
        animationType = 'fade-up',
        delay = 150,
        startDelay = 0
    } = options;
    
    const items = container.children;
    
    Array.from(items).forEach((item, index) => {
        item.classList.add('scroll-animate', animationType, 'stagger-item');
        item.dataset.delay = startDelay + (index * delay);
    });
}

function addParallax(selector, speed = 0.5) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        let className = 'parallax-medium';
        if (speed <= 0.3) className = 'parallax-slow';
        if (speed >= 0.8) className = 'parallax-fast';
        
        el.classList.add(className);
        el.dataset.speed = speed;
    });
}

/**
 * Inicialização
 */
if (prefersReducedMotion()) {
    document.documentElement.style.setProperty('--animation-duration', '0ms');
} else {
    const axelAnimations = new AxelAnimations();
    window.AxelAnimations = axelAnimations;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AxelAnimations, addScrollAnimation, createStaggerGroup, addParallax };
}