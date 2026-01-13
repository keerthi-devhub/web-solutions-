/* 
   Luxury Landing Page - Advanced Interactions
   Theme: Smooth, Premium, Dynamic
*/

document.addEventListener('DOMContentLoaded', () => {

    // 1. SCRAMBLE TEXT EFFECT FOR MAIN HEADLINE
    const scrambleElement = document.querySelector('.hero h1');
    if (scrambleElement) {
        // Wrap original text in a span avoiding br tags
        const originalText = scrambleElement.innerText;

        // We will animate the "Crafting Digital Masterpieces" concept
        // But since the structure is <h1>Text <br> <span>Text</span></h1>, we target specific parts if possible.
        // For simplicity, let's target the gradient span specifically "Masterpieces"
        const gradientText = document.querySelector('.text-gradient');
        if (gradientText) {
            const finalValue = gradientText.textContent;
            const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let iterations = 0;

            const interval = setInterval(() => {
                gradientText.innerText = finalValue
                    .split('')
                    .map((letter, index) => {
                        if (index < iterations) return finalValue[index];
                        return validChars[Math.floor(Math.random() * 26)];
                    })
                    .join('');

                if (iterations >= finalValue.length) clearInterval(interval);
                iterations += 1 / 3;
            }, 50);
        }
    }


    // 2. 3D TILT EFFECT FOR SERVICE CARDS
    const cards = document.querySelectorAll('.service-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Get rotation values (max +/- 10deg)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            card.style.background = `rgba(255, 255, 255, 0.1)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            card.style.background = `var(--glass-bg)`; // Reset to original CSS var
        });
    });


    // 3. PARALLAX SCROLL EFFECT
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        // Parallax for Hero Text
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
            heroContent.style.opacity = 1 - (scrolled / 700);
        }

        // Navbar Scroll Effect
        const navbar = document.querySelector('.navbar');
        if (scrolled > 50) {
            navbar.style.padding = '1rem 0';
            navbar.style.background = 'rgba(5, 5, 5, 0.95)';
        } else {
            navbar.style.padding = '1.5rem 0';
            navbar.style.background = 'rgba(11, 13, 23, 0.7)';
        }
    });


    // 4. SCROLL REVEAL ANIMATION (Smooth Fade Up)
    const revealElements = document.querySelectorAll('.service-card, .contact-container, .section-header');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(element => {
        element.classList.add('reveal-hidden');
        revealObserver.observe(element);
    });

    // 5. SMOOTH NAVIGATION
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 6. CLICK BLINK EFFECT
    const interactables = document.querySelectorAll('button, a.btn, input[type="submit"], .submit-btn');
    interactables.forEach(el => {
        el.addEventListener('click', function (e) {
            // Remove class if it exists to reset animation
            this.classList.remove('click-blink');

            // Trigger reflow to restart animation
            void this.offsetWidth;

            // Add class
            this.classList.add('click-blink');
        });
    });

    // Dynamic Copyright
    const yearSpan = document.querySelector('footer p');
    if (yearSpan) {
        yearSpan.innerHTML = `&copy; ${new Date().getFullYear()} Aesthetica. All rights reserved.`;
    }

    // 7. FORM SUBMISSION (Formspree)
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerText;

            // Set loading state
            submitBtn.disabled = true;
            submitBtn.innerText = 'Sending...';
            formStatus.style.display = 'none';
            formStatus.className = '';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.innerText = "Thanks for your message! We'll get back to you soon.";
                    formStatus.style.color = '#4ade80'; // Green
                    formStatus.style.display = 'block';
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        formStatus.innerText = data.errors.map(error => error["message"]).join(", ");
                    } else {
                        formStatus.innerText = "Oops! There was a problem submitting your form";
                    }
                    formStatus.style.color = '#ef4444'; // Red
                    formStatus.style.display = 'block';
                }
            } catch (error) {
                formStatus.innerText = "Oops! There was a problem submitting your form";
                formStatus.style.color = '#ef4444'; // Red
                formStatus.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    }

});

// Inject Animation CSS
const style = document.createElement('style');
style.innerHTML = `
    .reveal-hidden {
        opacity: 0;
        transform: translateY(50px);
        transition: all 1s cubic-bezier(0.5, 0, 0, 1);
    }
    .visible {
        opacity: 1;
        transform: translateY(0);
    }
    .service-card {
        transition: transform 0.1s ease, background 0.3s ease; /* Fast transform for smooth tilt */
        will-change: transform;
    }
`;
document.head.appendChild(style);
