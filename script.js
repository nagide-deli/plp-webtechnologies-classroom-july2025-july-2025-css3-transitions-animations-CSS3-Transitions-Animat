// Part 2: JavaScript Functions — Scope, Parameters & Return Values

// Global variables
let currentBooking = null;
const roomPrices = {
    standard: 99,
    deluxe: 149,
    suite: 249
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application
function initializeApp() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Explore button click
    document.getElementById('exploreBtn').addEventListener('click', function() {
        scrollToSection('rooms');
    });
    
    // Room booking buttons
    document.querySelectorAll('.book-btn').forEach(button => {
        button.addEventListener('click', function() {
            const roomType = this.getAttribute('data-room');
            openBookingModal(roomType);
        });
    });
    
    // Modal close button
    document.querySelector('.close-modal').addEventListener('click', closeBookingModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('bookingModal');
        if (e.target === modal) {
            closeBookingModal();
        }
    });
    
    // Booking form submission
    document.getElementById('bookingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        processBooking();
    });
    
    // Contact form submission
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        processContactForm();
    });
    
    // Initialize date inputs with min date as today
    initializeDateInputs();
}

// Function to scroll to a section with offset for header
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerOffset = 80;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Function to open booking modal
function openBookingModal(roomType) {
    const modal = document.getElementById('bookingModal');
    const roomTypeInput = document.getElementById('roomType');
    
    // Set room type and price in the form
    roomTypeInput.value = formatRoomType(roomType) + ` - $${roomPrices[roomType]}/night`;
    currentBooking = roomType;
    
    // Show modal with animation
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Function to close booking modal
function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Re-enable scrolling
    document.getElementById('bookingForm').reset();
}

// Function to format room type for display
function formatRoomType(roomType) {
    return roomType.charAt(0).toUpperCase() + roomType.slice(1) + ' Room';
}

// Function to initialize date inputs with today's date as minimum
function initializeDateInputs() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkIn').setAttribute('min', today);
    document.getElementById('checkOut').setAttribute('min', today);
}

// Function to calculate total price based on room type and stay duration
function calculateTotalPrice(roomType, checkIn, checkOut) {
    // Validate parameters
    if (!roomPrices[roomType] || !checkIn || !checkOut) {
        return 0;
    }
    
    // Calculate number of nights
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(checkIn);
    const secondDate = new Date(checkOut);
    const nights = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    
    // Return total price
    return roomPrices[roomType] * nights;
}

// Function to validate booking form
function validateBookingForm(formData) {
    const errors = [];
    
    // Check if check-out date is after check-in date
    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
        errors.push('Check-out date must be after check-in date');
    }
    
    // Validate number of guests
    if (formData.guests < 1 || formData.guests > 4) {
        errors.push('Number of guests must be between 1 and 4');
    }
    
    return errors;
}

// Function to process booking
function processBooking() {
    const formData = {
        roomType: currentBooking,
        checkIn: document.getElementById('checkIn').value,
        checkOut: document.getElementById('checkOut').value,
        guests: parseInt(document.getElementById('guests').value)
    };
    
    // Validate form
    const errors = validateBookingForm(formData);
    
    if (errors.length > 0) {
        showNotification(errors.join(', '), 'error');
        return;
    }
    
    // Calculate total price
    const totalPrice = calculateTotalPrice(formData.roomType, formData.checkIn, formData.checkOut);
    
    // In a real application, you would send this data to a server
    // For this demo, we'll just show a success message
    showNotification(`Booking confirmed for ${formatRoomType(formData.roomType)}! Total: $${totalPrice}`, 'success');
    
    // Close modal after a delay
    setTimeout(() => {
        closeBookingModal();
    }, 2000);
}

// Function to process contact form
function processContactForm() {
    // In a real application, you would send this data to a server
    // For this demo, we'll just show a success message
    showNotification('Thank you for your message! We will get back to you soon.', 'success');
    
    // Reset form
    document.getElementById('contactForm').reset();
}

// Function to show notification
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    
    // Set message and style based on type
    notification.textContent = message;
    notification.className = 'notification';
    
    if (type === 'error') {
        notification.style.backgroundColor = '#ff6b6b';
    } else if (type === 'success') {
        notification.style.backgroundColor = '#51cf66';
    } else {
        notification.style.backgroundColor = '#4f5d75';
    }
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Part 3: Combining CSS Animations with JavaScript

// Function to add animation class to elements when they come into view
function animateOnScroll() {
    const elements = document.querySelectorAll('.room-card, .amenity-item');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = 1;
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize elements for scroll animation
document.querySelectorAll('.room-card, .amenity-item').forEach(element => {
    element.style.opacity = 0;
    element.style.transform = 'translateY(50px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Add scroll event listener for animations
window.addEventListener('scroll', animateOnScroll);

// Trigger once on load in case elements are already in view
window.addEventListener('load', animateOnScroll);

// Function to add hover animation to elements
function addHoverAnimation() {
    const ctaButtons = document.querySelectorAll('.cta-button, .book-btn, .submit-btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
}

// Initialize hover animations
addHoverAnimation();