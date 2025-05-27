document.addEventListener("DOMContentLoaded", function () {
  console.log("Consolidated navbar script loaded");

  let lastScrollTop = 0;

  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    const contactBar = document.querySelector(".top-contact-bar");
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
      if (contactBar) contactBar.style.transform = "translateY(-100%)";
      if (navbar) navbar.classList.add("navbar-scrolled");
    } else {
      if (contactBar) contactBar.style.transform = "translateY(0)";
      if (navbar) navbar.classList.remove("navbar-scrolled");
    }

    lastScrollTop = scrollTop;
  });
  document.getElementById('customToggler').addEventListener('click', function () {
  const navbarNav = document.getElementById('navbarNav');
  const isExpanded = this.getAttribute('aria-expanded') === 'true';
  
  if (isExpanded) {
    // Collapse the navbar
    navbarNav.classList.remove('show');
    this.setAttribute('aria-expanded', 'false');
  } else {
    // Show the navbar
    navbarNav.classList.add('show');
    this.setAttribute('aria-expanded', 'true');
  }
});


  const navbarCollapse = document.querySelector("#navbarNav");
  const navbarToggler = document.querySelector(".navbar-toggler");

  if (navbarCollapse && navbarToggler) {
    function closeNavbar() {
      console.log("Attempting to close navbar");

      if (navbarCollapse.classList.contains("show")) {
        console.log("Navbar is open, closing...");

        if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
          try {
            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
            bsCollapse.hide();
            console.log("Bootstrap close successful");
          } catch (error) {
            console.log("Bootstrap close failed, using manual method");
            manualCloseNavbar();
          }
        } else {
          manualCloseNavbar();
        }
      }
    }

    function manualCloseNavbar() {
      navbarCollapse.classList.remove("show");
      navbarCollapse.classList.remove("collapsing");
      navbarToggler.setAttribute("aria-expanded", "false");
      navbarToggler.classList.add("collapsed");
      document.body.classList.remove("navbar-open");
    }

    function handleNavClick(element, href) {
      console.log("Navigation click:", href);

      // Close navbar IMMEDIATELY on all nav clicks
      closeNavbar();

      // If anchor link, smooth scroll with delay
      if (href && href.startsWith("#") && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          setTimeout(() => {
            target.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 200);
          return false; // Prevent default navigation
        }
      }

      // Allow normal navigation for other links
      return true;
    }

    document.addEventListener("click", function (e) {
      if (e.target.closest(".navbar-toggler")) {
        console.log("Navbar toggler clicked");
        return; // Let Bootstrap handle toggling
      }

      const navLink = e.target.closest(".navbar-nav .nav-link, .dropdown-item");
      if (navLink) {
        const href = navLink.getAttribute("href");
        if (!handleNavClick(navLink, href) && href.startsWith("#")) {
          e.preventDefault();
        }
        e.stopPropagation();
        return;
      }

      const navbar = document.querySelector(".navbar");
      const isOutsideClick = navbar && !navbar.contains(e.target);
      const isNavbarOpen = navbarCollapse.classList.contains("show");

      if (isOutsideClick && isNavbarOpen) {
        console.log("Outside click detected, closing navbar");
        closeNavbar();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navbarCollapse.classList.contains("show")) {
        console.log("Escape key pressed, closing navbar");
        closeNavbar();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 992 && navbarCollapse.classList.contains("show")) {
        console.log("Screen resized to desktop, closing mobile menu");
        closeNavbar();
      }
    });

    // Bootstrap collapse event listeners
    function onNavbarShown(e) {
      if (e.target === navbarCollapse) {
        console.log("Navbar opened via Bootstrap");
      }
    }

    function onNavbarHidden(e) {
      if (e.target === navbarCollapse) {
        console.log("Navbar closed via Bootstrap");
      }
    }

    navbarCollapse.removeEventListener("shown.bs.collapse", onNavbarShown);
    navbarCollapse.removeEventListener("hidden.bs.collapse", onNavbarHidden);

    navbarCollapse.addEventListener("shown.bs.collapse", onNavbarShown);
    navbarCollapse.addEventListener("hidden.bs.collapse", onNavbarHidden);
  }
});


  // ==================== ANIMATION & SCROLL EFFECTS ====================
  
  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document.querySelectorAll(".section-title, .description-text, .video-container").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.8s ease";
    observer.observe(el);
  });

  // Add click effect to button
  const knowMoreBtn = document.querySelector(".know-more-btn");
  if (knowMoreBtn) {
    knowMoreBtn.addEventListener("click", function (e) {
      e.preventDefault();
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "translateY(-2px) scale(1)";
      }, 150);
    });
  }

  // Add click analytics and ripple effect for inline social links
  document.querySelectorAll(".social-link-inline").forEach((link) => {
    link.addEventListener("click", function (e) {
      const platform = this.textContent.trim();
      console.log(`Social link clicked: ${platform}`);

      // Add ripple effect
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;

      this.style.position = "relative";
      this.style.overflow = "hidden";
      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // ==================== ACHIEVERS VIEW MORE/LESS ====================
  
  const achieversState = {
    isExpanded: false,
    toggle: function() {
      const hiddenAchievers = document.querySelectorAll(".hidden-achievers");
      const viewMoreBtn = document.getElementById("viewMoreBtn");

      if (!this.isExpanded) {
        hiddenAchievers.forEach((achiever) => {
          achiever.style.display = "block";
        });
        if (viewMoreBtn) viewMoreBtn.textContent = "View Less";
        this.isExpanded = true;
      } else {
        hiddenAchievers.forEach((achiever) => {
          achiever.style.display = "none";
        });
        if (viewMoreBtn) viewMoreBtn.textContent = "View More Achievers";
        this.isExpanded = false;
      }
    }
  };

  // Global function for achievers
  window.toggleAchievers = function() {
    achieversState.toggle();
  };

  // ==================== MOBILE CAROUSEL ====================
  
  const mobileCarousel = {
  currentSlide: 0,
  autoPlayInterval: null,
  totalSlides: 0,
  track: null,
  slides: null,
  indicators: null,

  init: function () {
    this.slides = document.querySelectorAll(".mobile-carousel-slide");
    this.totalSlides = this.slides.length;
    this.track = document.getElementById("carouselTrack");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const indicatorsContainer = document.getElementById("carouselIndicators");

    if (!this.track || !this.slides.length) return;

    // Create indicators
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement("div");
      dot.className = "carousel-dot";
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => this.goToSlide(i));
      indicatorsContainer.appendChild(dot);
    }

    this.indicators = document.querySelectorAll(".carousel-dot");

    // Navigation buttons
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.nextSlide();
        this.resetAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        this.prevSlide();
        this.resetAutoPlay();
      });
    }

    // Touch/swipe support
    this.setupTouchEvents();

    // Pause on hover (desktop)
    this.track.addEventListener("mouseenter", () => this.stopAutoPlay());
    this.track.addEventListener("mouseleave", () => this.startAutoPlay());

    // Handle resize
    window.addEventListener("resize", () => {
      this.updateCarousel();
    });

    this.updateCarousel();
    this.startAutoPlay();
  },

  updateCarousel: function () {
    if (!this.slides.length) return;
    const slideWidth = this.slides[0].offsetWidth;
    this.track.style.transform = `translateX(-${this.currentSlide * slideWidth}px)`;

    this.indicators.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentSlide);
    });
  },

  goToSlide: function (slideIndex) {
    this.currentSlide = slideIndex;
    this.updateCarousel();
    this.resetAutoPlay();
  },

  nextSlide: function () {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateCarousel();
  },

  prevSlide: function () {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.updateCarousel();
  },

  startAutoPlay: function () {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // 5 seconds
  },

  stopAutoPlay: function () {
    clearInterval(this.autoPlayInterval);
  },

  resetAutoPlay: function () {
    this.stopAutoPlay();
    this.startAutoPlay();
  },

  setupTouchEvents: function () {
    let startX = 0;
    let endX = 0;

    this.track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      this.stopAutoPlay();
    }, { passive: true });

    this.track.addEventListener("touchmove", (e) => {
      endX = e.touches[0].clientX;
    }, { passive: true });

    this.track.addEventListener("touchend", () => {
      const diffX = startX - endX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
        this.resetAutoPlay();
      }
    }, { passive: true });
  }
};

