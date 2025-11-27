// Fungsi Download CV
async function downloadCV() {
  try {
    const pdfData = await window.fs.readFile("CV Elsa Ainun Amalia.pdf");
    const blob = new Blob([pdfData], { type: "application/pdf" });
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

// Smooth scrolling untuk navigasi
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Array animasi modern dan profesional
const modernAnimations = [
  // Fade slide dari bawah
  { transform: "translateY(30px)", opacity: "0" },
  // Fade slide dari kiri
  { transform: "translateX(-30px)", opacity: "0" },
  // Fade slide dari kanan
  { transform: "translateX(30px)", opacity: "0" },
  // Subtle zoom in
  { transform: "scale(0.95)", opacity: "0" },
  // Fade slide dari atas
  { transform: "translateY(-30px)", opacity: "0" },
];

// Intersection Observer untuk animasi scroll
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

// Observe semua elemen dengan data-animate - MODERN & CLEAN
document.querySelectorAll("[data-animate]").forEach((el, index) => {
  // Pilih animasi yang sesuai dengan pola modern
  const animationType = modernAnimations[index % modernAnimations.length];

  // Set initial state dengan animasi subtle
  el.style.transform = animationType.transform;
  el.style.opacity = animationType.opacity;

  // Kecepatan konsisten
  el.style.transitionDelay = `${index * 0.05}s`;

  // Smooth easing yang profesional
  el.style.transition = "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

  observer.observe(el);
});

// Form submission handler
function handleSubmit() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  if (!name || !email || !message) {
    alert("Mohon isi semua field!");
    return;
  }

  // Validasi email
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

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  if (window.scrollY > 100) {
    nav.classList.add("shadow-xl");
  } else {
    nav.classList.remove("shadow-xl");
  }
});

// ========== PROJECT CAROUSEL ==========
let currentSlide = 0;
let slidesPerView = 3; // Default untuk desktop
const totalSlides = 5; // Total project cards

// Fungsi untuk menghitung slides per view berdasarkan lebar layar
function updateSlidesPerView() {
  const width = window.innerWidth;
  if (width < 768) {
    slidesPerView = 1; // Mobile
  } else if (width < 1024) {
    slidesPerView = 2; // Tablet
  } else {
    slidesPerView = 3; // Desktop
  }
}

// Fungsi untuk menggerakkan carousel
function moveCarousel(direction) {
  const carousel = document.getElementById("projectCarousel");
  if (!carousel) return;

  updateSlidesPerView();

  const maxSlide = totalSlides - slidesPerView;
  currentSlide += direction;

  // Batasi slide agar tidak keluar dari range
  if (currentSlide < 0) {
    currentSlide = 0;
  } else if (currentSlide > maxSlide) {
    currentSlide = maxSlide;
  }

  // Hitung offset berdasarkan lebar card dan gap
  const cardWidth = carousel.children[0].offsetWidth;
  const gap = 32; // 2rem = 32px (gap-8 di Tailwind)
  const offset = -(currentSlide * (cardWidth + gap));

  carousel.style.transform = `translateX(${offset}px)`;

  // Update tombol navigasi
  updateNavigationButtons();
}

// Fungsi untuk update state tombol navigasi
function updateNavigationButtons() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!prevBtn || !nextBtn) return;

  const maxSlide = totalSlides - slidesPerView;

  // Disable/enable tombol berdasarkan posisi
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

// Update carousel saat window resize
window.addEventListener("resize", () => {
  const carousel = document.getElementById("projectCarousel");
  if (!carousel) return;

  updateSlidesPerView();
  // Reset ke slide pertama saat resize untuk menghindari bug
  currentSlide = 0;
  carousel.style.transform = "translateX(0)";
  updateNavigationButtons();
});

