// 모바일/태블릿 전체 메뉴를 열고 닫는 함수
function initMobileMenu() {
  const openBtn = document.querySelector("[data-menu-open]");
  const closeBtn = document.querySelector("[data-menu-close]");
  const menu = document.querySelector(".mobile-menu");

  if (!openBtn || !closeBtn || !menu) return;

  openBtn.addEventListener("click", () => {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  });

  closeBtn.addEventListener("click", () => {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    openBtn.focus();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      menu.classList.remove("is-open");
      menu.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      openBtn.focus();
    }
  });
}

// 모바일/태블릿 아코디언 메뉴를 토글하는 함수
function initMobileAccordion() {
  const groups = document.querySelectorAll(".mobile-group");

  groups.forEach((group) => {
    const button = group.querySelector("button.mobile-depth1");
    if (!button) return;

    button.addEventListener("click", () => {
      group.classList.toggle("is-open");
      const expanded = group.classList.contains("is-open");
      button.setAttribute("aria-expanded", String(expanded));
    });
  });
}

// TOP 버튼 클릭 시 페이지 상단으로 이동하는 함수
function initTopButton() {
  const topButton = document.querySelector("[data-top-button]");
  if (!topButton) return;

  topButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// 공통 UI를 초기화하는 함수
function initCommon() {
  initMobileMenu();
  initMobileAccordion();
  initTopButton();
}

document.addEventListener("DOMContentLoaded", initCommon);