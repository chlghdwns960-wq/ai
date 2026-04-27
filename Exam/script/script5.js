const quickItems = document.querySelectorAll(".quick-item");

const CONDITION_STORAGE_KEY = "petlogBoriCondition";
const conditionBadge = document.getElementById("conditionBadge");
const conditionDim = document.getElementById("conditionDim");
const conditionSheet = document.getElementById("conditionSheet");
const conditionCloseButton = document.getElementById("conditionCloseButton");
const conditionOptionButtons = document.querySelectorAll("[data-condition]");

// 간편 기록 버튼의 체크 상태를 변경하는 함수
function toggleQuickRecord(item) {
  const checkIcon = item.querySelector(".quick-check");
  const isChecked = item.dataset.checked === "true";
  const nextCheckedState = !isChecked;

  item.dataset.checked = String(nextCheckedState);
  item.classList.toggle("is-checked", nextCheckedState);
  item.setAttribute("aria-pressed", String(nextCheckedState));

  checkIcon.src = nextCheckedState
    ? checkIcon.dataset.on
    : checkIcon.dataset.off;
}

// 간편 기록 버튼 클릭 이벤트를 연결하는 함수
function initQuickRecords() {
  quickItems.forEach(function (item) {
    item.addEventListener("click", function () {
      toggleQuickRecord(item);
    });
  });
}

// 저장된 컨디션을 불러오는 함수
function getSavedCondition() {
  return localStorage.getItem(CONDITION_STORAGE_KEY) || "기분 좋아요";
}

// 컨디션 문구를 화면에 반영하는 함수
function updateConditionText(condition) {
  if (!conditionBadge) {
    return;
  }

  conditionBadge.textContent = `컨디션 : ${condition}`;
}

// 컨디션 옵션 active 상태를 변경하는 함수
function updateConditionActive(condition) {
  conditionOptionButtons.forEach(function (button) {
    const isActive = button.dataset.condition === condition;
    button.classList.toggle("is-active", isActive);
  });
}

// 컨디션 바텀시트를 여는 함수
function openConditionSheet() {
  if (!conditionDim || !conditionSheet) {
    return;
  }

  conditionDim.classList.add("is-open");
  conditionSheet.classList.add("is-open");
  conditionDim.setAttribute("aria-hidden", "false");
}

// 컨디션 바텀시트를 닫는 함수
function closeConditionSheet() {
  if (!conditionDim || !conditionSheet) {
    return;
  }

  conditionDim.classList.remove("is-open");
  conditionSheet.classList.remove("is-open");
  conditionDim.setAttribute("aria-hidden", "true");
}

// 컨디션을 저장하고 화면에 반영하는 함수
function saveCondition(condition) {
  localStorage.setItem(CONDITION_STORAGE_KEY, condition);
  updateConditionText(condition);
  updateConditionActive(condition);
  closeConditionSheet();
}

// 컨디션 span 키보드 접근을 처리하는 함수
function handleConditionKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  openConditionSheet();
}

// 컨디션 선택 기능을 연결하는 함수
function initConditionSelector() {
  if (!conditionBadge || !conditionDim || !conditionSheet) {
    return;
  }

  const savedCondition = getSavedCondition();

  updateConditionText(savedCondition);
  updateConditionActive(savedCondition);

  conditionBadge.addEventListener("click", openConditionSheet);
  conditionBadge.addEventListener("keydown", handleConditionKeydown);

  conditionDim.addEventListener("click", closeConditionSheet);

  if (conditionCloseButton) {
    conditionCloseButton.addEventListener("click", closeConditionSheet);
  }

  conditionOptionButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      saveCondition(button.dataset.condition);
    });
  });
}

// 홈 화면 기능을 시작하는 함수
function initHomePage() {
  initQuickRecords();
  initConditionSelector();
}

window.addEventListener("load", initHomePage);
