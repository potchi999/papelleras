(() => {
    'use strict';

    //-----------------------------
    // Theme Selector Component
    //-----------------------------
    class TTheme extends HTMLElement {
        connectedCallback() {
            const type = this.getAttribute("mode") || "navbar";
            const html = document.documentElement;

            const applySystemTheme = () => {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) html.setAttribute("data-theme", "dark");
                else html.removeAttribute("data-theme");
            };

            let savedTheme = localStorage.getItem("theme") || "auto";
            let mq;

            const applyTheme = (mode) => {
                if (mq) mq.removeEventListener("change", applySystemTheme);

                if (mode === "light") {
                    html.setAttribute("data-theme", "light");
                } else if (mode === "dark") {
                    html.setAttribute("data-theme", "dark");
                } else {
                    mq = window.matchMedia("(prefers-color-scheme: dark)");
                    mq.addEventListener("change", applySystemTheme);
                    applySystemTheme();
                }
            };

            applyTheme(savedTheme);

            const broadcastThemeChange = (mode) => {
                localStorage.setItem("theme", mode);
                window.dispatchEvent(new CustomEvent("theme-change", { detail: mode }));
            };

            const getIonIconName = (theme) =>
                theme === "dark" ? "moon" :
                    theme === "auto" ? "desktop" : "sunny";

            if (type === "sidebar") {
                this.innerHTML = `
                    <div class="theme-buttons">
                        <button class="mode-btn" data-mode="light" aria-label="Light mode">
                            <ion-icon name="sunny"></ion-icon>
                        </button>
                        <button class="mode-btn" data-mode="auto" aria-label="System mode">
                            <ion-icon name="desktop"></ion-icon>
                        </button>
                        <button class="mode-btn" data-mode="dark" aria-label="Dark mode">
                            <ion-icon name="moon"></ion-icon>
                        </button>
                    </div>
                `;

                const buttons = this.querySelectorAll(".mode-btn");

                const updateActive = () => {
                    buttons.forEach((btn) =>
                        btn.classList.toggle("active", btn.dataset.mode === savedTheme)
                    );
                };
                updateActive();

                buttons.forEach((btn) => {
                    btn.addEventListener("click", () => {
                        const mode = btn.dataset.mode;
                        savedTheme = mode;
                        applyTheme(mode);
                        broadcastThemeChange(mode);
                        updateActive();
                    });
                });
            } else {
                this.innerHTML = `
                    <li class="dark-mode-toggle" id="dark-mode-toggle" role="button" tabindex="0">
                        <ion-icon name="\${getIonIconName(savedTheme)}"></ion-icon>
                    </li>
                    <ul class="dropdown-theme">
                        <li data-mode="light"><ion-icon name="sunny"></ion-icon> Light</li>
                        <li data-mode="auto"><ion-icon name="desktop"></ion-icon> System</li>
                        <li data-mode="dark"><ion-icon name="moon"></ion-icon> Dark</li>
                    </ul>
                `;

                const toggleBtn = this.querySelector("#dark-mode-toggle");
                const dropdown = this.querySelector(".dropdown-theme");
                const dropdownItems = dropdown.querySelectorAll("li");

                const updateDropdownActive = () => {
                    dropdownItems.forEach((item) =>
                        item.classList.toggle("active", item.dataset.mode === savedTheme)
                    );
                    toggleBtn.querySelector("ion-icon").setAttribute("name", getIonIconName(savedTheme));
                };
                updateDropdownActive();

                toggleBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const isOpen = dropdown.style.display === "block";
                    dropdown.style.display = isOpen ? "none" : "block";
                    toggleBtn.classList.toggle("active", !isOpen);
                });

                dropdownItems.forEach((item) => {
                    item.addEventListener("click", () => {
                        const mode = item.dataset.mode;
                        savedTheme = mode;
                        applyTheme(mode);
                        broadcastThemeChange(mode);
                        dropdown.style.display = "none";
                        toggleBtn.classList.remove("active");
                        updateDropdownActive();
                    });
                });

                document.addEventListener("click", (e) => {
                    if (!this.contains(e.target)) {
                        dropdown.style.display = "none";
                        toggleBtn.classList.remove("active");
                    }
                });
            }

            window.addEventListener("theme-change", (e) => {
                savedTheme = e.detail;
                applyTheme(savedTheme);

                if (type === "sidebar") {
                    const buttons = this.querySelectorAll(".mode-btn");
                    buttons.forEach((btn) =>
                        btn.classList.toggle("active", btn.dataset.mode === savedTheme)
                    );
                } else {
                    const toggleBtn = this.querySelector("#dark-mode-toggle");
                    const dropdownItems = this.querySelectorAll(".dropdown-theme li");
                    dropdownItems.forEach((item) =>
                        item.classList.toggle("active", item.dataset.mode === savedTheme)
                    );
                    toggleBtn.querySelector("ion-icon").setAttribute("name", getIonIconName(savedTheme));
                }
            });

            window.addEventListener("storage", (e) => {
                if (e.key === "theme" && e.newValue) {
                    const mode = e.newValue;
                    savedTheme = mode;
                    applyTheme(mode);
                    window.dispatchEvent(new CustomEvent("theme-change", { detail: mode }));
                }
            });
        }
    }
    customElements.define("t-theme", TTheme);



    //-----------------------------
    // Floating shapes animation
    //-----------------------------
    function createFloatingShapes() {
        const container = document.getElementById('floatingShapes');
        if (!container) return;

        const shapes = ['◆', '●', '▲', '■', '★', '◇', '○', '△'];
        const colors = ['--color-primary', '--color-secondary', '--color-success', '--color-warning', '--color-danger'];

        setInterval(() => {
            const shape = document.createElement('div');
            shape.className = 'shape';
            shape.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            shape.style.position = 'absolute';
            shape.style.left = Math.random() * 100 + '%';
            shape.style.top = '-20px';
            shape.style.fontSize = (Math.random() * 20 + 10) + 'px';

            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            shape.style.color = getComputedStyle(document.documentElement).getPropertyValue(randomColor);

            shape.style.animationDuration = (Math.random() * 10 + 10) + 's';
            shape.style.animationDelay = Math.random() * 2 + 's';
            shape.style.pointerEvents = 'none';

            container.appendChild(shape);

            setTimeout(() => {
                if (container.contains(shape)) container.removeChild(shape);
            }, 20000);
        }, 2000);
    }

    //-----------------------------
    // Reveal elements
    //-----------------------------
    function revealElements() {
        const reveals = document.querySelectorAll('.reveal');
        if (!reveals.length) return;

        reveals.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementVisible = 100;
            if (rect.top < window.innerHeight - elementVisible) element.classList.add('active');
        });
    }

    //-----------------------------
    // Smooth scrolling
    //-----------------------------
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href') || '';
                if (!href.startsWith('#')) return;
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    //-----------------------------
    // Update active nav links
    //-----------------------------
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        if (!sections.length || !navLinks.length) return;

        let current = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 200) current = section.getAttribute('id') || '';
        });

        navLinks.forEach(link => {
            const root = document.documentElement;
            link.style.background = 'transparent';
            link.style.color = getComputedStyle(root).getPropertyValue('--text-secondary');

            const href = link.getAttribute('href') || '';
            const icon = link.querySelector('ion-icon');

            if (href === `#${current}`) {
                link.style.background = getComputedStyle(root).getPropertyValue('--bg-glass-hover');
                link.style.color = getComputedStyle(root).getPropertyValue('--text-primary');
                if (icon && icon.getAttribute('name').endsWith('-outline')) icon.setAttribute('name', icon.getAttribute('name').replace('-outline', ''));
            } else {
                if (icon && !icon.getAttribute('name').endsWith('-outline')) icon.setAttribute('name', icon.getAttribute('name') + '-outline');
            }
        });
    }

    //-----------------------------
    // Contact form feedback
    //-----------------------------
    function initContactForm() {
        const form = document.querySelector('.contact-form form');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const submitBtn = this.querySelector('.submit-button');
            if (!submitBtn) return;

            const originalText = submitBtn.textContent || 'Send Message';
            const root = document.documentElement;

            // Loading animation
            submitBtn.textContent = 'Sending...';
            submitBtn.style.background = `linear-gradient(135deg, ${getComputedStyle(root).getPropertyValue('--color-primary')}, ${getComputedStyle(root).getPropertyValue('--color-secondary')})`;

            setTimeout(() => {
                submitBtn.textContent = 'Message Sent! ✓';
                submitBtn.style.background = `linear-gradient(135deg, ${getComputedStyle(root).getPropertyValue('--color-success')}, ${getComputedStyle(root).getPropertyValue('--color-primary')})`;

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = `linear-gradient(135deg, ${getComputedStyle(root).getPropertyValue('--color-primary')}, ${getComputedStyle(root).getPropertyValue('--color-secondary')})`;
                    form.reset();
                }, 3000);
            }, 2000);
        });
    }

    //-----------------------------
    // CONTINUOUS PARALLAX BLOBS - ALWAYS VISIBLE WITH SCALING
    //-----------------------------
    function parallaxBlobs() {
        const blobs = document.querySelectorAll('.blob');
        const scrolled = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;

        blobs.forEach((blob, index) => {
            // Different depth speeds for each layer
            const depthSpeeds = [0.15, 0.3, 0.5, 0.7];
            const speed = depthSpeeds[index] || 0.5;

            // CONTINUOUS vertical movement (but slower to keep blobs visible)
            const baseY = scrolled * speed * 0.3;
            const y = baseY % (windowHeight * 2) - windowHeight;

            // Subtle horizontal drift for 3D effect
            const x = Math.sin(scrolled * 0.001 + index) * 50 * (index + 1);

            // CONTINUOUS SCALING based on scroll position
            const scrollCycle = (scrolled * 0.002) % (Math.PI * 2);
            const baseScale = 1.0;
            const scaleAmplitude = [0.4, 0.5, 0.6, 0.8]; // Different scale ranges per blob
            const scale = baseScale + Math.sin(scrollCycle + index * Math.PI / 2) * scaleAmplitude[index];

            // Continuous rotation
            const rotation = (scrolled * (0.05 + index * 0.02)) % 360;

            // Keep opacity constant and visible
            const opacity = 0.7;

            // Apply transformations
            blob.style.transform = `
                translate3d(${x}px, ${y}px, 0) 
                scale(${scale}) 
                rotate(${rotation}deg)
            `;
            blob.style.opacity = opacity;

            // Consistent blur
            const blurAmount = 60 + (index * 15);
            blob.style.filter = `blur(${blurAmount}px)`;
        });
    }

    //-----------------------------
    // Background gradient
    //-----------------------------
    function updateBackgroundGradient() {
        const root = document.documentElement;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = maxScroll > 0 ? (window.pageYOffset || document.documentElement.scrollTop) / maxScroll : 0;

        const bgStart = getComputedStyle(root).getPropertyValue('--bg-primary-start').trim();
        const bgEnd = getComputedStyle(root).getPropertyValue('--bg-primary-end').trim();

        document.body.style.backgroundImage = `linear-gradient(135deg, ${bgStart} 0%, ${bgEnd} 100%)`;
    }

    //-----------------------------
    // Typing effect
    //-----------------------------
    function typeWriter() {
        const words = ['Creative Developer', 'UI/UX Designer', 'Problem Solver', 'Tech Enthusiast'];
        const subtitle = document.querySelector('.hero-subtitle');
        if (!subtitle) return;

        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) subtitle.textContent = currentWord.substring(0, charIndex - 1), charIndex--;
            else subtitle.textContent = currentWord.substring(0, charIndex + 1), charIndex++;

            if (!isDeleting && charIndex === currentWord.length) setTimeout(() => isDeleting = true, 2000);
            else if (isDeleting && charIndex === 0) isDeleting = false, wordIndex = (wordIndex + 1) % words.length;

            const speed = isDeleting ? 50 : 100;
            setTimeout(type, speed);
        }
        setTimeout(type, 1000);
    }

    //-----------------------------
    // Sparkle effect
    //-----------------------------
    function createSparkle(e) {
        const root = document.documentElement;
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';
        sparkle.style.width = '10px';
        sparkle.style.height = '10px';
        sparkle.style.background = `radial-gradient(circle, ${getComputedStyle(root).getPropertyValue('--text-primary')}, transparent)`;
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        sparkle.style.animation = 'sparkleAnimation 0.6s ease-out forwards';
        document.body.appendChild(sparkle);

        setTimeout(() => { if (document.body.contains(sparkle)) document.body.removeChild(sparkle) }, 600);
    }

    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
    @keyframes sparkleAnimation {
      0% { transform: scale(0) rotate(0deg); opacity:1; }
      50% { transform: scale(1) rotate(180deg); opacity:1; }
      100% { transform: scale(0) rotate(360deg); opacity:0; }
    }`;
    document.head.appendChild(sparkleStyle);

    //-----------------------------
    // Removed JS toggling of .nav-links (second trigger) - using CSS-only checkbox for sidebar
    //-----------------------------

    //-----------------------------
    // IntersectionObserver
    //-----------------------------
    function initIntersectionObserver() {
        const elements = document.querySelectorAll('.reveal');
        if (!elements.length) return;

        const options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) entry.target.classList.add('active');
                });
            }, options);
            elements.forEach(el => observer.observe(el));
        } else { revealElements(); }
    }

    //-----------------------------
    // Initialization
    //-----------------------------
    document.addEventListener('DOMContentLoaded', () => {
        initIntersectionObserver();
        createFloatingShapes();
        initSmoothScroll();
        initContactForm();
        // Removed initMobileMenu(); to prevent nav-links from toggling on burger click
        typeWriter();
        revealElements();
        updateActiveNav();
        updateBackgroundGradient();

        // Enable 3D perspective on body
        document.body.style.perspective = '1000px';
        document.body.style.perspectiveOrigin = '50% 50%';
    });

    //-----------------------------
    // Scroll & click events
    //-----------------------------
    let ticking = false;
    function updateScrollEffects() {
        revealElements();
        updateActiveNav();
        parallaxBlobs();
        updateBackgroundGradient();
        ticking = false;
    }
    function requestTick() { if (!ticking) { requestAnimationFrame(updateScrollEffects); ticking = true; } }
    window.addEventListener('scroll', requestTick);

    document.addEventListener('click', function (e) {
        if (e.target && (e.target.matches('.glass-button') || e.target.matches('.submit-button') || e.target.matches('.project-link'))) {
            createSparkle(e);
        }
    });

    const navToggle = document.getElementById("nav-toggle");
    const navOverlay = document.querySelector(".nav-overlay");

    if (navOverlay && navToggle) {
        navOverlay.addEventListener("click", () => {
            navToggle.checked = false;
        });
    }

    // Close sidebar when clicking any sidebar link
    const sidebarLinks = document.querySelectorAll(".sidebar-nav-links a");
    if (sidebarLinks && navToggle) {
        sidebarLinks.forEach(link => {
            link.addEventListener("click", () => {
                if (navToggle) navToggle.checked = false;
            });
        });
    }

    //avatar image fallback
    document.addEventListener('DOMContentLoaded', () => {
        const aboutCards = document.querySelectorAll('.about-image');

        aboutCards.forEach(card => {
            const img = card.querySelector('.avatar img');
            const fallback = card.querySelector('.avatar-fallback');

            if (!img) return;

            // Initially hide fallback
            if (fallback) fallback.style.display = 'none';

            // When image loads successfully
            img.addEventListener('load', () => {
                if (fallback) fallback.style.display = 'none';
                img.style.display = 'block';
            });

            // When image fails to load
            img.addEventListener('error', () => {
                img.style.display = 'none';
                if (fallback) {
                    fallback.style.display = 'flex';
                    // Use the img alt text as a label inside the fallback
                    fallback.textContent = img.alt || '';
                }
            });

            // Optional: handle empty src
            if (!img.src) {
                img.dispatchEvent(new Event('error'));
            }
        });
    });

    //project cards image fallback
    document.addEventListener('DOMContentLoaded', () => {
        const projectCards = document.querySelectorAll('.project-card');

        projectCards.forEach(card => {
            const img = card.querySelector('.project-image img');
            const fallback = card.querySelector('.project-image ion-icon');

            if (!img) return;

            // Initially hide fallback if image exists
            if (fallback) fallback.style.display = 'none';

            // When image loads successfully
            img.addEventListener('load', () => {
                if (fallback) fallback.style.display = 'none';
                img.style.display = 'block';
            });

            // When image fails to load
            img.addEventListener('error', () => {
                img.style.display = 'none';
                if (fallback) fallback.style.display = 'flex';
            });

            // Optional: handle empty src
            if (!img.src) {
                img.dispatchEvent(new Event('error'));
            }
        });
    });



    // Close sidebar with Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navToggle && navToggle.checked) {
            navToggle.checked = false;
        }
    });

    window.addEventListener('resize', () => { revealElements(); });

})();