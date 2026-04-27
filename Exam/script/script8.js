const periodButtons = document.querySelectorAll(".period-button");

// 기간 버튼 active 상태를 변경하는 함수
function handlePeriodButtonClick(clickedButton) {
  periodButtons.forEach(function (button) {
    const isCurrentButton = button === clickedButton;

    button.classList.toggle("is-active", isCurrentButton);
    button.setAttribute("aria-pressed", String(isCurrentButton));
  });
}

// 기간 토글 버튼 클릭 이벤트를 연결하는 함수
function initPeriodTabs() {
  periodButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      handlePeriodButtonClick(button);
    });
  });
}

// 기록 히스토리 화면 기능을 시작하는 함수
function initHistoryPage() {
  initPeriodTabs();
}

window.addEventListener("load", initHistoryPage);
