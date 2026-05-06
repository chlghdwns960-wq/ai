const pageLinks = document.querySelectorAll("[data-page-link]");
const pages = document.querySelectorAll(".page");
const gnb = document.getElementById("gnb");
const menuToggle = document.getElementById("menuToggle");
const filterButtons = document.querySelectorAll("[data-filter]");
const portfolioCards = document.querySelectorAll(".portfolio-card");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

const portfolioModal = document.getElementById("portfolioModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalCategory = document.getElementById("modalCategory");
const modalCloseButtons = document.querySelectorAll("[data-modal-close]");
const modalImageWrap = document.querySelector(".modal-image-wrap");

// 선택한 페이지 ID에 맞춰 콘텐츠 화면과 GNB 활성 상태를 변경하는 함수
function showPage(pageId) {
  pages.forEach((page) => {
    page.classList.toggle("is-visible", page.id === pageId);
  });

  pageLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.pageLink === pageId);
  });

  closeMobileMenu();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 모바일 메뉴를 닫고 접근성 상태값을 초기화하는 함수
function closeMobileMenu() {
  if (!gnb || !menuToggle) {
    return;
  }

  gnb.classList.remove("is-open");
  menuToggle.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "모바일 메뉴 열기");
}

// 모바일 메뉴 버튼 클릭 시 메뉴 열림/닫힘 상태를 전환하는 함수
function toggleMobileMenu() {
  if (!gnb || !menuToggle) {
    return;
  }

  const isOpen = gnb.classList.toggle("is-open");

  menuToggle.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "모바일 메뉴 닫기" : "모바일 메뉴 열기",
  );
}

// 포트폴리오 카드의 카테고리를 기준으로 노출 여부를 제어하는 함수
function filterPortfolio(category) {
  portfolioCards.forEach((card) => {
    const shouldShow = category === "all" || card.dataset.category === category;
    card.style.display = shouldShow ? "block" : "none";
  });

  filterButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === category);
  });
}

// 포트폴리오 카드 정보를 읽어 큰 이미지 모달을 여는 함수
function openPortfolioModal(card) {
  if (
    !portfolioModal ||
    !modalImage ||
    !modalTitle ||
    !modalDesc ||
    !modalCategory ||
    !modalImageWrap
  ) {
    return;
  }

  const title = card.dataset.title || "Portfolio Project";
  const desc = card.dataset.desc || "";
  const image = card.dataset.image || "";
  const category = card.querySelector(".tag")?.textContent || "Portfolio";

  modalTitle.textContent = title;
  modalDesc.textContent = desc;
  modalCategory.textContent = category;

  modalImageWrap.classList.remove("is-missing");
  modalImage.style.display = "block";
  modalImage.src = image;
  modalImage.alt = title;

  modalImage.onerror = () => {
    modalImageWrap.classList.add("is-missing");
    modalImage.removeAttribute("src");
    modalImage.alt = "";
  };

  portfolioModal.classList.add("is-open");
  portfolioModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-lock");
}

// 열린 포트폴리오 모달을 닫는 함수
function closePortfolioModal() {
  if (!portfolioModal || !modalImage || !modalImageWrap) {
    return;
  }

  portfolioModal.classList.remove("is-open");
  portfolioModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-lock");

  modalImage.removeAttribute("src");
  modalImage.alt = "";
  modalImageWrap.classList.remove("is-missing");
}

pageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(link.dataset.pageLink);
  });
});

if (menuToggle) {
  menuToggle.addEventListener("click", toggleMobileMenu);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterPortfolio(button.dataset.filter);
  });
});

portfolioCards.forEach((card) => {
  card.addEventListener("click", () => {
    openPortfolioModal(card);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPortfolioModal(card);
    }
  });
});

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", closePortfolioModal);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && portfolioModal?.classList.contains("is-open")) {
    closePortfolioModal();
  }
});

if (contactForm && formMessage) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.classList.add("is-visible");
    contactForm.reset();
  });
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) {
    closeMobileMenu();
  }
});
