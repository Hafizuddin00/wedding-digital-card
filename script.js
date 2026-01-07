// Wedding Invitation Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // App loads instantly - no curtain animation
    console.log('Wedding invitation loaded successfully');
    
    // Initialize background music
    initBackgroundMusic();
}

function initBackgroundMusic() {
    const audio = document.getElementById('backgroundMusic');
    
    if (audio) {
        // Set volume to a comfortable level
        audio.volume = 0.3;
        
        // Try to play audio (modern browsers may block autoplay)
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Background music started successfully');
            }).catch(error => {
                console.log('Autoplay prevented, will start on user interaction');
                // Add click listener to start music on first user interaction
                document.addEventListener('click', startMusicOnInteraction, { once: true });
                document.addEventListener('touchstart', startMusicOnInteraction, { once: true });
            });
        }
    }
}

function startMusicOnInteraction() {
    const audio = document.getElementById('backgroundMusic');
    if (audio) {
        audio.play().then(() => {
            console.log('Background music started after user interaction');
            updateMusicButton(true);
        }).catch(error => {
            console.log('Failed to start background music:', error);
        });
    }
}

function toggleMusic() {
    const audio = document.getElementById('backgroundMusic');
    const musicControl = document.getElementById('musicControl');
    
    if (audio) {
        if (audio.paused) {
            audio.play().then(() => {
                updateMusicButton(true);
            }).catch(error => {
                console.log('Failed to play music:', error);
            });
        } else {
            audio.pause();
            updateMusicButton(false);
        }
    }
}

function updateMusicButton(isPlaying) {
    const musicControl = document.getElementById('musicControl');
    const icon = musicControl.querySelector('i');
    
    if (isPlaying) {
        musicControl.classList.add('playing');
        musicControl.title = 'Pause Music';
        icon.className = 'fa-solid fa-pause';
    } else {
        musicControl.classList.remove('playing');
        musicControl.title = 'Play Music';
        icon.className = 'fa-solid fa-play';
    }
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
    
    // Music control button
    const musicControl = document.getElementById('musicControl');
    if (musicControl) {
        musicControl.addEventListener('click', toggleMusic);
    }
}

function handleRSVPSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const guestName = formData.get('guestName');
    const guestCount = formData.get('guestCount');
    const attendance = formData.get('attendance');
    const message = formData.get('message');
    
    // Show loading state
    showLoadingMessage();
    
    // Submit to Google Sheets
    submitToGoogleSheets({
        name: guestName,
        count: guestCount,
        attendance: attendance,
        message: message,
        timestamp: new Date().toLocaleString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur' })
    });
}

async function submitToGoogleSheets(data) {
    // Replace this URL with your Google Apps Script web app URL
    // To set up Google Sheets integration:
    // 1. Go to script.google.com
    // 2. Create a new project
    // 3. Paste the Google Apps Script code (see comments below)
    // 4. Deploy as web app with "Anyone" access
    // 5. Copy the web app URL and replace GOOGLE_SCRIPT_URL below
    
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzdN1unHSDPlJ0TD4wecH7aubjSJvOCwPQ6RxCmbQtNtN1SqFqeRFlAAKt7BLFpAQEB6A/exec';
    
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // Since we're using no-cors mode, we can't read the response
        // We'll assume success if no error is thrown
        showSuccessMessage('google-sheets');
        
        // Reset form
        const form = document.getElementById('rsvpForm');
        if (form) {
            form.reset();
        }
        
        // Close modal after a delay
        setTimeout(() => {
            closeModal();
        }, 3000);
        
    } catch (error) {
        console.error('Error submitting to Google Sheets:', error);
        showErrorMessage();
    }
}

/*
GOOGLE APPS SCRIPT CODE (Copy this to script.google.com):

function doPost(e) {
  try {
    const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';
    const SHEET_GID = SHEET_ID;

    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetById(SHEET_GID);

    const data = JSON.parse(e.postData.contents);

    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Name',
        'Guest Count',
        'Attendance',
        'Message',
        'Submitted At'
      ]);
    }

    sheet.appendRow([
      new Date(),
      data.name || '',
      data.count || '',
      data.attendance === 'hadir' ? 'Akan Hadir' : 'Tidak Dapat Hadir',
      data.message || '',
      data.timestamp || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

*/

function showLoadingMessage() {
    const modalBody = document.getElementById('modalBody');
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-message';
    loadingDiv.innerHTML = `
        <div style="text-align: center; padding: 2rem; background: rgba(33, 150, 243, 0.1); border-radius: 10px; border: 1px solid rgba(33, 150, 243, 0.3);">
            <div style="display: inline-block; width: 20px; height: 20px; border: 3px solid #2196F3; border-radius: 50%; border-top-color: transparent; animation: spin 1s ease-in-out infinite; margin-bottom: 1rem;"></div>
            <h3 style="color: #2196F3; margin-bottom: 1rem;">Menghantar...</h3>
            <p style="color: #8b7355;">Sila tunggu sebentar...</p>
        </div>
        <style>
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        </style>
    `;
    
    modalBody.appendChild(loadingDiv);
}

