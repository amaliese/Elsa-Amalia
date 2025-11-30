// ========== FUNGSI DOWNLOAD CV ==========
async function downloadCV() {
  try {
    const response = await fetch("CV Elsa Ainun Amalia.pdf");
    if (!response.ok) {
      throw new Error("File tidak ditemukan");
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CV_Elsa_Ainun_Amalia.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    alert("CV berhasil diunduh! ✅");
  } catch (error) {
    console.error("Error downloading CV:", error);
    alert("Maaf, terjadi kesalahan saat mengunduh CV.");
  }
}

// ========== FORM SUBMISSION ==========
function handleSubmit() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  if (!name || !email || !message) {
    alert("Mohon isi semua field!");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Format email tidak valid!");
    return;
  }

  alert(`Terima kasih ${name}! Pesan Anda telah terkirim.`);
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("message").value = "";
}

// ========== PROJECT CAROUSEL (FIXED) ==========
let currentSlide = 0;
let slidesPerView = 3;
const totalSlides = 5;
let touchStartX = 0;
let touchEndX = 0;

function updateSlidesPerView() {
  const width = window.innerWidth;
  if (width < 768) {
    slidesPerView = 1; // Mobile
  } else if (width < 1024) {
    slidesPerView = 2; // Tablet
  } else {
    slidesPerView = 3; // Desktop
  }
  updateDots();
  updateSlideCounter();
}

function updateDots() {
  const dotsContainer = document.getElementById("dotsContainer");
  if (!dotsContainer) return;

  const maxSlide = totalSlides - slidesPerView;
  dotsContainer.innerHTML = "";

  for (let i = 0; i <= maxSlide; i++) {
    const dot = document.createElement("button");
    dot.className = `carousel-dot w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
      i === currentSlide ? "bg-pink-400 scale-125" : "bg-pink-400/30"
    }`;
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  }
}

function goToSlide(slideIndex) {
  const carousel = document.getElementById("projectCarousel");
  if (!carousel) return;

  updateSlidesPerView();
  const maxSlide = totalSlides - slidesPerView;
  currentSlide = Math.max(0, Math.min(slideIndex, maxSlide));

  // Ambil card pertama untuk mendapatkan ukuran sebenarnya
  const firstCard = carousel.children[0];
  if (!firstCard) return;

  const cardWidth = firstCard.offsetWidth;
  const style = window.getComputedStyle(carousel);
  const gap = parseInt(style.gap) || 0;

  const offset = -(currentSlide * (cardWidth + gap));
  carousel.style.transform = `translateX(${offset}px)`;

  updateNavigationButtons();
  updateDots();
  updateSlideCounter();
}

function moveCarousel(direction) {
  goToSlide(currentSlide + direction);
}

function updateSlideCounter() {
  const currentText = document.getElementById("currentSlideText");
  const totalText = document.getElementById("totalSlidesText");

  if (currentText && totalText) {
    currentText.textContent = currentSlide + 1;
    totalText.textContent = totalSlides;
  }
}

function updateNavigationButtons() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  if (!prevBtn || !nextBtn) return;

  const maxSlide = totalSlides - slidesPerView;

  if (currentSlide === 0) {
    prevBtn.style.opacity = "0.3";
    prevBtn.style.pointerEvents = "none";
  } else {
    prevBtn.style.opacity = "1";
    prevBtn.style.pointerEvents = "auto";
  }

  if (currentSlide >= maxSlide) {
    nextBtn.style.opacity = "0.3";
    nextBtn.style.pointerEvents = "none";
  } else {
    nextBtn.style.opacity = "1";
    nextBtn.style.pointerEvents = "auto";
  }
}

function handleSwipe() {
  const swipeThreshold = 50;
  if (touchEndX < touchStartX - swipeThreshold) {
    moveCarousel(1);
  }
  if (touchEndX > touchStartX + swipeThreshold) {
    moveCarousel(-1);
  }
}

function initProjectCardEffects() {
  const projectSection = document.getElementById("projects");
  if (!projectSection) return;

  const projectCards = projectSection.querySelectorAll(
    "#projectCarousel > div"
  );

  projectCards.forEach((card) => {
    card.style.transition = "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

    if (window.matchMedia("(hover: hover)").matches) {
      card.addEventListener("mouseenter", function () {
        this.style.transform = "scale(1.05) translateY(-8px)";
        this.style.zIndex = "50";
        this.style.boxShadow = "0 20px 40px -15px rgba(236, 72, 153, 0.35)";

        projectCards.forEach((otherCard) => {
          if (otherCard !== this) {
            otherCard.style.filter = "blur(2px) brightness(0.7)";
            otherCard.style.opacity = "0.6";
          }
        });
      });

      card.addEventListener("mouseleave", function () {
        this.style.transform = "scale(1) translateY(0)";
        this.style.zIndex = "1";
        this.style.boxShadow = "";

        projectCards.forEach((otherCard) => {
          otherCard.style.filter = "none";
          otherCard.style.opacity = "1";
        });
      });
    }
  });
}

// ========== ANIMASI SCROLL ==========
const modernAnimations = [
  { transform: "translateY(30px)", opacity: "0" },
  { transform: "translateX(-30px)", opacity: "0" },
  { transform: "translateX(30px)", opacity: "0" },
  { transform: "scale(0.95)", opacity: "0" },
  { transform: "translateY(-30px)", opacity: "0" },
];

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translate(0, 0) scale(1)";
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }
);

// ========== EVENT LISTENERS ==========
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  if (window.scrollY > 100) {
    nav.classList.add("shadow-xl");
  } else {
    nav.classList.remove("shadow-xl");
  }
});

window.addEventListener("resize", () => {
  const carousel = document.getElementById("projectCarousel");
  if (!carousel) return;

  const oldSlidesPerView = slidesPerView;
  updateSlidesPerView();

  if (oldSlidesPerView !== slidesPerView) {
    currentSlide = 0;
  }

  goToSlide(currentSlide);
});

document.addEventListener("keydown", (e) => {
  const projectSection = document.getElementById("projects");
  if (!projectSection) return;

  const rect = projectSection.getBoundingClientRect();
  const isInView = rect.top < window.innerHeight && rect.bottom >= 0;

  if (isInView) {
    if (e.key === "ArrowLeft") {
      moveCarousel(-1);
    } else if (e.key === "ArrowRight") {
      moveCarousel(1);
    }
  }
});

// ========== DOM CONTENT LOADED ==========
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const closeIcon = document.getElementById("close-icon");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      hamburgerIcon.classList.toggle("hidden");
      closeIcon.classList.toggle("hidden");
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        hamburgerIcon.classList.remove("hidden");
        closeIcon.classList.add("hidden");
      });
    });
  }

  document.querySelectorAll("[data-animate]").forEach((el, index) => {
    const animationType = modernAnimations[index % modernAnimations.length];
    el.style.transform = animationType.transform;
    el.style.opacity = animationType.opacity;
    el.style.transitionDelay = `${index * 0.05}s`;
    el.style.transition = "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    observer.observe(el);
  });

  const carousel = document.getElementById("projectCarousel");
  if (carousel) {
    updateSlidesPerView();

    // Wait for images/content to load before calculating
    setTimeout(() => {
      goToSlide(0);
    }, 100);

    initProjectCardEffects();

    carousel.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
  }

  setTimeout(() => {
    const typingElement = document.querySelector(".typing-animation");
    if (typingElement) {
      typingElement.classList.add("finished");
    }
  }, 3500);
});
