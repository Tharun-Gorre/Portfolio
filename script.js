// Profile image error handling
document.addEventListener('DOMContentLoaded', function() {
    const profileImg = document.querySelector('.profile-img');
    if (profileImg) {
        profileImg.addEventListener('error', function() {
            console.log('Profile image failed to load, using fallback');
            // You can add fallback logic here if needed
            this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.innerHTML = '<span style="color: white; font-size: 3rem; font-weight: bold;">GT</span>';
        });
        
        // Ensure image loads properly
        profileImg.crossOrigin = 'anonymous';
    }
    
    // Section fade-in animation on scroll
    const sections = document.querySelectorAll('.section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Make home section visible immediately
    const homeSection = document.getElementById('home');
    if (homeSection) {
        homeSection.classList.add('visible');
    }
});

// Mobile Navigation Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (targetId === '#home') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight + 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
        
        // Close mobile menu if open
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Active navigation link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections and cards
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll(
        '.section-title, .about-text p, .stat-item, .education-item, .project-card, .skill-item, .contact-item'
    );
    
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Animate skill bars when they come into view
    const skillBars = document.querySelectorAll('.skill-bar');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 200);
                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
});

// Contact form handling with Formspree
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            showFormStatus('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormStatus('Please enter a valid email address', 'error');
            return;
        }
        
        // Show sending status
        showFormStatus('Sending message...', 'sending');
        
        // Add subject to form data if not present
        if (!formData.get('_subject')) {
            formData.append('_subject', 'New Portfolio Contact: ' + subject);
        }
        
        try {
            // Submit to Formspree
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showFormStatus('Thank you! Your message has been sent successfully.', 'success');
                this.reset();
            } else {
                showFormStatus('Oops! Something went wrong. Please try again.', 'error');
            }
        } catch (error) {
            showFormStatus('Oops! Something went wrong. Please try again.', 'error');
        }
    });
}

// Show form status message
function showFormStatus(message, type) {
    const formStatus = document.getElementById('form-status');
    if (formStatus) {
        formStatus.textContent = message;
        formStatus.style.display = 'block';
        
        if (type === 'success') {
            formStatus.style.background = 'rgba(76, 175, 80, 0.9)';
            formStatus.style.color = 'white';
        } else if (type === 'error') {
            formStatus.style.background = 'rgba(244, 67, 54, 0.9)';
            formStatus.style.color = 'white';
        } else if (type === 'sending') {
            formStatus.style.background = 'rgba(33, 150, 243, 0.9)';
            formStatus.style.color = 'white';
        }
        
        // Hide after 5 seconds for success/error
        if (type !== 'sending') {
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }
    }
}

// Success message function
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message show';
    successDiv.textContent = 'Thank you for your message! I\'ll get back to you soon.';
    
    const contactForm = document.getElementById('contact-form');
    contactForm.parentNode.insertBefore(successDiv, contactForm);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Resume download functionality (PDF)
