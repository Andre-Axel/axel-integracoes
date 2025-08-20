/**
 * AXEL INTEGRAÇÕES - ANIMAÇÕES E EFEITOS VISUAIS
 * Animações customizadas e efeitos interativos
 */

// Configurações de animação
const ANIMATION_CONFIG = {
    duration: {
        fast: 200,
        normal: 300,
        slow: 500
    },
    easing: {
        easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },
    delays: {
        stagger: 100,
        cascade: 150
    }
};

/**
 * Inicialização das animações
 */
document.addEventListener('DOMContentLoaded', function() {
    initCardAnimations();
    initHeroAnimations();
    initScrollAnimations();
    initParallaxEffects();
    initLoadingAnimations();
    initAdvancedEffects();
});

/**
 * Animações dos cards com hover e entrada
 */
function initCardAnimations() {
    const cards = document.querySelectorAll('.card-hover, .service-card, .problem-card, .project-card, .platform-category');
    
    cards.forEach((card, index) => {
        // Estado inicial
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        // Observer para animação de entrada
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        animateCardEntry(entry.target);
                    }, index * ANIMATION_CONFIG.delays.stagger);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(card);
        
        // Efeitos de hover
        addHoverEffects(card);
    });
}

function animateCardEntry(card) {
    card.style.transition = `all ${ANIMATION_CONFIG.duration.slow}ms ${ANIMATION_CONFIG.easing.easeOut}`;
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
}

function addHoverEffects(card) {
    card.addEventListener('mouseenter', function() {
        this.style.transition = `transform ${ANIMATION_CONFIG.duration.fast}ms ${ANIMATION_CONFIG.easing.easeOut}`;
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
    
    // Efeito de ripple ao clicar
    card.addEventListener('click', function(e) {
        createRippleEffect(this, e);
    });
}

/**
 * Animações do hero section
 */
function initHeroAnimations() {
    const heroElements = [
        document.querySelector('#hero h1'),
        document.querySelector('#hero .text-xl'),
        document.querySelector('#hero .text-lg'),
        ...document.querySelectorAll('#hero .btn-primary, #hero .btn-secondary')
    ];
    
    heroElements.forEach((element, index) => {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.transform = 'translateY(40px)';
        
        setTimeout(() => {
            element.style.transition = `all ${ANIMATION_CONFIG.duration.slow}ms ${ANIMATION_CONFIG.easing.easeOut}`;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * ANIMATION_CONFIG.delays.cascade + 500);
    });
    
    // Animação do elemento flutuante
    const floatingElement = document.querySelector('.floating-animation');
    if (floatingElement) {
        setTimeout(() => {
            floatingElement.style.opacity = '0';
            floatingElement.style.transform = 'scale(0.8)';
            floatingElement.style.transition = `all ${ANIMATION_CONFIG.duration.slow}ms ease`;
            
            setTimeout(() => {
                floatingElement.style.opacity = '1';
                floatingElement.style.transform = 'scale(1)';
            }, 100);
        }, 1200);
    }
}

/**
 * Animações baseadas em scroll
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animações específicas por seção
                if (entry.target.id === 'beneficios') {
                    animateBenefits();
                }
                
                if (entry.target.id === 'projetos') {
                    animateProjects();
                }
                
                if (entry.target.classList.contains('benefit-item')) {
                    animateBenefitItem(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observar seções
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));
    
    // Observar elementos específicos
    const benefitItems = document.querySelectorAll('.benefit-item');
    benefitItems.forEach(item => observer.observe(item));
}

function animateBenefits() {
    const benefits = document.querySelectorAll('.benefit-item');
    
    benefits.forEach((benefit, index) => {
        setTimeout(() => {
            benefit.style.opacity = '0';
            benefit.style.transform = 'translateX(-30px)';
            benefit.style.transition = `all ${ANIMATION_CONFIG.duration.normal}ms ${ANIMATION_CONFIG.easing.easeOut}`;
            
            setTimeout(() => {
                benefit.style.opacity = '1';
                benefit.style.transform = 'translateX(0)';
            }, 50);
        }, index * 200);
    });
}

function animateProjects() {
    const projects = document.querySelectorAll('.project-card');
    
    projects.forEach((project, index) => {
        setTimeout(() => {
            project.style.transform = 'scale(0.9) rotateY(10deg)';
            project.style.transition = `all ${ANIMATION_CONFIG.duration.slow}ms ${ANIMATION_CONFIG.easing.bounce}`;
            
            setTimeout(() => {
                project.style.transform = 'scale(1) rotateY(0deg)';
            }, 100);
        }, index * 300);
    });
}

function animateBenefitItem(item) {
    const icon = item.querySelector('.bg-green-500, .bg-blue-500, .bg-purple-500, .bg-yellow-500');
    
    if (icon) {
        icon.style.transform = 'scale(0)';
        icon.style.transition = `transform ${ANIMATION_CONFIG.duration.normal}ms ${ANIMATION_CONFIG.easing.bounce}`;
        
        setTimeout(() => {
            icon.style.transform = 'scale(1)';
        }, 200);
    }
}

/**
 * Efeitos de parallax suaves
 */
function initParallaxEffects() {
    if (window.innerWidth < 768) return; // Skip no mobile
    
    const parallaxElements = document.querySelectorAll('.floating-animation');
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    }
    
    window.addEventListener('scroll', throttle(updateParallax, 16));
}

/**
 * Animações de carregamento
 */
function initLoadingAnimations() {
    // Fade-in progressivo dos elementos
    const allElements = document.querySelectorAll('section, nav, footer');
    
    allElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = `all ${ANIMATION_CONFIG.duration.normal}ms ease`;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Loading indicator para imagens
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '0';
            this.style.transition = `opacity ${ANIMATION_CONFIG.duration.normal}ms ease`;
            setTimeout(() => {
                this.style.opacity = '1';
            }, 100);
        });
    });
}

