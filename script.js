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

  // earth element for 3‑D effect
  const earthImg = document.querySelector('.erde');

  function updateEarth() {
    if (!earthImg) return;
    const progress = Math.max(0, Math.min(1, window.scrollY / (window.innerHeight * 2))); // slower animation
    const rightValue = -85 + progress * 85; // from -85% (15% visible) to 0% (fully in)
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
  let textTimeout = null;

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

    legendText.style.opacity = "0";

    clearTimeout(textTimeout);
    textTimeout = setTimeout(() => {
      legendText.innerHTML = `<span class="legend-text-${index + 1}">${storyData[index]}</span>`;
      legendText.style.opacity = "1";
    }, 120);
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

  function onScroll() {
    updateCurrentSection();
    updateScrolly();
    updateEarth();
  }

  setText(0);
  setScene(0, 0);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
});