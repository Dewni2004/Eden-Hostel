document.addEventListener('DOMContentLoaded', () => {
    // 1. Header scroll state
    const header = document.getElementById('siteHeader');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        
        if (scrollPos > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (scrollPos > 450) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('show');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('show') && header && !header.contains(e.target)) {
                navLinks.classList.remove('show');
                mobileMenuBtn.classList.remove('active');
            }
        });

        // Close menu if window is resized past mobile breakpoint
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }

    // 3. Smooth scroll and close mobile menu on click
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight || 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight + 10;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                if (navLinks && navLinks.classList.contains('show')) {
                    navLinks.classList.remove('show');
                    if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
                }
            }
        });
    });

    // 4. Set Default Date in Forms (Tomorrow or Today)
    const today = new Date().toISOString().split('T')[0];
    const quickCheckIn = document.getElementById('quickCheckIn');
    const stayDates = document.getElementById('stayDates');

    if (quickCheckIn) quickCheckIn.value = today;
    if (stayDates) stayDates.value = today;

    // 5. Quick Booking Bar (Hero Form)
    const quickBookingForm = document.getElementById('quickBookingForm');
    if (quickBookingForm) {
        quickBookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const date = document.getElementById('quickCheckIn').value;
            const vehicle = document.getElementById('quickVehicle').value;
            const room = document.getElementById('quickRoomType').value;
            const drivers = document.getElementById('quickDrivers').value;

            const message = `Hello Eden Hostel, I am a tour driver.\nI would like to check availability:\n- Check-in Date: ${date}\n- Room Option: ${room}\n- Vehicle Type: ${vehicle}\n- Drivers/Crew: ${drivers}\n\nPlease confirm availability. Thank you!`;
            const encoded = encodeURIComponent(message);
            window.open(`https://wa.me/94713160016?text=${encoded}`, '_blank');
        });
    }

    // 6. Interactive Calculator Logic
    const roomOptBtns = document.querySelectorAll('.calc-opt-btn');
    const calcNightsSelect = document.getElementById('calcNights');
    const calcVehicleSelect = document.getElementById('calcVehicleType');
    const summaryRoom = document.getElementById('calcSummaryRoom');
    const summaryDuration = document.getElementById('calcSummaryDuration');
    const summaryTotal = document.getElementById('calcTotalPrice');
    const calcWhatsAppBtn = document.getElementById('calcWhatsAppBtn');

    let currentRoomRate = 25;
    let currentRoomName = 'Private Driver Room';

    function updateCalculator() {
        const nights = parseInt(calcNightsSelect ? calcNightsSelect.value : '1', 10);
        const total = currentRoomRate * nights;
        const formattedTotal = '$' + total.toLocaleString();

        if (summaryRoom) summaryRoom.textContent = currentRoomName;
        if (summaryDuration) summaryDuration.textContent = nights === 1 ? '1 Night' : `${nights} Nights`;
        if (summaryTotal) summaryTotal.textContent = formattedTotal;
    }

    if (roomOptBtns.length > 0) {
        roomOptBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                roomOptBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentRoomRate = parseInt(btn.dataset.rate, 10);
                currentRoomName = btn.dataset.name;
                updateCalculator();
            });
        });
    }

    if (calcNightsSelect) {
        calcNightsSelect.addEventListener('change', updateCalculator);
    }

    if (calcWhatsAppBtn) {
        calcWhatsAppBtn.addEventListener('click', () => {
            const nights = calcNightsSelect ? calcNightsSelect.value : '1';
            const vehicle = calcVehicleSelect ? calcVehicleSelect.value : 'KDH Van';
            const total = summaryTotal ? summaryTotal.textContent : '$25';

            const message = `Hello Eden Hostel, I calculated my stay on your website:\n- Room Choice: ${currentRoomName}\n- Duration: ${nights} Night(s)\n- Vehicle: ${vehicle}\n- Estimated Rate: ${total}\n- Vehicle Parking: Included\n\nPlease reserve this for me.`;
            const encoded = encodeURIComponent(message);
            window.open(`https://wa.me/94713160016?text=${encoded}`, '_blank');
        });
    }

    // 7. Gallery Category Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // 8. Gallery Lightbox Modal
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.querySelector('h4') ? item.querySelector('h4').textContent : '';
            if (lightbox && lightboxImg && img) {
                lightboxImg.src = img.src;
                if (lightboxCaption) lightboxCaption.textContent = title;
                lightbox.style.display = 'flex';
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }

    // 9. FAQ Accordion Toggle
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isCurrentlyActive = item.classList.contains('active');

            // Close all items
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                const btn = i.querySelector('.faq-question');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });

            // If it wasn't active, activate it
            if (!isCurrentlyActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // 10. Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('driverName').value;
            const phone = document.getElementById('driverPhone').value;
            const vehicle = document.getElementById('vehicleModel').value || 'Not specified';
            const date = document.getElementById('stayDates').value;
            const msg = document.getElementById('driverMessage').value || 'No additional notes';

            const formattedMsg = `Hi Eden Hostel, I have an inquiry via your website:\n- Name: ${name}\n- Phone: ${phone}\n- Vehicle: ${vehicle}\n- Arrival Date: ${date}\n- Message: ${msg}\n\nPlease get back to me.`;
            const encoded = encodeURIComponent(formattedMsg);

            window.open(`https://wa.me/94713160016?text=${encoded}`, '_blank');
            alert('Opening WhatsApp to send your inquiry directly to Eden Hostel front desk!');
            contactForm.reset();
        });
    }

    // 11. Intersection Observer for Smooth Fade/Slide In
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll(
            '.room-card, .facility-card, .stat-card, .review-card, .gallery-item, .pillar-item, .waypoint-item'
        );

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(24px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    }
});
