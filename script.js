// Navigation Scroll Effect
const navbar = document.querySelector('.navbar');
const navMenu = document.querySelector('.nav-menu');
const hamburger = document.querySelector('#hamburger');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Animated Counter for Stats
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.textContent.includes('%') ? '%' : '+');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.textContent.includes('%') ? '%' : '+');
        }
    }, 16);
};

// Intersection Observer for Stats Animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target;
            const target = parseInt(statNumber.getAttribute('data-target'));
            animateCounter(statNumber, target);
            statsObserver.unobserve(statNumber);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(stat => {
    statsObserver.observe(stat);
});

// Testimonials Slider
let currentSlide = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');

const showSlide = (index) => {
    testimonialCards.forEach((card, i) => {
        card.classList.remove('active');
        if (i === index) {
            card.classList.add('active');
        }
    });

    dots.forEach((dot, i) => {
        dot.classList.remove('active');
        if (i === index) {
            dot.classList.add('active');
        }
    });
};

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// Auto-play testimonials
setInterval(() => {
    currentSlide = (currentSlide + 1) % testimonialCards.length;
    showSlide(currentSlide);
}, 5000);

// Form Submission - Enhanced Lead Generation
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            interest: document.getElementById('interest').value,
            message: document.getElementById('message').value,
            newsletter: document.getElementById('newsletter').checked,
            timestamp: new Date().toISOString(),
            source: 'contact_form'
        };

        // Here you would typically send the data to a server/CRM
        // Example: fetch('/api/leads', { method: 'POST', body: JSON.stringify(formData) })
        console.log('Lead captured:', formData);
        
        // Store in localStorage as backup
        const leads = JSON.parse(localStorage.getItem('leads') || '[]');
        leads.push(formData);
        localStorage.setItem('leads', JSON.stringify(leads));
        
        // Show success message
        showSuccessMessage('Thank you for your interest! Our team will contact you within 24 hours.');
        
        // Reset form
        contactForm.reset();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Quick Lead Form (Modal)
const quickLeadForm = document.getElementById('quickLeadForm');
if (quickLeadForm) {
    quickLeadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const inputs = quickLeadForm.querySelectorAll('input');
        const leadData = {
            name: inputs[0].value,
            phone: inputs[1].value,
            email: inputs[2].value,
            timestamp: new Date().toISOString(),
            source: 'quick_lead_modal'
        };
        
        console.log('Quick lead captured:', leadData);
        
        // Store lead
        const leads = JSON.parse(localStorage.getItem('leads') || '[]');
        leads.push(leadData);
        localStorage.setItem('leads', JSON.stringify(leads));
        
        // Close modal
        closeModal();
        
        // Show success
        showSuccessMessage('Thank you! Your free consultation session has been reserved. We\'ll contact you shortly.');
    });
}

// Modal Functionality
const leadModal = document.getElementById('leadModal');
const modalClose = document.getElementById('modalClose');

function openModal() {
    if (leadModal) {
        leadModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (leadModal) {
        leadModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

if (leadModal) {
    leadModal.addEventListener('click', (e) => {
        if (e.target === leadModal) {
            closeModal();
        }
    });
}

// Show modal after user scrolls 50% of page (lead generation strategy)
let modalShown = false;
window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    
    if (scrollPercent > 50 && !modalShown && leadModal) {
        // Check if user hasn't seen modal in this session
        if (!sessionStorage.getItem('modalShown')) {
            setTimeout(() => {
                openModal();
                modalShown = true;
                sessionStorage.setItem('modalShown', 'true');
            }, 2000); // Show after 2 seconds of being at 50% scroll
        }
    }
});

// Success Message Function
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--gradient);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10001;
        animation: slideInRight 0.5s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 500);
    }, 5000);
}

// Track CTA Button Clicks (Analytics)
document.querySelectorAll('.btn-primary, .btn-secondary, .program-cta, .floating-cta-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const ctaData = {
            buttonText: btn.textContent.trim(),
            buttonLocation: btn.closest('section')?.id || 'unknown',
            timestamp: new Date().toISOString()
        };
        console.log('CTA clicked:', ctaData);
        
        // Store for analytics
        const ctaClicks = JSON.parse(localStorage.getItem('ctaClicks') || '[]');
        ctaClicks.push(ctaData);
        localStorage.setItem('ctaClicks', JSON.stringify(ctaClicks));
    });
});

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to sections
document.querySelectorAll('.feature-card, .program-card, .about-text, .certification-text, .frozen-text').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(el);
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Active Navigation Link Highlighting
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