// Keyboard navigation untuk carousel
document.addEventListener("keydown", (e) => {
  const projectSection = document.getElementById("projects");
  if (!projectSection) return;

  // Hanya aktif jika user berada di section projects
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

// Touch/swipe support untuk mobile
let touchStartX = 0;
let touchEndX = 0;

// ========== PROJECT CARD HOVER EFFECTS ==========
function initProjectCardEffects() {
  const projectSection = document.getElementById("projects");
  if (!projectSection) return;

  // Set overflow visible pada containers
  const carouselWrapper = projectSection.querySelector(
    ".relative.overflow-hidden"
  );
  if (carouselWrapper) {
    carouselWrapper.style.overflow = "visible";
    carouselWrapper.style.paddingTop = "60px";
    carouselWrapper.style.paddingBottom = "60px";
  }

  const carousel = document.getElementById("projectCarousel");
  if (carousel) {
    carousel.parentElement.style.overflow = "visible";
  }

  const projectCards = projectSection.querySelectorAll(
    "#projectCarousel > div"
  );

  projectCards.forEach((card) => {
    // Set initial state dengan transisi smooth
    card.style.transition = "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

    // Mouse enter - Zoom in & blur background
    card.addEventListener("mouseenter", function () {
      // Zoom card yang di-hover (lebih subtle)
      this.style.transform = "scale(1.08) translateY(-10px)";
      this.style.zIndex = "50";
      this.style.boxShadow = "0 20px 40px -15px rgba(236, 72, 153, 0.35)";

      // Blur semua card lainnya (lebih halus)
      projectCards.forEach((otherCard) => {
        if (otherCard !== this) {
          otherCard.style.filter = "blur(3px) brightness(0.6)";
          otherCard.style.opacity = "0.5";
          otherCard.style.transform = "scale(0.97)";
          otherCard.style.transition = "all 0.3s ease";
        }
      });
    });

    // Mouse leave - Reset semua
    card.addEventListener("mouseleave", function () {
      // Reset card yang di-hover
      this.style.transform = "scale(1) translateY(0)";
      this.style.zIndex = "1";
      this.style.boxShadow = "";

      // Reset semua card lainnya
      projectCards.forEach((otherCard) => {
        otherCard.style.filter = "none";
        otherCard.style.opacity = "1";
        otherCard.style.transform = "scale(1)";
      });
    });

    // Touch support untuk mobile
    card.addEventListener("touchstart", function (e) {
      if (e.touches.length === 1) {
        // Zoom card yang di-touch (subtle)
        this.style.transform = "scale(1.05) translateY(-8px)";
        this.style.zIndex = "50";
        this.style.boxShadow = "0 15px 30px -10px rgba(236, 72, 153, 0.3)";

        // Blur card lainnya (halus)
        projectCards.forEach((otherCard) => {
          if (otherCard !== this) {
            otherCard.style.filter = "blur(2px) brightness(0.7)";
            otherCard.style.opacity = "0.6";
            otherCard.style.transform = "scale(0.98)";
            otherCard.style.transition = "all 0.3s ease";
          }
        });
      }
    });

    // Reset saat touch end
    card.addEventListener("touchend", function () {
      setTimeout(() => {
        this.style.transform = "scale(1) translateY(0)";
        this.style.zIndex = "1";
        this.style.boxShadow = "";

        projectCards.forEach((otherCard) => {
          otherCard.style.filter = "none";
          otherCard.style.opacity = "1";
          otherCard.style.transform = "scale(1)";
        });
      }, 200);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("projectCarousel");
  if (carousel) {
    // Initialize navigation buttons state
    updateSlidesPerView();
    updateNavigationButtons();

    // Initialize project card hover effects
    initProjectCardEffects();

    // Touch events untuk swipe
    carousel.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
  }

  // Typing animation selesai
  setTimeout(() => {
    const typingElement = document.querySelector(".typing-animation");
    if (typingElement) {
      typingElement.classList.add("finished");
    }
  }, 2500);
});

function handleSwipe() {
  const swipeThreshold = 50; // Minimum distance untuk trigger swipe

  if (touchEndX < touchStartX - swipeThreshold) {
    // Swipe left
    moveCarousel(1);
  }

  if (touchEndX > touchStartX + swipeThreshold) {
    // Swipe right
    moveCarousel(-1);
  }
}
