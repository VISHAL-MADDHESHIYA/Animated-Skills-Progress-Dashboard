/**
 * Animated Skills Dashboard - Script
 * Handles IntersectionObserver, filtering, theme toggling, 
 * counters, and dynamic interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // DOM Elements
    // =========================================
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('theme-toggle');
    const cards = document.querySelectorAll('.skill-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const skillsGrid = document.getElementById('skills-grid');
    const emptyState = document.getElementById('empty-state');
    const replayBtn = document.getElementById('replay-btn');
    const backToTopBtn = document.getElementById('back-to-top');
    
    const totalSkillsEl = document.getElementById('total-skills');
    const avgProficiencyEl = document.getElementById('avg-proficiency');

    // =========================================
    // Theme Toggle Logic
    // =========================================
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        htmlElement.setAttribute('data-theme', savedTheme);
    };

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // =========================================
    // Animation Logic & Intersection Observer
    // =========================================
    
    // Animate a single card's progress bar and text
    const animateCard = (card, delay = 0) => {
        if (card.classList.contains('animated')) return;

        setTimeout(() => {
            card.classList.add('animated');
            
            const fill = card.querySelector('.progress-fill');
            const text = card.querySelector('.progress-text');
            const progressContainer = card.querySelector('.progress-container');
            const target = parseInt(card.dataset.progress, 10);

            // Validate percentage
            const safeTarget = isNaN(target) ? 0 : Math.min(Math.max(target, 0), 100);

            // Set width for CSS transition
            fill.style.width = `${safeTarget}%`;
            
            // Update ARIA attributes
            progressContainer.setAttribute('aria-valuenow', safeTarget);

            // Animate the counter text
            let current = 0;
            const duration = 1500; // Matches CSS transition duration
            const start = performance.now();

            const updateText = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out quart
                const ease = 1 - Math.pow(1 - progress, 4);
                current = Math.floor(ease * safeTarget);
                text.textContent = `${current}%`;

                if (progress < 1) {
                    requestAnimationFrame(updateText);
                } else {
                    text.textContent = `${safeTarget}%`;
                }
            };
            requestAnimationFrame(updateText);

        }, delay);
    };

    // Intersection Observer Setup
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const card = entry.target;
                
                // Stagger based on the card's index in the NodeList
                const index = Array.from(cards).indexOf(card);
                const delay = (index % 4) * 100; // Stagger by column

                animateCard(card, delay);
                observer.unobserve(card); // Prevent re-animation on scroll
            }
        });
    }, observerOptions);

    // Initialize observation for all cards
    const initObserver = () => {
        cards.forEach(card => observer.observe(card));
    };

    // =========================================
    // Stats & Summary Calculation
    // =========================================
    const animateCounter = (el, target, duration = 1000) => {
        let current = 0;
        const start = performance.now();
        
        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // ease out cubic
            current = Math.floor(ease * target);
            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        };
        requestAnimationFrame(update);
    };

    const updateStats = () => {
        const visibleCards = Array.from(cards).filter(card => card.style.display !== 'none');
        const total = visibleCards.length;
        
        if (total === 0) {
            totalSkillsEl.textContent = '0';
            avgProficiencyEl.textContent = '0';
            return;
        }

        const totalProgress = visibleCards.reduce((sum, card) => {
            return sum + parseInt(card.dataset.progress, 10);
        }, 0);
        
        const average = Math.round(totalProgress / total);

        animateCounter(totalSkillsEl, total);
        animateCounter(avgProficiencyEl, average);
    };

    // =========================================
    // Filtering Logic
    // =========================================
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            const filter = btn.dataset.filter;
            let visibleCount = 0;

            cards.forEach(card => {
                const category = card.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    visibleCount++;
                    
                    // If the card hasn't animated yet, trigger it
                    if (!card.classList.contains('animated')) {
                        // Check if it's in viewport before triggering, or just let observer handle it.
                        // For newly visible cards, we force animation if they are currently in view.
                        const rect = card.getBoundingClientRect();
                        const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;
                        
                        if (isInViewport) {
                            const index = Array.from(cards).indexOf(card);
                            animateCard(card, (index % 4) * 50);
                        } else {
                            observer.observe(card);
                        }
                    }
                } else {
                    card.style.display = 'none';
                }
            });

            // Handle Empty State
            if (visibleCount === 0) {
                emptyState.classList.remove('hidden');
                skillsGrid.style.display = 'none';
            } else {
                emptyState.classList.add('hidden');
                skillsGrid.style.display = 'grid';
            }

            updateStats();
        });
    });

    // =========================================
    // Replay Animations
    // =========================================
    replayBtn.addEventListener('click', () => {
        cards.forEach(card => {
            // Reset classes and styles
            card.classList.remove('animated');
            const fill = card.querySelector('.progress-fill');
            const text = card.querySelector('.progress-text');
            const progressContainer = card.querySelector('.progress-container');

            fill.style.transition = 'none';
            fill.style.width = '0%';
            text.textContent = '0%';
            progressContainer.setAttribute('aria-valuenow', 0);

            // Force reflow
            void fill.offsetWidth;

            // Restore transition
            fill.style.transition = 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1)';

            // Re-observe if visible
            if (card.style.display !== 'none') {
                observer.observe(card);
            }
        });
        
        // Scroll to skills section smoothly
        document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
    });

    // =========================================
    // Back to Top Button
    // =========================================
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // =========================================
    // Initialization
    // =========================================
    initTheme();
    initObserver();
    updateStats(); // Set initial stats

    // Handle window resize for responsive adjustments if necessary
    window.addEventListener('resize', () => {
        // Recalculate stats if needed, though CSS handles layout
    });
});