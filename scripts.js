// DOM Elements
const header = document.getElementById("header")
const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
const navLinks = document.querySelector(".nav-links")
const backToTopBtn = document.getElementById("back-to-top")

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Force dark mode
  document.body.classList.add("dark-mode")

  initializeGallery()
  setupMobileMenu()
  setupScrollEvents()
  setupAnimations()

  // Update the year in the footer
  const dateChanger = document.getElementById("date")
  if (dateChanger) {
    dateChanger.innerHTML = new Date().getFullYear()
  }
})

// Initialize Gallery with enhanced lightbox
function initializeGallery() {
  const galleryContainers = document.querySelectorAll(".gallery-container")
  let currentGallery = null
  let currentImageIndex = 0

  galleryContainers.forEach((container) => {
    // Get all gallery images
    const galleryImages = container.querySelectorAll(".gallery-item")

    // Add click event to each image
    galleryImages.forEach((item, index) => {
      item.addEventListener("click", function () {
        const image = this.querySelector("img")
        currentGallery = container
        currentImageIndex = index
        openLightbox(image.src, image.alt)
      })
    })
  })

  // Create lightbox if it doesn't exist
  if (!document.getElementById("lightbox")) {
    const lightbox = document.createElement("div")
    lightbox.id = "lightbox"
    lightbox.className = "lightbox"
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <span class="close-lightbox">&times;</span>
        <button class="nav-btn prev-btn" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
        <div class="lightbox-image-container">
          <img id="lightbox-image" src="/placeholder.svg" alt="">
          <div class="loading-spinner"></div>
        </div>
        <button class="nav-btn next-btn" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
        <div class="lightbox-caption"></div>
      </div>
    `
    document.body.appendChild(lightbox)

    // Add close functionality
    const closeLightbox = document.querySelector(".close-lightbox")
    closeLightbox.addEventListener("click", () => {
      document.getElementById("lightbox").classList.remove("active")
      setTimeout(() => {
        document.getElementById("lightbox").style.display = "none"
      }, 300)
    })

    // Close lightbox when clicking outside the image
    lightbox.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("active")
        setTimeout(() => {
          this.style.display = "none"
        }, 300)
      }
    })

    // Add navigation buttons functionality
    const prevBtn = lightbox.querySelector(".prev-btn")
    const nextBtn = lightbox.querySelector(".next-btn")

    prevBtn.addEventListener("click", () => {
      if (!currentGallery) return

      const galleryImages = currentGallery.querySelectorAll(".gallery-item")
      currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length

      const image = galleryImages[currentImageIndex].querySelector("img")
      updateLightboxImage(image.src, image.alt)
    })

    nextBtn.addEventListener("click", () => {
      if (!currentGallery) return

      const galleryImages = currentGallery.querySelectorAll(".gallery-item")
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length

      const image = galleryImages[currentImageIndex].querySelector("img")
      updateLightboxImage(image.src, image.alt)
    })

    // Add keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (lightbox.style.display !== "flex") return

      if (e.key === "Escape") {
        lightbox.classList.remove("active")
        setTimeout(() => {
          lightbox.style.display = "none"
        }, 300)
      } else if (e.key === "ArrowLeft") {
        prevBtn.click()
      } else if (e.key === "ArrowRight") {
        nextBtn.click()
      }
    })
  }
}

// Open lightbox with image
function openLightbox(src, alt) {
  const lightbox = document.getElementById("lightbox")

  // Show lightbox first with loading state
  lightbox.style.display = "flex"

  // Force reflow to enable transition
  void lightbox.offsetWidth

  // Add active class for animation
  lightbox.classList.add("active")

  // Update image
  updateLightboxImage(src, alt)
}

// Update lightbox image with loading indicator
function updateLightboxImage(src, alt) {
  const lightboxImage = document.getElementById("lightbox-image")
  const lightboxCaption = document.querySelector(".lightbox-caption")
  const loadingSpinner = document.querySelector(".loading-spinner")

  // Show loading spinner
  loadingSpinner.style.display = "block"
  lightboxImage.style.opacity = "0.3"

  // Reset image src to trigger load event
  lightboxImage.src = ""

  // Update caption
  lightboxCaption.textContent = alt

  // Load new image
  const img = new Image()
  img.onload = () => {
    lightboxImage.src = src
    lightboxImage.style.opacity = "1"
    loadingSpinner.style.display = "none"
  }
  img.onerror = () => {
    lightboxCaption.textContent = "Error loading image"
    loadingSpinner.style.display = "none"
  }
  img.src = src
}

// Mobile Menu
function setupMobileMenu() {
  mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active")

    // Animate hamburger to X
    const bars = mobileMenuBtn.querySelectorAll(".bar")
    bars[0].classList.toggle("rotate-45")
    bars[1].classList.toggle("opacity-0")
    bars[2].classList.toggle("rotate-neg-45")
  })
}

// Scroll Events
function setupScrollEvents() {
  // Header scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled")
      backToTopBtn.classList.add("visible")
    } else {
      header.classList.remove("scrolled")
      backToTopBtn.classList.remove("visible")
    }
  })

  // Back to top button
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        })

        // Close mobile menu if open
        if (navLinks.classList.contains("active")) {
          navLinks.classList.remove("active")
        }
      }
    })
  })
}

// Setup animations for page elements
function setupAnimations() {
  // Add animation on scroll
  const animatedElements = document.querySelectorAll("[data-aos]")

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("aos-animate")
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  animatedElements.forEach((element) => {
    element.classList.add("aos-init")
    observer.observe(element)
  })

  // Add hover effects to project cards
  document.querySelectorAll(".project").forEach((project) => {
    project.addEventListener("mouseenter", function () {
      this.classList.add("hover")
    })

    project.addEventListener("mouseleave", function () {
      this.classList.remove("hover")
    })
  })
}

