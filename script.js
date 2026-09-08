document.addEventListener("DOMContentLoaded", () => {
  // 1. Détection dynamique de la section active pour le Dock en bas
  const sections = document.querySelectorAll("section");
  const dockLinks = document.querySelectorAll(".dock-link");

  const updateActiveDock = () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 250;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    dockLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", updateActiveDock);
  updateActiveDock();

  // 2. Animations bidirectionnelles (apparition à la descente ET à la remontée)
  const revealElements = document.querySelectorAll(".reveal");

  const handleScrollAnimation = () => {
    const triggerBottom = window.innerHeight * 0.88;
    const triggerTop = 60;

    revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < triggerBottom && rect.bottom > triggerTop) {
        el.classList.add("visible");
      } else {
        el.classList.remove("visible");
      }
    });
  };

  window.addEventListener("scroll", handleScrollAnimation);
  window.addEventListener("resize", handleScrollAnimation);
  handleScrollAnimation();

  // 3. Carrousel vertical 3D pour les Certifications (Molette + Clic)
  const carousel = document.getElementById("certifCarousel");
  if (carousel) {
    const slides = carousel.querySelectorAll(".v-slide");
    const dotsContainer = document.getElementById("carouselDots");
    let currentIndex = 0;
    const totalSlides = slides.length;
    let isThrottled = false;

    dotsContainer.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.classList.add("v-dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => updateCarousel(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".v-dot");

    const updateCarousel = (newIndex) => {
      currentIndex = (newIndex + totalSlides) % totalSlides;

      slides.forEach((slide, i) => {
        slide.className = "certif-card liquid-card v-slide";

        const diff = (i - currentIndex + totalSlides) % totalSlides;

        if (diff === 0) {
          slide.classList.add("active");
        } else if (diff === totalSlides - 1) {
          slide.classList.add("prev");
        } else if (diff === 1) {
          slide.classList.add("next");
        } else if (diff > 1 && diff <= totalSlides / 2) {
          slide.classList.add("hidden-bottom");
        } else {
          slide.classList.add("hidden-top");
        }
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
      });
    };

    carousel.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        if (isThrottled) return;

        isThrottled = true;
        setTimeout(() => {
          isThrottled = false;
        }, 320);

        if (e.deltaY > 0) {
          updateCarousel(currentIndex + 1);
        } else {
          updateCarousel(currentIndex - 1);
        }
      },
      { passive: false }
    );

    slides.forEach((slide) => {
      slide.addEventListener("click", () => {
        const slideIndex = parseInt(slide.getAttribute("data-index"), 10);
        if (slideIndex !== currentIndex) {
          updateCarousel(slideIndex);
        }
      });
    });

    updateCarousel(0);
  }

  // 4. Filtrage dynamique des Projets
  const filterTabs = document.querySelectorAll(".filter-tab");
  const projectBoxes = document.querySelectorAll(".project-box");

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      filterTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.getAttribute("data-filter");

      projectBoxes.forEach((box) => {
        if (filter === "all" || box.getAttribute("data-category") === filter) {
          box.style.display = "flex";
        } else {
          box.style.display = "none";
        }
      });
    });
  });

  // 5. Gestion de toutes les Modales
  const openBtns = document.querySelectorAll(".open-modal");
  const closeBtns = document.querySelectorAll(".close-btn");
  const backdrops = document.querySelectorAll(".modal-backdrop");
  const modalAnchorLinks = document.querySelectorAll(".modal-anchor-link");

  openBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.getAttribute("data-target"));
      if (target) target.style.display = "flex";
    });
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      backdrops.forEach((b) => (b.style.display = "none"));
    });
  });

  modalAnchorLinks.forEach((link) => {
    link.addEventListener("click", () => {
      backdrops.forEach((b) => (b.style.display = "none"));
    });
  });

  window.addEventListener("click", (e) => {
    backdrops.forEach((b) => {
      if (e.target === b) b.style.display = "none";
    });
  });
});