// Learnify Platform - Main JavaScript

/**
 * Main application module
 * Uses IIFE pattern for encapsulation and to avoid global namespace pollution
 */
(function() {
    'use strict';

    /**
     * DOM Ready Handler
     * Initializes all JavaScript functionality once the DOM is fully loaded
     */
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize all modules
        initMobileMenu();
        initDarkMode();
        initCourseFilters();
        initVideoPlayer();
        initAuthForms();
        initProgressTracker();
    });

    /**
     * Initialize mobile menu toggle functionality
     */
    function initMobileMenu() {
        const navbarToggle = document.querySelector('.navbar-toggle');
        const navbarMenu = document.querySelector('.navbar-menu');

        if (navbarToggle && navbarMenu) {
            navbarToggle.addEventListener('click', function() {
                navbarMenu.classList.toggle('active');
            });
        }
    }

    /**
     * Dark Mode Toggle Functionality
     */
    function initDarkMode() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        
        if (darkModeToggle) {
            // Check for saved preference
            const savedTheme = localStorage.getItem('learnify-theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                updateDarkModeIcon(true);
            }

            darkModeToggle.addEventListener('click', function() {
                document.body.classList.toggle('dark-mode');
                const isDark = document.body.classList.contains('dark-mode');
                localStorage.setItem('learnify-theme', isDark ? 'dark' : 'light');
                updateDarkModeIcon(isDark);
            });
        }
    }

    function updateDarkModeIcon(isDark) {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            const icon = darkModeToggle.querySelector('i');
            if (icon) {
                icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }

    /**
     * Course Search and Filter Functionality
     */
    function initCourseFilters() {
        const searchInput = document.getElementById('searchInput');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const courseCards = document.querySelectorAll('.course-card');
        const sortSelect = document.getElementById('sortSelect');
        const resultsCount = document.getElementById('resultsCount');

        if (!searchInput || courseCards.length === 0) return;

        // Search functionality
        searchInput.addEventListener('input', function() {
            filterCourses(searchInput.value, getActiveCategory());
        });

        // Filter buttons
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                filterCourses(searchInput.value, this.dataset.category);
            });
        });

        // Sort functionality
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                sortCourses(this.value);
            });
        }

        function filterCourses(searchTerm, category) {
            let visibleCount = 0;
            
            courseCards.forEach(card => {
                const title = card.querySelector('.course-title')?.textContent.toLowerCase() || '';
                const categoryData = card.dataset.category || '';
                const searchMatch = title.includes(searchTerm.toLowerCase());
                const categoryMatch = category === 'all' || categoryData === category;
                
                if (searchMatch && categoryMatch) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (resultsCount) {
                resultsCount.textContent = `Showing ${visibleCount} courses`;
            }
        }

        function getActiveCategory() {
            const activeBtn = document.querySelector('.filter-btn.active');
            return activeBtn ? activeBtn.dataset.category : 'all';
        }

        function sortCourses(sortBy) {
            const grid = document.getElementById('coursesGrid');
            if (!grid) return;

            const cards = Array.from(courseCards);
            
            cards.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.course-price')?.textContent.replace('$', '') || '0');
                const priceB = parseFloat(b.querySelector('.course-price')?.textContent.replace('$', '') || '0');
                const ratingA = parseFloat(a.querySelector('.fa-star')?.parentElement?.textContent || '0');
                const ratingB = parseFloat(b.querySelector('.fa-star')?.parentElement?.textContent || '0');

                switch(sortBy) {
                    case 'price-low':
                        return priceA - priceB;
                    case 'price-high':
                        return priceB - priceA;
                    case 'popular':
                        return ratingB - ratingA;
                    default:
                        return 0;
                }
            });

            cards.forEach(card => grid.appendChild(card));
        }
    }

    /**
     * Video Player Functionality
     */
    function initVideoPlayer() {
        const video = document.getElementById('mainVideo');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const playButtonLarge = document.getElementById('playButtonLarge');
        const videoOverlay = document.getElementById('videoOverlay');
        const progressBar = document.getElementById('progressBar');
        const timeDisplay = document.getElementById('timeDisplay');
        const volumeSlider = document.getElementById('volumeSlider');
        const muteBtn = document.getElementById('muteBtn');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const rewindBtn = document.getElementById('rewindBtn');
        const forwardBtn = document.getElementById('forwardBtn');
        const speedBtn = document.getElementById('speedBtn');

        if (!video) return;

        // Play/Pause
        function togglePlay() {
            if (video.paused) {
                video.play();
                playPauseBtn.querySelector('i').className = 'fas fa-pause';
                if (videoOverlay) videoOverlay.classList.add('hidden');
            } else {
                video.pause();
                playPauseBtn.querySelector('i').className = 'fas fa-play';
            }
        }

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', togglePlay);
        }

        if (playButtonLarge) {
            playButtonLarge.addEventListener('click', togglePlay);
        }

        if (videoOverlay) {
            videoOverlay.addEventListener('click', togglePlay);
        }

        // Progress bar
        video.addEventListener('timeupdate', function() {
            const progress = (video.currentTime / video.duration) * 100;
            if (progressBar) progressBar.style.width = progress + '%';
            if (timeDisplay) {
                timeDisplay.textContent = formatTime(video.currentTime) + ' / ' + formatTime(video.duration);
            }
        });

        // Volume control
        if (volumeSlider) {
            volumeSlider.addEventListener('input', function() {
                video.volume = this.value;
                updateVolumeIcon(this.value);
            });
        }

        if (muteBtn) {
            muteBtn.addEventListener('click', function() {
                video.muted = !video.muted;
                updateVolumeIcon(video.muted ? 0 : video.volume);
            });
        }

        // Rewind/Forward
        if (rewindBtn) {
            rewindBtn.addEventListener('click', function() {
                video.currentTime = Math.max(0, video.currentTime - 10);
            });
        }

        if (forwardBtn) {
            forwardBtn.addEventListener('click', function() {
                video.currentTime = Math.min(video.duration, video.currentTime + 10);
            });
        }

        // Fullscreen
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', function() {
                const wrapper = document.querySelector('.video-wrapper');
                if (wrapper) {
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    } else {
                        wrapper.requestFullscreen();
                    }
                }
            });
        }

        // Speed control
        if (speedBtn) {
            const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
            let currentSpeedIndex = 2; // Start at 1x

            speedBtn.addEventListener('click', function() {
                currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
                video.playbackRate = speeds[currentSpeedIndex];
                this.querySelector('span').textContent = speeds[currentSpeedIndex] + 'x';
            });
        }

        function formatTime(seconds) {
            if (isNaN(seconds)) return '0:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return mins + ':' + (secs < 10 ? '0' : '') + secs;
        }

        function updateVolumeIcon(volume) {
            if (muteBtn) {
                const icon = muteBtn.querySelector('i');
                if (icon) {
                    if (volume === 0 || volume === '0') {
                        icon.className = 'fas fa-volume-mute';
                    } else if (volume < 0.5) {
                        icon.className = 'fas fa-volume-down';
                    } else {
                        icon.className = 'fas fa-volume-up';
                    }
                }
            }
        }

        // Like/Dislike buttons
        const likeBtn = document.getElementById('likeBtn');
        const dislikeBtn = document.getElementById('dislikeBtn');

        if (likeBtn) {
            likeBtn.addEventListener('click', function() {
                this.classList.toggle('liked');
                const icon = this.querySelector('i');
                if (icon) {
                    icon.className = this.classList.contains('liked') ? 'fas fa-thumbs-up' : 'far fa-thumbs-up';
                }
                if (dislikeBtn && dislikeBtn.classList.contains('disliked')) {
                    dislikeBtn.classList.remove('disliked');
                    dislikeBtn.querySelector('i').className = 'far fa-thumbs-down';
                }
            });
        }

        if (dislikeBtn) {
            dislikeBtn.addEventListener('click', function() {
                this.classList.toggle('disliked');
                const icon = this.querySelector('i');
                if (icon) {
                    icon.className = this.classList.contains('disliked') ? 'fas fa-thumbs-down' : 'far fa-thumbs-down';
                }
                if (likeBtn && likeBtn.classList.contains('liked')) {
                    likeBtn.classList.remove('liked');
                    likeBtn.querySelector('i').className = 'far fa-thumbs-up';
                }
            });
        }
    }

    /**
     * Authentication Forms
     */
    function initAuthForms() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const registerLink = document.getElementById('registerLink');
        const loginLink = document.getElementById('loginLink');
        const registerSection = document.getElementById('registerSection');

        // Toggle between login and register
        if (registerLink) {
            registerLink.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelector('.auth-section').style.display = 'none';
                if (registerSection) registerSection.style.display = 'block';
            });
        }

        if (loginLink) {
            loginLink.addEventListener('click', function(e) {
                e.preventDefault();
                if (registerSection) registerSection.style.display = 'none';
                document.querySelector('.auth-section').style.display = 'block';
            });
        }

        // Login form validation
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('email');
                const password = document.getElementById('password');
                let isValid = true;

                // Reset errors
                clearErrors();

                // Validate email
                if (email && !isValidEmail(email.value)) {
                    showError('emailError', 'Please enter a valid email address');
                    isValid = false;
                }

                // Validate password
                if (password && password.value.length < 8) {
                    showError('passwordError', 'Password must be at least 8 characters');
                    isValid = false;
                }

                if (isValid) {
                    // Simulate login
                    alert('Login successful! Redirecting to courses...');
                    window.location.href = 'courses.html';
                }
            });
        }

        // Register form validation
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('registerName');
                const email = document.getElementById('registerEmail');
                const password = document.getElementById('registerPassword');
                const confirmPassword = document.getElementById('confirmPassword');
                const terms = document.getElementById('terms');
                let isValid = true;

                // Reset errors
                clearErrors();

                // Validate name
                if (name && name.value.trim().length < 2) {
                    showError('nameError', 'Please enter your full name');
                    isValid = false;
                }

                // Validate email
                if (email && !isValidEmail(email.value)) {
                    showError('emailError', 'Please enter a valid email address');
                    isValid = false;
                }

                // Validate password
                if (password && password.value.length < 8) {
                    showError('passwordError', 'Password must be at least 8 characters');
                    isValid = false;
                }

                // Validate confirm password
                if (confirmPassword && confirmPassword.value !== password.value) {
                    showError('confirmPasswordError', 'Passwords do not match');
                    isValid = false;
                }

                // Validate terms
                if (terms && !terms.checked) {
                    alert('Please accept the Terms of Service');
                    isValid = false;
                }

                if (isValid) {
                    // Simulate registration
                    alert('Registration successful! Please login.');
                    window.location.href = 'login.html';
                }
            });
        }

        // Password visibility toggle
        const togglePasswordBtns = document.querySelectorAll('.toggle-password');
        togglePasswordBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                if (input) {
                    if (input.type === 'password') {
                        input.type = 'text';
                        this.querySelector('i').className = 'fas fa-eye-slash';
                    } else {
                        input.type = 'password';
                        this.querySelector('i').className = 'fas fa-eye';
                    }
                }
            });
        });

        function showError(elementId, message) {
            const errorElement = document.getElementById(elementId);
            if (errorElement) {
                errorElement.textContent = message;
            }
        }

        function clearErrors() {
            const errors = document.querySelectorAll('.error-message');
            errors.forEach(error => error.textContent = '');
        }
    }

    /**
     * Progress Tracker
     */
    function initProgressTracker() {
        const progressSection = document.querySelector('.progress-tracker-section');
        
        // For demo purposes, show the progress tracker
        // In a real app, this would be based on user data
        if (progressSection) {
            // Simulate progress data
            const progressFill = document.querySelector('.progress-fill');
            if (progressFill) {
                // This would normally come from user data
                progressFill.style.width = '35%';
            }
        }

        // Curriculum accordion
        const curriculumHeaders = document.querySelectorAll('.curriculum-section-header');
        curriculumHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const content = this.nextElementSibling;
                const icon = this.querySelector('.fa-chevron-right, .fa-chevron-down');
                
                if (content && content.classList.contains('curriculum-section-content')) {
                    if (content.style.display === 'none') {
                        content.style.display = 'block';
                        if (icon) icon.className = 'fas fa-chevron-down';
                    } else {
                        content.style.display = 'none';
                        if (icon) icon.className = 'fas fa-chevron-right';
                    }
                }
            });
        });

        // Lesson items click handler
        const lessonItems = document.querySelectorAll('.lesson-item');
        lessonItems.forEach(item => {
            item.addEventListener('click', function() {
                if (!this.classList.contains('locked')) {
                    // Mark as active
                    lessonItems.forEach(i => i.classList.remove('active'));
                    this.classList.add('active');
                    
                    // In a real app, this would navigate to the video
                    const title = this.querySelector('.lesson-title')?.textContent;
                    console.log('Playing lesson:', title);
                }
            });
        });
    }

    /**
     * Form Validation Helpers
     */
    function isValidEmail(email) {
        if (!email || typeof email !== 'string') {
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    function isValidPassword(password) {
        if (!password || typeof password !== 'string') {
            return false;
        }
        return password.length >= 8;
    }

    function isRequired(value) {
        if (value === null || value === undefined) {
            return false;
        }
        return String(value).trim().length > 0;
    }

    function hasMinLength(value, minLength) {
        if (!value || typeof value !== 'string') {
            return false;
        }
        return value.trim().length >= minLength;
    }

    function hasMaxLength(value, maxLength) {
        if (!value || typeof value !== 'string') {
            return false;
        }
        return value.trim().length <= maxLength;
    }

    function valuesMatch(value1, value2) {
        return value1 === value2;
    }

    // Export validation functions to global scope
    window.FormValidation = {
        isValidEmail: isValidEmail,
        isValidPassword: isValidPassword,
        isRequired: isRequired,
        hasMinLength: hasMinLength,
        hasMaxLength: hasMaxLength,
        valuesMatch: valuesMatch
    };

})();