const resumeBtn = document.getElementById('resume-btn');
if (resumeBtn) {
    resumeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Load jsPDF library
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = function() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Set font sizes and styles
            doc.setFontSize(20);
            doc.setFont(undefined, 'bold');
            doc.text('GORRE THARUN', 20, 30);
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            doc.text('IT Student | Phone: +91 79951 08337 | Email: tharungorre88@gmail.com', 20, 40);
            doc.text('LinkedIn: linkedin.com/in/tharun-gorre-172302320', 20, 50);
            
            // Career Objective
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('CAREER OBJECTIVE', 20, 70);
            
            doc.setFontSize(11);
            doc.setFont(undefined, 'normal');
            const objective = 'To begin a career as a Software Engineer in a progressive organization, applying coding, problem-solving, and analytical skills to contribute to impactful projects while continuously learning new technologies.';
            const splitObjective = doc.splitTextToSize(objective, 170);
            doc.text(splitObjective, 20, 80);
            
            // Education
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('EDUCATION', 20, 110);
            
            doc.setFontSize(11);
            doc.setFont(undefined, 'normal');
            doc.text('Maturi Venkata Subba Rao Engineering College, Hyderabad', 20, 120);
            doc.text('B.Tech in Information Technology | 2023 - Present | CGPA: 8.5', 20, 130);
            
            doc.text('Government Polytechnic, Hyderabad', 20, 145);
            doc.text('Diploma in Civil Engineering | 2020-2023 | CGPA: 9.3', 20, 155);
            
            doc.text('Brooklyn Grammar High School, Metpally', 20, 170);
            doc.text('SSC | 2019-2020 | GPA: 10', 20, 180);
            
            // Technical Skills
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('TECHNICAL SKILLS', 20, 200);
            
            doc.setFontSize(11);
            doc.setFont(undefined, 'normal');
            doc.text('• Programming Languages: Python, Java', 20, 210);
            doc.text('• Web Development: HTML, CSS, JavaScript', 20, 220);
            doc.text('• Databases: MySQL', 20, 230);
            doc.text('• Soft Skills: Communication, Leadership, Teamwork, Time Management', 20, 240);
            
            // Projects
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('PROJECTS', 20, 260);
            
            doc.setFontSize(11);
            doc.setFont(undefined, 'normal');
            doc.text('Dance Forms of India (2025)', 20, 270);
            const project1 = '• Developed a frontend-only web application showcasing classical and folk dances of India';
            const project1Split = doc.splitTextToSize(project1, 170);
            doc.text(project1Split, 20, 280);
            
            doc.text('Healthcare Chat Bot (2024)', 20, 300);
            const project2 = '• Features include Symptom Checking & Diagnosis, Health Monitoring, and Personalized Health Advice';
            const project2Split = doc.splitTextToSize(project2, 170);
            doc.text(project2Split, 20, 310);
            
            // Add new page if needed
            doc.addPage();
            
            // Certifications
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('CERTIFICATIONS', 20, 30);
            
            doc.setFontSize(11);
            doc.setFont(undefined, 'normal');
            doc.text('• EduSkills - Web Development and Frameworks', 20, 40);
            doc.text('• Simplilearn - Jenkins and Frameworks', 20, 50);
            doc.text('• Simplilearn - DevOps and its Frameworks', 20, 60);
            
            // Extra-Curricular Activities
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('EXTRA-CURRICULAR ACTIVITIES', 20, 80);
            
            doc.setFontSize(11);
            doc.setFont(undefined, 'normal');
            doc.text('• Participant in hackathons', 20, 90);
            doc.text('• Volunteered for orientation programs at MVSR', 20, 100);
            doc.text('• Hosted farewell events at Diploma college', 20, 110);
            
            // Save the PDF
            doc.save('Gorre_Tharun_Resume.pdf');
            
            // Show success message
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message show';
            successDiv.textContent = 'Resume downloaded successfully as PDF!';
            successDiv.style.position = 'fixed';
            successDiv.style.top = '100px';
            successDiv.style.right = '20px';
            successDiv.style.zIndex = '9999';
            document.body.appendChild(successDiv);
            
            setTimeout(() => {
                successDiv.remove();
            }, 3000);
        };
        document.head.appendChild(script);
    });
}

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Typing effect for hero title
function typeWriter() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 50);
            }
        }
        
        // Start typing effect when page loads
        setTimeout(type, 500);
    }
}

// Initialize typing effect
document.addEventListener('DOMContentLoaded', typeWriter);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add hover effect to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add hover effect to skill items
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.05)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Mobile menu animation
mobileMenu.addEventListener('click', function() {
    this.classList.toggle('active');
    const bars = this.querySelectorAll('.bar');
    
    if (this.classList.contains('active')) {
        bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
    } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
});

// Add CSS for mobile menu animation
const style = document.createElement('style');
style.textContent = `
    .nav-toggle.active .bar:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    .nav-toggle.active .bar:nth-child(2) {
        opacity: 0;
    }
    .nav-toggle.active .bar:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);

// Console welcome message
console.log('%c Welcome to Tharun\'s Portfolio! ', 'background: #4a90e2; color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
