// Manejo de Interacciones y Animaciones del Portafolio

document.addEventListener('DOMContentLoaded', () => {

    // 1. Animaciones de "Fade Up" al hacer Scroll (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Se activa cuando el 15% del elemento es visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Opcional: Descomentar la siguiente línea si quieres que la animación ocurra solo una vez
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Seleccionamos todos los elementos a los que queremos darle el efecto
    const elementsToAnimate = document.querySelectorAll(
        '.section-title, .about-card, .timeline-item, .project-card, .skills-box, .contact-info, .social-icon'
    );

    // Les agregamos la clase base "fade-up" para ocultarlos inicialmente y ser trackeados
    elementsToAnimate.forEach((el, index) => {
        el.classList.add('fade-up');
        // Pequeño delay dinámico horizontal opcional (puedes ajustar el valor)
        // el.style.transitionDelay = `${index * 0.05}s`;
        scrollObserver.observe(el);
    });

    // 2. Efecto Tilt 3D estilo Glassmorphism en las Tarjetas (Proyecto, Experiencia, Perfil)
    const cards = document.querySelectorAll('.card, .project-card, .about-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            // Posición del ratón dentro de la tarjeta
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculamos el centro de la tarjeta
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Rango de inclinación max: 8 grados
            const rotateX = ((y - centerY) / centerY) * -8; 
            const rotateY = ((x - centerX) / centerX) * 8;
            
            // Asignamos el transform dinámico
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            // Volver a la posición original suavemente
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // 3. Resaltar enlace de Navegación Activo según la sección en vista
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Se resta 150 para que el cambio de nav se active un poco antes al hacer scroll hacia abajo
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 4. Efecto sutil "Parallax" en el resplandor de la imagen Hero (Opcional, hace que el brillo siga el mouse sutilmente)
    const heroImageContainer = document.querySelector('.image-wrapper');
    const heroGlow = document.querySelector('.glow-effect');

    if (heroImageContainer && heroGlow) {
        heroImageContainer.addEventListener('mousemove', (e) => {
            const rect = heroImageContainer.getBoundingClientRect();
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);

            // Mueve el fondo un poco en la dirección opuesta al ratón
            heroGlow.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        heroImageContainer.addEventListener('mouseleave', () => {
            heroGlow.style.transform = `translate(0px, 0px)`;
        });
    }

    // 5. Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            cursorOutline.style.left = `${posX}px`;
            cursorOutline.style.top = `${posY}px`;
        });

        // Hover anim en links y tarjetas interactivos
        document.querySelectorAll('a, button, .card, .project-card, .about-card, .timeline-content').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.backgroundColor = 'rgba(168, 85, 247, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '38px';
                cursorOutline.style.height = '38px';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    }

    // 6. Typewriter Effect
    const typedTextSpan = document.getElementById("typed-text");
    let textArrays = {
        es: ["Técnico en Sistemas", "Desarrollador de Software"],
        en: ["Systems Technician", "Software Developer"]
    };
    let currentTypeLang = 'es';
    let textArray = textArrays[currentTypeLang];
    const typingDelay = 100;
    const erasingDelay = 40;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    window.addEventListener('languageChanged', (e) => {
        currentTypeLang = e.detail;
        textArray = textArrays[currentTypeLang];
    });

    function type() {
        if (!typedTextSpan) return;
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (!typedTextSpan) return;
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    if (typedTextSpan && textArray.length) setTimeout(type, newTextDelay + 250);

    // 7. Dynamic Particle Background in Hero
    const canvas = document.getElementById('hero-particles');
    const heroSection = document.querySelector('.hero');
    
    if (canvas && heroSection) {
        const ctx = canvas.getContext('2d');
        let particlesArray;

        canvas.width = window.innerWidth;
        canvas.height = heroSection.offsetHeight;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = heroSection.offsetHeight;
            initParticles();
        });

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function initParticles() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 1) - 0.5;
                let directionY = (Math.random() * 1) - 0.5;
                let color = 'rgba(168, 85, 247, 0.4)';
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function animateParticles() {
            requestAnimationFrame(animateParticles);
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
        }

        initParticles();
        animateParticles();
    }
});
