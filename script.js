document.addEventListener('DOMContentLoaded', () => {
    
    // --- Progress Tracking System ---
    const checkboxes = document.querySelectorAll('.lecture-checkbox');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    // Prefix for localStorage to avoid collision with other courses
    const STORAGE_PREFIX = 'finance_a_completed_';

    // Calculate and update progress UI
    function updateProgress() {
        if (!checkboxes || checkboxes.length === 0) return;

        let completed = 0;
        checkboxes.forEach(cb => {
            if (cb.checked) {
                completed++;
                // Add active state to the card for visual feedback
                cb.closest('.lecture-card').style.opacity = '0.9';
            } else {
                cb.closest('.lecture-card').style.opacity = '1';
            }
        });

        const total = checkboxes.length;
        const percentage = Math.round((completed / total) * 100);
        
        // Ensure progress bar animate smoothly
        progressBar.style.width = percentage + "%";
        progressText.innerText = percentage + "% הושלם";
    }

    // Load saved states from localStorage
    function loadProgressState() {
        checkboxes.forEach(cb => {
            const id = cb.getAttribute('data-id');
            const savedState = localStorage.getItem(STORAGE_PREFIX + id);
            
            if (savedState === 'true') {
                cb.checked = true;
            }
        });
        updateProgress();
    }

    // Save state on change
    function saveProgressState(event) {
        const cb = event.target;
        const id = cb.getAttribute('data-id');
        
        localStorage.setItem(STORAGE_PREFIX + id, cb.checked);
        updateProgress();
    }

    // Attach event listeners
    checkboxes.forEach(cb => {
        cb.addEventListener('change', saveProgressState);
    });

    // Initialize state on load
    loadProgressState();

    // --- Smooth Scrolling for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Ignore empty links like in Materials
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// --- Cinema Mode System ---
// We keep these functions in the global scope so they can be triggered from inline handlers

const cinemaModal = document.getElementById('cinema-modal');
const cinemaFrame = document.getElementById('cinema-frame');

function openCinema(videoUrl) {
    if (!cinemaModal || !cinemaFrame) return;

    // Append autoplay parameter
    const videoUrlWithAutoplay = videoUrl.includes('?') ? 
        videoUrl + '&autoplay=1' : 
        videoUrl + '?autoplay=1';

    cinemaFrame.src = videoUrlWithAutoplay;
    cinemaModal.classList.add('active');
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
}

function closeCinema() {
    if (!cinemaModal || !cinemaFrame) return;

    cinemaModal.classList.remove('active');
    
    // Clear iframe src to stop video playing in background
    setTimeout(() => {
        cinemaFrame.src = "";
    }, 300); // Wait for fade out animation
    
    // Restore scrolling
    document.body.style.overflow = '';
}

// Close Cinema Mode with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cinemaModal.classList.contains('active')) {
        closeCinema();
    }
});

// Close Cinema Mode when clicking outside the video
if (cinemaModal) {
    cinemaModal.addEventListener('click', (e) => {
        // If they click on the modal background itself (not the video frame)
        if (e.target === cinemaModal || e.target.classList.contains('cinema-content')) {
            closeCinema();
        }
    });
}
