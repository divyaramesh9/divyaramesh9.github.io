// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        // Toggle navigation
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when a link is clicked
if (hamburger && navLinks) {
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Scroll-spy: highlight current section in the nav
const menuItems = document.querySelectorAll('.nav-links a[data-scrollspy]');
const sections = Array.from(menuItems)
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

const setActiveNav = (hash) => {
    menuItems.forEach(a => {
        const href = a.getAttribute('href');
        if (href === hash) {
            a.classList.add('active');
        } else {
            a.classList.remove('active');
        }
    });
};

if (sections.length > 0) {
    const observer = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter(e => e.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (visible && visible.target && visible.target.id) {
                setActiveNav(`#${visible.target.id}`);
            }
        },
        {
            root: null,
            threshold: [0.15, 0.3, 0.5, 0.75],
            rootMargin: '-120px 0px -60% 0px'
        }
    );

    sections.forEach(section => observer.observe(section));
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        if (!targetId.startsWith('#')) return;

        e.preventDefault();
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });

            setActiveNav(targetId);

            if (navLinks && hamburger) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
});

// Form submission handling
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);

        const existingMessage = document.querySelector('.success-message, .error-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Thank you for your message! I will get back to you soon.';
                successMessage.style.backgroundColor = '#4CAF50';
                successMessage.style.color = 'white';
                successMessage.style.padding = '1rem';
                successMessage.style.borderRadius = '4px';
                successMessage.style.marginTop = '1rem';
                successMessage.style.textAlign = 'center';
                
                // Clear the form
                contactForm.reset();
                
                // Add the new success message
                contactForm.appendChild(successMessage);
                
                // Remove the message after 5 seconds
                setTimeout(() => {
                    successMessage.style.opacity = '0';
                    setTimeout(() => {
                        successMessage.remove();
                    }, 500);
                }, 5000);
            } else {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = (data && data.message) ? data.message : 'Sorry—something went wrong. Please try again.';
                errorMessage.style.backgroundColor = '#E53935';
                errorMessage.style.color = 'white';
                errorMessage.style.padding = '1rem';
                errorMessage.style.borderRadius = '4px';
                errorMessage.style.marginTop = '1rem';
                errorMessage.style.textAlign = 'center';

                contactForm.appendChild(errorMessage);
            }
        } catch (err) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Network error—please try again later.';
            errorMessage.style.backgroundColor = '#E53935';
            errorMessage.style.color = 'white';
            errorMessage.style.padding = '1rem';
            errorMessage.style.borderRadius = '4px';
            errorMessage.style.marginTop = '1rem';
            errorMessage.style.textAlign = 'center';

            contactForm.appendChild(errorMessage);
        }
    });
}