// Initialize carousel
mobileCarousel.init();

  // ==================== ARCHIVES FILTER ====================
  
  const filterBtns = document.querySelectorAll(".filter-btn");
  const archiveCards = document.querySelectorAll(".archive-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      filterBtns.forEach((b) => b.classList.remove("active"));
      // Add active class to clicked button
      btn.classList.add("active");

      const category = btn.getAttribute("data-category");

      archiveCards.forEach((card) => {
        if (category === "all" || card.getAttribute("data-category") === category) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Archives View More functionality
  const viewMoreArchivesBtn = document.getElementById("viewMoreBtn");
  const hiddenArchives = document.querySelectorAll(".hidden-archives");

  if (viewMoreArchivesBtn) {
    viewMoreArchivesBtn.addEventListener("click", () => {
      const currentlyExpanded = hiddenArchives[0]?.classList.contains("show");

      hiddenArchives.forEach((archive) => {
        if (currentlyExpanded) {
          archive.classList.remove("show");
        } else {
          archive.classList.add("show");
        }
      });

      viewMoreArchivesBtn.textContent = currentlyExpanded
        ? "View More Archives"
        : "View Less";
    });
  }

  // ==================== REVIEW CAROUSEL ====================
  
  const reviewCarousel = {
    currentSlide: 0,
    totalSlides: 2,
    autoPlayInterval: null,

    init: function() {
      // Show first slide initially
      this.showSlide(0);

      // Auto-advance slides every 5 seconds
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide();
      }, 5000);
    },

    showSlide: function(n) {
      // Hide all slides
      const carousel1 = document.getElementById("reviewCarousel");
      const carousel2 = document.getElementById("slide2");
      
      if (carousel1) carousel1.classList.add("d-none");
      if (carousel2) carousel2.classList.add("d-none");

      // Show current slide
      if (n === 0 && carousel1) {
        carousel1.classList.remove("d-none");
      } else if (n === 1 && carousel2) {
        carousel2.classList.remove("d-none");
      }
    },

    nextSlide: function() {
      this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
      this.showSlide(this.currentSlide);
    },

    prevSlide: function() {
      this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
      this.showSlide(this.currentSlide);
    }
  };

  // Initialize review carousel
  reviewCarousel.init();

  // Global functions for review carousel
  window.nextSlide = function() {
    reviewCarousel.nextSlide();
  };

  window.prevSlide = function() {
    reviewCarousel.prevSlide();
  };


// ==================== GLOBAL FUNCTIONS ====================

// Video play functionality
window.playVideo = function() {
  window.open("https://www.youtube.com/watch?v=QrvqoahVrDU", "_blank");
};

// ==================== CSS INJECTION ====================

// Add CSS for ripple animation
const style = document.createElement("style");
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);