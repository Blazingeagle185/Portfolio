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
    const galleryCount = galleryImages.length
    if (galleryCount === 1) {
      container.classList.add("gallery-single")
    } else if (galleryCount === 2) {
      container.classList.add("gallery-double")
    } else {
      container.classList.add("gallery-multi")
    }

    // Add click event to each image
    galleryImages.forEach((item, index) => {
      item.addEventListener("click", function () {
        const image = this.querySelector("img")
        const projectId = this.getAttribute("data-project-id")
        const detailType = this.getAttribute("data-detail")
        const forceSimple = detailType === "simple"
        const detailNode = forceSimple ? null : this.querySelector(".what-how-results")
        const detailLayout = this.getAttribute("data-detail-layout")
        const useHeroImage = detailLayout === "hero"
        const description =
          this.getAttribute("data-description") ||
          this.querySelector(".gallery-caption")?.textContent?.trim()
        currentGallery = container
        currentImageIndex = index
        openLightbox(
          image.src,
          image.alt,
          projectId,
          detailNode,
          description,
          forceSimple,
          useHeroImage
        )
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
          <img id="lightbox-image" alt="" />
          <div class="loading-spinner" aria-hidden="true"></div>
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

      const item = galleryImages[currentImageIndex]
      const image = item.querySelector("img")
      const projectId = item.getAttribute("data-project-id")
      const detailType = item.getAttribute("data-detail")
      const forceSimple = detailType === "simple"
      const detailNode = forceSimple ? null : item.querySelector(".what-how-results")
      const detailLayout = item.getAttribute("data-detail-layout")
      const useHeroImage = detailLayout === "hero"
      const description =
        item.getAttribute("data-description") ||
        item.querySelector(".gallery-caption")?.textContent?.trim()
      openLightbox(
        image.src,
        image.alt,
        projectId,
        detailNode,
        description,
        forceSimple,
        useHeroImage
      )
    })

    nextBtn.addEventListener("click", () => {
      if (!currentGallery) return

      const galleryImages = currentGallery.querySelectorAll(".gallery-item")
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length

      const item = galleryImages[currentImageIndex]
      const image = item.querySelector("img")
      const projectId = item.getAttribute("data-project-id")
      const detailType = item.getAttribute("data-detail")
      const forceSimple = detailType === "simple"
      const detailNode = forceSimple ? null : item.querySelector(".what-how-results")
      const detailLayout = item.getAttribute("data-detail-layout")
      const useHeroImage = detailLayout === "hero"
      const description =
        item.getAttribute("data-description") ||
        item.querySelector(".gallery-caption")?.textContent?.trim()
      openLightbox(
        image.src,
        image.alt,
        projectId,
        detailNode,
        description,
        forceSimple,
        useHeroImage
      )
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

// Data for projects is now loaded from index.html (window.projectWebData)

// Open lightbox with image (and optional project details)
function openLightbox(
  src,
  alt,
  projectId = null,
  detailNode = null,
  description = "",
  forceSimple = false,
  useHeroImage = false
) {
  const lightbox = document.getElementById("lightbox")
  const contentContainer = lightbox.querySelector(".lightbox-content")

  // Reset content to default state first (remove any injected details)
  const existingDetails = lightbox.querySelector(".lightbox-details");
  if (existingDetails) existingDetails.remove();
  const existingCustom = lightbox.querySelector(".lightbox-custom-details");
  if (existingCustom) existingCustom.remove();

  // Show lightbox first with loading state
  lightbox.style.display = "flex"

  // Force reflow to enable transition
  void lightbox.offsetWidth

  // Add active class for animation
  lightbox.classList.add("active")

  if (useHeroImage) {
    lightbox.classList.add("hero-detail")
  } else {
    lightbox.classList.remove("hero-detail")
  }

  // Check if this is a detailed project
  if (detailNode) {
    setupDomDetailedView(lightbox, src, alt, detailNode);
  } else if (!forceSimple && projectId && projectWebData[projectId]) {
    setupDetailedView(lightbox, src, alt, projectWebData[projectId]);
  } else {
    setupStandardView(lightbox, src, alt, description);
  }
}

function setupDetailedView(lightbox, src, alt, data) {
  lightbox.classList.add("detailed-view");
  lightbox.classList.remove("simple-view");

  // Create detailed content structure
  const detailsHTML = `
        <div class="lightbox-details">
            <h3 class="lightbox-title">${data.title}</h3>
            <div class="detail-tabs">
                <button class="detail-tab-btn active" onclick="switchDetailTab(event, 'what')">What</button>
                <button class="detail-tab-btn" onclick="switchDetailTab(event, 'how')">How</button>
                <button class="detail-tab-btn" onclick="switchDetailTab(event, 'results')">Results</button>
            </div>
            <div id="what" class="detail-content active">${data.what}</div>
            <div id="how" class="detail-content">${data.how}</div>
            <div id="results" class="detail-content">${data.results}</div>
            <p class="detail-description">${data.description}</p>
        </div>
    `;

  // Append details after the image container
  const imageContainer = lightbox.querySelector(".lightbox-image-container");
  imageContainer.insertAdjacentHTML('afterend', detailsHTML);

  updateLightboxImage(src, alt); // Load image as usual
}

function setupStandardView(lightbox, src, alt, description) {
  lightbox.classList.remove("detailed-view");
  lightbox.classList.add("simple-view");
  // Standard view cleanup handled by removing .lightbox-details at start
  updateLightboxImage(src, alt, description || alt);
}

// Use DOM content from the gallery item itself (what/how/results block)
function setupDomDetailedView(lightbox, src, alt, detailNode) {
  lightbox.classList.add("detailed-view");
  lightbox.classList.remove("simple-view");

  // Clone the provided detail block so we don't move the original
  const clonedDetails = detailNode.cloneNode(true);
  clonedDetails.classList.add("lightbox-custom-details");

  // Append after the image container
  const imageContainer = lightbox.querySelector(".lightbox-image-container");
  imageContainer.insertAdjacentElement('afterend', clonedDetails);

  updateLightboxImage(src, alt); // Load image as usual
}

// Global function for tab switching (needs to be global or attached to window if module)
window.switchDetailTab = function (event, tabName) {
  // Buttons
  const buttons = event.target.parentElement.querySelectorAll(".detail-tab-btn");
  buttons.forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");

  // Content
  const container = event.target.closest(".lightbox-details");
  const contents = container.querySelectorAll(".detail-content");
  contents.forEach(content => content.classList.remove("active"));

  container.querySelector(`#${tabName}`).classList.add("active");
}


// Update lightbox image with loading indicator
function updateLightboxImage(src, alt, captionText = alt) {
  const lightboxImage = document.getElementById("lightbox-image")
  const lightboxCaption = document.querySelector(".lightbox-caption")
  const loadingSpinner = document.querySelector(".loading-spinner")

  // Show loading spinner
  loadingSpinner.style.display = "block"
  lightboxImage.style.opacity = "0.3"

  // Reset image src to trigger load event
  lightboxImage.src = ""

  // Update caption
  lightboxCaption.textContent = captionText

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
