// 메인 비주얼 슬라이드를 실행하고 상태 막대를 연동하는 함수
function initMainVisualSwiper() {
  const mainVisual = document.querySelector(".mainVisualSwiper");
  const barSets = document.querySelectorAll(".product-thumb-bars");

  if (!mainVisual || typeof Swiper === "undefined") return;

  // 슬라이드 번호에 따라 막대 상태 변경
  function updateProductBars(index) {
    barSets.forEach((barSet) => {
      const bars = barSet.querySelectorAll("span");

      bars.forEach((bar, barIndex) => {
        if (barIndex === index) {
          bar.style.background = "#111111";
          bar.style.width = "48px";
          bar.style.height = "4px";
        } else {
          bar.style.background = "#8f8f8f";
          bar.style.width = "28px";
          bar.style.height = "3px";
        }
      });
    });
  }
  new Swiper(".mainVisualSwiper", {
    loop: true,
    slidesPerView: 1,
    effect: window.innerWidth <= 767 ? "fade" : "slide",
    fadeEffect: {
      crossFade: true,
    },
    speed: 700,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    on: {
      init: function () {
        updateProductBars(this.realIndex);
      },
      slideChange: function () {
        updateProductBars(this.realIndex);
      },
    },
  });
}

// 메인 공지사항 탭을 전환하는 함수
function initNoticeTabs() {
  const buttons = document.querySelectorAll("[data-notice-tab]");
  const cards = document.querySelectorAll("[data-notice-type]");

  if (!buttons.length || !cards.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.noticeTab;

      buttons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      cards.forEach((card) => {
        const visible = type === "all" || card.dataset.noticeType === type;
        card.style.display = visible ? "" : "none";
      });
    });
  });
}

// PC 헤더 서브메뉴 함수
function initPcSubmenu() {
  const mediaQuery = window.matchMedia("(min-width: 1200px)");
  const header = document.querySelector(".site-header");
  const submenu = document.getElementById("pcSubmenu");
  const gnbLinks = document.querySelectorAll(".gnb-link");
  const submenuLinks = document.querySelectorAll(".gnb-link.has-submenu");
  const panels = document.querySelectorAll(".pc-submenu-panel");

  if (!header || !submenu || !submenuLinks.length || !panels.length) return;

  function openSubmenu(menuName) {
    if (!mediaQuery.matches) return;

    gnbLinks.forEach((link) => link.classList.remove("is-active"));

    submenuLinks.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.menu === menuName);
    });

    panels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === menuName);
    });

    submenu.classList.add("is-open");
    submenu.setAttribute("aria-hidden", "false");
  }

  function closeSubmenu() {
    gnbLinks.forEach((link) => link.classList.remove("is-active"));
    panels.forEach((panel) => panel.classList.remove("is-active"));
    submenu.classList.remove("is-open");
    submenu.setAttribute("aria-hidden", "true");
  }

  submenuLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => openSubmenu(link.dataset.menu));
    link.addEventListener("focus", () => openSubmenu(link.dataset.menu));
  });

  gnbLinks.forEach((link) => {
    if (!link.classList.contains("has-submenu")) {
      link.addEventListener("mouseenter", closeSubmenu);
    }
  });

  header.addEventListener("mouseleave", closeSubmenu);
}

// 갤러리 자동 이동 함수
function initGalleryMotion() {
  const track = document.querySelector("[data-gallery-track]");
  if (!track) return;

  let timerId = null;
  let isMoving = false;

  function setFirstCardActive() {
    const cards = Array.from(track.querySelectorAll("[data-gallery-card]"));
    cards.forEach((card, index) => {
      card.classList.toggle("is-active", index === 0);
    });
  }

  function getTrackGap() {
    const style = window.getComputedStyle(track);
    return parseFloat(style.gap) || 24;
  }

  function moveNextGallery() {
    if (isMoving) return;

    const firstCard = track.querySelector("[data-gallery-card]");
    if (!firstCard) return;

    isMoving = true;

    const moveDistance = firstCard.offsetWidth + getTrackGap();

    track.style.transition = "transform 0.7s ease";
    track.style.transform = `translate3d(-${moveDistance}px,0,0)`;

    setTimeout(() => {
      track.appendChild(firstCard);
      track.style.transition = "none";
      track.style.transform = "translate3d(0,0,0)";
      setFirstCardActive();
      isMoving = false;
    }, 700);
  }

  timerId = setInterval(moveNextGallery, 2000);
  setFirstCardActive();
}

// 메인 페이지 전용 초기화
function initIndexPage() {
  initMainVisualSwiper();
  initNoticeTabs();
  initPcSubmenu();
  initGalleryMotion();
}

document.addEventListener("DOMContentLoaded", initIndexPage);
