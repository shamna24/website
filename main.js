document.addEventListener('DOMContentLoaded', () => {
    const bulb = document.getElementById('light-bulb');
    const toggleBtn = document.getElementById('toggle-btn');
    const brandReveal = document.getElementById('brand-reveal');
    const mainNav = document.getElementById('main-nav');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const raysCanvas = document.getElementById('rays-canvas');
    const ctx = raysCanvas.getContext('2d');

    let isOn = false;

    // Mobile Menu Toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-nav-item').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // Set canvas size and cache stable viewport height
    let cachedViewportHeight = window.innerHeight;
    const resizeCanvas = () => {
        raysCanvas.width = window.innerWidth;
        raysCanvas.height = window.innerHeight;
        cachedViewportHeight = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Cinematic Glow Background
    const glowDiv = document.createElement('div');
    glowDiv.className = 'cinematic-glow';
    document.body.appendChild(glowDiv);

    const toggleLight = () => {
        if (isOn) return; 
        
        isOn = true;
        
        // 1. Turn on bulb
        bulb.classList.remove('off');
        bulb.classList.add('on');
        
        // 2. Show cinematic backgrounds
        glowDiv.classList.add('active');
        raysCanvas.classList.add('active');
        
        // 3. Hide button
        toggleBtn.classList.add('hidden');
        
        // 4. Reveal Brand Logo
        setTimeout(() => {
            brandReveal.classList.add('visible');
            startRayAnimation();
        }, 800);

        // Pre-warm video for mobile scroll animation
        const contactVideo = document.getElementById('contact-video-bg');
        if (contactVideo) {
            contactVideo.play().then(() => {
                contactVideo.pause();
                contactVideo.currentTime = 0;
            }).catch(e => console.log('Video pre-warm failed:', e));
        }

        // 5. Reveal Navigation after Logo
        setTimeout(() => {
            mainNav.classList.add('visible');
            if (window.innerWidth <= 768) {
                hamburger.style.display = 'flex';
                hamburger.style.opacity = '1';
            }
        }, 1800);
    };

    bulb.addEventListener('click', toggleLight);
    toggleBtn.addEventListener('click', toggleLight);

    // Particle and Ray Animation Logic
    let rays = [];
    let particles = [];

    class Ray {
        constructor() {
            this.reset();
        }

        reset() {
            this.angle = Math.random() * Math.PI * 2;
            this.length = Math.random() * (Math.max(window.innerWidth, window.innerHeight) * 1.2);
            this.width = Math.random() * 1.5 + 0.2;
            this.opacity = Math.random() * 0.3;
            this.speed = (Math.random() - 0.5) * 0.001;
        }

        draw() {
            const centerX = window.innerWidth / 2;
            const centerY = 150; 

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            
            const endX = centerX + Math.cos(this.angle) * this.length;
            const endY = centerY + Math.sin(this.angle) * this.length;
            
            const gradient = ctx.createLinearGradient(centerX, centerY, endX, endY);
            gradient.addColorStop(0, `rgba(255, 204, 51, ${this.opacity})`);
            gradient.addColorStop(0.2, `rgba(255, 204, 51, ${this.opacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(255, 204, 51, 0)');
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = this.width;
            ctx.stroke();

            this.angle += this.speed;
        }
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > window.innerWidth) this.speedX *= -1;
            if (this.y < 0 || this.y > window.innerHeight) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 204, 51, ${this.opacity})`;
            ctx.fill();
        }
    }

    const initEffects = () => {
        for (let i = 0; i < 60; i++) {
            rays.push(new Ray());
        }
        for (let i = 0; i < 150; i++) { // Increased particles
            particles.push(new Particle());
        }
    };

    const animate = () => {
        if (!isOn) return;
        ctx.clearRect(0, 0, raysCanvas.width, raysCanvas.height);
        
        rays.forEach(ray => ray.draw());
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animate);
    };

    const startRayAnimation = () => {
        initEffects();
        animate();
    };

    // --- Scroll Transformation Logic ---
    const bulbWrapper = document.getElementById('transforming-bulb-container');
    const wireContainer = document.querySelector('.wire-container');
    const magicSection = document.getElementById('behind-the-magic');
    const wallTexture = document.querySelector('.wall-texture');
    const wallGlow = document.getElementById('wall-glow');
    const playgroundBg = document.querySelector('.playground-bg');
    const workspaceSection = document.getElementById('made-with-magic');
    const workspaceBg = document.querySelector('.workspace-bg');
    const surfaceReflection = document.querySelector('.surface-reflection');

    // High-quality cubic easing for cinematic motion
    const easeInOutCubic = (t) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const handleScroll = () => {
        const scrollY = window.scrollY;
        // Use cached height to prevent mobile browser URL bar from causing scroll jumps
        const viewportHeight = cachedViewportHeight;
        
        // --- Phase 1: Hero to Magic (0 to 1vh) ---
        let progress1 = 0;
        if (scrollY < viewportHeight * 1.5) { // Keeps it active slightly past to not snap out
            let p1 = Math.min(Math.max(scrollY / viewportHeight, 0), 1);
            progress1 = easeInOutCubic(p1);
            
            // Only apply Phase 1 transforms if we haven't entered Phase 2 significantly
            if (scrollY < viewportHeight) {
                const leftPos1 = 50 - (progress1 * 42); 
                const translateX1 = -50 + (progress1 * 50); 
                const topPos1 = progress1 * 220; 

                bulbWrapper.style.left = `${leftPos1}%`;
                bulbWrapper.style.transform = `translateX(${translateX1}%) translateY(${topPos1}px)`;
                
                wallTexture.style.opacity = progress1;
                wallGlow.style.opacity = progress1;

                if (progress1 > 0.8) {
                    bulbWrapper.classList.add('wall-mounted');
                    if (isOn) wallGlow.style.opacity = '1';
                } else {
                    bulbWrapper.classList.remove('wall-mounted');
                    wallGlow.style.opacity = '0';
                }
            }
        } 

        // --- Parchment Scroll Animation (tied to Phase 1 progress) ---
        const parchmentBody = document.getElementById('parchment-body');
        const candleGlow = document.querySelector('.scroll-candle-glow');
        const inkLines = document.querySelectorAll('.ink-line');

        if (parchmentBody) {
            const scrollP = Math.min(Math.max(scrollY / viewportHeight, 0), 1);
            
            // Unroll the parchment when user has scrolled 30% into Phase 1
            if (scrollP > 0.3) {
                parchmentBody.classList.add('unrolled');
                if (candleGlow) candleGlow.style.opacity = '1';
            } else {
                parchmentBody.classList.remove('unrolled');
                if (candleGlow) candleGlow.style.opacity = '0';
            }

            // Staggered ink line reveal (each line appears at progressively later scroll points)
            const totalLines = inkLines.length;
            inkLines.forEach((line, index) => {
                // Each line reveals between 0.35 and 0.85 scroll progress
                const lineThreshold = 0.35 + (index / totalLines) * 0.5;
                if (scrollP > lineThreshold) {
                    line.classList.add('revealed');
                } else {
                    line.classList.remove('revealed');
                }
            });
        }
        
        // --- Responsive Settings ---
        const isMobile = window.innerWidth <= 768;
        const targetTop = isMobile ? 50 : 30; // The bulb will hang safely away from the top boundary

        // --- Phase 2: Magic to Playground (1vh to 2vh) ---
        if (scrollY >= viewportHeight && scrollY < viewportHeight * 2.5) {
            let p2 = Math.min(Math.max((scrollY - viewportHeight) / viewportHeight, 0), 1);
            let progress2 = easeInOutCubic(p2);
            
            // Only apply Phase 2 transforms if we haven't entered Phase 3
            if (scrollY < viewportHeight * 2.0) {
                const leftPos = 8 + (progress2 * 42); 
                const translateX = 0 - (progress2 * 50); 
                const topPos = 220 - (progress2 * (220 - targetTop)); 

                bulbWrapper.style.setProperty('--bulb-y', `${topPos}px`);
                bulbWrapper.style.left = `${leftPos}%`;
                bulbWrapper.style.transform = `translateX(${translateX}%) translateY(${topPos}px)`;

                wallTexture.style.opacity = Math.max(0, 1 - progress2);
                wallGlow.style.opacity = Math.max(0, 1 - (progress2 * 1.5));
                playgroundBg.style.opacity = progress2;

                if (progress2 > 0.9) {
                    bulbWrapper.classList.remove('wall-mounted', 'table-lamp');
                    bulbWrapper.classList.add('swinging');
                } else {
                    bulbWrapper.classList.add('wall-mounted');
                    bulbWrapper.classList.remove('swinging', 'table-lamp');
                }
            }
        } 
        
        // --- Phase 3: Playground to Workspace (2vh to 3vh) ---
        if (scrollY >= (viewportHeight * 1.8) && scrollY < viewportHeight * 4.0) { 
            let p3 = Math.min(Math.max((scrollY - (viewportHeight * 2.0)) / viewportHeight, 0), 1);
            let progress3 = easeInOutCubic(p3);

            if (scrollY >= viewportHeight * 2.0 && scrollY < viewportHeight * 3.0) {
                const moveDistance = viewportHeight * 0.5;
                const topPos = targetTop + (progress3 * moveDistance); 
                const leftPos = 50 + (progress3 * 35); 
                
                // Keep swinging for the first few moments of scroll down
                if (progress3 > 0.05) {
                    bulbWrapper.classList.remove('swinging', 'wall-mounted');
                    bulbWrapper.classList.add('table-lamp');
                } else {
                    bulbWrapper.classList.remove('wall-mounted', 'table-lamp');
                    bulbWrapper.classList.add('swinging');
                }
                
                const translateX = -50 + (progress3 * 50); 
                const scale = 1 - (progress3 * 0.4); 
                
                bulbWrapper.style.setProperty('--bulb-y', `${topPos}px`);
                bulbWrapper.style.left = `${leftPos}%`;
                bulbWrapper.style.transform = `translateX(${translateX}%) translateY(${topPos}px) scale(${scale})`;
                
                bulbWrapper.style.opacity = 1 - (progress3 * 2);
                wireContainer.style.opacity = 1 - progress3;

                playgroundBg.style.opacity = Math.max(0, 1 - progress3);
                workspaceSection.classList.add('active');
                workspaceBg.style.opacity = progress3;
                
                if (surfaceReflection) {
                    surfaceReflection.style.opacity = progress3 * 0.5;
                }
            }
        }

        // --- Phase 4: Workspace to Cinematic Finish (3vh to 4vh) ---
        const contactSection = document.getElementById('knock-our-door');
        const contactVideo = document.getElementById('contact-video-bg');
        const contactDetails = document.querySelector('.contact-details-overlay');
        
        const contactStart = viewportHeight * 3.0; 

        if (scrollY >= contactStart) {
            let p4 = Math.min(Math.max((scrollY - contactStart) / viewportHeight, 0), 1);
            let progress4 = Math.min(1, easeInOutCubic(p4) * 1.05); // Slight boost to hit 1.0 safely

            contactSection.classList.add('active');
            if (contactVideo && contactVideo.readyState >= 1) {
                try {
                    contactVideo.currentTime = contactVideo.duration * progress4;
                } catch(e) {}
            }
            if (contactDetails) {
                contactDetails.style.opacity = progress4 >= 0.999 ? 1 : 0;
            }
            workspaceBg.style.opacity = Math.max(0, 1 - (progress4 * 2));
        } else {
            contactSection.classList.remove('active');
            if (contactDetails) {
                contactDetails.style.opacity = 0;
            }
        }
    };

    // --- Smooth Navigation Logic ---
    const scrollToSection = (targetIndex) => {
        let targetScroll = 0;

        switch(parseInt(targetIndex)) {
            case 0: targetScroll = 0; break; 
            case 1: targetScroll = document.getElementById('behind-the-magic').offsetTop; break; 
            case 2: targetScroll = document.getElementById('our-playground').offsetTop; break; 
            case 3: targetScroll = document.getElementById('made-with-magic').offsetTop; break; 
            case 4: targetScroll = document.documentElement.scrollHeight; break; 
        }

        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    };

    // Desktop Nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            if (target !== null) scrollToSection(target);
        });
    });

    // Mobile Nav
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            if (target !== null) {
                scrollToSection(target);
                // Mobile menu already has a listener to close, but let's be explicit
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    });

    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
});
