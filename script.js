const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
    const isOpen = mobileNav.classList.contains("open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section[id]");
  const topLinks = document.querySelectorAll(".nav-link");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  const sideLinks = document.querySelectorAll(".side-link");

  function removeActive(links) {
    links.forEach((link) => link.classList.remove("active"));
  }

  function setActiveById(links, id) {
    links.forEach((link) => {
      if (link.getAttribute("href") === `#${id}`) {
        link.classList.add("active");
      }
    });
  }

  function updateActiveStates(id) {
    removeActive(topLinks);
    removeActive(mobileLinks);
    removeActive(sideLinks);

    setActiveById(topLinks, id);
    setActiveById(mobileLinks, id);
    setActiveById(sideLinks, id);
  }

  function updateCurrentSection() {
    const scrollPosition = window.scrollY + 180;
    let currentId = "intro";

    sections.forEach((section) => {
      if (scrollPosition >= section.offsetTop) {
        currentId = section.id;
      }
    });

    updateActiveStates(currentId);
  }

  const storyData = [
    "Ein männlicher Gott wird zur Strafe in einen Hund namens Tumang verwandelt. Eines Tages fällt einer Frau beim Weben ein Werkzeug herunter, und sie schwört, den Finder zu heiraten. Tumang, der nun ein Hund ist, bringt es zurück – und sie hält ihr Versprechen.",
    "Ihr Sohn Sangkuriang wächst heran und geht mit Tumang auf die Jagd. Als er keine Beute findet, tötet er im Zorn den Hund. Er weiß nicht, dass Tumang sein Vater ist. Das Fleisch bringt er ahnungslos seiner Mutter.",
    "Dayang Sumbi erkennt die Wahrheit und wird von Schmerz und Wut überwältigt. Sie schlägt Sangkuriang mit einem Reislöffel auf den Kopf und hinterlässt eine Narbe. Danach verstößt sie ihn aus ihrem Leben. Sangkuriang verlässt seine Heimat und kehrt erst viele Jahre später zurück.",
    "Als erwachsener Mann begegnet Sangkuriang einer wunderschönen Frau und verliebt sich in sie. Er erkennt nicht, dass es seine eigene Mutter ist, die ewige Jugend erhalten hat. Als Dayang Sumbi die Narbe auf seinem Kopf sieht, begreift sie die Wahrheit. Um die Hochzeit zu verhindern, verlangt sie von ihm, über Nacht einen Fluss zu stauen und ein riesiges Boot zu bauen.",
    "Mit Hilfe von Geistern gelingt es Sangkuriang fast, die Aufgabe rechtzeitig zu erfüllen. Aus Angst lässt Dayang Sumbi den Sonnenaufgang vortäuschen, damit er glaubt, die Zeit sei vorbei. Als er erkennt, dass er getäuscht wurde, bricht seine Wut hervor. In rasendem Zorn tritt er das unfertige Boot um.",
    "Das umgestoßene Boot wird der Legende nach zum Berg Tangkuban Perahu. Der aufgestaute Fluss formt ein großes Becken, aus dem später die Region Bandung entsteht. Berge, Hügel und Täler gelten als Spuren seiner Zerstörung. So lebt die Geschichte bis heute in der Landschaft weiter."
  ];

  const scrolly = document.querySelector(".legend-scrolly");
  const slides = Array.from(document.querySelectorAll(".legend-slide"));
  const images = Array.from(document.querySelectorAll(".legend-slide__image"));
  const steps = Array.from(document.querySelectorAll(".legend-step"));
  const legendText = document.getElementById("legendText");
  const legendOverlay = document.querySelector(".legend-overlay");

  // earth element for 3‑D effect
  const earthImg = document.querySelector('.erde');

  function updateEarth() {
    if (!earthImg) return;
    const isMobile = window.innerWidth <= 768;
    const progressRange = isMobile ? window.innerHeight * 1.5 : window.innerHeight * 2;
    const progress = Math.max(0, Math.min(1, window.scrollY / progressRange));
    const startOffset = isMobile ? -30 : -60;
    const endOffset = isMobile ? 10 : 0;
    const rightValue = startOffset + progress * (endOffset - startOffset);
    earthImg.style.right = `${rightValue}%`;
  }

  updateCurrentSection();
  updateEarth();

  if (!scrolly || !slides.length || !images.length || !steps.length || !legendText) {
    window.addEventListener("scroll", () => {
      updateCurrentSection();
      updateEarth();
    }, { passive: true });
    window.addEventListener("resize", () => {
      updateCurrentSection();
      updateEarth();
    });
    return;
  }

  let currentIndex = 0;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function setScene(index, progress) {
    slides.forEach((slide, i) => {
      slide.style.opacity = "0";
      slide.style.zIndex = "1";
      images[i].style.transform = "scale(1.1)";
      images[i].style.filter = "brightness(0.72) saturate(0.96)";
    });

    const currentSlide = slides[index];
    const nextSlide = slides[index + 1];
    const currentImage = images[index];
    const nextImage = images[index + 1];

    if (currentSlide) {
      currentSlide.style.opacity = nextSlide ? String(1 - progress) : "1";
      currentSlide.style.zIndex = "2";
      currentImage.style.transform = `scale(${1.05 + progress * 0.08})`;
      currentImage.style.filter = `brightness(${0.78 - progress * 0.04}) saturate(${0.98 + progress * 0.01})`;
    }

    if (nextSlide) {
      nextSlide.style.opacity = String(progress);
      nextSlide.style.zIndex = "3";
      nextImage.style.transform = `scale(${1.13 - progress * 0.08})`;
      nextImage.style.filter = `brightness(${0.72 + progress * 0.06}) saturate(0.98)`;
    }
  }

  function setText(index) {
    if (!storyData[index]) return;

    let textSpan = legendText.querySelector(".legend-text");
    if (!textSpan) {
      legendText.innerHTML = `<span class="legend-text legend-text-${index + 1}"></span>`;
      textSpan = legendText.querySelector(".legend-text");
    }

    textSpan.className = `legend-text legend-text-${index + 1}`;
    textSpan.innerHTML = `${storyData[index]}<br><small style="font-size: 0.75rem; opacity: 0.7; margin-top: 0.5rem; display: block;">${index + 1}/${storyData.length}</small>`;

    // Position textbox at top for slide 5 (index 4) in mobile
    if (legendOverlay && window.innerWidth <= 768) {
      if (index === 4) {
        legendOverlay.classList.add("align-top");
      } else {
        legendOverlay.classList.remove("align-top");
      }
    }
  }

  function updateScrolly() {
    const rect = scrolly.getBoundingClientRect();
    const total = scrolly.offsetHeight - window.innerHeight;
    const progressAll = clamp((-rect.top) / total, 0, 1);

    const sceneFloat = progressAll * slides.length;
    const index = Math.min(Math.floor(sceneFloat), slides.length - 1);
    const localProgress = clamp(sceneFloat - index, 0, 1);

    if (index !== currentIndex) {
      currentIndex = index;
      setText(index);
    }

    setScene(index, localProgress);
  }

  let updateVulkanTextScroll = () => {};

  function onScroll() {
    updateCurrentSection();
    updateScrolly();
    updateEarth();
    updateVulkanTextScroll();
  }

  setText(0);
  setScene(0, 0);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  // Activity section slide-in animation
  const activityBox = document.querySelector('.activity-overlay-box');
  const activitySection = document.querySelector('.activity-section');
  if (activityBox && activitySection) {
    activityBox.classList.remove('slide-in');

    const revealActivity = () => {
      if (activityBox.classList.contains('slide-in')) return;
      const rect = activitySection.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.6) {
        activityBox.classList.add('slide-in');
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activityBox.classList.add('slide-in');
          observer.unobserve(activitySection);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px'
    });
    observer.observe(activitySection);

    revealActivity();
    window.addEventListener('scroll', revealActivity, { passive: true });
  }

  // Vulkan section text animation (scroll-linked)
  const vulkanSection = document.querySelector('.vulkan-section');
  const kraterText = document.getElementById('krater');
  const schichtenText = document.getElementById('schichten');

  if (vulkanSection && kraterText && schichtenText) {
    let observerVulkan = null;
    let vulkanMode = "";

    const resetInlineVulkanStyles = () => {
      kraterText.style.transform = "";
      kraterText.style.opacity = "";
      kraterText.style.visibility = "";
      schichtenText.style.transform = "";
      schichtenText.style.opacity = "";
      schichtenText.style.visibility = "";
    };

    const setupVulkanAnimation = () => {
      const isMobile = window.innerWidth <= 768;
      const nextMode = isMobile ? "mobile" : "desktop";
      if (vulkanMode === nextMode) return;

      if (observerVulkan) {
        observerVulkan.disconnect();
        observerVulkan = null;
      }

      if (isMobile) {
        updateVulkanTextScroll = () => {};
        resetInlineVulkanStyles();
        kraterText.classList.remove('slide-in');
        schichtenText.classList.remove('slide-in');

        observerVulkan = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                kraterText.classList.add('slide-in');
              }, 180);
              setTimeout(() => {
                schichtenText.classList.add('slide-in');
              }, 520);
            }

            if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
              kraterText.classList.remove('slide-in');
              schichtenText.classList.remove('slide-in');
            }
          });
        }, {
          threshold: 0.45,
        });

        observerVulkan.observe(vulkanSection);
      } else {
        kraterText.classList.remove('slide-in');
        schichtenText.classList.remove('slide-in');

        updateVulkanTextScroll = () => {
          const rect = vulkanSection.getBoundingClientRect();
          const viewportHeight = window.innerHeight;

          const start = viewportHeight * 0.95;
          const end = -viewportHeight * 0.35;
          const progress = clamp((start - rect.top) / (start - end), 0, 1);

          const applyMotion = (element, delay = 0) => {
            const delayedProgress = clamp((progress - delay) / (1 - delay), 0, 1);
            const offsetY = (1 - delayedProgress) * viewportHeight;
            const opacity = clamp((delayedProgress - 0.08) / 0.32, 0, 1);

            element.style.transform = `translateY(${offsetY}px)`;
            element.style.opacity = String(opacity);
            element.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
          };

          applyMotion(kraterText, 0);
          applyMotion(schichtenText, 0.12);
        };

        updateVulkanTextScroll();
      }

      vulkanMode = nextMode;
    };

    setupVulkanAnimation();
    window.addEventListener('resize', setupVulkanAnimation);
  }
});