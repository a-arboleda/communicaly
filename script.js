// Navigation and Page Management
document.addEventListener('DOMContentLoaded', function() {
    // Navigation elements
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    // Resources data
    const resourcesData = [
        {
            id: 1,
            category: 'personality',
            image: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            title: 'Understanding Your Emotional Landscape',
            excerpt: 'Explore the depths of emotional expression in your new language and discover how it shapes your identity.',
            content: 'Full content would be displayed here...'
        },
        {
            id: 2,
            category: 'motivation',
            image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            title: 'Building Social Bridges Through Language',
            excerpt: 'Learn effective strategies for creating meaningful connections while staying true to yourself.',
            content: 'Full content would be displayed here...'
        },
        {
            id: 3,
            category: 'integration',
            image: 'https://images.pexels.com/photos/3184633/pexels-photo-3184633.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            title: 'Integrating Multiple Cultural Identities',
            excerpt: 'Navigate the beautiful complexity of being multilingual and multicultural with confidence.',
            content: 'Full content would be displayed here...'
        },
        {
            id: 4,
            category: 'personality',
            image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            title: 'Mindful Communication Practices',
            excerpt: 'Develop awareness and intentionality in your language learning journey.',
            content: 'Full content would be displayed here...'
        },
        {
            id: 5,
            category: 'motivation',
            image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            title: 'Overcoming Language Learning Anxiety',
            excerpt: 'Practical techniques for building confidence and reducing stress in language learning.',
            content: 'Full content would be displayed here...'
        },
        {
            id: 6,
            category: 'integration',
            image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            title: 'The Art of Authentic Expression',
            excerpt: 'Master the balance between linguistic accuracy and personal authenticity.',
            content: 'Full content would be displayed here...'
        },
        {
            id: 7,
            category: 'personality',
            image: 'https://images.pexels.com/photos/3183026/pexels-photo-3183026.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            title: 'Discovering Your Voice in a New Language',
            excerpt: 'Explore how different languages can reveal different aspects of your personality.',
            content: 'Full content would be displayed here...'
        },
        {
            id: 8,
            category: 'motivation',
            image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            title: 'Maintaining Motivation Through Challenges',
            excerpt: 'Strategies for staying inspired and committed to your language learning goals.',
            content: 'Full content would be displayed here...'
        }
    ];

    // State management
    let currentPage = 'home';
    let currentCategory = 'all';
    let searchTerm = '';

    // Initialize the application
    init();

    function init() {
        setupNavigation();
        setupResourcesPage();
        setupContactForm();
        showPage('home');
    }

    // Navigation Setup
    function setupNavigation() {
        // Hamburger menu toggle
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Navigation link clicks
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const page = this.getAttribute('data-page');
                showPage(page);
                
                // Close mobile menu
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Page Management
    function showPage(pageName) {
        // Hide all pages
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update navigation
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            }
        });

        currentPage = pageName;

        // Initialize page-specific functionality
        if (pageName === 'resources') {
            renderResources();
        }

        // Scroll to top
        window.scrollTo(0, 0);
    }

    // Resources Page Setup
    function setupResourcesPage() {
        const searchInput = document.getElementById('search-input');
        const categoryButtons = document.querySelectorAll('.category-btn');

        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                searchTerm = this.value.toLowerCase();
                renderResources();
            });
        }

        // Category filtering
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active category
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                currentCategory = this.getAttribute('data-category');
                renderResources();
            });
        });
    }

    // Render Resources
    function renderResources() {
        const resourcesGrid = document.getElementById('resources-grid');
        const noResults = document.getElementById('no-results');
        
        if (!resourcesGrid) return;

        // Filter resources
        const filteredResources = resourcesData.filter(resource => {
            const matchesSearch = resource.title.toLowerCase().includes(searchTerm) ||
                                resource.excerpt.toLowerCase().includes(searchTerm);
            const matchesCategory = currentCategory === 'all' || resource.category === currentCategory;
            return matchesSearch && matchesCategory;
        });

        // Clear grid
        resourcesGrid.innerHTML = '';

        if (filteredResources.length === 0) {
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';

        // Render filtered resources
        filteredResources.forEach(resource => {
            const resourceCard = createResourceCard(resource);
            resourcesGrid.appendChild(resourceCard);
        });
    }

    // Create Resource Card
    function createResourceCard(resource) {
        const card = document.createElement('div');
        card.className = 'resource-card-page';
        card.addEventListener('click', () => openResource(resource));

        card.innerHTML = `
            <div class="resource-image">
                <img src="${resource.image}" alt="${resource.title}" loading="lazy">
            </div>
            <div class="resource-content">
                <h4 class="resource-title">${resource.title}</h4>
                <p class="resource-description">${resource.excerpt}</p>
            </div>
        `;

        return card;
    }

    // Open Resource
    function openResource(resource) {
        // In a real application, this would open a new page or modal with full content
        const newWindow = window.open('', '_blank');
        newWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${resource.title}</title>
                <style>
                    body { 
                        font-family: 'Inter', sans-serif; 
                        max-width: 800px; 
                        margin: 0 auto; 
                        padding: 2rem; 
                        line-height: 1.6;
                        color: #463F3A;
                    }
                    img { 
                        width: 100%; 
                        height: 300px; 
                        object-fit: cover; 
                        border-radius: 12px; 
                        margin-bottom: 2rem;
                    }
                    h1 { 
                        color: #463F3A; 
                        margin-bottom: 1rem;
                        font-size: 2.5rem;
                    }
                    .excerpt { 
                        font-size: 1.2rem; 
                        color: #8A817C; 
                        margin-bottom: 2rem;
                        font-style: italic;
                    }
                    .content {
                        font-size: 1.1rem;
                        line-height: 1.8;
                    }
                </style>
            </head>
            <body>
                <img src="${resource.image}" alt="${resource.title}">
                <h1>${resource.title}</h1>
                <p class="excerpt">${resource.excerpt}</p>
                <div class="content">
                    <p>This is where the full content of the resource would be displayed. In a real application, this would contain the complete article, tutorial, or guide content.</p>
                    <p>The content would be rich and detailed, providing valuable insights into ${resource.title.toLowerCase()} and helping users develop their language learning and personality development skills.</p>
                </div>
            </body>
            </html>
        `);
    }

    // Contact Form Setup
    function setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        const submitBtn = document.getElementById('submit-btn');
        const successMessage = document.getElementById('success-message');

        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleFormSubmission();
            });
        }

        async function handleFormSubmission() {
            // Show loading state
            const originalContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="loading"></div>';
            submitBtn.disabled = true;

            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            successMessage.style.display = 'block';
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;

            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);

            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Smooth scrolling for anchor links
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

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.solution-card, .resource-card, .quote-section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Form validation enhancement
    const formInputs = document.querySelectorAll('.form-input, .form-textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '';
            }
        });

        input.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(220, 53, 69)') {
                this.style.borderColor = '';
            }
        });
    });

    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization
window.addEventListener('load', function() {
    // Remove loading states
    document.body.classList.add('loaded');
    
    // Preload critical images
    const criticalImages = [
        'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
});

// Service worker registration (for future PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker would be registered here in a production environment
        console.log('Service worker support detected');
    });
}