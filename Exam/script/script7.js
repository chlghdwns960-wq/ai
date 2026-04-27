const moreButton = document.querySelector(".more-button");
const recordCard = document.querySelector(".record-card");
const memoCard = document.querySelector(".memo-card");

const MEMO_STORAGE_KEY = "petlogRecordDetailMemos";

const openMemoAddButton = document.getElementById("openMemoAddButton");
const memoList = document.getElementById("memoList");
const memoEmpty = document.getElementById("memoEmpty");
const memoCount = document.getElementById("memoCount");

const memoDim = document.getElementById("memoDim");
const memoSheet = document.getElementById("memoSheet");
const memoSheetTitle = document.getElementById("memoSheetTitle");
const memoTextInput = document.getElementById("memoTextInput");
const memoSaveButton = document.getElementById("memoSaveButton");
const memoCancelButton = document.getElementById("memoCancelButton");
const memoCloseButton = document.getElementById("memoCloseButton");

let editingMemoId = null;

// 기본 메모 데이터를 만드는 함수
function createDefaultMemos() {
  return [
    {
      id: "default-memo-1",
      text: "오늘은 컨디션이 좋아서 평소보다 오래 산책했어",
      createdAt: Date.now(),
    },
  ];
}

// 저장된 메모를 불러오는 함수
function getMemos() {
  const savedMemos = localStorage.getItem(MEMO_STORAGE_KEY);

  if (savedMemos === null) {
    const defaultMemos = createDefaultMemos();
    saveMemos(defaultMemos);
    return defaultMemos;
  }

  try {
    return JSON.parse(savedMemos);
  } catch (error) {
    const defaultMemos = createDefaultMemos();
    saveMemos(defaultMemos);
    return defaultMemos;
  }
}

// 메모를 localStorage에 저장하는 함수
function saveMemos(memos) {
  localStorage.setItem(MEMO_STORAGE_KEY, JSON.stringify(memos));
}

// 메모 바텀시트를 여는 함수
function openMemoSheet(mode, memoId = null) {
  const memos = getMemos();
  const targetMemo = memos.find(function (memo) {
    return memo.id === memoId;
  });

  editingMemoId = mode === "edit" && targetMemo ? memoId : null;

  memoSheetTitle.textContent = editingMemoId ? "메모 수정" : "메모 추가";
  memoSaveButton.textContent = editingMemoId ? "수정 완료" : "저장";

  memoTextInput.value = targetMemo ? targetMemo.text : "";

  memoDim.classList.add("is-open");
  memoSheet.classList.add("is-open");
  memoDim.setAttribute("aria-hidden", "false");

  window.setTimeout(function () {
    memoTextInput.focus();
  }, 120);
}

// 메모 바텀시트를 닫는 함수
function closeMemoSheet() {
  editingMemoId = null;
  memoTextInput.value = "";

  memoDim.classList.remove("is-open");
  memoSheet.classList.remove("is-open");
  memoDim.setAttribute("aria-hidden", "true");
}

// 새 메모를 추가하는 함수
function addMemo(text) {
  const memos = getMemos();

  const newMemo = {
    id: `memo-${Date.now()}`,
    text: text,
    createdAt: Date.now(),
  };

  memos.push(newMemo);
  saveMemos(memos);
}

// 기존 메모를 수정하는 함수
function updateMemo(memoId, text) {
  const memos = getMemos();

  const nextMemos = memos.map(function (memo) {
    if (memo.id !== memoId) {
      return memo;
    }

    return {
      ...memo,
      text: text,
    };
  });

  saveMemos(nextMemos);
}

// 메모를 삭제하는 함수
function deleteMemo(memoId) {
  const isConfirmed = window.confirm("이 메모를 삭제할까?");

  if (!isConfirmed) {
    return;
  }

  const memos = getMemos();
  const nextMemos = memos.filter(function (memo) {
    return memo.id !== memoId;
  });

  saveMemos(nextMemos);
  renderMemoList();
}

// 메모 저장 버튼을 눌렀을 때 추가/수정을 처리하는 함수
function handleMemoSave() {
  const text = memoTextInput.value.trim();

  if (!text) {
    alert("메모 내용을 입력해줘.");
    memoTextInput.focus();
    return;
  }

  if (editingMemoId) {
    updateMemo(editingMemoId, text);
  } else {
    addMemo(text);
  }

  closeMemoSheet();
  renderMemoList();
}

// 메모 아이템 HTML을 만드는 함수
function createMemoItem(memo) {
  const memoItem = document.createElement("div");
  memoItem.className = "memo-item";

  memoItem.innerHTML = `
    <p class="memo-item-text">${memo.text}</p>

    <div class="memo-item-actions">
      <button
        type="button"
        class="memo-action-button"
        data-action="edit"
        data-id="${memo.id}"
      >
        수정
      </button>

      <button
        type="button"
        class="memo-action-button is-delete"
        data-action="delete"
        data-id="${memo.id}"
      >
        삭제
      </button>
    </div>
  `;

  return memoItem;
}

// 메모 목록을 화면에 렌더링하는 함수
function renderMemoList() {
  const memos = getMemos();

  memoList.innerHTML = "";
  memoCount.textContent = `${memos.length}개`;

  if (memos.length === 0) {
    memoEmpty.style.display = "block";
    return;
  }

  memoEmpty.style.display = "none";

  memos.forEach(function (memo) {
    memoList.appendChild(createMemoItem(memo));
  });
}

// 메모 목록의 수정/삭제 버튼 클릭을 처리하는 함수
function handleMemoListClick(event) {
  const actionButton = event.target.closest("button[data-action]");

  if (!actionButton) {
    return;
  }

  const action = actionButton.dataset.action;
  const memoId = actionButton.dataset.id;

  if (action === "edit") {
    openMemoSheet("edit", memoId);
  }

  if (action === "delete") {
    deleteMemo(memoId);
  }
}

// 기록 카드에 키보드 접근용 효과를 연결하는 함수
function initRecordCardInteraction() {
  if (recordCard) {
    recordCard.addEventListener("click", function () {
      recordCard.classList.toggle("is-selected");
    });
  }

  if (memoCard) {
    memoCard.addEventListener("click", function () {
      memoCard.classList.toggle("is-selected");
    });
  }
}

// 메모 기능을 시작하는 함수
function initMemoManager() {
  openMemoAddButton.addEventListener("click", function () {
    openMemoSheet("add");
  });

  moreButton.addEventListener("click", function () {
    openMemoSheet("add");
  });

  memoSaveButton.addEventListener("click", handleMemoSave);
  memoCancelButton.addEventListener("click", closeMemoSheet);
  memoCloseButton.addEventListener("click", closeMemoSheet);
  memoDim.addEventListener("click", closeMemoSheet);
  memoList.addEventListener("click", handleMemoListClick);

  renderMemoList();
}

// 기록 상세 화면 기능을 시작하는 함수
function initRecordDetailPage() {
  initRecordCardInteraction();
  initMemoManager();
}

window.addEventListener("load", initRecordDetailPage);