/**
 * Efeitos avançados e interativos
 */
function initAdvancedEffects() {
    initMagneticButtons();
    initTextAnimations();
    initProgressBars();
    initGlowEffects();
}

function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .cta-button');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = 50;
            
            if (distance < maxDistance) {
                const factor = (maxDistance - distance) / maxDistance;
                const moveX = x * factor * 0.2;
                const moveY = y * factor * 0.2;
                
                this.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0) scale(1)';
        });
    });
}

function initTextAnimations() {
    const titles = document.querySelectorAll('h1, h2, h3');
    
    titles.forEach(title => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateTextReveal(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(title);
    });
}

function animateTextReveal(element) {
    const text = element.textContent;
    element.textContent = '';
    
    const letters = text.split('');
    
    letters.forEach((letter, index) => {
        const span = document.createElement('span');
        span.textContent = letter === ' ' ? '\u00A0' : letter;
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        span.style.display = 'inline-block';
        span.style.transition = `all ${ANIMATION_CONFIG.duration.fast}ms ease`;
        
        element.appendChild(span);
        
        setTimeout(() => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

function initProgressBars() {
    // Para futuras barras de progresso de habilidades
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target.dataset.progress || 0;
                    animateProgressBar(entry.target, progress);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(bar);
    });
}

function animateProgressBar(bar, targetProgress) {
    const fill = bar.querySelector('.progress-fill');
    if (!fill) return;
    
    let currentProgress = 0;
    const increment = targetProgress / 60; // 1 second animation at 60fps
    
    function updateProgress() {
        currentProgress += increment;
        
        if (currentProgress >= targetProgress) {
            currentProgress = targetProgress;
        }
        
        fill.style.width = currentProgress + '%';
        
        if (currentProgress < targetProgress) {
            requestAnimationFrame(updateProgress);
        }
    }
    
    requestAnimationFrame(updateProgress);
}

function initGlowEffects() {
    const glowElements = document.querySelectorAll('.gradient-bg, .cta-button');
    
    glowElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.3)';
            this.style.transition = `box-shadow ${ANIMATION_CONFIG.duration.fast}ms ease`;
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

/**
 * Efeito de ripple para cliques
 */
function createRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        pointer-events: none;
        z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    ripple.style.transition = `transform ${ANIMATION_CONFIG.duration.slow}ms ease-out, opacity ${ANIMATION_CONFIG.duration.slow}ms ease-out`;
    ripple.style.transform = 'scale(2)';
    ripple.style.opacity = '0';
    
    setTimeout(() => {
        ripple.remove();
    }, ANIMATION_CONFIG.duration.slow);
}

/**
 * Função throttle para performance
 */
function throttle(func, limit) {
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

/**
 * Função para detectar se o usuário prefere movimento reduzido
 */
function respectsReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Desabilitar animações se o usuário preferir movimento reduzido
if (respectsReducedMotion()) {
    document.documentElement.style.setProperty('--animation-duration', '0ms');
    console.log('Animações reduzidas para acessibilidade');
}

/**
 * Observer de performance para pausar animações em dispositivos lentos
 */
function monitorPerformance() {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            
            entries.forEach(entry => {
                if (entry.name === 'frame' && entry.duration > 16.67) {
                    // Frame rate baixo detectado, reduzir animações
                    document.body.classList.add('reduce-animations');
                }
            });
        });
        
        observer.observe({ entryTypes: ['measure'] });
    }
}

// Inicializar monitoramento de performance
document.addEventListener('DOMContentLoaded', monitorPerformance);

/**
 * Cleanup de animações ao sair da página
 */
window.addEventListener('beforeunload', function() {
    // Pausar todas as animações para performance
    document.querySelectorAll('*').forEach(el => {
        el.style.animationPlayState = 'paused';
        el.style.transitionDuration = '0s';
    });
});