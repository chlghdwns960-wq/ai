const filterButtons = document.querySelectorAll(".filter-button");
const sortButton = document.getElementById("sortButton");
const sortMenu = document.getElementById("sortMenu");
const sortLabel = document.getElementById("sortLabel");
const sortOptions = document.querySelectorAll(".sort-menu button");

// 사진 필터 버튼 active 상태를 변경하는 함수
function handleFilterButtonClick(clickedButton) {
  filterButtons.forEach(function (button) {
    const isCurrentButton = button === clickedButton;

    button.classList.toggle("is-active", isCurrentButton);
    button.setAttribute("aria-pressed", String(isCurrentButton));
  });
}

// 필터 버튼 클릭 이벤트를 연결하는 함수
function initFilterTabs() {
  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      handleFilterButtonClick(button);
    });
  });
}

// 정렬 드롭다운을 열고 닫는 함수
function toggleSortMenu() {
  const isOpen = sortMenu.classList.toggle("is-open");

  sortButton.setAttribute("aria-expanded", String(isOpen));
}

// 정렬 드롭다운을 닫는 함수
function closeSortMenu() {
  sortMenu.classList.remove("is-open");
  sortButton.setAttribute("aria-expanded", "false");
}

// 정렬 옵션을 선택하는 함수
function selectSortOption(option) {
  sortLabel.textContent = option.dataset.sort;
  closeSortMenu();
}

// 정렬 드롭다운 외부 클릭을 감지하는 함수
function handleDocumentClick(event) {
  const isSortArea = event.target.closest(".sort-wrap");

  if (!isSortArea) {
    closeSortMenu();
  }
}

// 정렬 드롭다운 기능을 시작하는 함수
function initSortDropdown() {
  sortButton.addEventListener("click", toggleSortMenu);

  sortOptions.forEach(function (option) {
    option.addEventListener("click", function () {
      selectSortOption(option);
    });
  });

  document.addEventListener("click", handleDocumentClick);
}

// 사진 아카이브 화면 기능을 시작하는 함수
function initArchivePage() {
  initFilterTabs();
  initSortDropdown();
}

window.addEventListener("load", initArchivePage);
