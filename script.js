const ACCESS_CODE = "666888";
const STORAGE_KEY = "lazy-portfolio-unlocked";

const accessScreen = document.querySelector("#accessScreen");
const accessForm = document.querySelector("#accessForm");
const accessInput = document.querySelector("#portfolio-password");
const accessMessage = document.querySelector("#accessMessage");
const portfolio = document.querySelector("#portfolio");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxProject = document.querySelector("#lightboxProject");
const lightboxPage = document.querySelector("#lightboxPage");
const visualGrid = document.querySelector("#visualGrid");
const modelGrid = document.querySelector("#modelGrid");

function getAssetSrc(id) {
  return window.LAZY_ASSETS?.[id] || `./assets/${id}.jpg`;
}

const visualSlides = Array.from({ length: 11 }, (_, index) => {
  const page = index + 1;
  const id = `visual-${String(page).padStart(2, "0")}`;
  return {
    id,
    src: getAssetSrc(id),
    alt: `视觉灵感板第 ${page} 页`,
    page,
    projectName: "视觉灵感板",
  };
});

const modelSlides = Array.from({ length: 89 }, (_, index) => {
  const page = index + 1;
  const id = `model-${String(page).padStart(2, "0")}`;
  return {
    id,
    src: getAssetSrc(id),
    alt: `外模面试 Look 第 ${page} 页`,
    page,
    projectName: "外模面试 Look",
  };
});

const slides = [...visualSlides, ...modelSlides];

function unlock() {
  sessionStorage.setItem(STORAGE_KEY, "true");
  accessScreen.hidden = true;
  portfolio.hidden = false;
}

function renderSlide(grid, slide) {
  const button = document.createElement("button");
  button.className = "slide-card";
  button.type = "button";
  button.setAttribute("aria-label", `放大查看${slide.alt}`);
  button.dataset.open = slide.id;

  const img = document.createElement("img");
  img.src = slide.src;
  img.alt = slide.alt;
  img.loading = "lazy";

  const number = document.createElement("span");
  number.textContent = String(slide.page).padStart(2, "0");

  button.append(img, number);
  grid.append(button);
}

function openLightbox(slide) {
  lightboxImage.src = slide.src;
  lightboxImage.alt = slide.alt;
  lightboxProject.textContent = slide.projectName;
  lightboxPage.textContent = `PAGE ${String(slide.page).padStart(2, "0")}`;
  lightbox.hidden = false;
  document.body.classList.add("modal-open");
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.classList.remove("modal-open");
}

visualSlides.forEach((slide) => renderSlide(visualGrid, slide));
modelSlides.forEach((slide) => renderSlide(modelGrid, slide));

if (sessionStorage.getItem(STORAGE_KEY) === "true") {
  unlock();
}

accessForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (accessInput.value === ACCESS_CODE) {
    accessMessage.textContent = "";
    accessInput.value = "";
    unlock();
    return;
  }

  accessMessage.textContent = "密码不正确，请重新输入";
  accessInput.select();
});

document.addEventListener("click", (event) => {
  const opener = event.target.closest("[data-open]");
  if (!opener) return;

  const slide = slides.find((item) => item.id === opener.dataset.open);
  if (slide) openLightbox(slide);
});

document.querySelector("#lightboxBackdrop").addEventListener("click", closeLightbox);
document.querySelector("#lightboxClose").addEventListener("click", closeLightbox);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) {
    closeLightbox();
  }
});
