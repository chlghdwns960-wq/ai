// 메인 비주얼 슬라이드를 실행하는 함수
function initMainVisualSwiper() {
  const mainVisual = document.querySelector(".mainVisualSwiper");

  if (!mainVisual || typeof Swiper === "undefined") return;

  new Swiper(".mainVisualSwiper", {
    loop: true,
    speed: 700,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
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

// PC 헤더 서브메뉴를 여닫는 함수
function initPcSubmenu() {
  const mediaQuery = window.matchMedia("(min-width: 1200px)");
  const header = document.querySelector(".site-header");
  const submenu = document.getElementById("pcSubmenu");
  const gnbLinks = document.querySelectorAll(".gnb-link");
  const submenuLinks = document.querySelectorAll(".gnb-link.has-submenu");
  const panels = document.querySelectorAll(".pc-submenu-panel");

  if (!header || !submenu || !submenuLinks.length || !panels.length) return;

  // 선택된 대메뉴와 연결된 서브메뉴만 활성화하는 함수
  function openSubmenu(menuName) {
    if (!mediaQuery.matches) return;

    gnbLinks.forEach((link) => {
      link.classList.remove("is-active");
    });

    submenuLinks.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.menu === menuName);
    });

    panels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === menuName);
    });

    submenu.classList.add("is-open");
    submenu.setAttribute("aria-hidden", "false");
  }

  // PC 서브메뉴를 닫는 함수
  function closeSubmenu() {
    gnbLinks.forEach((link) => link.classList.remove("is-active"));
    panels.forEach((panel) => panel.classList.remove("is-active"));
    submenu.classList.remove("is-open");
    submenu.setAttribute("aria-hidden", "true");
  }

  submenuLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      openSubmenu(link.dataset.menu);
    });

    link.addEventListener("focus", () => {
      openSubmenu(link.dataset.menu);
    });

    link.addEventListener("click", (event) => {
      if (!mediaQuery.matches) return;

      event.preventDefault();

      const isSameOpen =
        submenu.classList.contains("is-open") &&
        link.classList.contains("is-active");

      if (isSameOpen) {
        closeSubmenu();
      } else {
        openSubmenu(link.dataset.menu);
      }
    });
  });

  gnbLinks.forEach((link) => {
    if (link.classList.contains("has-submenu")) return;

    link.addEventListener("mouseenter", closeSubmenu);
    link.addEventListener("focus", closeSubmenu);
  });

  header.addEventListener("mouseleave", closeSubmenu);

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) {
      closeSubmenu();
    }
  });

  window.addEventListener("resize", () => {
    if (!mediaQuery.matches) {
      closeSubmenu();
    }
  });
}

// 숫자를 최소값과 최대값 사이로 제한하는 함수
function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

// 갤러리 트랙 위치를 부드럽게 이동시키고 선택 이미지만 확대하는 함수
function initGalleryMotion() {
  const viewport = document.querySelector("[data-gallery-viewport]");
  const track = document.querySelector("[data-gallery-track]");
  const cards = Array.from(document.querySelectorAll("[data-gallery-card]"));

  if (!viewport || !track || !cards.length) return;

  let currentX = 0;
  let targetX = 0;
  let activeIndex = 0;
  let rafId = null;

  // 갤러리 트랙의 최대 이동 거리를 계산하는 함수
  function getMaxMove() {
    const viewportWidth = viewport.clientWidth;
    const trackWidth = track.scrollWidth;
    return Math.max(trackWidth - viewportWidth, 0);
  }

  // 선택된 카드만 active 상태로 바꾸는 함수
  function setActiveCard(index) {
    activeIndex = clamp(index, 0, cards.length - 1);

    cards.forEach((card, cardIndex) => {
      card.classList.toggle("is-active", cardIndex === activeIndex);
    });
  }

  // 현재 카드 위치를 기준으로 트랙 이동값을 계산하는 함수
  function getCardTargetX(index) {
    const maxMove = getMaxMove();
    const card = cards[index];

    if (!card || maxMove <= 0) return 0;

    const cardLeft = card.offsetLeft;
    const viewportCenter = viewport.clientWidth * 0.35;
    const nextX = -(cardLeft - viewportCenter);

    return clamp(nextX, -maxMove, 0);
  }

  // 목표 위치까지 부드럽게 이동하는 함수
  function animateTrack() {
    currentX += (targetX - currentX) * 0.16;

    if (Math.abs(targetX - currentX) < 0.3) {
      currentX = targetX;
    }

    track.style.transform = `translate3d(${currentX}px, 0, 0)`;

    if (currentX !== targetX) {
      rafId = requestAnimationFrame(animateTrack);
    } else {
      rafId = null;
    }
  }

  // 트랙 이동 목표값을 설정하는 함수
  function moveTo(value) {
    const maxMove = getMaxMove();
    targetX = clamp(value, -maxMove, 0);

    if (!rafId) {
      rafId = requestAnimationFrame(animateTrack);
    }
  }

  // 마우스 위치에 따라 트랙을 좌우로 이동하는 함수
  function handleMouseMove(event) {
    const maxMove = getMaxMove();

    if (maxMove <= 0) return;

    const rect = viewport.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const ratio = clamp(mouseX / rect.width, 0, 1);

    moveTo(-maxMove * ratio);
  }

  // 터치 시작 위치를 저장하는 함수
  let touchStartX = 0;
  let touchStartTargetX = 0;

  function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartTargetX = targetX;
  }

  // 터치 이동 시 갤러리를 좌우로 이동하는 함수
  function handleTouchMove(event) {
    const touchX = event.touches[0].clientX;
    const diffX = touchX - touchStartX;

    moveTo(touchStartTargetX + diffX);
  }

  cards.forEach((card, index) => {
    card.addEventListener("mouseenter", () => {
      setActiveCard(index);
      moveTo(getCardTargetX(index));
    });

    card.addEventListener("focusin", () => {
      setActiveCard(index);
      moveTo(getCardTargetX(index));
    });

    card.addEventListener("click", () => {
      setActiveCard(index);
      moveTo(getCardTargetX(index));
    });
  });

  viewport.addEventListener("mousemove", handleMouseMove);
  viewport.addEventListener("touchstart", handleTouchStart, { passive: true });
  viewport.addEventListener("touchmove", handleTouchMove, { passive: true });

  window.addEventListener("resize", () => {
    currentX = 0;
    targetX = 0;
    track.style.transform = "translate3d(0, 0, 0)";
    setActiveCard(activeIndex);
    moveTo(getCardTargetX(activeIndex));
  });

  setActiveCard(0);
  moveTo(0);
}

// 메인 페이지 전용 기능을 초기화하는 함수
function initIndexPage() {
  initMainVisualSwiper();
  initNoticeTabs();
  initPcSubmenu();
  initGalleryMotion();
}

document.addEventListener("DOMContentLoaded", initIndexPage);
