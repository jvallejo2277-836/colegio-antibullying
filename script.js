// Modal functionality
const modal = document.getElementById('reportModal');
const reportBtn = document.getElementById('reportBtn');
const closeBtn = document.querySelector('.close');
const reportForm = document.getElementById('reportForm');

// Open modal when report button is clicked
reportBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Close modal when X is clicked
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Handle form submission
reportForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const reportType = document.getElementById('reportType').value;
    const description = document.getElementById('description').value;
    const anonymous = document.getElementById('anonymous').checked;
    
    // In a real application, this would send data to a server
    console.log('Report submitted:', {
        type: reportType,
        description: description,
        anonymous: anonymous,
        timestamp: new Date().toISOString()
    });
    
    // Show success message
    alert('¡Gracias por tu reporte! Un miembro de nuestro equipo lo revisará pronto.');
    
    // Reset form and close modal
    reportForm.reset();
    modal.style.display = 'none';
});

// Smooth scrolling for navigation links
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

// Add action button handlers
document.querySelectorAll('.action-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const buttonText = e.target.textContent;
        alert(`Acción seleccionada: ${buttonText}\n\nEn una aplicación real, esto te conectaría con el recurso apropiado.`);
    });
});

// Add animation to cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.card, .stat-item').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s, transform 0.5s';
    observer.observe(card);
});

// Log creation date
console.log('Colegio Anti-Bullying Platform - Created: November 3, 2025');
