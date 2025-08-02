document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navItems = document.querySelectorAll('.nav-links ul li a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Sticky navbar on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.padding = '15px 0';
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '20px 0';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Scroll animations
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Download Resume button
    const downloadBtn = document.querySelector('.download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // In a real implementation, this would link to your resume PDF
            window.open('assets/resume.pdf', '_blank');
        });
    }
    
    // Project buttons
    const codeButtons = document.querySelectorAll('.code-btn');
    codeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real implementation, this would link to your GitHub repo
            window.open('https://github.com', '_blank');
        });
    });
    
    const reportButtons = document.querySelectorAll('.report-btn');
    reportButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real implementation, this would show project details
            alert('Project report would open here');
        });
    });
    
    // Certificate buttons
    const certButtons = document.querySelectorAll('.cert-btn');
    certButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real implementation, this would open the certificate PDF
            window.open('assets/certificates/cert1.pdf', '_blank');
        });
    });
    
    // Contact form submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const subject = this.querySelectorAll('input[type="text"]')[1].value;
            const message = this.querySelector('textarea').value;
            
            // In a real implementation, you would send this data to a server
            console.log({ name, email, subject, message });
            
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }
});