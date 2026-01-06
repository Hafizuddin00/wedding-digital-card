// Wedding Card Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    
    // RSVP Button Functionality
    const rsvpButton = document.querySelector('.rsvp-button');
    
    rsvpButton.addEventListener('click', function() {
        // Create a simple modal or redirect to RSVP form
        showRSVPModal();
    });
    
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.event, .couple-names, .rsvp-section');
    animateElements.forEach(el => observer.observe(el));
    
    // Add sparkle effect on hover for names
    const names = document.querySelectorAll('.groom-name, .bride-name');
    names.forEach(name => {
        name.addEventListener('mouseenter', createSparkles);
        name.addEventListener('mouseleave', removeSparkles);
    });
    
    // Add floating animation to Islamic patterns
    const patterns = document.querySelectorAll('.islamic-pattern');
    patterns.forEach(pattern => {
        pattern.addEventListener('mouseenter', function() {
            this.style.animation = 'patternGlow 0.5s ease-in-out, float 2s ease-in-out infinite';
        });
        
        pattern.addEventListener('mouseleave', function() {
            this.style.animation = 'patternGlow 2s ease-in-out infinite alternate';
        });
    });
    
    // Add touch interactions for mobile
    if ('ontouchstart' in window) {
        addMobileTouchEffects();
    }
    
    // Preload animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

function showRSVPModal() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'rsvp-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>RSVP Confirmation</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>Thank you for your interest in celebrating with us!</p>
                <p>Please contact us to confirm your attendance:</p>
                <div class="contact-info">
                    <p><strong>WhatsApp:</strong> +60 12-345 6789</p>
                    <p><strong>Email:</strong> wedding@ahmadsiti.com</p>
                </div>
                <div class="modal-buttons">
                    <button class="whatsapp-btn" onclick="openWhatsApp()">
                        WhatsApp RSVP
                    </button>
                    <button class="email-btn" onclick="openEmail()">
                        Email RSVP
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = `
        .rsvp-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease-out;
        }
        
        .modal-content {
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            animation: slideUp 0.3s ease-out;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #d4af37;
            padding-bottom: 15px;
        }
        
        .modal-header h3 {
            color: #1a4b3a;
            font-family: 'Playfair Display', serif;
            margin: 0;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 24px;
            color: #1a4b3a;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-body p {
            color: #2d5a4a;
            margin-bottom: 15px;
            line-height: 1.6;
        }
        
        .contact-info {
            background: rgba(212, 175, 55, 0.1);
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
        }
        
        .contact-info p {
            margin: 8px 0;
            font-size: 14px;
        }
        
        .modal-buttons {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        
        .whatsapp-btn, .email-btn {
            flex: 1;
            padding: 12px 20px;
            border: none;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
        }
        
        .whatsapp-btn {
            background: #25D366;
            color: white;
        }
        
        .whatsapp-btn:hover {
            background: #128C7E;
            transform: translateY(-2px);
        }
        
        .email-btn {
            background: #d4af37;
            color: #1a4b3a;
        }
        
        .email-btn:hover {
            background: #ffd700;
            transform: translateY(-2px);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    // Add styles to head
    const styleSheet = document.createElement('style');
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            document.body.removeChild(modal);
            document.head.removeChild(styleSheet);
        }, 300);
    });
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeBtn.click();
        }
    });
}

function openWhatsApp() {
    const message = encodeURIComponent("Assalamualaikum! I would like to RSVP for Ahmad & Siti's wedding. Please confirm my attendance.");
    window.open(`https://wa.me/60123456789?text=${message}`, '_blank');
}

function openEmail() {
    const subject = encodeURIComponent("RSVP - Ahmad & Siti Wedding");
    const body = encodeURIComponent("Assalamualaikum,\n\nI would like to RSVP for Ahmad & Siti's wedding.\n\nPlease confirm my attendance.\n\nThank you.");
    window.open(`mailto:wedding@ahmadsiti.com?subject=${subject}&body=${body}`);
}

function createSparkles(e) {
    const name = e.target;
    const rect = name.getBoundingClientRect();
    
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #d4af37;
            border-radius: 50%;
            pointer-events: none;
            z-index: 100;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
            animation: sparkleAnimation 1s ease-out forwards;
        `;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            if (document.body.contains(sparkle)) {
                document.body.removeChild(sparkle);
            }
        }, 1000);
    }
}

function removeSparkles() {
    const sparkles = document.querySelectorAll('.sparkle');
    sparkles.forEach(sparkle => {
        if (document.body.contains(sparkle)) {
            document.body.removeChild(sparkle);
        }
    });
}

function addMobileTouchEffects() {
    const touchElements = document.querySelectorAll('.event, .rsvp-button, .groom-name, .bride-name');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// Add sparkle animation CSS
const sparkleCSS = `
    @keyframes sparkleAnimation {
        0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
        }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;

// Add sparkle styles to document
const sparkleStyleSheet = document.createElement('style');
sparkleStyleSheet.textContent = sparkleCSS;
document.head.appendChild(sparkleStyleSheet);