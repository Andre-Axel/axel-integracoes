/**
 * AXEL INTEGRAÇÕES - SISTEMA DE ANIMAÇÕES
 * Arquivo: assets/js/animations.js
 * 
 * Sistema completo de animações de scroll e interações
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
        
        console.log('Axel Animations - Sistema inicializado');
    }

    /**
     * Configuração das animações de scroll
     */
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                        
                        // Trigger específico para cada tipo de animação
                        this.handleSpecialAnimations(entry.target);
                        
                    }, delay);
                    
                    // Para de observar após animar (performance)
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
     * Manipula animações especiais baseadas em classes
     */
    handleSpecialAnimations(element) {
        if (element.classList.contains('counter')) {
            this.animateCounter(element);
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
     * Animação de contadores numéricos
     */
    animateCounter(element) {
        const target = parseInt(element.dataset.target || element.textContent.replace(/\D/g, ''));
        const duration = parseInt(element.dataset.duration) || 2000;
        const suffix = element.dataset.suffix || '';
        const prefix = element.dataset.prefix || '';
        
        if (isNaN(target)) return;
        
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
                // Remove cursor após terminar
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
     * Configuração de animações escalonadas (stagger)
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
     * Sistema de parallax suave
     */
    initParallax() {
        if (window.innerWidth <= 768) return; // Desabilita no mobile
        
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('[class*="parallax-"]');
            
            parallaxElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                
                // Só anima se estiver visível
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
     * Efeitos de hover melhorados
     */
    initHoverEffects() {
        // Cards com animação
        document.querySelectorAll('.card-animate').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCardHover(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCardHover(card, false);
            });
        });

        // Botões com efeito shimmer
        document.querySelectorAll('.button-animate').forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.triggerShimmerEffect(button);
            });
        });
    }

    /**
     * Animação de hover para cards
     */
    animateCardHover(card, isHover) {
        if (isHover) {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = '0 25px 50px -12px rgba(47, 65, 79, 0.2)';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
        }
    }

    /**
     * Efeito shimmer em botões
     */
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
    
    // Anima um elemento específico
    animateElement(selector, animationClass = 'fade-up') {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.add('scroll-animate', animationClass);
            element.classList.add('visible');
        }
    }

    // Remove animação de um elemento
    removeAnimation(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.remove('scroll-animate', 'visible');
        }
    }

    // Trigger manual de contador
    triggerCounter(selector) {
        const element = document.querySelector(selector);
        if (element && element.classList.contains('counter')) {
            this.animateCounter(element);
        }
    }

    // Adiciona delay a um elemento
    addDelay(selector, delay) {
        const element = document.querySelector(selector);
        if (element) {
            element.dataset.delay = delay;
        }
    }

    // Reset de todas as animações (útil para SPAs)
    resetAnimations() {
        document.querySelectorAll('.scroll-animate.visible').forEach(el => {
            el.classList.remove('visible');
        });
        
        // Re-observa elementos
        this.initScrollAnimations();
    }
}

/**
 * Funções utilitárias globais
 */

// Função para detectar se animações devem ser reduzidas
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Função para adicionar animação a elemento específico
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

// Função para criar animação de stagger em grupo
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

// Função para adicionar parallax
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
 * Inicialização automática
 */

// Verifica se animações devem ser desabilitadas
if (prefersReducedMotion()) {
    document.documentElement.style.setProperty('--animation-duration', '0ms');
    console.log('Axel Animations - Movimento reduzido detectado, animações desabilitadas');
} else {
    // Inicializa o sistema de animações
    const axelAnimations = new AxelAnimations();
    
    // Torna disponível globalmente para uso manual
    window.AxelAnimations = axelAnimations;
}

/**
 * Configurações adicionais
 */

// Performance: Limita FPS em dispositivos de baixa performance
let lastFrameTime = 0;
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;

function throttleAnimation(callback) {
    return function(...args) {
        const currentTime = Date.now();
        if (currentTime - lastFrameTime >= frameInterval) {
            callback.apply(this, args);
            lastFrameTime = currentTime;
        }
    };
}

// Export para uso em módulos ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AxelAnimations, addScrollAnimation, createStaggerGroup, addParallax };
}