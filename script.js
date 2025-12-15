
// Floating shapes animation
function createFloatingShapes() {
    const container = document.getElementById('floatingShapes');
    const shapes = ['◆', '●', '▲', '■', '★', '◇', '○', '△'];
    
    setInterval(() => {
        const shape = document.createElement('div');
        shape.className = 'shape';
        shape.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        shape.style.left = Math.random() * 100 + '%';
        shape.style.fontSize = (Math.random() * 20 + 10) + 'px';
        shape.style.color = `hsl(${Math.random() * 360}, 70%, 70%)`;
        shape.style.animationDuration = (Math.random() * 10 + 10) + 's';
        shape.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(shape);
        
        setTimeout(() => {
            if (container.contains(shape)) {
                container.removeChild(shape);
            }
        }, 20000);
    }, 2000);
}

// Scroll reveal animation
function revealElements() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 100;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Smooth scrolling for navigation
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Navigation active state
function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.background = 'transparent';
        link.style.color = 'rgba(255, 255, 255, 0.8)';
        
        if (link.getAttribute('href') === `#${current}`) {
            link.style.background = 'rgba(255, 255, 255, 0.1)';
            link.style.color = '#ffffff';
        }
    });
}

// Form submission with glass effect
function initContactForm() {
    const form = document.querySelector('.contact-form form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.submit-button');
        const originalText = submitBtn.textContent;
        
        // Loading animation
        submitBtn.textContent = 'Sending...';
        submitBtn.style.background = 'linear-gradient(135deg, #54a0ff, #5f27cd)';
        
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent! ✓';
            submitBtn.style.background = 'linear-gradient(135deg, #00d2d3, #10ac84)';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
                form.reset();
            }, 3000);
        }, 2000);
    });
}

// Parallax effect for blobs
function parallaxBlobs() {
    const blobs = document.querySelectorAll('.blob');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.3;
    
    blobs.forEach((blob, index) => {
        const speed = (index + 1) * 0.1;
        blob.style.transform = `translate3d(0, ${rate * speed}px, 0)`;
    });
}

// Mouse interaction for glass cards
function initMouseInteraction() {
    const cards = document.querySelectorAll('.glass');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            card.style.transition = 'none';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            card.style.transition = 'transform 0.5s ease';
        });
    });
}

// Dynamic background color based on scroll
function updateBackgroundGradient() {
    const scrollPercent = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
    const hue1 = 230 + (scrollPercent * 50); // From 230 to 280
    const hue2 = 280 + (scrollPercent * 50); // From 280 to 330
    
    document.body.style.background = `linear-gradient(135deg, hsl(${hue1}, 60%, 60%) 0%, hsl(${hue2}, 50%, 50%) 100%)`;
}

// Initialize typing effect for hero section
function typeWriter() {
    const words = ['Creative Developer', 'UI/UX Designer', 'Problem Solver', 'Tech Enthusiast'];
    const subtitle = document.querySelector('.hero-subtitle');
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            subtitle.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            subtitle.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            setTimeout(() => isDeleting = true, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }

        const typingSpeed = isDeleting ? 50 : 100;
        setTimeout(type, typingSpeed);
    }

    // Start typing after a short delay
    setTimeout(type, 1000);
}

// Add sparkle effect on click
function createSparkle(e) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = e.clientX + 'px';
    sparkle.style.top = e.clientY + 'px';
    sparkle.style.width = '10px';
    sparkle.style.height = '10px';
    sparkle.style.background = 'radial-gradient(circle, #fff, transparent)';
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    sparkle.style.animation = 'sparkleAnimation 0.6s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        if (document.body.contains(sparkle)) {
            document.body.removeChild(sparkle);
        }
    }, 600);
}

// Add sparkle animation keyframes
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkleAnimation {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: scale(1) rotate(180deg);
            opacity: 1;
        }
        100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkleStyle);

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    createFloatingShapes();
    initSmoothScroll();
    initContactForm();
    initMouseInteraction();
    typeWriter();
    revealElements();
    updateActiveNav();
});

// Event listeners
window.addEventListener('scroll', function() {
    revealElements();
    updateActiveNav();
    parallaxBlobs();
    updateBackgroundGradient();
});

// Add sparkle effect to buttons
document.addEventListener('click', function(e) {
    if (e.target.matches('.glass-button, .submit-button, .project-link')) {
        createSparkle(e);
    }
});

// Add window resize handler
window.addEventListener('resize', function() {
    // Recalculate animations on resize
    revealElements();
});

// Performance optimization: throttle scroll events
let ticking = false;
function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
}

function updateScrollEffects() {
    revealElements();
    updateActiveNav();
    parallaxBlobs();
    updateBackgroundGradient();
    ticking = false;
}

window.addEventListener('scroll', requestTick);
