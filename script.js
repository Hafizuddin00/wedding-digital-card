// Wedding Invitation Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    startCountdown();
});

function initializeApp() {
    // App loads instantly - no curtain animation
    console.log('Wedding invitation loaded successfully');
}

function setupEventListeners() {
    // Navigation button event listeners
    const navButtons = document.querySelectorAll('.nav-btn');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('closeBtn');
    const modalBody = document.getElementById('modalBody');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            openModal(section);
        });
    });

    // Close modal event listeners
    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Add swipe down to close modal on mobile
    setupSwipeToClose();

    // RSVP form submission
    const rsvpForm = document.getElementById('rsvpForm');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', handleRSVPSubmission);
    }
}

function handleRSVPSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const guestName = formData.get('guestName');
    const guestCount = formData.get('guestCount');
    const attendance = formData.get('attendance');
    const message = formData.get('message');
    
    // Create WhatsApp message
    const whatsappMessage = createWhatsAppMessage(guestName, guestCount, attendance, message);
    
    // Open WhatsApp with the message
    const whatsappUrl = `https://wa.me/60123456789?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    showSuccessMessage();
    
    // Close modal after a delay
    setTimeout(() => {
        closeModal();
    }, 2000);
}

function createWhatsAppMessage(name, count, attendance, message) {
    let whatsappMessage = `Assalamualaikum,\n\n`;
    whatsappMessage += `Saya ingin mengesahkan kehadiran untuk Walimatul Urus Ahmad & Siti:\n\n`;
    whatsappMessage += `👤 Nama: ${name}\n`;
    whatsappMessage += `👥 Bilangan: ${count}\n`;
    whatsappMessage += `✅ Status: ${attendance === 'hadir' ? 'Akan Hadir' : 'Tidak Dapat Hadir'}\n`;
    
    if (message && message.trim()) {
        whatsappMessage += `💬 Ucapan: ${message}\n`;
    }
    
    whatsappMessage += `\nTerima kasih.\n`;
    whatsappMessage += `Wassalamualaikum.`;
    
    return whatsappMessage;
}

function showSuccessMessage() {
    const modalBody = document.getElementById('modalBody');
    const successDiv = document.createElement('div');
    successDiv.innerHTML = `
        <div style="text-align: center; padding: 2rem; background: rgba(76, 175, 80, 0.1); border-radius: 10px; border: 1px solid rgba(76, 175, 80, 0.3);">
            <h3 style="color: #4CAF50; margin-bottom: 1rem;">✅ Berjaya!</h3>
            <p style="color: #8b7355;">Pengesahan kehadiran anda telah dihantar melalui WhatsApp.</p>
            <p style="color: #a0896b; font-size: 0.9rem; margin-top: 0.5rem;">Terima kasih atas maklum balas anda.</p>
        </div>
    `;
    
    modalBody.appendChild(successDiv);
}

function startCountdown() {
    const weddingDate = new Date('2024-06-15T12:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            
            // Update countdown in main page (if elements exist)
            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            
            if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
            if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
            if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
        } else {
            // Wedding day has arrived
            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            
            if (daysElement) daysElement.textContent = '00';
            if (hoursElement) hoursElement.textContent = '00';
            if (minutesElement) minutesElement.textContent = '00';
        }
    }
    
    // Update countdown immediately and then every minute
    updateCountdown();
    setInterval(updateCountdown, 60000);
}

function updateCountdownInModal() {
    // Update countdown specifically in modal
    setTimeout(() => {
        const modalDays = document.querySelector('#modalBody #days');
        const modalHours = document.querySelector('#modalBody #hours');
        const modalMinutes = document.querySelector('#modalBody #minutes');
        
        if (modalDays && modalHours && modalMinutes) {
            const weddingDate = new Date('2024-06-15T12:00:00').getTime();
            const now = new Date().getTime();
            const distance = weddingDate - now;
            
            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                
                modalDays.textContent = days.toString().padStart(2, '0');
                modalHours.textContent = hours.toString().padStart(2, '0');
                modalMinutes.textContent = minutes.toString().padStart(2, '0');
            }
        }
    }, 100);
}

// Add smooth animations for button interactions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('nav-btn') || e.target.closest('.nav-btn')) {
        const button = e.target.classList.contains('nav-btn') ? e.target : e.target.closest('.nav-btn');
        
        // Add click animation
        button.style.transform = 'translateY(0) scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
});

// Add touch support for mobile devices
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function(e) {
        if (e.target.classList.contains('nav-btn') || e.target.closest('.nav-btn')) {
            const button = e.target.classList.contains('nav-btn') ? e.target : e.target.closest('.nav-btn');
            button.style.transform = 'translateY(0) scale(0.95)';
        }
    });
    
    document.addEventListener('touchend', function(e) {
        if (e.target.classList.contains('nav-btn') || e.target.closest('.nav-btn')) {
            const button = e.target.classList.contains('nav-btn') ? e.target : e.target.closest('.nav-btn');
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        }
    });
}

// Prevent zoom on double tap for iOS
document.addEventListener('touchend', function(e) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

let lastTouchEnd = 0;

// Swipe to close modal functionality
function setupSwipeToClose() {
    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    document.addEventListener('touchstart', function(e) {
        const modalContent = document.getElementById('modalContent');
        const modalOverlay = document.getElementById('modalOverlay');
        
        if (modalOverlay && modalOverlay.classList.contains('active') && 
            modalContent && modalContent.contains(e.target)) {
            startY = e.touches[0].clientY;
            isDragging = true;
        }
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;
        
        // Only allow downward swipes
        if (deltaY > 0) {
            const modalContent = document.getElementById('modalContent');
            if (modalContent) {
                const progress = Math.min(deltaY / 200, 1); // 200px for full close
                modalContent.style.transform = `translateY(${deltaY}px)`;
                modalContent.style.opacity = 1 - (progress * 0.5);
            }
        }
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        
        const deltaY = currentY - startY;
        const modalContent = document.getElementById('modalContent');
        
        if (deltaY > 100) { // Close if swiped down more than 100px
            closeModal();
        } else {
            // Snap back to original position
            if (modalContent) {
                modalContent.style.transform = 'translateY(0)';
                modalContent.style.opacity = '1';
            }
        }
        
        isDragging = false;
        startY = 0;
        currentY = 0;
    }, { passive: true });
}

// Enhanced modal animations
function openModal(section) {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalBody = document.getElementById('modalBody');
    const contentElement = document.getElementById(`${section}-content`);

    if (contentElement) {
        // Clone the content to avoid moving the original element
        const content = contentElement.cloneNode(true);
        content.style.display = 'block';
        
        // Clear previous content and add new content
        modalBody.innerHTML = '';
        modalBody.appendChild(content);
        
        // Show modal with slide-up animation
        modalOverlay.classList.add('active');
        // No need to change body overflow since it's already fixed
        
        // Re-setup form listener if it's the attendance section
        if (section === 'attendance') {
            const rsvpForm = modalBody.querySelector('#rsvpForm');
            if (rsvpForm) {
                rsvpForm.addEventListener('submit', handleRSVPSubmission);
            }
        }
        
        // Update countdown if it's the datetime section
        if (section === 'datetime') {
            updateCountdownInModal();
        }
    }
}

function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');
    
    // Reset any transform/opacity changes from swipe
    if (modalContent) {
        modalContent.style.transform = '';
        modalContent.style.opacity = '';
    }
    
    modalOverlay.classList.remove('active');
    // No need to restore body overflow since it's always fixed
}