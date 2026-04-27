const moreButton = document.querySelector(".more-button");
const recordCard = document.querySelector(".record-card");
const memoCard = document.querySelector(".memo-card");

// 더보기 버튼을 눌렀을 때 임시 안내를 보여주는 함수
function handleMoreButtonClick() {
  alert("기록 수정 기능은 다음 단계에서 연결할게.");
}

// 기록 카드에 키보드 접근용 효과를 연결하는 함수
function initRecordCardInteraction() {
  recordCard.addEventListener("click", function () {
    recordCard.classList.toggle("is-selected");
  });

  memoCard.addEventListener("click", function () {
    memoCard.classList.toggle("is-selected");
  });
}

// 기록 상세 화면 기능을 시작하는 함수
function initRecordDetailPage() {
  moreButton.addEventListener("click", handleMoreButtonClick);
  initRecordCardInteraction();
}

window.addEventListener("load", initRecordDetailPage);
