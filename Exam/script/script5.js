const quickItems = document.querySelectorAll(".quick-item");

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

// 홈 화면 기능을 시작하는 함수
function initHomePage() {
  initQuickRecords();
}

window.addEventListener("load", initHomePage);