function showSuccessMessage(type = 'whatsapp') {
    // Remove loading message if exists
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
        loadingMessage.remove();
    }
    
    const modalBody = document.getElementById('modalBody');
    const successDiv = document.createElement('div');
    
    if (type === 'google-sheets') {
        successDiv.innerHTML = `
            <div style="text-align: center; padding: 2rem; background: rgba(76, 175, 80, 0.1); border-radius: 10px; border: 1px solid rgba(76, 175, 80, 0.3);">
                <h3 style="color: #4CAF50; margin-bottom: 1rem;">✅ Berjaya!</h3>
                <p style="color: #8b7355;">Pengesahan kehadiran anda telah berjaya direkodkan.</p>
                <p style="color: #a0896b; font-size: 0.9rem; margin-top: 0.5rem;">Terima kasih atas maklum balas anda.</p>
            </div>
        `;
    } else {
        successDiv.innerHTML = `
            <div style="text-align: center; padding: 2rem; background: rgba(76, 175, 80, 0.1); border-radius: 10px; border: 1px solid rgba(76, 175, 80, 0.3);">
                <h3 style="color: #4CAF50; margin-bottom: 1rem;">✅ Berjaya!</h3>
                <p style="color: #8b7355;">Pengesahan kehadiran anda telah dihantar melalui WhatsApp.</p>
                <p style="color: #a0896b; font-size: 0.9rem; margin-top: 0.5rem;">Terima kasih atas maklum balas anda.</p>
            </div>
        `;
    }
    
    modalBody.appendChild(successDiv);
}

function showErrorMessage() {
    // Remove loading message if exists
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
        loadingMessage.remove();
    }
    
    const modalBody = document.getElementById('modalBody');
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
        <div style="text-align: center; padding: 2rem; background: rgba(244, 67, 54, 0.1); border-radius: 10px; border: 1px solid rgba(244, 67, 54, 0.3);">
            <h3 style="color: #F44336; margin-bottom: 1rem;">❌ Ralat</h3>
            <p style="color: #8b7355;">Maaf, terdapat masalah semasa menghantar data.</p>
            <p style="color: #a0896b; font-size: 0.9rem; margin-top: 0.5rem;">Sila cuba lagi atau hubungi kami terus.</p>
            <div style="margin-top: 1rem;">
                <a href="https://wa.me/60177431564" style="display: inline-block; padding: 0.8rem 1.5rem; background: #25D366; color: white; text-decoration: none; border-radius: 25px; font-weight: 600;" target="_blank">
                    📱 WhatsApp Kami
                </a>
            </div>
        </div>
    `;
    
    modalBody.appendChild(errorDiv);
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

// Falling Leaves Animation
function initFallingLeaves() {
    // Wait for GSAP to load
    if (typeof gsap === 'undefined') {
        setTimeout(initFallingLeaves, 100);
        return;
    }

    gsap.set("#container", {perspective: 600});
    
    const total = 10;
    const container = document.getElementById("container");
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    for (let i = 0; i < total; i++) { 
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const div3 = document.createElement('div');
        
        gsap.set(div1, {
            attr: {class: 'dot'},
            x: R(0, w),
            y: R(-400, -100),
            z: R(-200, 200),
            xPercent: -50,
            yPercent: -50
        });
        
        gsap.set(div2, {
            attr: {class: 'dot2'},
            x: R(0, w),
            y: R(-400, -100),
            z: R(-200, 200),
            xPercent: -50,
            yPercent: -50
        });
        
        gsap.set(div3, {
            attr: {class: 'dot3'},
            x: R(0, w),
            y: R(-400, -100),
            z: R(-200, 200),
            xPercent: -50,
            yPercent: -50
        });
        
        container.appendChild(div1);
        container.appendChild(div2);
        container.appendChild(div3);
        
        animateLeaf(div1);
        animateLeaf(div2);
        animateLeaf(div3);
    }
}

function animateLeaf(elm) {   
    gsap.to(elm, {
        y: window.innerHeight + 100,
        duration: R(8, 20),
        ease: "none",
        repeat: -1,
        delay: R(-20, 0)
    });
    
    gsap.to(elm, {
        x: '+=100',
        rotation: R(0, 180),
        duration: R(4, 8),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    gsap.to(elm, {
        duration: R(2, 8),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: -5
    });
}

function R(min, max) {
    return min + Math.random() * (max - min);
}

// Initialize falling leaves after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initFallingLeaves();
});